import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  ReactFlowInstance,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { SourceNode } from './SourceNode';
import { ProcessorNode } from './ProcessorNode';
import { DestinationNode } from './DestinationNode';
import SourceDropdownOptions from '../Pipelines/DropdownOptions/SourceDropdownOptions';
import ProcessorDropdownOptions from '../Pipelines/DropdownOptions/ProcessorDropdownOptions';
import DestinationDropdownOptions from '../Pipelines/DropdownOptions/DestinationDropdownOptions';
import { useNodeValue } from '@/context/useNodeContext';


// Node types mapping
const nodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  destination: DestinationNode
};

const PipelineBuilder = () => {
  const fetchLocalStorageData = () => {
    const Nodes=JSON.parse(localStorage.getItem("Nodes") || "[]")
    return {Nodes};
  };
  const {Nodes } = fetchLocalStorageData();
  const initialNodes:any = [
    ...Nodes.map((source: any, index: number) => ({
      id: source.component_id.toString(),
      type: source.component_role == "receiver" ? "source" : source.component_role == "exporter" ? "destination" : "processor",
      position: { x: 100, y: 100 + index * 100 },
      data: {
        label: (
          <div style={{ fontSize: '10px', textAlign: 'center' }}>
            {`${source.name}-(${index + 1})`}
          </div>
        ),
        type: source.component_role,
        name: source.name,
        supported_signals: source.supported_signals,
        plugin_name: source.plugin_name,
      },
    })),
  ];

  const { nodeValue, setNodeValue, onNodesChange } = useNodeValue();

  // useEffect(() => {
  //   console.log("Updated nodeValue:", nodeValue);
  // }, [nodeValue]);

  const validatedNodeValue = nodeValue.map((node, index) => ({
    ...node,
    position: node.position || { x: 100, y: 100 + index * 100 }, // Fallback position
  }));

  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(JSON.parse(localStorage.getItem("PipelineEdges") || "[]"));
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => {
        if (!params.source || !params.target) {
          console.error('Invalid connection: source or target is null');
          return eds;
        }
      
        const updatedEdges = addEdge(
          {
            ...params,
            source: params.source,
            target: params.target,
            animated: true,
            data: {
              sourceComponentId: parseInt(params.source,10), // Use the source node's ID
              targetComponentId: parseInt(params.target,10), // Use the target node's ID
            },
          },
          eds
        );
        localStorage.setItem('PipelineEdges', JSON.stringify(updatedEdges));
        return updatedEdges;
      });
    },
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

      const newNode = { id, type, position, data: nodeData };
      setNodeValue((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodeValue, setNodeValue]
  );



  return (
    <div className="w-full flex flex-col gap-2 h-screen p-4">
      <div className="h-4/5 border-2 border-gray-200 rounded-lg">
        <ReactFlow
          nodes={validatedNodeValue}
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
