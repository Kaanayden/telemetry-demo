import { DiagLogLevel } from '@opentelemetry/api';
interface Config {
    endpoint: string;
    instruments: ('http' | 'express' | 'mongodb' | 'socket' | 'graphql' | 'redis' | 'mysql' | 'aws' | 'mongoose' | 'fs' | 'runtime' | 'system')[];
    serviceName?: string;
    logLevel?: DiagLogLevel;
}
export declare function register(config: Config): void;
export { DiagLogLevel };
