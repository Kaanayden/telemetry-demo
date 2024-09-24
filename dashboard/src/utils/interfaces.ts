export interface Services {
    allServices: {ServiceName: string}[];
    activeServices: {ServiceName: string}[]; 
  }
  
export interface UniqueRelation {
    from_service: string;
    to_service: string;
}

export interface HomePageProps {
    services: Services;
    uniqueRelations: UniqueRelation[];
}

export interface TraceData {
    Timestamp: string;
    TraceId: string;
    SpanId: string;
    ParentSpanId: string;
    TraceState: string;
    SpanName: string;
    SpanKind: string;
    ServiceName: string;
    ResourceAttributes: object;
    ScopeName: string;
    ScopeVersion: string;
    SpanAttributes: object;
    Duration: string;
    StatusCode: string;
    StatusMessage: string;
    Events: object;
    Links: object;
  }

  export interface MetricData {
    
        interval_start: string,
        avg_process_memory_usage: number,
        avg_system_memory_usage: number,
        avg_system_memory_usage_percent: number
    
  }