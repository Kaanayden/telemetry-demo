import { getClickhouseClient } from "@/utils/clickhouse"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {


  const clickhouse = getClickhouseClient();

  const query = `WITH ClientSpans AS (
  SELECT *
  FROM otel_traces
  WHERE SpanKind = 'Client'
),
ServerSpans AS (
  SELECT *
  FROM otel_traces
  WHERE SpanKind = 'Server'
),
RankedServerSpans AS (
  SELECT 
    server.*,
    client.SpanId AS client_SpanId,
    ROW_NUMBER() OVER (
      PARTITION BY client.SpanId 
      ORDER BY toUnixTimestamp64Nano(server.Timestamp) - toUnixTimestamp64Nano(client.Timestamp)
    ) AS rn
  FROM ServerSpans AS server
  CROSS JOIN ClientSpans AS client 
  WHERE server.SpanAttributes['http.url'] = client.SpanAttributes['url.full']
    AND server.Timestamp > client.Timestamp
)
SELECT 
  server.Timestamp AS server_Timestamp, 
  client.Timestamp AS client_Timestamp,
  client.ServiceName AS from_service,
  server.ServiceName AS to_service,
  server.SpanAttributes,
  client.SpanAttributes,
  server.SpanName,
  client.SpanName,
  server.Duration,
  client.Duration,
  server.StatusCode,
  client.StatusCode,
  server.SpanId AS server_span_id,
  client.SpanId AS client_span_id,
  server.SpanAttributes['http.url'] AS server_url,
  client.SpanAttributes['url.full'] AS client_url
FROM ClientSpans AS client
JOIN RankedServerSpans AS server
  ON server.client_SpanId = client.SpanId
  AND server.rn = 1`;

  const results = await clickhouse.query({ query: query, format: 'JSONEachRow' })
  const jsonResults: any[] = await results.json();

  return Response.json({ relations: jsonResults })
}