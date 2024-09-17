# OpenTelemetry Node.js SDK Wrapper

This is a simple wrapper for OpenTelemetry's Node.js SDK. It automatically configures tracing for popular Node.js libraries and exports the traces to an OpenTelemetry-compatible backend via the OTLP gRPC exporter.

## Features
- Supports automatic instrumentation of various Node.js libraries.
- Easily configurable service name and log levels.
- Exports traces using OTLP gRPC exporter.
- Graceful shutdown on `SIGTERM`.

## Supported Instrumentations
- HTTP
- Express
- MongoDB
- Socket.IO
- GraphQL
- Redis
- MySQL
- AWS SDK
- Mongoose
- File System (fs)

## Installation

```bash
npm install infrastack-interview-fs-ka
yarn add infrastack-interview-fs-ka
```

## Usage

### 1. Import the Wrapper

```typescript
import { register } from 'infrastack-interview-fs-ka';
```

### 2. Register Tracing with Configuration

Use the `register` function to initialize OpenTelemetry with your desired configuration.

```typescript
register({
  endpoint: 'http://localhost:4317', // Your OTLP endpoint
  instruments: ['http', 'express', 'mongodb'], // List the libraries you want to instrument
  serviceName: 'my-node-service', // Optional: Define the service name
  logLevel: 1 // Optional: Set the log level (DiagLogLevel)
});
```

### 3. Environment Setup

Make sure your OTLP backend (like Jaeger or a collector) is up and running. The `endpoint` should point to the trace receiver's gRPC endpoint.

### Configuration Options

| Option         | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| `endpoint`     | `string` | The URL of your OTLP gRPC trace exporter.                                    |
| `instruments`  | `array`  | Array of libraries to auto-instrument (`http`, `express`, `mongodb`, etc.).   |
| `serviceName`  | `string` | Optional: The name of your service (default: `undefined`).                   |
| `logLevel`     | `number` | Optional: The logging level for OpenTelemetry diagnostics (default: `INFO`). |

### Example

```typescript
import { register } from 'infrastack-interview-fs-ka';

register({
    endpoint: 'http://localhost:4317',
    instruments: ['http', 'express', 'redis', 'graphql'],
    serviceName: 'my-awesome-service',
    logLevel: 2 // DiagLogLevel.DEBUG
});
```

### Graceful Shutdown

The wrapper automatically handles shutdown when the process receives a `SIGTERM` signal. It will terminate the tracing process and clean up resources.

### Logging

The `logLevel` parameter controls the verbosity of OpenTelemetry's internal logging. It can be set to any value from `DiagLogLevel`:
- `DiagLogLevel.NONE` = 0
- `DiagLogLevel.ERROR` = 1
- `DiagLogLevel.WARN` = 2
- `DiagLogLevel.INFO` = 3
- `DiagLogLevel.DEBUG` = 4
- `DiagLogLevel.VERBOSE` = 5

## License
[MIT](LICENSE)
