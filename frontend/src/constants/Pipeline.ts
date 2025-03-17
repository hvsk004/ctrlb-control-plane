import { PipelineList } from "@/types/pipeline.types";

export const Pipelines: PipelineList[] = [
  {
    id: "1",
    name: "ctrlb",
    agents: 0,
    incoming_bytes: "120 GB",
    outgoing_bytes: "30 GB",
    incoming_events: "15 K",
    updated_at: "15/08/2024 12:45:00 IST",
    overview: [
      { label: "Pipeline Id", value: "7fdea737-2eea-419d-a5ed-305a05a4b9b2" },
      { label: "Pipeline created by", value: "johndoe@fintechistanbul.net" },
      { label: "Pipeline created", value: "10:00 AM, Aug 15, 2024" },
      { label: "Pipeline last updated by", value: "janedoe@fintechistanbul.net" },
      { label: "Pipeline last updated", value: "12:45 PM, Aug 15, 2024" },
      { label: "Active agents", value: [] }
    ]
  },
  {
    id: "2",
    name: "local",
    agents: 0,
    incoming_bytes: "250 GB",
    outgoing_bytes: "50 GB",
    incoming_events: "25 K",
    updated_at: "05/09/2024 14:20:10 IST",
    overview: [
      { label: "Pipeline Id", value: "8gdea737-3eea-419d-a5ed-305a05a4b9b3" },
      { label: "Pipeline created by", value: "alice@fintechistanbul.net" },
      { label: "Pipeline created", value: "2:00 PM, Sep 5, 2024" },
      { label: "Pipeline last updated by", value: "bob@fintechistanbul.net" },
      { label: "Pipeline last updated", value: "2:20 PM, Sep 5, 2024" },
      { label: "Active agents", value: [] }
    ]
  },
];