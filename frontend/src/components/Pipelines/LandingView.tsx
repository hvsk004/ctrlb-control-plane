import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"

import PipelineDetails from './AddNewPipelineComponent/PipelineDetails';
import SourcesDetails from './AddNewPipelineComponent/source/SourcesDetails';
import AddDestination from './AddNewPipelineComponent/destination/DestinationDetails';
import AddAgent from './AddNewPipelineComponent/AddAgent';
import { usePipelineStatus } from '@/context/usePipelineStatus';


const LandingView = () => {
    const pipelineStatus = usePipelineStatus();
    if (!pipelineStatus) {
        return null;
    }
    const { currentStep } = pipelineStatus;
    return (
        <div className="flex flex-col gap-7 justify-center items-center">
            <p className='font-bold text-xl mt-[6rem]'>Get started</p>
            <p className='text-gray-700'>Create Your First Pipeline</p>
            <p className='text-gray-700'>Pipelines are configurations that guide agents on the data sources to collect and destination to route the data</p>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="flex items-center gap-1 px-4 py-1 bg-blue-500 text-white" variant="outline">Add New Pipeline
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <div>
                        </div>
                        <SheetDescription>
                            <div className='flex flex-col'>
                                <div className='flex flex-1 gap-5'>
                                    <div className='flex flex-1/2'>
                                        <div className=" my-2 mx-auto">
                                            {
                                                currentStep == 0 ? <PipelineDetails /> : currentStep == 1 ? <SourcesDetails/> : currentStep == 2 ? <AddDestination  /> : <AddAgent />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default LandingView



