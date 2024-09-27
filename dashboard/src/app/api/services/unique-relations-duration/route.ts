import { getClickhouseClient } from "@/utils/clickhouse"
import { NextRequest } from "next/server"



export async function GET(request: NextRequest) {



    const clickhouse = getClickhouseClient();

    const query = `WITH ClientSpans AS (
  SELECT *
  FROM otel_traces
  WHERE SpanKind = 'Client'
      AND Timestamp >= now() - INTERVAL 1 HOUR
),
ServerSpans AS (
  SELECT *
  FROM otel_traces
  WHERE SpanKind = 'Server'
      AND Timestamp >= now() - INTERVAL 1 HOUR
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
  client.ServiceName AS from_service,
  server.ServiceName AS to_service,
  AVG(server.Duration + client.Duration) AS avg_total_duration
FROM ClientSpans AS client
JOIN RankedServerSpans AS server
  ON server.client_SpanId = client.SpanId
  AND server.rn = 1
GROUP BY
  client.ServiceName,
  server.ServiceName`;

    const results = await clickhouse.query({ query: query, format: 'JSONEachRow' })
    const jsonResults : { ServiceName: String}[] = await results.json();


  return Response.json({ relations: jsonResults})
}