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