import React, { useCallback, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Custom node components
const SourceNode = ({ data }) => (
    <div className="bg-gray-300 flex items-center rounded-md h-24 w-16">
        <Handle type="source" position={Position.Right} />
        <div className="flex flex-col items-center justify-center w-full">
            <div className="text-xs">{data.icon}</div>
        </div>
    </div>
);

const DestinationNode = ({ data }) => (
    <div className="bg-gray-300 flex items-center rounded-md h-24 w-16">
        <Handle type="target" position={Position.Left} />
        <div className="flex flex-col items-center justify-center w-full">
            <div className="text-xs">{data.icon}</div>
        </div>
    </div>
);

const ProcessorNode = ({ data }) => (
    <div className="flex flex-col bg-white rounded-md p-2 shadow-sm w-48">
        <Handle type="target" position={Position.Left} />
        <div className="font-medium text-sm">{data.label}</div>
        <div className="text-gray-400 text-xs">{data.sublabel}</div>
        <div className="flex justify-between text-xs mt-2">
            <div>{data.inputType}</div>
            <div>{data.outputType}</div>
        </div>
        <Handle type="source" position={Position.Right} />
    </div>
);

const SinkNode = ({ data }) => (
    <div className="flex flex-col bg-white rounded-md p-2 shadow-sm w-48">
        <Handle type="target" position={Position.Left} />
        <div className="font-medium text-sm">{data.label}</div>
        <div className="text-gray-400 text-xs">{data.sublabel}</div>
        <div className="flex justify-between text-xs mt-2">
            <div>{data.inputType}</div>
            <div>{data.outputType}</div>
        </div>
    </div>
);

const ViewEditPipelineCanvas = () => {
    // Define the initial nodes
    const initialNodes = [
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
            type: 'processor',
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
            type: 'processor',
            position: { x: 750, y: 320 },
            data: {
                label: 'Openmetrics',
                sublabel: 'openmetrics',
                inputType: 'MIXED',
                outputType: ''
            },
        },
        {
            id: 'output',
            type: 'destination',
            position: { x: 950, y: 200 },
            data: {
                icon: '→|'
            },
        },
    ];

    // Define the initial edges with labels
    const initialEdges = [
        { id: 'e1-2', source: 'system', target: 'mask_ssn', label: '11GB', animated: true },
        { id: 'e2-3', source: 'mask_ssn', target: 'drop_trace', label: '2KB', animated: true },
        { id: 'e2-4', source: 'mask_ssn', target: 'error_monitor', label: '2KB', animated: true },
        { id: 'e2-5', source: 'mask_ssn', target: 'exception_m', label: '2KB', animated: true },
        { id: 'e2-6', source: 'mask_ssn', target: 'log_to_pattern', label: '2KB', animated: true },
        { id: 'e3-7', source: 'drop_trace', target: 'ctrlb', label: '2KB', animated: true },
        { id: 'e4-7', source: 'error_monitor', target: 'openmetrics', label: '1MB', animated: true },
        { id: 'e5-7', source: 'exception_m', target: 'openmetrics', label: '685KB', animated: true },
        { id: 'e6-7', source: 'log_to_pattern', target: 'openmetrics', label: '1MB', animated: true },
        { id: 'e7-8', source: 'ctrlb', target: 'output', animated: true },
        { id: 'e8-9', source: 'openmetrics', target: 'output', animated: true },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [editMode, setEditMode] = useState(false);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges],
    );

    // Node types
    const nodeTypes = {
        source: SourceNode,
        processor: ProcessorNode,
        destination: DestinationNode,
        sink: SinkNode,
    };

    return (
        <Sheet>
            <SheetContent className="w-full sm:max-w-full p-0" side="top">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <div className="text-xl font-medium">ctrlb</div>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-4 flex items-center space-x-2">
                            <span>Edit Mode</span>
                            <Toggle
                                pressed={editMode}
                                onPressedChange={setEditMode}
                                className="data-[state=on]:bg-green-500"
                            />
                        </div>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                    </div>
                </div>

                <div style={{ height: '65vh' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background />
                    </ReactFlow>
                </div>

                <div className="flex justify-center p-4 bg-gray-200 mt-8">
                    <div className="flex space-x-4">
                        <Button variant="outline" className="bg-white">Add Source</Button>
                        <Button variant="outline" className="bg-white">Add Processor</Button>
                        <Button variant="outline" className="bg-white">Add Destination</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ViewEditPipelineCanvas;