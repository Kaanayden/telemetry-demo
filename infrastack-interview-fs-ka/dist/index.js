"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagLogLevel = exports.register = void 0;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const exporter_metrics_otlp_grpc_1 = require("@opentelemetry/exporter-metrics-otlp-grpc");
const resources_1 = require("@opentelemetry/resources");
const api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "DiagLogLevel", { enumerable: true, get: function () { return api_1.DiagLogLevel; } });
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const instrumentation_runtime_node_1 = require("@opentelemetry/instrumentation-runtime-node");
const host_metrics_1 = require("@opentelemetry/host-metrics");
function register(config) {
    const { endpoint, instruments } = config;
    const resource = new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: config.serviceName || "test-service",
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: "0.0.1",
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_INSTANCE_ID]: `uuidgen`
    });
    api_1.diag.setLogger(new api_1.DiagConsoleLogger(), config.logLevel || api_1.DiagLogLevel.INFO);
    if (instruments.includes('system')) {
        // Create metric exporter
        const metricExporter = new exporter_metrics_otlp_grpc_1.OTLPMetricExporter({
            url: endpoint, // Same or different URL for metrics endpoint
        });
        // Add periodic metric reader for exporting metrics
        const metricReader = new sdk_metrics_1.PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 30000,
        });
        const meterProvider = new sdk_metrics_1.MeterProvider({
            readers: [metricReader],
            resource: resource
        });
        const hostMetrics = new host_metrics_1.HostMetrics({ meterProvider });
        hostMetrics.start();
    }
    const sdk = new sdk_node_1.NodeSDK({
        traceExporter: new exporter_trace_otlp_grpc_1.OTLPTraceExporter({
            url: endpoint,
        }),
        // Some popular instrumentations
        instrumentations: [...(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
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
            new instrumentation_runtime_node_1.RuntimeNodeInstrumentation({ eventLoopUtilizationMeasurementInterval: 30000, enabled: instruments.includes('runtime') }),
        ],
        resource: config.serviceName ? resource : resources_1.Resource.default(),
    });
    sdk.start();
    api_1.diag.info("Tracing initialized");
    process.on("SIGTERM", () => {
        sdk
            .shutdown()
            .then(() => console.log("Tracing terminated"))
            .catch((error) => console.log("Error terminating tracing", error))
            .finally(() => process.exit(0));
    });
}
exports.register = register;
;
