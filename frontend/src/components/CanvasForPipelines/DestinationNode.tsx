import { Handle, Position } from "reactflow"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useNodeValue } from "@/context/useNodeContext";
import { Button } from "../ui/button";
import usePipelineChangesLog from "@/context/usePipelineChangesLog";
interface formData {
    name: string,
    http: string,
    Authentication_Token: string
}
export const DestinationNode = ({ data }: any) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const { setNodeValue } = useNodeValue()
    const { setChangesLog } = usePipelineChangesLog()

    const [formData, setFormData] = useState<formData>({
        name: data.label,
        http: data.sublabel,
        Authentication_Token: ''
    });
    const DestinationType = data.sublabel


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

        // Clear error when user types
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
        e.preventDefault();
        const newErrors = {
            name: !formData.name.trim(),
            http: !formData.http.trim(),
            Authentication_Token: false
        };
        if (formData.name !== data.label && formData.http !== data.sublabel) {
            setChangesLog(prev => [...prev, { type: 'source', name: data.label, status: "edited" }])
        }
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
    const handleDeleteNode = () => {
        console.log(data)
        setNodeValue(prev => prev.filter(node => node.id !== data.label));
        setChangesLog(prev => [...prev, { type: 'destination', name: data.label, status: "deleted" }])
        setIsSheetOpen(false)
    }
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <div className="flex items-center">
                    <div className='bg-green-600 h-6 rounded-tl-lg rounded-bl-lg w-2' />
                    <div className="bg-gray-200 flex items-center rounded-md h-24 w-[8rem]">
                        <Handle type="target" position={Position.Left} className="bg-green-600 w-0 h-0 rounded-full" />
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="text-xs">{data.icon}</div>
                            <div className="font-medium text-sm">{formData.name}</div>
                            <div className="text-gray-400 text-xs">{formData.http}</div>
                            <div className="flex justify-between text-xs mt-2">
                                <div>{data.inputType}</div>
                                <div>{data.outputType}</div>
                            </div>
                        </div>
                        {data.label === 'ctrlB' ? (
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
            </SheetTrigger>
            <SheetContent className="w-[36rem]">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex gap-3 items-center">
                        <p className="text-lg bg-gray-500 items-center rounded-lg p-2 px-3 m-1 text-white">→|</p>
                        <h2 className="text-xl font-bold">{DestinationType}</h2>

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
                                <Button variant={"outline"} onClick={handleDeleteNode}>Delete Node</Button>
                            </div>
                        </SheetClose>

                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>

    )
};