import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { usePipelineStatus } from '@/context/usePipelineStatus';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Tabs from './Tabs';
import ProgressFlow from './ProgressFlow';

interface formData {
    name: string,
    description: string,
    platform: string
}

const PipelineDetails = () => {
    const pipelineStatus = usePipelineStatus();
    if (!pipelineStatus) {
        return null;
    }

    const { currentStep } = pipelineStatus;
    const [formData, setFormData] = useState<formData>({
        name: '',
        description: '',
        platform: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        description: false,
        platform: false
    });

    const [touched, setTouched] = useState({
        name: false,
        description: false,
        platform: false
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
        if (id === 'name' && !formData[id as keyof formData].trim()) {
            setErrors(prev => ({
                ...prev,
                [id]: true
            }));
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Check required fields
        const newErrors = {
            name: !formData.name.trim(),
            description: false,
            platform: false
        };

        setErrors(newErrors);
        setTouched({
            name: true,
            description: true,
            platform: true
        });

        if (!newErrors.name) {
            console.log('Form submitted:', formData);
        }
    };

    return (
        <div className='flex flex-col gap-5'>
            <Tabs />
            <div className="mx-auto flex gap-5">
                <ProgressFlow />
                <Card className="w-full h-[40rem]">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Let's get started building your Pipeline.
                        </CardTitle>
                        <p className="text-gray-600 mt-2">
                            We'll walk you through configuring the Sources you want to ingest telemetry from
                            and the Destination you want to send the data to.
                        </p>
                        <p className="text-gray-600 mt-2">
                            Let's get started building your configuration.
                        </p>
                    </CardHeader>
                    <CardContent className='h-[27rem]'>
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
                                <Label htmlFor="description" className="text-base font-medium flex items-center">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`h-10 ${errors.description && touched.description ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="platform" className="text-base font-medium flex items-center">
                                    Platform
                                </Label>
                                <select
                                    id="platform"
                                    value={formData.platform}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`h-10 w-full px-2 border border-gray-200 rounded-lg ${errors.platform && touched.platform ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Platform</option>
                                    <option value="linux">Linux</option>
                                    <option value="kubernetes">Kubernetes</option>
                                    <option value="macos">macOS</option>
                                    <option value="openshift">OpenShift</option>
                                </select>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className='flex justify-end'>
                        <div className='flex'>
                            <Button
                                onClick={() => {
                                    pipelineStatus.setCurrentStep(currentStep + 1);
                                    handleSubmit
                                }}
                                disabled={!formData.name}
                                className='bg-blue-500 px-6'>
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>

    )
}

export default PipelineDetails