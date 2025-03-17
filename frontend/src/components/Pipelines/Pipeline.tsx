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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import PipelineOverview from "./PipelineOverview";
import { usePipelineOverview } from "@/context/usePipelineDetailContext";
import { Pipelines } from "@/constants/Pipeline";

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
