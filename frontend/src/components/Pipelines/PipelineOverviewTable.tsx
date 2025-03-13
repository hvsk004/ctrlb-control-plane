import {
    TableCell,
} from "@/components/ui/table"
import { useAgentValues } from "@/context/useAgentsValues"
import { RefreshCcwIcon } from "lucide-react";
import { Button } from "../ui/button";

const PipelineOverviewTable = () => {
    const { agentValues, setAgentValues } = useAgentValues()

    const handleSelectAll = (e: any) => {
        const isChecked = e.target.checked;
        setAgentValues(agentValues.map(device => ({
            ...device,
            selected: isChecked
        })));
    };

    const handleSelectDevice = (id: number) => {
        console.log("Select Device ID:", id);
        setAgentValues(agentValues.map(device =>
            device.id === id ? { ...device, selected: !device.selected } : device
        ));
    };

    return (
        <div className=" p-4 rounded-lg shadow">
            <div className="flex mb-5 justify-between">
                <h1 className="text-xl flex justify-center items-center text-gray-600">Agents ({agentValues.length})
                    <RefreshCcwIcon className="w-5 mx-4 text-blue-500" />
                </h1>
                <Button className="bg-blue-500">
                    Add Agent
                </Button>
            </div>
            <table className="min-w-full bg-gray-50">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-4 px-2 text-left">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                onChange={handleSelectAll}
                                checked={agentValues.every(device => device.selected)}
                            />
                        </th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Name</th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Status</th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Pipeline</th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Version</th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Logs</th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Metrics</th>
                        <th className="py-4 px-4 text-left font-medium text-gray-600">Traces</th>
                    </tr>
                </thead>
                <tbody>
                    {agentValues.map(agent => (
                        <tr key={agent.id} className="border-b border-gray-200">
                            <td className="py-4 px-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={agent.selected}
                                    onChange={() => handleSelectDevice(agent.id)}
                                />
                            </td>
                            <TableCell className="font-medium text-gray-700">{agent.name}</TableCell>
                            <TableCell className={`${agent.status === "Connected" ? "bg-green-100 text-green-700" : agent.status === "Failed" ? "bg-red-100 text-red-700" : ""}`}>
                                {agent.status}
                            </TableCell>
                            <TableCell className="text-gray-700">{agent.pipelineName}</TableCell>
                            <TableCell className="text-gray-700">{agent.version}</TableCell>
                            <TableCell className="text-gray-700">{agent.logs}</TableCell>
                            <TableCell className="text-gray-700">{agent.metrics}</TableCell>
                            <TableCell className="text-gray-700">{agent.traces}</TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PipelineOverviewTable