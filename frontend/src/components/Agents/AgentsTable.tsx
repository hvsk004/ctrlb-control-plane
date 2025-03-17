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
import { Agent } from "@/constants/AgentList";

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