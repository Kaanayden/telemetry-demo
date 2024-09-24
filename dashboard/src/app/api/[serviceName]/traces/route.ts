import { getClickhouseClient } from "@/utils/clickhouse"
import { TraceData } from "@/utils/interfaces";
import { periodToQuery, validPeriods } from "@/utils/periods";
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

    const query = `SELECT * FROM otel_traces WHERE ServiceName = '${serviceName}' AND SpanKind != 'Internal' AND Timestamp >= now() - INTERVAL ${since} HOUR`;
    const results = await clickhouse.query({ query: query, format: 'JSONEachRow' })
    const traces : TraceData[] = await results.json();

  return Response.json(traces)
}