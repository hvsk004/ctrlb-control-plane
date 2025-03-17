import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AgentsType } from "@/constants/AgentType";
import { Copy } from "lucide-react";
import { useState } from "react";

const AddAgentDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: () => void }) => {
    const [activeAgentType, setActiveAgentType] = useState("Docker");
    const [copySuccess, setCopySuccess] = useState("");

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess("Copied!")
            setTimeout(() => {
                setCopySuccess("")
            }, 2000)
        }, (err) => {
            console.error("Failed to copy", err)
        })
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl mb-5">Add Agents</DialogTitle>
                    <DialogDescription>
                        <div className="flex gap-2 border-b">
                            {AgentsType.map(({ label }) => (
                                <button
                                    key={label}
                                    onClick={() => setActiveAgentType(label)}
                                    className={`px-4  py-2 text-md rounded-t-md text-gray-600 focus:outline-none ${activeAgentType === label
                                        ? "border-b-2 border-gray-700 text-gray-700 font-semibold"
                                        : ""
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-200 p-4 mt-4 rounded-md">
                            <div className="w-full flex flex-col justify-center h-[8rem] text-orange-400 rounded-lg p-4 bg-black">
                                {
                                    AgentsType.filter(({ label }) => label === activeAgentType).map(({ label, value }) => (
                                        <p key={label} className="text-orange-500">
                                            {value.split('\n').map((line, index) => (
                                                <span key={index}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    ))
                                }
                            </div>

                            <button className="">
                                <Copy className="text-gray-600 hover:text-black" onClick={() => handleCopyToClipboard(AgentsType.find(({ label }) => label === activeAgentType)?.value || "")} />
                            </button>
                            {copySuccess && <span className="text-green-700 text-md ml-2">{copySuccess}</span>}

                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddAgentDialog