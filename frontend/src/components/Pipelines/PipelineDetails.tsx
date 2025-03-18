import { useEffect } from "react";
import { usePipelineOverview } from "@/context/usePipelineDetailContext";
import { Boxes, Trash2 } from "lucide-react";
import { useRef, useState, useCallback, useMemo } from "react";
import EditPipelineYAML from "./EditPipelineYAML";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useEdgesState,
    addEdge,
    Node,
    Edge,
    Connection,
    ReactFlowInstance,
    EdgeMouseHandler,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SourceNode } from "../CanvasForPipelines/SourceNode";
import { ProcessorNode } from "../CanvasForPipelines/ProcessorNode";
import { DestinationNode } from "../CanvasForPipelines/DestinationNode";
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
import { initialEdges } from "@/constants/PipelineNodeAndEdges";
import { Label } from "../ui/label";
import SourceDropdownOptions from "./DropdownOptions/SourceDropdownOptions";
import { useNodeValue } from "@/context/useNodeContext";
import DestinationDropdownOptions from "./DropdownOptions/DestinationDropdownOptions";
import ProcessorDropdownOptions from "./DropdownOptions/ProcessorDropdownOptions";


const PipelineDetails = () => {
    const { pipelineOverview } = usePipelineOverview();
    const TABS = [
        { label: "Overview", value: "overview" },
        { label: "YAML", value: "yaml" },
    ];
    const { agentValues } = useAgentValues()
    const { nodeValue, setNodeValue, onNodesChange } = useNodeValue();
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [nodeCounter, setNodeCounter] = useState(10);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [edgePopoverPosition, setEdgePopoverPosition] = useState({ x: 0, y: 0 });

    const nodeTypes = useMemo(() => ({
        source: SourceNode,
        processor: ProcessorNode,
        destination: DestinationNode
    }), [])

    useEffect(() => {
        if (isEditMode) {
            console.log('Source option toggled');
        }
    }, [isEditMode]);

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

            setNodeValue((nds: any) => nds.concat(newNode));
            setNodeCounter((prevCounter) => prevCounter + 1);
        },
        [nodeCounter, reactFlowInstance, setNodeValue],
    );

    const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
        if (!isEditMode) return;
        console.log("test")
        // Calculate the position for the popover
        const rect = reactFlowWrapper.current?.getBoundingClientRect();
        if (rect) {
            setEdgePopoverPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        }
        
        setSelectedEdge(edge);
    }, [isEditMode]);

    const handleDeleteEdge = useCallback(() => {
        if (selectedEdge) {
            setEdges((edges) => edges.filter((edge) => edge.id !== selectedEdge.id));
            setSelectedEdge(null);
        }
    }, [selectedEdge, setEdges]);

    const [activeTab, setActiveTab] = useState("overview");

    // Close popover when clicking elsewhere
    const onPaneClick = useCallback(() => {
        setSelectedEdge(null);
    }, []);

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
                                    <div className="flex items-center mx-4">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                            <Button className="rounded-full px-6">Review</Button>
                                            </SheetTrigger>
                                            <SheetContent className="w-[30rem]">
                                                <SheetTitle>Pending Changes</SheetTitle>
                                            </SheetContent>
                                        </Sheet>
                                        <div className="mx-4 flex items-center space-x-2">
                                            <Switch id="edit-mode" checked={isEditMode} onCheckedChange={setIsEditMode} />
                                            <Label htmlFor="edit-mode">Edit Mode</Label>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: '77vh', backgroundColor: "#f9f9f9" }} ref={reactFlowWrapper}>
                                    <ReactFlow
                                        nodes={nodeValue}
                                        edges={edges.map(edge => ({
                                            ...edge,
                                            label: isEditMode ? '' : edge.label
                                        }))}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        nodeTypes={nodeTypes}
                                        onInit={setReactFlowInstance}
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        onEdgeClick={onEdgeClick}
                                        onPaneClick={onPaneClick}
                                        fitView
                                    >
                                        <Background />
                                        <Controls />
                                        <MiniMap />
                                        {selectedEdge && isEditMode && (
                                            <Panel 
                                                position="top-left" 
                                                style={{ 
                                                    position: 'absolute', 
                                                    left: edgePopoverPosition.x, 
                                                    top: edgePopoverPosition.y,
                                                    transform: 'translate(-50%, -50%)',
                                                    background: 'white',
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    zIndex: 10
                                                }}
                                            >
                                                    <Trash2 onClick={handleDeleteEdge} className="text-red-500 cursor-pointer"  size={16} />
                                            </Panel>
                                        )}
                                    </ReactFlow>
                                </div>

                                <div className="bg-gray-100 h-1/5 p-4 rounded-lg">
                                    <div className="flex justify-around gap-2">
                                        <div className='flex items-center'>
                                            <SourceDropdownOptions />
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='bg-green-600 h-6 rounded-tl-lg rounded-bl-lg w-2' />
                                            <ProcessorDropdownOptions />
                                        </div>

                                        <div className='flex items-center'>
                                            <div className='bg-green-600 h-6 rounded-tl-lg rounded-bl-lg w-2' />
                                            <DestinationDropdownOptions />
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Delete Pipeline</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[40rem] h-[25rem]">
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
                    <div key={label} className="flex justify-between py-2">
                        <span className="text-gray-700">{label}:</span>
                        {typeof (value) !== "object" ? <span className="text-gray-500">{value}</span> : <span className="text-gray-500">{value.length}</span>}
                    </div>
                ))}
            </div> : <EditPipelineYAML />}

        </div>
    )
}

export default PipelineDetails