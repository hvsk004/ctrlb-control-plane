import { useDraggable } from "@dnd-kit/core";

const DraggableComponent = ({ id, label }:any) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "10px",
        border: "1px solid black",
        marginBottom: "10px",
        cursor: "grab",
        background: "white",
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      }}
    >
      {label}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div style={{ position: "absolute", left: 10, top: 10 }}>
      <DraggableComponent id="source" label="Add Source" />
      <DraggableComponent id="processor" label="Add Processor" />
      <DraggableComponent id="destination" label="Add Destination" />
    </div>
  );
};

export default Sidebar;
