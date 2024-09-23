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