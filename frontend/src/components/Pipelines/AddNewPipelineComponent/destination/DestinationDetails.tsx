import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePipelineStatus } from "@/context/usePipelineStatus";
import ProgressFlow from "../ProgressFlow";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Tabs from "../Tabs";
import { sources } from "@/constants/SourceList";
// import EditSourceConfiguration from "./EditSourceConfiguration";
import { usePipelineTab } from "@/context/useAddNewPipelineActiveTab";
import CreateNewAgent from "@/components/Agents/CreateNewAgent";
import { TransporterService } from "@/services/transporterService";

interface sources {
    name: string,
    display_name: string,
    type: string,
    supported_signals: string[]
}

import { JsonForms } from '@jsonforms/react';

import {
    materialCells,
    materialRenderers,
} from '@jsonforms/material-renderers';

import { ThemeProvider, createTheme } from '@mui/material/styles';

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
const DestinationDetail = ({ type, title, description, transport_type }: { type: string, title: string, description: string, transport_type: string }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSource, setSelectedSource] = useState<sources | null>(null);
    const [editSourceSheet, setEditSourceSheet] = useState(false);
    const { currentTab } = usePipelineTab()
    const [sources, setSources] = useState<sources[]>([])
    const [form, setForm] = useState<object>({})
    const [existingSources, setExistingSources] = useState<sources[]>(() => {
        const savedSources = localStorage.getItem(`Destination`); // Use a unique key
        return savedSources ? JSON.parse(savedSources) : [];
    });

    const [data, setData] = useState<object>();

    const source = async () => {
        const res = await TransporterService.getTransporterService(transport_type)
        setSources(res)
    }
    const getForm = async () => {
        const res = await TransporterService.getTransporterForm(selectedSource!.name)
        setForm(res)

    }
    const filteredSources = sources.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pipelineStatus = usePipelineStatus();
    if (!pipelineStatus) {
        return null;
    }
    useEffect(() => {
        getForm()
        source()
    }, [selectedSource])


    let { currentStep, setCurrentStep } = pipelineStatus;

    const handleDeleteSource = (index: number) => {
        const updatedSources = existingSources.filter((_, i) => i !== index);
        setExistingSources(updatedSources);
        localStorage.setItem(`Destination`, JSON.stringify(updatedSources)); // Save with a unique key
    };


    const handleSourceConfiguration = (source: sources) => {
        setSelectedSource(source);
    }

    const handleSubmit = () => {
        const updatedSources = [
            ...existingSources,
            {
                name: selectedSource!.name,
                display_name: selectedSource!.display_name,
                supported_signals: selectedSource!.supported_signals,
                type: selectedSource!.type,
            },
        ];
        setExistingSources(updatedSources);
        localStorage.setItem(`Destination`, JSON.stringify(updatedSources));
    };


    return (
        <div className="flex flex-col gap-5">
            <Tabs />
            {currentTab == "pipelines" ? <div className="mx-auto flex gap-5 w-full">
                <ProgressFlow />
                <Card className="w-full h-[40rem] bg-white shadow-sm">
                    <CardContent className="p-6 h-[36rem]">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                {title}
                            </h2>

                            <p className="text-gray-600 text-sm">
                                {description}
                            </p>

                            {existingSources && (
                                existingSources
                                    .filter((source: sources) => source.name && source.display_name)
                                    .map((source: sources, index: number) => (
                                        <div
                                            className="flex justify-between items-center border rounded-md border-gray-300 p-3"
                                            key={index}
                                        >
                                            <div className="capitalize">
                                                {source.type} | {source.name}
                                            </div>
                                            <div className="flex gap-2">
                                                <Sheet
                                                    open={editSourceSheet}
                                                    onOpenChange={(open) => setEditSourceSheet(open)}
                                                >
                                                    <SheetTrigger asChild>
                                                        <Button variant={"outline"}>Edit</Button>
                                                    </SheetTrigger>
                                                    <SheetContent>
                                                        {/* Add your edit source configuration logic here */}
                                                    </SheetContent>
                                                </Sheet>
                                                <Button
                                                    variant={"destructive"}
                                                    onClick={() => handleDeleteSource(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                            )}

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="flex items-center w-full gap-1 px-4 py-1 bg-blue-500 text-white" variant="outline">Add {type}
                                        <PlusIcon className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <div className="p-4">
                                        <p className="text-2xl mb-3">Add {type}</p>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search for a technology..."
                                                className="pl-10 pr-4 py-2 border rounded-md w-full"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1 overflow-auto">
                                            <div className="p-4 h-[40rem]">
                                                {filteredSources.map((source: sources) => (
                                                    <Sheet open={editSourceSheet} onOpenChange={(open) => setEditSourceSheet(open)}>                                                        <SheetTrigger asChild>
                                                        <div onClick={() => handleSourceConfiguration(source)} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b cursor-pointer">
                                                            <div className="flex items-center">
                                                                <span className="ml-3 font-medium">{source.name}</span>
                                                            </div>
                                                            <div className="flex space-x-1">
                                                                {source.supported_signals.map((feature: string) => (
                                                                    <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                                        {feature}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </SheetTrigger>
                                                        <SheetContent>
                                                            <ThemeProvider theme={theme}>
                                                                <div className='mt-3'>
                                                                    <div className='text-2xl p-4 font-semibold bg-gray-100'>{form.title}</div>
                                                                    <div className='p-3 '>
                                                                        <div className='overflow-y-auto h-[45rem]'>
                                                                            <JsonForms
                                                                                data={data}
                                                                                schema={form}
                                                                                renderers={renderers}
                                                                                cells={materialCells}
                                                                                onChange={({ data }) => setData(data)}
                                                                            />
                                                                            <SheetClose>
                                                                                <div className='flex justify-end mb-10'>
                                                                                    <Button size={"lg"} className='bg-blue-500' onClick={() => {
                                                                                        handleSubmit();
                                                                                        setSelectedSource(null);
                                                                                        setEditSourceSheet(false); // Close the sheet
                                                                                    }}>
                                                                                        Submit
                                                                                    </Button>
                                                                                </div>
                                                                            </SheetClose>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </ThemeProvider>
                                                        </SheetContent>
                                                    </Sheet>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        {selectedSource && (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button className="flex items-center gap-1 px-4 py-1 bg-blue-500 text-white" variant="outline">Add New Pipeline
                                        <PlusIcon className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                </SheetContent>
                            </Sheet>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end items-end">
                        <div className=" flex items-end justify-end gap-4">
                            <Button
                                className="bg-gray-700 px-6 disabled:opacity-50"
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(--currentStep)}
                            >
                                Back
                            </Button>
                            <Button
                                className="bg-blue-500 hover:bg-blue-700 px-6 disabled:opacity-50"
                                onClick={() => setCurrentStep(++currentStep)}
                            >
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div> : <CreateNewAgent />}

        </div>
    )
}

export default DestinationDetail;