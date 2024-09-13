import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';


interface Config {
    endpoint: string;
    instruments: (
        'http' | 'express' | 'mongodb' | 'socket' |
        'graphql' | 'redis' | 'mysql' | 'aws-sdk' | 'mongoose' | 'fs'
    )[];
    serviceName?: string;
    logLevel?: DiagLogLevel;
}

export default function register(config: Config) {
    const { endpoint, instruments } = config;

    const resource = Resource.default().merge(
        // fix according to deprecated API
        new Resource({
        'service.name': config.serviceName,
        })
      );

      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
      
    const sdk = new NodeSDK({
        traceExporter: new OTLPTraceExporter({
            url: endpoint,
        }),
        // Some popular instrumentations
        instrumentations: getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: instruments.includes('http') },
            '@opentelemetry/instrumentation-express': { enabled: instruments.includes('express') },
            '@opentelemetry/instrumentation-mongodb': { enabled: instruments.includes('mongodb') },
            '@opentelemetry/instrumentation-socket.io': { enabled: instruments.includes('socket') },
            '@opentelemetry/instrumentation-graphql': { enabled: instruments.includes('graphql') },
            '@opentelemetry/instrumentation-redis': { enabled: instruments.includes('redis') },
            '@opentelemetry/instrumentation-mysql': { enabled: instruments.includes('mysql') },
            '@opentelemetry/instrumentation-aws-sdk': { enabled: instruments.includes('aws-sdk') },
            '@opentelemetry/instrumentation-mongoose': { enabled: instruments.includes('mongoose') },
            '@opentelemetry/instrumentation-fs': { enabled: instruments.includes('fs') },
        }),
        resource: resource || Resource.default(),
    });

        sdk.start();
    
        process.on("SIGTERM", () => {
            sdk
                .shutdown()
                .then(() => console.log("Tracing terminated"))
                .catch((error) => console.log("Error terminating tracing", error))
                .finally(() => process.exit(0));
        });

    };



