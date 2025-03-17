import { initialNodes } from "@/constants/PipelineNodeAndEdges";
import React, { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Node, NodeChange, useNodesState } from "reactflow";

interface NodeValueContextType {
  nodeValue: Node[];
  setNodeValue: Dispatch<SetStateAction<Node<Node[] | undefined, string | undefined>[]>>  ;
  onNodesChange: (changes: NodeChange[]) => void;
}

const NodeValueContext = createContext<NodeValueContextType | undefined>(undefined);

export const NodeValueProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodeValue, setNodeValue, onNodesChange] = useNodesState(initialNodes);

  return (
    <NodeValueContext.Provider value={{ nodeValue, setNodeValue, onNodesChange }}>
      {children}
    </NodeValueContext.Provider>
  );
};

export const useNodeValue = () => {
  const context = useContext(NodeValueContext);
  if (!context) {
    throw new Error("useNodeValue must be used within a NodeValueProvider");
  }
  return context;
};


