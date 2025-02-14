import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Copy } from "lucide-react";
import { useState } from "react";

const AgentsType = [
    { label: "Docker", value: "docker pull ubuntu:latest\ndocker run -it ubuntu:latest /bin/bash\ndocker ps -a\ndocker tag my-image:latest my-repo/my-image:latest" },
    { label: "Kubernetes", value: "kubectl apply -f my-deployment.yaml\nkubectl get pods\nkubectl logs my-pod\nkubectl get deployments" },
    { label: "Helm", value: "helm repo add my-repo https://example.com/charts\nhelm install my-release my-repo/my-chart\nhelm list\nhelm --version" },
    { label: "Linux", value: "sudo apt update\nsudo apt install my-package\nsystemctl status my-service\nsudo apt upgrade" },
    { label: "Windows", value: "choco install my-package\nStart-Service -Name 'MyService'\nGet-Service -Name 'MyService'\nchoco --version" },
    { label: "MacOS", value: "brew update\nbrew install my-package\nbrew services start my-package\nbre --version" }
]

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