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

export interface agentVal {
    "id": string,
    "name": string,
    "version": string,
    "pipelineID": string,
    "pipelineName": string,
    "status": string,
    "hostname": string,
    "platform": string,
    "labels": { [key: string]: string }
  }