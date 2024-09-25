import { getClickhouseClient } from "@/utils/clickhouse"
import { sinceToPeriod } from "@/utils/periods";
import { NextRequest } from "next/server"



export async function GET(request: NextRequest,
  { params }: { params: { serviceName: string } }) {

    const searchParams = request.nextUrl.searchParams
    const since = searchParams.get('since')

    const serviceName = params.serviceName;


    if(!since || isNaN(Number(since))) {
        return Response.json({ error: "Invalid since" }, { status: 400 })
    }

    const clickhouse = getClickhouseClient();

    const processQuery = `SELECT ${sinceToPeriod[since]}(TimeUnix) AS interval_start, avg(Value) AS avg_process_memory_usage FROM otel_metrics_gauge WHERE ServiceName = '${serviceName}' AND MetricName = 'process.memory.usage' AND TimeUnix >= now() - interval ${since} hour GROUP BY interval_start ORDER BY interval_start`;
    const systemQuery = `SELECT ${sinceToPeriod[since]}(TimeUnix) AS interval_start, avg(Value) AS avg_system_memory_usage FROM otel_metrics_gauge WHERE ServiceName = '${serviceName}' AND MetricName = 'system.memory.usage'  AND Attributes['system.memory.state'] = 'used' AND TimeUnix >= now() - interval ${since} hour GROUP BY interval_start ORDER BY interval_start`;
    const systemPercentQuery = `SELECT ${sinceToPeriod[since]}(TimeUnix) AS interval_start, avg(Value) AS avg_system_memory_usage_percent FROM otel_metrics_gauge WHERE ServiceName = '${serviceName}' AND MetricName = 'system.memory.utilization'  AND Attributes['system.memory.state'] = 'used' AND TimeUnix >= now() - interval ${since} hour GROUP BY interval_start ORDER BY interval_start`;
   

    const processResults = await clickhouse.query({ query: processQuery, format: 'JSONEachRow' })
    const processMetrics : {interval_start: Date, avg_process_memory_usage: Number}[] = await processResults.json();

    const systemResults = await clickhouse.query({ query: systemQuery, format: 'JSONEachRow' })
    const systemMetrics : {interval_start: Date, avg_system_memory_usage: Number}[] = await systemResults.json();

    const systemPercentResults = await clickhouse.query({ query: systemPercentQuery, format: 'JSONEachRow' })
    const systemPercentMetrics : {interval_start: Date, avg_system_memory_usage_percent: Number}[] = await systemPercentResults.json();


    const metrics = processMetrics.map((processMetric, index) => {
        return {
            interval_start: processMetric.interval_start,
            avg_process_memory_usage: processMetric.avg_process_memory_usage,
            avg_system_memory_usage: systemMetrics[index].avg_system_memory_usage,
            avg_system_memory_usage_percent: systemPercentMetrics[index].avg_system_memory_usage_percent
        }
    })



  return Response.json(metrics)
}