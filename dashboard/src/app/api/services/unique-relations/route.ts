import { getClickhouseClient } from "@/utils/clickhouse"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {


  const clickhouse = getClickhouseClient();

  const query = `SELECT DISTINCT
    client.ServiceName AS from_service,
    server.ServiceName AS to_service
FROM otel_traces AS server
JOIN otel_traces AS client
    ON server.SpanAttributes['http.url'] = client.SpanAttributes['url.full']
WHERE server.SpanKind = 'Server'
    AND client.SpanKind = 'Client'`;

  const results = await clickhouse.query({ query: query, format: 'JSONEachRow' })
  const jsonResults: any[] = await results.json();

  return Response.json({ relations: jsonResults })
}