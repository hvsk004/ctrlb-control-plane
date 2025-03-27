import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge, CopyIcon, HeartPulse, Loader2, LucideArrowLeftRight, PlusIcon } from "lucide-react";
import { Select, SelectItem, SelectGroup, SelectTrigger, SelectValue, SelectContent } from "../ui/select";
import { Close, DialogClose } from "@radix-ui/react-dialog";
import { CpuUsageChart } from "./charts/CpuUsageChart";
import { MemoryUsageChart } from "./charts/MemoryUsageChart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CreateNewAgent = () => {
    const [platform, setPlatform] = useState<string | null>(null)
    const [showRunCommand, setShowRunCommand] = useState(false)
    const [showHeartBeat, setShowHeartBeat] = useState(false)
    const [showStatus, setShowStatus] = useState(false)
    const [status, setStatus] = useState<"success" | "failed">("failed")
    const [showAgentInfo, setShowAgentInfo] = useState(false)
    const [activeTab, setActiveTab] = useState<string>("pipeline")
    const [label, setLabel] = useState<string>("")
    const [labelList, setLabelList] = useState<string[]>([])
    const TABS = [
        { label: "Health", value: "health", icon: <HeartPulse /> },
        { label: "Pipeline", value: "pipeline", icon: <LucideArrowLeftRight /> },
    ];
    const { toast } = useToast()
    const handleChange = () => {
        setShowRunCommand(true)
    }

    const handleSaveChanges = () => {
        setLabelList([...labelList, label])
    }

    const EDI_API_KEY = "b684f7-9485ght-4f7-9f8g-4f7g9-4f7g9"
    const agentInfo = [
        {
            name: "Apple-macbook-pro.local",
            agentId: "gtfuwrf349635984tyge9ty59",
            type: "OpenTelemetry Agent",
            version: "v1.72.0",
            pipeline_connected: "None",
            pipeline_id: "None",
            hostname: "Apple-macbook-pro.local",
            platform: "darwin amd64",
            operating_system: "macOS 14.6",
            remote_address: "10.3.9.8:3400",
        }
    ]
    const handleLabelInput = (e: any) => {
        const value = e.target.value
        setLabel(value)
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(`${EDI_API_KEY}`)
        setTimeout(() => {
            toast({
                title: 'Copied',
                description: 'API Key copied to clipboard',
                duration: 2000,
            })
        }, 1000)
        setTimeout(() => {
            setShowHeartBeat(true)
        }, 2000)
        setTimeout(() => {
            setShowStatus(true)
        }, 6000)
        setTimeout(() => {
            setShowAgentInfo(true)
        }, 7000)
    }
    return (
        <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col gap-7 justify-center items-center">
                <p className='font-bold text-xl mt-[6rem]'>Get started</p>
                <p className='text-gray-700'>Install Your First Agent</p>
                <p className='text-gray-700'>Agents collect data from the sources in the pipeline and route them to desired destinations</p>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="flex items-center gap-1 px-4 py-1 bg-blue-500 text-white" variant="outline">Install First Agent
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    {!showAgentInfo && <SheetContent className="w-[50rem]">
                        <SheetHeader>
                            <div>
                                <h2 className="text-lg font-semibold ">Lets get some Agents Installed</h2>
                            </div>
                        </SheetHeader>
                        <SheetDescription>
                            <p className="mt-2">Your first step is to select the platform you want to install agent</p>
                            <p className="my-3 text-gray-900">Platform</p>
                            <Select onValueChange={(value) => setPlatform(value)}>
                                <SelectTrigger className="w-[47rem]">
                                    <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="linux">Linux</SelectItem>
                                        <SelectItem value="kubernetes">Kubernetes</SelectItem>
                                        <SelectItem value="macOS">macOS</SelectItem>
                                        <SelectItem value="OpenShift">OpenShift</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button disabled={!platform} onClick={handleChange} className="mt-5 w-full bg-blue-500 text-white">Generate Config</Button>
                            {showRunCommand && <div className="mt-5 flex flex-col gap-2 mb-4">
                                <p className="text-lg font-bold text-black">Run Command</p>
                                <p className="text-gray-500">Running this command will deploy the agent in your selected envoirment</p>
                                <div className="flex justify-between border-2 border-orange-300 p-3 rounded-lg text-orange-400">
                                    <p>EDI_API_KEY={EDI_API_KEY}</p>
                                    <CopyIcon onClick={handleCopy} className="h-5 w-5 text-orange-400 cursor-pointer" />
                                </div>
                            </div>}
                            {showHeartBeat && <div className="mt-3 flex flex-col gap-2">
                                <p>Once the agent is completely installed it will also appear in the Agent list Table</p>
                                <div className="flex gap-4 border-2 border-blue-300 p-3 rounded-lg text-blue-400">
                                    <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                                    <p>CtrlB is checking for heartbeat..</p>
                                </div>
                            </div>}
                            {status === "success" ? showStatus && <div className="mt-3 bg-green-200 flex p-3 gap-2 items-center rounded-md">
                                <Badge className="text-green-600" />
                                <p className="text-green-600">Your agent is successfully deployed</p>
                            </div> : showStatus && <div className="mt-3 bg-red-200 flex p-3 gap-2 items-center justify-between rounded-md">
                                <div className="flex justify-start">
                                    <Close className="text-red-600" />
                                    <p className="text-red-600">Heartbeat not detected</p>
                                </div>
                                <Button variant={"destructive"}>Try again</Button>
                            </div>}

                        </SheetDescription>
                        <SheetFooter className="mt-5">
                            <SheetClose asChild>
                                <Button className="w-full">All Agents</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>}
                    {showAgentInfo && <SheetContent className="w-[50rem]">
                        {agentInfo.map((agent, index) => (
                            <div key={index}>
                                <SheetHeader className="font-bold text-lg">
                                    {agent.name}
                                </SheetHeader>
                                <SheetDescription className="mt-5 flex flex-col gap-2">
                                    {Object.keys(agent).map((key) => (
                                        <p className="capitalize text-md text-balance" key={key}><span className="text-black font-semibold">{key}:</span> {agent[key as keyof typeof agent]}</p>
                                    ))}
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-2 items-center">
                                            <p className="text-black font-bold">Labels: </p>
                                            {labelList.map((label, index) => (
                                                <p key={index} className="border border-1 bg-gray-100 rounded-full p-2">{label}</p>
                                            ))}
                                        </div>
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
                                                        <Label htmlFor="label" className="text-right">
                                                            Label
                                                        </Label>
                                                        <Input id="label" onChange={handleLabelInput} className="col-span-3" />
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
                                            activeTab == "pipeline" && <div>
                                                <p className="p-[8rem] font-bold text-lg">In order to implement a pipeline on this agent please go to Pipelines tab - Select a pipeline - click on 'Add Agent' and then select this agent</p>
                                            </div>
                                        }
                                        {
                                            activeTab == "health" && <div className="grid grid-cols-2 p-2 mt-5 gap-4">
                                                <CpuUsageChart id="" />
                                                <MemoryUsageChart id="" />
                                            </div>
                                        }
                                    </div>
                                </SheetDescription>
                            </div>

                        ))}
                    </SheetContent>}
                </Sheet>
            </div>
        </div>

    )
}

export default CreateNewAgent
