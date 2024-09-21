import { getClickhouseClient } from "@/utils/clickhouse"
import { periodToQuery, validPeriods } from "@/utils/periods";
import { NextRequest } from "next/server"



export async function GET(request: NextRequest,
  { params }: { params: { serviceName: string } }) {

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period')
    const since = searchParams.get('since')

    const serviceName = params.serviceName;

    if(!period || !periodToQuery[period]) {
        return Response.json({ error: "Invalid period" }, { status: 400 })
    }

    const clickhouse = getClickhouseClient();

    const dbQuery = `SELECT ${periodToQuery[period]}(TimeUnix) AS interval_start, avg(Value) AS avg_memory_usage FROM otel_metrics_gauge WHERE ServiceName = '${serviceName}' AND MetricName = 'process.memory.usage' AND TimeUnix >= now() - interval 1 hour GROUP BY interval_start ORDER BY interval_start`;
    const resultMetricSet = await clickhouse.query({ query: dbQuery, format: 'JSONEachRow' })
    const metrics : {interval_start: Date, avg_memory_usage: Number}[] = await resultMetricSet.json();

    const ping = await clickhouse.ping()

  return Response.json({ test: "hey", period, params, ping, metrics })
}