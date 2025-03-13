import {Handle,Position} from "reactflow"

export const ProcessorNode = ({ data }:any) => (
    <div className="flex flex-col bg-white rounded-md p-2 shadow-sm w-48">
        <Handle type="target" position={Position.Left} className="bg-green-600 w-0 h-0 rounded-full" />
        <div className="font-medium text-sm">{data.label}</div>
        <div className="text-gray-400 text-xs">{data.sublabel}</div>
        <div className="flex justify-between text-xs mt-2">
            <div>{data.inputType}</div>
            <div>{data.outputType}</div>
        </div>
        <Handle type="source" position={Position.Right} className="bg-green-600 w-0 h-0 rounded-full" />
    </div>
);