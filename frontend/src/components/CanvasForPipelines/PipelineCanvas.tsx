import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { SourceNode } from './SourceNode';
import { ProcessorNode } from './ProcessorNode';
import { DestinationNode } from './DestinationNode';


// Node types mapping
const nodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  destination: DestinationNode
};

const PipelineBuilder = () => {
  const initialNodes = [
    {
      id: 'demo-source',
      type: 'source',
      position: { x: 100, y: 100 },
      data: { label: 'Demo_source', type: 'logs', details: 'LOG logs' }
    },
    {
      id: 'ctrl-b',
      type: 'destination',
      position: { x: 600, y: 100 },
      data: { label: 'CtrlB', type: 'MIXED', details: 'CtrlB_Explore' }
    }
  ];

  const initialEdges = [
    {
      id: 'edge-1',
      source: 'demo-source',
      target: 'ctrl-b',
      animated: true,
    }
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/nodeType');
      if (!type) return;

      if (!reactFlowInstance) return;
      const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY });
      let nodeData;
      const id = `node_${Date.now()}`;

      switch (type) {
        case 'source':
          nodeData = { label: `Source_${nodes.length + 1}`, type: 'logs', details: 'LOG logs' };
          break;
        case 'processor':
          nodeData = { label: `Processor_${nodes.length + 1}`, type: 'transform', details: 'Process data' };
          break;
        case 'destination':
          nodeData = { label: `Destination_${nodes.length + 1}`, type: 'MIXED', details: 'Output data' };
          break;
        default:
          nodeData = { label: `Node_${nodes.length + 1}`, type: 'generic', details: 'Generic node' };
      }

      const newNode = { id, type, position, data: nodeData };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-full flex flex-col gap-2 h-screen p-4">
      <div className="h-4/5 border-2 border-gray-200 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
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


    </div>
  );
};

export default PipelineBuilder;
