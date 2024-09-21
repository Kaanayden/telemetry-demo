import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { HostMetrics } from '@opentelemetry/host-metrics';
interface Config {
    endpoint: string;
    instruments: (
        'http' | 'express' | 'mongodb' | 'socket' |
        'graphql' | 'redis' | 'mysql' | 'aws' | 'mongoose' | 'fs' | 'runtime' | 'system'
    )[];
    serviceName?: string;
    logLevel?: DiagLogLevel;
}

export function register(config: Config) {
    const { endpoint, instruments } = config;

    const resource =
        new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName || "test-service",
            [SemanticResourceAttributes.SERVICE_VERSION]: "0.0.1",
            [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: `uuidgen`
        })


    diag.setLogger(new DiagConsoleLogger(), config.logLevel || DiagLogLevel.INFO);


    if (instruments.includes('system')) {

        // Create metric exporter
        const metricExporter = new OTLPMetricExporter({
            url: endpoint, // Same or different URL for metrics endpoint
        });


        // Add periodic metric reader for exporting metrics

        const metricReader = new PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 30000,
        })

        const meterProvider = new MeterProvider({
            readers: [metricReader],
            resource: resource
        });

        const hostMetrics = new HostMetrics({ meterProvider });
        hostMetrics.start();

    }


    const sdk = new NodeSDK({
        traceExporter: new OTLPTraceExporter({
            url: endpoint,
        }),
        // Some popular instrumentations
        instrumentations: [...getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: instruments.includes('http') },
            '@opentelemetry/instrumentation-express': { enabled: instruments.includes('express') },
            '@opentelemetry/instrumentation-mongodb': { enabled: instruments.includes('mongodb') },
            '@opentelemetry/instrumentation-socket.io': { enabled: instruments.includes('socket') },
            '@opentelemetry/instrumentation-graphql': { enabled: instruments.includes('graphql') },
            '@opentelemetry/instrumentation-redis': { enabled: instruments.includes('redis') },
            '@opentelemetry/instrumentation-mysql': { enabled: instruments.includes('mysql') },
            '@opentelemetry/instrumentation-aws-sdk': { enabled: instruments.includes('aws') },
            '@opentelemetry/instrumentation-mongoose': { enabled: instruments.includes('mongoose') },
            '@opentelemetry/instrumentation-fs': { enabled: instruments.includes('fs') },
        }),
        new RuntimeNodeInstrumentation({ eventLoopUtilizationMeasurementInterval: 30000, enabled: instruments.includes('runtime') }),
        ],
        resource: config.serviceName ? resource : Resource.default(),
    });
    sdk.start();
    diag.info("Tracing initialized");

    process.on("SIGTERM", () => {
        sdk
            .shutdown()
            .then(() => console.log("Tracing terminated"))
            .catch((error) => console.log("Error terminating tracing", error))
            .finally(() => process.exit(0));
    });

};

export { DiagLogLevel };