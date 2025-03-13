export interface Pipeline {
    id: string;
    name: string;
    type: string;
    version: string;
    hostname: string;
    platform: string;
    config: Config;
    isPipeline: boolean;
    registeredAt: string; 
  }

export interface PipelineList{
    id: string;
    name: string;
    agents: number;
    incoming_bytes: string;
    outgoing_bytes: string;
    incoming_events: string;
    updated_at: string;
    overview: PipeLineOverview[];
  }

export interface PipeLineOverview{
  label: string;
  value: string;
}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Config {
  }

  export interface ApiError {
    message: string;
  }