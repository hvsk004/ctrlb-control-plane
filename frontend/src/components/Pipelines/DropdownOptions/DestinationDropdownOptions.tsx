import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Node } from "reactflow";
import { useNodeValue } from "@/context/useNodeContext";
import usePipelineChangesLog from "@/context/usePipelineChangesLog";

interface formData {
    name: string,
    http: string,
    Authentication_Token: string
}
const DestinationDropdownOptions = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [sourceOptionValue, setSourceOptionValue] = useState('')
    const { nodeValue, setNodeValue } = useNodeValue()
    const {setChangesLog}=usePipelineChangesLog()
    const handleSheetOPen = (e: any) => {
        setSourceOptionValue(e.target.innerText)
        setIsSheetOpen(!isSheetOpen)
    }
    const [formData, setFormData] = useState<formData>({
        name: '',
        http: '',
        Authentication_Token: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        http: false,
        Authentication_Token: false
    });

    const [touched, setTouched] = useState({
        name: false,
        http: false,
        Authentication_Token: false
    });

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        if (value.trim()) {
            setErrors(prev => ({
                ...prev,
                [id]: false
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id } = e.target;
        setTouched(prev => ({
            ...prev,
            [id]: true
        }));

        // Validate on blur
        if ((id === 'name' || id === 'http') && !formData[id as keyof formData].trim()) {
            setErrors(prev => ({
                ...prev,
                [id]: true
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        const newNode: Node = {
            id: formData.name,
            type: "destination",
            position: { x: 650, y: 350 },
            data: { label: formData.name, sublabel: sourceOptionValue, inputType: "LOG", outputType: "METRIC" }
        };
        setNodeValue([...nodeValue!, newNode]);
        setChangesLog(prev => [...prev, { type: 'destination', name: formData.name, status: "added" }])

        e.preventDefault();
        const newErrors = {
            name: !formData.name.trim(),
            http: !formData.http.trim(),
            Authentication_Token: false
        };

        setErrors(newErrors);
        setTouched({
            name: true,
            http: true,
            Authentication_Token: true
        });

        if (!newErrors.name && !newErrors.http) {
            console.log('Form submitted:', formData);
        }
        setIsSheetOpen(false)

    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Add Destination</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Destination 1</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={handleSheetOPen}>Apache HTTP</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSheetOPen}>AWS Rehydration</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSheetOPen}>Apache Spark</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Destination 2</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={handleSheetOPen}>AWS Cloudwatch</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSheetOPen}>Bindplane</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSheetOPen}>Azure Event Hub</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                <DropdownMenuTrigger asChild>
                    <div className="flex justify-center items-center">
                        <div
                            className="bg-white cursor-pointer rounded-md shadow-md p-3 border-2 border-gray-300 flex items-center justify-center"
                            draggable
                        >
                            Add Destination
                        </div>
                    </div>
                </DropdownMenuTrigger>
            </DropdownMenu>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="w-[36rem]">
                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex gap-3 items-center">
                                <p className="text-lg bg-gray-500 items-center rounded-lg p-2 px-3 m-1 text-white">→|</p>
                                <h2 className="text-xl font-bold">{sourceOptionValue}</h2>
                            </div>
                            <p className="text-gray-500">Generate the defined log type at the rate desired <span className="text-blue-500 underline">Documentation</span></p>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base font-medium flex items-center">
                                        Name <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`h-10 ${errors.name && touched.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {errors.name && touched.name && (
                                        <div className="flex items-center mt-1 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            <span>Name is required</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="http" className="text-base font-medium flex items-center">
                                        HTTP <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Input
                                        id="http"
                                        value={formData.http}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`h-10 ${errors.http && touched.http ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {errors.http && touched.http && (
                                        <div className="flex items-center mt-1 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            <span>HTTP is required</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="Authentication_Token" className="text-base font-medium flex items-center">
                                        Authentication Token
                                    </Label>
                                    <Input
                                        id="Authentication_Token"
                                        value={formData.Authentication_Token}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`h-10 ${errors.Authentication_Token && touched.Authentication_Token ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                            </form>
                            <SheetFooter className="mt-[15rem]">
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

export default DestinationDropdownOptions
