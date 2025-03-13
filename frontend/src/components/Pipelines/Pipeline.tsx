import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import LandingView from "./LandingView";
import { PipelineList } from "@/types/pipeline.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import PipelineOverview from "./PipelineOverview";
import { usePipelineOverview } from "@/context/usePipelineDetailContext";

const Pipelines: PipelineList[] = [
  {
    id: "1",
    name: "ctrlb",
    agents: 3,
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
      { label: "Active agents", value: "3" }
    ]
  },
  {
    id: "2",
    name: "local",
    agents: 2,
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
      { label: "Active agents", value: "2" }
    ]
  },
];

const Pipeline = () => {
  const { setPipelineOverview } = usePipelineOverview()
  return (
    <>
      {Pipelines.length > 0 && (
        <Table className="border border-gray-200">
          <TableCaption>A list of your recent pipelines.</TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Agents</TableHead>
              <TableHead className="w-[100px]">Incoming bytes</TableHead>
              <TableHead className="w-[100px]">Outgoing bytes</TableHead>
              <TableHead className="w-[100px]">Outgoing events</TableHead>
              <TableHead className="w-[100px]">Last updated at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Pipelines.map((pipeline) => (
              <Sheet key={pipeline.id}>
                <SheetTrigger asChild>
                  <TableRow onClick={() => setPipelineOverview(pipeline)} key={pipeline.id}>
                    <TableCell className="font-medium text-gray-700">{pipeline.name}</TableCell>
                    <TableCell className="text-gray-700">{pipeline.agents}</TableCell>
                    <TableCell className="text-gray-700">{pipeline.incoming_bytes}</TableCell>
                    <TableCell className="text-gray-700">{pipeline.outgoing_bytes}</TableCell>
                    <TableCell className="text-gray-700">{pipeline.incoming_events}</TableCell>
                    <TableCell className="text-gray-700">{pipeline.updated_at}</TableCell>
                  </TableRow>
                </SheetTrigger>
                <SheetHeader>
                </SheetHeader>
                <SheetContent>
                  <PipelineOverview />
                </SheetContent>
              </Sheet>
            ))}
          </TableBody>
        </Table>
      )
      }
      {Pipelines.length == 0 && <LandingView />}
    </>

  )
}

export default Pipeline
