import { usePipelineOverview } from "@/context/usePipelineDetailContext";
import { Boxes } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import EditPipelineYAML from "./EditPipelineYAML";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Edge,
    Connection,
    ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SourceNode } from "../CanvasForPipelines/SourceNode";
import { ProcessorNode } from "../CanvasForPipelines/ProcessorNode";
import { DestinationNode } from "../CanvasForPipelines/DestinationNode";
import { Label } from "@radix-ui/react-label";
import { Switch } from "../ui/switch";
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


const initialNodes: Node[] = [
    // Source
    {
        id: 'system',
        type: 'source',
        position: { x: 50, y: 200 },
        data: {
            label: 'system',
            sublabel: 'fluentbit',
            inputType: '',
            outputType: 'LOG',
            icon: '→|'
        },
    },
    // Processors
    {
        id: 'mask_ssn',
        type: 'processor',
        position: { x: 250, y: 200 },
        data: {
            label: 'mask_ssn',
            sublabel: 'mask',
            inputType: 'LOG',
            outputType: 'LOG'
        },
    },
    {
        id: 'drop_trace',
        type: 'processor',
        position: { x: 500, y: 80 },
        data: {
            label: 'drop_trace',
            sublabel: 'regex_filter',
            inputType: 'LOG',
            outputType: 'LOG'
        },
    },
    {
        id: 'error_monitor',
        type: 'processor',
        position: { x: 500, y: 200 },
        data: {
            label: 'error_monitor',
            sublabel: 'log_to_metric',
            inputType: 'LOG',
            outputType: 'METRIC'
        },
    },
    {
        id: 'exception_m',
        type: 'processor',
        position: { x: 500, y: 320 },
        data: {
            label: 'exception_m',
            sublabel: 'log_to_metric',
            inputType: 'LOG',
            outputType: 'METRIC'
        },
    },
    {
        id: 'log_to_pattern',
        type: 'processor',
        position: { x: 500, y: 440 },
        data: {
            label: 'log_to_pattern',
            sublabel: 'log_to_pattern',
            inputType: 'LOG',
            outputType: 'PATTERN & SAMPLE'
        },
    },
    // Destinations
    {
        id: 'ctrlb',
        type: 'destination',
        position: { x: 750, y: 80 },
        data: {
            label: 'CtrlB',
            sublabel: 'CtrlB_Explore',
            inputType: 'MIXED',
            outputType: ''
        },
    },
    {
        id: 'openmetrics',
        type: 'destination',
        position: { x: 750, y: 320 },
        data: {
            label: 'Openmetrics',
            sublabel: 'openmetrics',
            inputType: 'MIXED',
            outputType: ''
        },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'system', target: 'mask_ssn', label: '11GB', animated: true },
    { id: 'e2-3', source: 'mask_ssn', target: 'drop_trace', label: '2KB', animated: true },
    { id: 'e2-4', source: 'mask_ssn', target: 'error_monitor', label: '2KB', animated: true },
    { id: 'e2-5', source: 'mask_ssn', target: 'exception_m', label: '2KB', animated: true },
    { id: 'e2-6', source: 'mask_ssn', target: 'log_to_pattern', label: '2KB', animated: true },
    { id: 'e3-7', source: 'drop_trace', target: 'ctrlb', label: '2KB', animated: true },
    { id: 'e4-7', source: 'error_monitor', target: 'openmetrics', label: '1MB', animated: true },
    { id: 'e5-7', source: 'exception_m', target: 'openmetrics', label: '685KB', animated: true },
    { id: 'e6-7', source: 'log_to_pattern', target: 'openmetrics', label: '1MB', animated: true },
];

const PipelineDetails = () => {
    const { pipelineOverview } = usePipelineOverview();
    const TABS = [
        { label: "Overview", value: "overview" },
        { label: "YAML", value: "yaml" },
    ];
    const { agentValues } = useAgentValues()
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [nodeCounter, setNodeCounter] = useState(10);
    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance!.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            let newNode: Node = {
                id: `${type}_${nodeCounter}`,
                type,
                position,
                data: { label: `New ${type}` },
            };

            if (type === 'source') {
                newNode.data = {
                    label: `source_${nodeCounter}`,
                    sublabel: 'input',
                    outputType: 'LOG',
                    icon: '→|'
                };
            } else if (type === 'processor') {
                newNode.data = {
                    label: `processor_${nodeCounter}`,
                    sublabel: 'transform',
                    inputType: 'LOG',
                    outputType: 'LOG'
                };
            } else if (type === 'destination') {
                newNode.data = {
                    label: `destination_${nodeCounter}`,
                    sublabel: 'output',
                    inputType: 'LOG',
                    outputType: 'LOG'
                };
            }

            setNodes((nds) => nds.concat(newNode));
            setNodeCounter((prevCounter) => prevCounter + 1);
        },
        [nodeCounter, reactFlowInstance, setNodes],
    );

    const nodeTypes = {
        source: SourceNode,
        processor: ProcessorNode,
        destination: DestinationNode,
    };

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="py-4 flex flex-col">
            <div className="flex mb-5 gap-2 items-center">
                <Boxes className="text-gray-700" size={36} />
                <h1 className="text-2xl text-gray-800">{pipelineOverview?.name}</h1>
            </div>
            <div className="flex items-center w-full md:w-auto">
                <div className="flex gap-2 justify-between w-full mb-2">
                    <div className="flex gap-2 justify-start">
                        {TABS.map(({ label, value }) => (
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
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className="bg-blue-500">View/Edit Pipeline</Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-full p-0" side="right">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-xl font-medium">ctrlb</div>
                                    </div>
                                    <div className="flex items-center mr-6">
                                        <div className="mr-4 flex items-center space-x-2">
                                            <Switch id="edit-mode" />
                                            <Label htmlFor="edit-mode">Edit Mode</Label>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '77vh', backgroundColor: "#f9f9f9" }} ref={reactFlowWrapper}>
                                    <ReactFlow
                                        nodes={nodes}
                                        edges={edges}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        nodeTypes={nodeTypes}
                                        onInit={setReactFlowInstance}
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        fitView
                                    >
                                        <Background />
                                        <Controls />
                                        <MiniMap />
                                    </ReactFlow>
                                </div>

                                <div className="bg-gray-100 h-1/5 p-4 rounded-lg">
                                    <div className="flex justify-around gap-2">
                                        <div className='flex items-center'>
                                            <div
                                                className="bg-white rounded-md shadow-md p-3 cursor-move border-2 border-gray-300 flex items-center justify-center"
                                                draggable
                                                onDragStart={(event) => onDragStart(event, 'source')}
                                            >
                                                Add Source
                                            </div>
                                            <div className='bg-green-600 h-6 rounded-tr-lg rounded-br-lg w-2' />
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='bg-green-600 h-6 rounded-tl-lg rounded-bl-lg w-2' />

                                            <div
                                                className="bg-white rounded-md shadow-md p-3 cursor-move border-2 border-gray-300 flex items-center justify-center"
                                                draggable
                                                onDragStart={(event) => onDragStart(event, 'processor')}
                                            >
                                                Add Processor
                                            </div>
                                            <div className='bg-green-600 h-6 rounded-tr-lg rounded-br-lg w-2' />

                                        </div>

                                        <div className='flex items-center'>
                                            <div className='bg-green-600 h-6 rounded-tl-lg rounded-bl-lg w-2' />
                                            <div
                                                className="bg-white rounded-md shadow-md p-3 cursor-move border-2 border-gray-300 flex items-center justify-center"
                                                draggable
                                                onDragStart={(event) => onDragStart(event, 'destination')}
                                            >
                                                Add Destination
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Delete Pipeline</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[40rem] h-[20rem]">
                                <DialogHeader>
                                    <DialogTitle className="text-red-500 text-xl">Delete Pipeline</DialogTitle>
                                    <DialogDescription className="text-md text-gray-700">
                                        Are you sure you want to delete this Pipeline?
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col">
                                    <p className="text-gray-600">Pipeline Id: {pipelineOverview?.id} </p>
                                    <p className="text-gray-600">Pipeline Name: {pipelineOverview?.name}</p>
                                    <p className="text-red-500 mt-2">After Deleting this pipeline the below agents will be orphaned</p>
                                    {agentValues.map((agent, index) => (
                                        <p className="text-gray-600" key={index}>
                                            Agent: {agent.name}
                                        </p>
                                    ))}
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>Cancel</Button>
                                    </DialogClose>
                                    <Button variant={"destructive"} type="submit">Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            {activeTab == "overview" ? <div className="flex flex-col w-[30rem] md:w-full">
                {pipelineOverview?.overview.map(({ label, value }) => (
                    <div key={value} className="flex justify-between py-2">
                        <span className="text-gray-700">{label}:</span>
                        <span className="text-gray-500">{value}</span>
                    </div>
                ))}
            </div> : <EditPipelineYAML />}

        </div>
    )
}

export default PipelineDetails