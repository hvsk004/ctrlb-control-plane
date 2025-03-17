import {TableCell} from "@/components/ui/table"
import { useAgentValues } from "@/context/useAgentsValues"
import { RefreshCcwIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePipelineOverview } from "@/context/usePipelineDetailContext";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { AgentValuesType } from "@/types/agentValues.type";

const PipelineOverviewTable = () => {
    const { agentValues, setAgentValues } = useAgentValues()
    const { pipelineOverview, setPipelineOverview } = usePipelineOverview()
    const [selectedAgent, setSelectedAgent] = useState<AgentValuesType | null>(null);


    const handleSelectDevice = (id: number) => {
        setAgentValues(agentValues.map(device =>
            device.id === id ? { ...device, selected: !device.selected } : device
        ));
    };

    const handleAgentApply = (agent: AgentValuesType | null) => {
        if (!agent || !pipelineOverview) return;
        const updatedAgent = {
            ...agent,
            pipelineName: pipelineOverview.name,
            status: "Connected"
        };

        setAgentValues(agentValues.map(a => a.id === agent.id ? updatedAgent : a));
        pipelineOverview.agents = pipelineOverview.agents + 1;
        const updatedOverview = pipelineOverview.overview.map(overview => {
            if (overview.label === "Active agents") {
                return {
                    ...overview,
                    value: [...overview.value, updatedAgent]
                };
            }
            return overview;
        });

        setPipelineOverview({
            ...pipelineOverview,
            overview: updatedOverview
        });
    }

    const handleDetachAgent = () => {
        if (!pipelineOverview) return;
        const selectedAgents = agentValues.filter(agent => agent.selected && agent.pipelineName === pipelineOverview.name);

        const updatedAgents = agentValues.map(agent => {
            if (selectedAgents.some(selectedAgent => selectedAgent.id === agent.id)) {
                return {
                    ...agent,
                    pipelineName: "",
                    status: "Disconnected",
                    selected: false
                };
            }
            return agent;
        });

        setAgentValues(updatedAgents);
        pipelineOverview.agents = pipelineOverview.agents - selectedAgents.length;
        const updatedOverview = pipelineOverview.overview.map(overview => {
            if (overview.label === "Active agents") {
                return {
                    ...overview,
                    value: Array.isArray(overview.value) ? overview.value.filter((a: any) => !selectedAgents.some(selectedAgent => selectedAgent.id === a.id)) : overview.value
                };
            }
            return overview;
        });

        setPipelineOverview({
            ...pipelineOverview,
            overview: updatedOverview
        });
        console.log(agentValues)
    }

    const handleNumberOfAgent = () => {
        const agentNumber = pipelineOverview?.overview.map(overview => overview.value.length)
        return agentNumber
    }

    return (
        <div className="p-4 rounded-lg shadow">
            <div className="flex mb-5 justify-between">
                <h1 className="text-xl flex justify-center items-center text-gray-600">Agents ({pipelineOverview?.overview.map(overview => overview.label == "Active agents" ? overview.value.length : "")})
                    <RefreshCcwIcon onClick={handleNumberOfAgent} className="w-5 mx-4 text-blue-500" />
                </h1>
                {agentValues.every(agent => agent.selected) ? (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"destructive"}>Detach All Agents</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-[16rem]">
                            <DialogHeader>
                                <DialogTitle className="mb-2">Detach All Agents</DialogTitle>
                                <DialogDescription>
                                    <p className="text-gray-700 mb-4">Are you sure you want to detach all agents from {pipelineOverview?.name} Pipeline?</p>
                                    {agentValues.filter(agent => agent.selected).map(
                                        agent => (
                                            <p className="text-gray-600" key={agent.id}>{agent.name}</p>
                                        )
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose className="flex gap-4">
                                    <Button>Cancel</Button>
                                    <Button variant={"destructive"} type="submit" onClick={handleDetachAgent}>Detach All Agent</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ) : agentValues.some(agent => agent.selected) ? (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"destructive"}>Detach Agent</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-[16rem]">
                            <DialogHeader>
                                <DialogTitle className="mb-2">Detach Agent</DialogTitle>
                                <DialogDescription>
                                    <p className="text-gray-700 mb-4">Are you sure you want to detach selected agents from {pipelineOverview?.name} Pipeline?</p>
                                    {agentValues.filter(agent => agent.selected).map(
                                        agent => (
                                            <p className="text-gray-600" key={agent.id}>{agent.name}</p>
                                        )
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose className="flex gap-4">
                                    <Button>Cancel</Button>
                                    <Button variant={"destructive"} type="submit" onClick={handleDetachAgent}>Detach Agent</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>

                    </Dialog>
                ) : (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" className="bg-blue-500">Add Agent</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-[16rem]">
                            <DialogHeader>
                                <DialogTitle className="mb-2">Add Agent</DialogTitle>
                                <DialogDescription>
                                    <p className="text-gray-700 mb-4">Add an agent from listed agents in the Agents table</p>
                                    <Select onValueChange={(value) => {
                                        const agent = agentValues.find(agent => agent.name === value);
                                        setSelectedAgent(agent || null);
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select an agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {agentValues.filter(agent => agent.pipelineName !== pipelineOverview?.name && agent.status == "Disconnected").map(agent => (
                                                    <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            </div>
                            <DialogFooter>
                                <DialogClose className="flex gap-4">
                                    <Button>Cancel</Button>
                                    <Button onClick={() => handleAgentApply(selectedAgent)} className="bg-blue-500" type="submit">Apply</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <table className="min-w-full bg-gray-50">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-4 px-2 text-left">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setAgentValues(agentValues.map(device =>
                                        device.pipelineName === pipelineOverview?.name ? { ...device, selected: isChecked } : device
                                    ));
                                }}
                                checked={agentValues
                                    .filter(device => device.pipelineName === pipelineOverview?.name)
                                    .every(device => device.selected)}
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
                    {agentValues
                        .filter(agent => agent.pipelineName === pipelineOverview?.name && agent.status == "Connected")
                        .map(agent => (
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
                                <TableCell className={`${agent.status === "Connected" ? "bg-green-100 text-green-700" : agent.status === "Disconnected" ? "bg-red-100 text-red-700" : ""}`}>
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