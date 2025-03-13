import { Handle, Position } from "reactflow"

export const DestinationNode = ({ data }: any) => (
    <div className="flex items-center">
        <div className='bg-green-600 h-6 rounded-tl-lg rounded-bl-lg w-2' />
        <div className="bg-gray-200 flex items-center rounded-md h-24 w-[8rem]">
            <Handle type="target" position={Position.Left} className="bg-green-600 w-0 h-0 rounded-full" />
            <div className="flex flex-col items-center justify-center w-full">
                <div className="text-xs">{data.icon}</div>
                <div className="font-medium text-sm">{data.label}</div>
                <div className="text-gray-400 text-xs">{data.sublabel}</div>
                <div className="flex justify-between text-xs mt-2">
                    <div>{data.inputType}</div>
                    <div>{data.outputType}</div>
                </div>
            </div>
            {data.label === 'CtrlB' ? (
                <div className="flex items-center justify-center rounded-br-md rounded-tr-md bg-green-500 h-[6rem]">
                    <div className="bg-white rounded-md m-1">
                        <img src='./ctrlb-logo.png' width={"48px"} />
                    </div>
                </div>
            ) : (<div className="flex items-center justify-center rounded-br-md rounded-tr-md bg-gray-500 h-[6rem]">
                <p className="text-xl m-1 text-white">→|</p>
            </div>)}
        </div>
    </div>
);