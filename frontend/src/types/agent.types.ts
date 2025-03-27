export interface Agent {
    id: string,
    name: string,
    status: string,
    pipeline_name: string,
    version: string,
    log_rate: number,
    metrics_rate: number,
    trace_rate: number,
    selected?: boolean,
}

  export interface ApiError {
    message: string;
    error?:string
  }