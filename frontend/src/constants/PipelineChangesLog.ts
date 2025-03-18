export interface Changes {
    type: string,
    name: string,
    status: string
}[]
export const PipelineChangesLog: Changes[] = [
    {
        type: "source",
        name: "system",
        status: "added"
    },
    {
        type: "processor",
        name: "mask_ssn",
        status: "added"
    },
    {
        type: "processor",
        name: "drop_trace",
        status: "added"
    },
    {
        type: "processor",
        name: "error_monitor",
        status: "added"
    },
    {
        type: "processor",
        name: "exception_m",
        status: "added"
    },
    {
        type: "processor",
        name: "log_to_pattern",
        status: "added"
    },
    {
        type: "destination",
        name: "ctrlB",
        status: "added"
    },
    {
        type: "destination",
        name: "openmetrics",
        status: "added"
    }

]