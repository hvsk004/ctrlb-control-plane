import { Handle, Position } from "reactflow"

export const SourceNode = ({ data }: any) => (
  <div className='flex items-center'>
    <div className="flex items-center justify-center rounded-bl-md rounded-tl-md bg-gray-500 h-[6rem]">
      <p className="text-xl m-1 text-white">→|</p>
    </div>
    <div className="bg-gray-200 rounded-md border-2 border-gray-300 p-4 h-[6rem] shadow-md w-[8rem] relative">
      <div className="font-medium text-sm">{data.label}</div>
      {<div className="text-gray-400 text-xs">{data.sublabel}</div>}
      <div className="flex justify-between text-xs mt-2">
        <div>{data.inputType}</div>
        <div>{data.outputType}</div>
      </div>
      <Handle type="source" position={Position.Right} className="bg-green-600 w-0 h-0 rounded-full" />
    </div>
    <div className='bg-green-600 h-6 rounded-tr-lg rounded-br-lg w-2' />
  </div>
);