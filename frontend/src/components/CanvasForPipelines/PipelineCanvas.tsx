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
import SourceDropdownOptions from '../Pipelines/DropdownOptions/SourceDropdownOptions';
import ProcessorDropdownOptions from '../Pipelines/DropdownOptions/ProcessorDropdownOptions';
import DestinationDropdownOptions from '../Pipelines/DropdownOptions/DestinationDropdownOptions';


// Node types mapping
const nodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  destination: DestinationNode
};

const PipelineBuilder = () => {
  const fetchLocalStorageData = () => {
    const sources = JSON.parse(localStorage.getItem('Sources') || '[]');
    const destinations = JSON.parse(localStorage.getItem('Destination') || '[]');
    return { sources, destinations };
  };
  const { sources, destinations } = fetchLocalStorageData();
  const initialNodes = [
    ...sources.map((source: any, index: number) => ({
      id: `source-${index}`,
      type: 'source',
      position: { x: 100, y: 100 + index * 100 },
      data: {
        label: (
          <div style={{ fontSize: '10px', textAlign: 'center' }}>
            {`${source.display_name}-(${index + 1})`}
          </div>
        ), // Wrap label in a div with smaller font size
        type: source.type,
        details: source.details,
      },
    })),
    ...destinations.map((destination: any, index: number) => ({
      id: `destination-${index}`,
      type: 'destination',
      position: { x: 600, y: 100 + index * 100 },
      data: {
        label: (
          <div style={{ fontSize: '10px', textAlign: 'center' }}>
            {`${destination.display_name}-(${index + 1})`}
          </div>
        ), // Wrap label in a div with smaller font size
        type: destination.type,
        details: destination.details,
      },
    })),
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(JSON.parse(localStorage.getItem("PipelineEdges") || "[]"));
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => {
        const updatedEdges = addEdge(
          {
            ...params,
            animated: true,
            label: `${params.source} -> ${params.target}`,
          },
          eds
        );
        localStorage.setItem('PipelineEdges', JSON.stringify(updatedEdges));
        return updatedEdges;
      });
    },
    [setEdges]
  );

  const pipelineName = localStorage.getItem('pipelinename');
  const createdBy = localStorage.getItem('userEmail');
  const agentIds = JSON.parse(localStorage.getItem('selectedAgentIds') || '[]');
  const Pipelinenodes = JSON.parse(localStorage.getItem('Nodes') || '[]');
  const Pipelineedges = JSON.parse(localStorage.getItem('PipelineEdges') || '[]');

  const pipelinePayload = {
    "name": pipelineName,
    "created_by": createdBy,
    "agent_ids": agentIds,
    "pipeline_graph": {
      "nodes": Pipelinenodes,
      "edges": Pipelineedges
    }
  }
  console.log("Pipeline Payload", pipelinePayload);

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
          <SourceDropdownOptions/>
          <ProcessorDropdownOptions/>
          <DestinationDropdownOptions/>
        </div>
      </div>


    </div>
  );
};

export default PipelineBuilder;
