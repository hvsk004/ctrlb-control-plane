import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Boxes, PlusIcon } from "lucide-react"
import { useState } from "react"
import PipelineOverview from "./PipelineOverview"
import EditPipelineYAML from "./EditPipelineYAML"
import AddAgentDialog from "../Agents/AddAgentDialog"
import DeleteAgentDialog from "../Agents/DeleteAgentDialog"
import { PipelineOverviewProvider } from "@/context/usePipelineDetailContext"

const TABS = [
    { label: "Overview", value: "overview" },
    { label: "YAML", value: "yaml" },
];

const AddPipeline = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isDialogOpenAgent, setIsDialogOpenAgent] = useState(false);
    const [deletePipelineDialogOpen, setDeletePipelineDialogOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState("");

    const handleOpenDialog = () => {
        setIsDialogOpenAgent(true);
    }

    const handleCloseDialog = () => {
        setIsDialogOpenAgent(false);
        setSelectedOption("");
    }

    const handleDeleteDialogOpen = () => {
        setDeletePipelineDialogOpen(true)
    }
    const handleDeleteDialogClose = () => {
        setDeletePipelineDialogOpen(false)
        setSelectedOption("")
    }

    return (
        <PipelineOverviewProvider>
            <div className="w-full">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="flex items-center gap-1 px-4 py-1 bg-blue-500 text-white" variant="outline">New Pipeline
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <div className="flex justify-between">
                                <div className="flex justify-start">
                                    <SheetTitle className="flex items-center gap-2 text-gray-700 font-bold text-xl">
                                        <Boxes size={28}/>
                                        Ctrlb
                                    </SheetTitle>
                                </div>
                                <div className="flex justify-end space-x-6 mx-12">
                                    <Button className="bg-blue-500 text-white">
                                        View/Edit Pipeline
                                    </Button>
                                    <Select onValueChange={(value) => {
                                        setSelectedOption(value);
                                        value === "add agent" ? handleOpenDialog() : handleDeleteDialogOpen()
                                    }} value={selectedOption}>
                                        <SelectTrigger className="w-[8rem]">
                                            <SelectValue placeholder="Options" />
                                        </SelectTrigger>
                                        <SelectContent className="w-[12rem]">
                                            <SelectItem value="add agent">Add Agents</SelectItem>
                                            <SelectItem value="delete pipeline">Delete Pipeline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <SheetDescription>
                                <div className="flex items-center mt-8 w-full md:w-auto">
                                    <div className="flex gap-2 border-b">
                                        {TABS.map(({ label, value }) => (
                                            <button
                                                key={value}
                                                onClick={() => setActiveTab(value)}
                                                className={`px-4 py-2 text-lg rounded-t-md text-gray-600 focus:outline-none ${activeTab === value
                                                    ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                                                    : ""
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                        {activeTab === "overview" ? <PipelineOverview /> : <EditPipelineYAML />}
                    </SheetContent>
                </Sheet>
                <AddAgentDialog open={isDialogOpenAgent} onOpenChange={handleCloseDialog} />
                <DeleteAgentDialog open={deletePipelineDialogOpen} onOpenChange={handleDeleteDialogClose} />
            </div>
        </PipelineOverviewProvider>

    )
}

export default AddPipeline