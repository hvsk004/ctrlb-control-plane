import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

import { useAgentValues } from "@/context/useAgentsValues";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import agentServices from "@/services/agentServices";
import CreateNewAgent from "./CreateNewAgent";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { HeartPulse, Lock, LucideArrowLeftRight } from "lucide-react";
import { CpuUsageChart } from "./charts/CpuUsageChart";
import { MemoryUsageChart } from "./charts/MemoryUsageChart";
import { MetricsReusableChart } from "./charts/MetricsReusableChart";
import { agentVal } from "@/types/agent.types";


export function AgentsTable() {
  const { agentValues } = useAgentValues()
  const [agentVal, setAgentVal] = useState<agentVal>()
  const [labelList, setLabelList] = useState<{ [key: string]: string }>({})
  const [labelKey, setLabelKey] = useState<string>("")
  const [labelValue, setLabelValue] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("pipeline")
  const [traceRate, setTraceRate] = useState([])
  const [logRate, setLogRate] = useState([])
  const [metricRate, setMetricRate] = useState([])

  const TABS = [
    { label: "Health", value: "health", icon: <HeartPulse /> },
    { label: "Pipeline", value: "pipeline", icon: <LucideArrowLeftRight /> },
    { label: "Rate Metrics", value: "rate_metrics", icon: <Lock /> }
  ];

  const handleAgentById = async (agentId: string) => {
    const res = await agentServices.getAgentById(agentId)
    setAgentVal(res)
    setLabelList(res.labels)
  }

  const handleLabelKeyInput = (e: any) => {
    setLabelKey(e.target.value)
  }

  const handleLabelValueInput = (e: any) => {
    setLabelValue(e.target.value)
  }

  const handleSaveChanges = async () => {
    const newLabel = { [labelKey]: labelValue };
    setLabelList({ ...labelList, ...newLabel });
    const res = await agentServices.addAgentLabel(agentVal!.id, newLabel);
    console.log(res);
  };

  const getCpuDataPoint = async () => {
    console.log(agentVal?.id!)
    const res = await agentServices.getAgentRateMetrics(agentVal?.id!)
    setMetricRate(res[1].data_points)
    setTraceRate(res[0].data_points)
    setLogRate(res[2].data_points)
  }

  useEffect(() => {
    getCpuDataPoint()
  }, [agentVal])

  return (
    <div>
      {agentValues.length > 0 && <Table className="border border-gray-200">
        <TableCaption>A list of your recent agents.</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[100px]">Pipeline Name</TableHead>
            <TableHead className="w-[100px]">Version</TableHead>
            <TableHead className="w-[100px]">Log Rate</TableHead>
            <TableHead className="w-[100px]">Metrics Rate</TableHead>
            <TableHead className="w-[100px]">Trace Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agentValues.map((agent) => (
            <Sheet key={agent.id}>
              <SheetTrigger asChild>
                <TableRow onClick={() => { handleAgentById(agent.id) }}>
                  <TableCell className="flex items-center font-medium text-gray-700">
                    {agent.name}
                  </TableCell>
                  <TableCell className={`mx-4 my-3 ${agent.status === "connected" ? "text-green-600" : "text-red-600"}`}>
                    {agent.status}
                  </TableCell>
                  <TableCell className="text-gray-700">{agent.pipeline_name}</TableCell>
                  <TableCell className="text-gray-700">{agent.version}</TableCell>
                  <TableCell className="text-gray-700">{agent.log_rate}</TableCell>
                  <TableCell className="text-gray-700">{agent.metrics_rate}</TableCell>
                  <TableCell className="text-gray-700">{agent.trace_rate}</TableCell>
                </TableRow>
              </SheetTrigger>
              <SheetContent>
                {agentVal && <div className="flex flex-col gap-2">
                  <h1 className="capitalize font-bold text-2xl mb-4">{agentVal.name}</h1>
                  <p className="capitalize"><span className="font-bold">ID:</span>{agentVal.id}</p>
                  <p className="capitalize"> <span className="font-bold">Version:</span> {agentVal.version}</p>
                  <p className="capitalize"><span className="font-bold">Pipeline: </span> {agentVal.pipelineName}</p>
                  <p className="capitalize"><span className="font-bold">Status:</span> <span className={` ${agent.status === "connected" ? "text-green-600" : "text-red-600"}`}>{agentVal.status}</span></p>
                  <p className="capitalize"> <span className="font-bold">Hostname: </span> {agentVal.hostname}</p>
                  <p className="capitalize"> <span className="font-bold">Platform: </span> {agentVal.platform}</p>
                  <div className="flex gap-2 items-center">
                    <p className="text-black font-bold">Labels: </p>
                    {labelList && Object.keys(labelList).map((key) => (
                      <p className="border border-1 bg-gray-100 rounded-full px-3 py-1" key={key}>{key}: {labelList[key]}</p>
                    ))}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size={"sm"} className="bg-blue-500">Add Label</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Label</DialogTitle>
                          <DialogDescription>
                            Add label to your pipeline.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="labelKey" className="text-right">
                              Label Key
                            </Label>
                            <Input id="labelKey" onChange={handleLabelKeyInput} className="col-span-3" />
                            <Label htmlFor="labelValue" className="text-right">
                              Label Value
                            </Label>
                            <Input id="labelValue" onChange={handleLabelValueInput} className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button className="mx-3" variant={"outline"}>Cancel</Button>
                            <Button onClick={handleSaveChanges} type="submit">Save changes</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>}
                <div>
                  <div className="flex gap-2 border-b mt-5">
                    {TABS.map(({ label, value, icon }) => (
                      <div className="flex gap-2">
                        <span className="flex items-center gap-2">
                          {icon}
                        </span>
                        <button
                          key={value}
                          onClick={() => setActiveTab(value)}
                          className={`px-4 py-2 text-lg rounded-t-md text-gray-600 focus:outline-none ${activeTab === value
                            ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                            : ""
                            }`}
                        >
                          {label}
                        </button>
                      </div>
                    ))}
                  </div>
                  {
                    activeTab == "pipeline" ? <div>
                      <p className="p-[8rem] font-bold text-lg">In order to implement a pipeline on this agent please go to Pipelines tab - Select a pipeline - click on 'Add Agent' and then select this agent</p>
                    </div>:""
                  }
                  {
                    activeTab == "health" && <div className="grid grid-cols-2 p-2 mt-5 gap-4">
                      <CpuUsageChart id={agentVal!.id} />
                      <MemoryUsageChart id={agentVal!.id} />
                    </div>
                  }
                  {
                    activeTab == "rate_metrics" && <div className="grid grid-cols-3 p-2 mt-5 gap-4">
                      <MetricsReusableChart name={"Metrics Rate"} data={metricRate} />
                      <MetricsReusableChart name={"Trace Rate"} data={traceRate} />
                      <MetricsReusableChart name={"Log Rate"} data={logRate} />
                    </div>
                  }
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </TableBody>
      </Table>}
      {agentValues.length === 0 && <CreateNewAgent />}
    </div>
  )
}