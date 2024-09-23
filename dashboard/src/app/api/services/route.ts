import { getClickhouseClient } from "@/utils/clickhouse"
import { NextRequest } from "next/server"



export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const since = searchParams.get('since')

    if(!since || isNaN(Number(since))) {
        return Response.json({ error: "Invalid since" }, { status: 400 })
    }

    const clickhouse = getClickhouseClient();

    const query = `SELECT DISTINCT ServiceName FROM otel_metrics_gauge`;
    const results = await clickhouse.query({ query: query, format: 'JSONEachRow' })
    const jsonResults : { ServiceName: String}[] = await results.json();

    const lastQuery = `SELECT DISTINCT ServiceName FROM otel_metrics_gauge WHERE TimeUnix >= now() - INTERVAL ${since} MINUTE`;
    const lastResults = await clickhouse.query({ query: lastQuery, format: 'JSONEachRow' })
    const lastJsonResults : { ServiceName: String}[] = await lastResults.json();


  return Response.json({ allServices: jsonResults, activeServices: lastJsonResults})
}