import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function verifyClickHouseData() {
    const clickhouse = createClient({
        url: process.env.OTEL_EXPORTER_CLICKHOUSE_ENDPOINT,
        database: process.env.OTEL_EXPORTER_CLICKHOUSE_DATABASE,
        username: process.env.OTEL_EXPORTER_CLICKHOUSE_USERNAME,
        password: process.env.OTEL_EXPORTER_CLICKHOUSE_PASSWORD,
    });

    try {
        // Query to check if data exists in the trace table
        const query = `
SELECT * FROM otel_traces ORDER BY Timestamp DESC LIMIT 2
        `
        const resultSet = await clickhouse.query({ query, format: 'JSONEachRow' })
        const traces = await resultSet.json();

        // Query to check if data exists in the histogram table
        const metricQuery = `SELECT * FROM otel_metrics_histogram ORDER BY TimeUnix DESC LIMIT 5`
        const resultMetricSet = await clickhouse.query({ query: metricQuery, format: 'JSONEachRow' })
        const metrics = await resultMetricSet.json();

        if (traces.length > 0) {
            console.log(`Data verification successful on traces.`);
            console.log(traces)
        } else {
            console.log('Data verification failed: No records found.');
        }

        if (metrics.length > 0) {
            console.log(`Data verification successful on histogram metrics.`);
            console.log(metrics)
        } else {
            console.log('Data verification failed: No records found.');
        }
    } catch (error) {
        console.error('Error querying ClickHouse:', error);
    } finally {
        await clickhouse.close();
    }
}

verifyClickHouseData();