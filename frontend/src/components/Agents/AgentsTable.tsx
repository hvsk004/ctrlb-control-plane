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
import { useAgentValues } from "@/context/useAgentsValues";


const Agent = [
  {
    id: 1,
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg-1.jpg",
    name: "Agent Alpha",
    type: "Linux",
    version: "v2.0.1",
    status: "Connected",
    exportedVolume: "150 GB",
    logs: "",
    metrics: "700KB/h",
    traces: "",
    configuration:"",
    pipelineName:"cltrb"
  },
  {
    id: 2,
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg",
    name: "Agent Beta",
    type: "Windows",
    version: "v1.3.5",
    status: "Connected",
    exportedVolume: "85 GB",
    logs: "",
    metrics: "600KB/h",
    traces: "",
    configuration:"",
    pipelineName:"local"
  },
];


export function AgentsTable() {
  const { agentValues, setAgentValues } = useAgentValues()
  setAgentValues(Agent)
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
        {agentValues.map((agent) => (
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