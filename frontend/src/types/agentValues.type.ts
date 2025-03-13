export interface AgentValues{
    id:number
    img: string;
    name: string;
    type: string;
    version: string;
    status: string;
    exportedVolume: string;
    logs:string,
    metrics:string,
    traces:string,
    configuration:string,
    selected:boolean,
    pipelineName:string
}