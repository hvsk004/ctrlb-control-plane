import { PencilIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const Agent = [
  {
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg-1.jpg",
    name: "Agent Alpha",
    type: "Linux",
    version: "v2.0.1",
    status: "Active",
    exportedVolume: "150 GB",
  },
  {
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg",
    name: "Agent Beta",
    type: "Windows",
    version: "v1.3.5",
    status: "Inactive",
    exportedVolume: "85 GB",
  },
];



export function AgentsTable() {
  const navigate = useNavigate();
  const handleClick = () => navigate("/config/123");

  return (
    <Table className="border border-gray-200">
      <TableCaption>A list of your recent agents.</TableCaption>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="w-[100px]">
            Name</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[100px]">Exported Volume</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Agent.map((agent) => (
          <TableRow key={agent.name}>
            <TableCell className="flex items-center font-medium text-gray-700">
              <img className="mx-4" width={30} src={agent.img} />
              {agent.type}</TableCell>
            <TableCell className="text-gray-700">{agent.version}</TableCell>
            <TableCell className="text-gray-700">{agent.status}</TableCell>
            <TableCell className=" text-gray-700">{agent.exportedVolume}
            </TableCell>
            <TableCell>
              <PencilIcon onClick={handleClick} className="h-5 w-5 mx-5 text-gray-500 cursor-pointer" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}