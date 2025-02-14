import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const Pipelines = [
  {
    id: "1",
    name: "ctrlb",
    agents: 1,
    incoming_bytes: "90 GB",
    outgoing_bytes: "10 GB",
    incoming_events: "10 K",
    updated_at: "20/09/2024 17:30:30 IST"
  },
  {
    id: "2",
    name: "local",
    agents: 1,
    incoming_bytes: "300 GB",
    outgoing_bytes: "60 GB",
    incoming_events: "60 K",
    updated_at: "10/07/2024 17:30:30 IST"
  },
];

const Pipeline = () => {
  return (
    <Table className="border border-gray-200">
      <TableCaption>A list of your recent pipelines.</TableCaption>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="w-[100px]">
            Name</TableHead>
          <TableHead className="w-[100px]">Agents</TableHead>
          <TableHead className="w-[100px]">Incoming bytes</TableHead>
          <TableHead className="w-[100px]">Outgoing bytes</TableHead>
          <TableHead className="w-[100px]">Outgoing events</TableHead>
          <TableHead className="w-[100px]">Last updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Pipelines.map((pipeline) => (
          <TableRow key={pipeline.id}>
            <TableCell className="font-medium text-gray-700">{pipeline.name}</TableCell>
            <TableCell className="text-gray-700">{pipeline.agents}</TableCell>
            <TableCell className="text-gray-700">{pipeline.incoming_bytes}</TableCell>
            <TableCell className="text-gray-700">{pipeline.outgoing_bytes}</TableCell>
            <TableCell className="text-gray-700">{pipeline.incoming_events}</TableCell>
            <TableCell className="text-gray-700">{pipeline.updated_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default Pipeline
