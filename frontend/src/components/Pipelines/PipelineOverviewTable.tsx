import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const Agents = [
    {
        id: "1",
        name: "Apple-Macbook-pro.local",
        status: "Connected",
        pipeline: "localhost_1",
        version: "v1.60.0",
        logs: "2.9Mib/min",
        metrics: "",
        traces: ""
    },
    {
        id: "2",
        name: "Apple-Macbook-pro.local",
        status: "Failed",
        pipeline: "localhost_1",
        version: "v1.60.0",
        logs: "2.7Mib/min",
        metrics: "",
        traces: ""
    }

]
const PipelineOverviewTable = () => {
    return (
        <div>
            <Table className="border mt-5 border-gray-200">
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead className="w-[100px] text-md">Name</TableHead>
                        <TableHead className="w-[100px] text-md">Status</TableHead>
                        <TableHead className="w-[100px] text-md">Pipeline</TableHead>
                        <TableHead className="w-[100px] text-md">Version</TableHead>
                        <TableHead className="w-[100px] text-md">Logs</TableHead>
                        <TableHead className="w-[100px] text-md">Metrics</TableHead>
                        <TableHead className="w-[100px] text-md">Traces</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Agents.map((agent) => (
                        <TableRow key={agent.id}>
                            <TableCell className="font-medium text-gray-700">{agent.name}</TableCell>
                            <TableCell className={`${agent.status === "Connected" ? "bg-green-100 text-green-700" : agent.status === "Failed" ? "bg-red-100 text-red-700" : ""}`}>
                                {agent.status}
                            </TableCell>
                            <TableCell className="text-gray-700">{agent.pipeline}</TableCell>
                            <TableCell className="text-gray-700">{agent.version}</TableCell>
                            <TableCell className="text-gray-700">{agent.logs}</TableCell>
                            <TableCell className="text-gray-700">{agent.metrics}</TableCell>
                            <TableCell className="text-gray-700">{agent.traces}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default PipelineOverviewTable
