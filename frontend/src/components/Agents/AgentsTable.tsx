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
    status: "Disconnected",
    exportedVolume: "150 GB",
    logs: "",
    metrics: "700KB/h",
    traces: "",
    configuration:"",
    pipelineName:"",
    selected:false
  },
  {
    id: 2,
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg",
    name: "Agent Beta",
    type: "Windows",
    version: "v1.3.5",
    status: "Disconnected",
    exportedVolume: "85 GB",
    logs: "",
    metrics: "600KB/h",
    traces: "",
    configuration:"",
    pipelineName:"",
    selected:false
  },
  {
    id: 3,
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg-2.jpg",
    name: "Agent Gamma",
    type: "MacOS",
    version: "v3.1.0",
    status: "Disconnected",
    exportedVolume: "200 GB",
    logs: "",
    metrics: "800KB/h",
    traces: "",
    configuration:"",
    pipelineName:"",
    selected:false
  },
  {
    id: 4,
    img: "https://cdn.brandfetch.io/idxVhszl6V/w/400/h/400/theme/dark/icon.jpeg-3.jpg",
    name: "Agent Delta",
    type: "Linux",
    version: "v2.2.3",
    status: "Disconnected",
    exportedVolume: "120 GB",
    logs: "",
    metrics: "500KB/h",
    traces: "",
    configuration:"",
    pipelineName:"",
    selected:false
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
          <TableHead className="w-[100px]">Pipeline</TableHead>
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
              {agent.name}</TableCell>
            <TableCell className="text-gray-700">{agent.pipelineName}</TableCell>
            <TableCell className="text-gray-700">{agent.version}</TableCell>
            <TableCell className="text-gray-700">{agent.status}</TableCell>
            <TableCell className=" text-gray-700">{agent.exportedVolume}</TableCell>
            <TableCell>
              <PencilIcon onClick={handleClick} className="h-5 w-5 mx-5 text-gray-500 cursor-pointer" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}