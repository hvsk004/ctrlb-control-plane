import { useState } from 'react';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import PipelineDetails from './AddNewPipelineComponent/PipelineDetails';
import SourcesDetails from './AddNewPipelineComponent/source/SourcesDetails';
import AddAgent from './AddNewPipelineComponent/AddAgent';
import { usePipelineStatus } from '@/context/usePipelineStatus';
import DestinationDetail from './AddNewPipelineComponent/destination/DestinationDetails';

const LandingView = () => {
    const pipelineStatus = usePipelineStatus();
    if (!pipelineStatus) {
        return null;
    }

    const { currentStep, setCurrentStep } = pipelineStatus;

    const [isSheetOpen, setIsSheetOpen] = useState(false); 
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSheetClose = () => {
        setIsSheetOpen(false);
        setIsDialogOpen(true);
    };

    const handleDialogDiscard = () => {
        setIsSheetOpen(true); 
        setIsDialogOpen(false); 
    };

    const handleDialogOkay = () => {
        localStorage.removeItem('Sources');
        localStorage.removeItem('Destination');

        setIsDialogOpen(false); 
        setCurrentStep(0); 
    };

    return (
        <div className="flex flex-col gap-7 justify-center items-center">
            <p className='font-bold text-xl mt-[6rem]'>Get started</p>
            <p className='text-gray-700'>Create Your First Pipeline</p>
            <p className='text-gray-700'>Pipelines are configurations that guide agents on the data sources to collect and destination to route the data</p>
            <Sheet open={isSheetOpen} onOpenChange={(open) => open ? setIsSheetOpen(true) : handleSheetClose()}>
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
                                                currentStep == 0 ? <PipelineDetails /> : currentStep == 1 ? <SourcesDetails type='Sources' title="Add Sources from which you'd like to collect telemetry." description="A Source is a combination of OpenTelemetry receivers and
                processors that allows you to collect telemetry from a specific
                technology. Ensuring the right combination of these components is
                one of the most challenging aspects of building an OpenTelemetry
                configuration file. With CtrlB, we handle that all for you." transport_type='receiver' /> : currentStep == 2 ? 
                
                <DestinationDetail type='Destination' title="Add Destination from which you'd like to collect telemetry." description=" A Destination is a combination of OpenTelemetry receivers and
                processors that allows you to collect telemetry from a specific
                technology. Ensuring the right combination of these components is
                one of the most challenging aspects of building an OpenTelemetry
                configuration file. With CtrlB, we handle that all for you." transport_type='exporter' /> : <AddAgent />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='w-[50rem]'>
                    <DialogHeader>
                        <DialogTitle>Discard Changes?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to discard the current pipeline setup? If you select "Okay", the flow will restart and all data will be cleared.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleDialogDiscard}>
                            Discard
                        </Button>
                        <Button className='bg-blue-500' onClick={handleDialogOkay}>
                            Okay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LandingView;