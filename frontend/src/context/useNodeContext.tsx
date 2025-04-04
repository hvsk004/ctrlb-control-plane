import React, { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Node, NodeChange, useNodesState } from "reactflow";

interface NodeValueContextType {
  nodeValue: Node<any, string | undefined>[];
  setNodeValue: Dispatch<SetStateAction<Node<any, string | undefined>[]>>;
  onNodesChange: (changes: NodeChange[]) => void;
}
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
// const Nodes = (() => {
//   try {
//     const parsedNodes = JSON.parse(localStorage.getItem("Nodes") || "[]") as Node<any, string | undefined>[];
//     return parsedNodes.map((node, index) => ({
//       ...node,
//       position: node.position || { x: 100, y: 100 + index * 100 }, // Ensure position is set
//     }));
//   } catch (error) {
//     console.error("Failed to parse Nodes from localStorage:", error);
//     return [];
//   }
// })();

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