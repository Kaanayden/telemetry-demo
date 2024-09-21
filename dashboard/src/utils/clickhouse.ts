import { createClient } from '@clickhouse/client';
import { NodeClickHouseClient } from '@clickhouse/client/dist/client';
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

let client : NodeClickHouseClient;


  
export const getClickhouseClient = () => { 
    if(!client) {
        client = createClient({
            url: process.env.OTEL_EXPORTER_CLICKHOUSE_ENDPOINT,
            database: process.env.OTEL_EXPORTER_CLICKHOUSE_DATABASE,
            username: process.env.OTEL_EXPORTER_CLICKHOUSE_USERNAME,
            password: process.env.OTEL_EXPORTER_CLICKHOUSE_PASSWORD,
        });
    }

    return client;
}


