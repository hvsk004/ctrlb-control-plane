import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useNodeValue } from "@/context/useNodeContext";
import usePipelineChangesLog from "@/context/usePipelineChangesLog";
import { TransporterService } from "@/services/transporterService";
import { JsonForms } from '@jsonforms/react';

import {
    materialCells,
    materialRenderers,
} from '@jsonforms/material-renderers';

interface Processor {
    name: string,
    display_name: string,
    type: string,
    supported_signals: string[]
}

import { ThemeProvider, createTheme } from '@mui/material/styles';
const ProcessorDropdownOptions = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [processorOptionValue, setProcessorOptionValue] = useState('')
    const { nodeValue, setNodeValue } = useNodeValue()
    const { setChangesLog } = usePipelineChangesLog()
    const [form, setForm] = useState<object>({})
    const [data, setData] = useState<object>();
    const [pluginName,setPluginName] = useState()
    const [processors, setProcessors] = useState<Processor[]>([])

    const handleSheetOPen = (e: any) => {
        setPluginName(e)
        setIsSheetOpen(!isSheetOpen)
        handleGetProcessorForm(e)
    }
    const existingNodes = JSON.parse(localStorage.getItem('Nodes') || '[]');

    
    const handleSubmit = () => {
        const supported_signals = processors.find(s => s.name == pluginName)?.supported_signals
        const newNode: any = {
            id: `node_${Date.now()}`,
            type: "processor",
            position: { x: 350, y: 450 },
            component_id: existingNodes.length,
            component_role: "processor",
            config: data,
            name: processorOptionValue,
            plugin_name: pluginName,
            supported_signals: supported_signals,
            data: {
                type: "processor",
                name: processorOptionValue,
                supported_signals: supported_signals,
                plugin_name: pluginName,
            }
        };
        setNodeValue([...nodeValue, newNode]);
        setChangesLog(prev => [...prev, { type: 'processor', name: processorOptionValue, status: "added" }])
        setIsSheetOpen(false)
    };

    const handleGetProcessor = async () => {
        const res = await TransporterService.getTransporterService("processor")
        setProcessors(res)
    }

    const handleGetProcessorForm = async (sourceOptionValue: string) => {
        const res = await TransporterService.getTransporterForm(sourceOptionValue)
        setForm(res)
    }

    useEffect(() => {
        handleGetProcessor()
    }, [])

    const theme = createTheme({
        components: {
            MuiFormControl: {
                styleOverrides: {
                    root: {
                        marginBottom: '0.5rem',
                    },
                },
            },
        },
    });

    const renderers = [
        ...materialRenderers,
    ];

    return (
        <>
            <DropdownMenu>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Add Processor</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            {processors!.map((processor, index) => (
                                <DropdownMenuItem key={index} onClick={()=>{handleSheetOPen(processor.name)
                                    setProcessorOptionValue(processor.display_name)
                                }}>{processor.display_name}</DropdownMenuItem>
                            ))}
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                <DropdownMenuTrigger asChild>
                    <div className="flex justify-center items-center">
                        <div className='bg-green-600 h-6 rounded-bl-lg rounded-tl-lg w-2' />
                        <div
                            className="bg-white cursor-pointer rounded-md shadow-md p-3 border-2 border-gray-300 flex items-center justify-center"
                            draggable
                        >
                            Add Processor
                        </div>
                        <div className='bg-green-600 h-6 rounded-tr-lg rounded-br-lg w-2' />
                    </div>
                </DropdownMenuTrigger>
            </DropdownMenu>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="w-[36rem]">
                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex gap-3 items-center">
                                <p className="text-lg bg-gray-500 items-center rounded-lg p-2 px-3 m-1 text-white">→|</p>
                                <h2 className="text-xl font-bold">{processorOptionValue}</h2>
                            </div>
                            <p className="text-gray-500">Generate the defined log type at the rate desired <span className="text-blue-500 underline">Documentation</span></p>
                            <ThemeProvider theme={theme}>
                                <div className='mt-3'>
                                    <div className='p-3 '>
                                        <div className='overflow-y-auto h-[32rem]'>
                                            <JsonForms
                                                data={data}
                                                schema={form}
                                                renderers={renderers}
                                                cells={materialCells}
                                                onChange={({ data }) => setData(data)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ThemeProvider>
                            <SheetFooter>
                                <SheetClose>
                                    <div className="flex gap-3">
                                        <Button className="bg-blue-500" onClick={handleSubmit}>Apply</Button>
                                        <Button variant={"outline"} onClick={() => setIsSheetOpen(false)}>Discard Changes</Button>
                                        <Button variant={"outline"} onClick={() => setIsSheetOpen(false)}>Delete Node</Button>
                                    </div>
                                </SheetClose>
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    )
}

export default ProcessorDropdownOptions
