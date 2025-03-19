import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SourceType } from "@/types/sourceConfig.type";

import { usePipelineStatus } from "@/context/usePipelineStatus";
import ProgressFlow from "../ProgressFlow";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import Tabs from "../Tabs";
import DestinationConfiguration from "./DestinationConfiguration";
import { Destination } from "@/constants/DestinationList";
import { DestinationDetail } from "@/types/destination.type";
import { SourceDetail } from "@/types/source.types";
import EditDestinationConfiguration from "./EditDestinationConfiguration";

const DestinationDetails = ({ name, description, features, type }: DestinationDetail) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);
  const [editDestinationSheet, setEditDestinationSheet] = useState(false);
  const [existingDestination, setExistingDestination] = useState<DestinationDetail[]>(() => {
    const savedDestination = localStorage.getItem("Destination");
    return savedDestination ? JSON.parse(savedDestination) : [];
  });

  const filteredDestination = Destination.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pipelineStatus = usePipelineStatus();
  if (!pipelineStatus) {
    return null;
  }

  let { currentStep, setCurrentStep } = pipelineStatus;

  useEffect(() => {
    if (name && description) {
      const isSourceExist = existingDestination.some(
        (existingSource: SourceDetail) =>
          existingSource.name === name &&
          existingSource.type === type &&
          existingSource.description === description &&
          JSON.stringify(existingSource.features) === JSON.stringify(features)
      );
      if (!isSourceExist) {
        const updatedDestination = [
          ...existingDestination,
          { name, description, features, type },
        ];
        setExistingDestination(updatedDestination);
        localStorage.setItem("Destination", JSON.stringify(updatedDestination));
      }
    }
  }, [name, description, features]);

  const handleDeleteSource = (index: number) => {
    const updatedDestination = existingDestination.filter((_, i) => i !== index);
    setExistingDestination(updatedDestination);
    localStorage.setItem("Destination", JSON.stringify(updatedDestination));
  };

  const IconComponent = ({ source }: any) => {
    if (source.icon === 'aws') {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md">
          <span className="text-xs font-bold text-gray-500">AWS</span>
        </div>
      );
    } else if (source.icon === 'azure') {
      return (
        <div className="flex items-center justify-center w-8 h-8 text-blue-500">
          <div className="bg-blue-500 w-5 h-5 rounded-md"></div>
        </div>
      );
    } else if (source.icon === 'bp') {
      return (
        <div className="flex items-center justify-center w-8 h-8">
          <div className="transform rotate-45 bg-gray-800 w-5 h-5"></div>
        </div>
      );
    } else {
      return <div className="w-8 h-8 flex items-center justify-center">{source.icon}</div>;
    }
  };

  const handleSourceConfiguration = (source: SourceType) => {
    setSelectedSource(source);
  }

  const handleCloseSheet = () => {
    setSelectedSource(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <Tabs />
      <div className="mx-auto flex gap-5">
        <ProgressFlow />
        <Card className="w-full h-[40rem] bg-white shadow-sm">
          <CardContent className="p-6 h-[36rem]">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Add Destination from which you'd like to collect telemetry.
              </h2>

              <p className="text-gray-600 text-sm">
                A Destination is a combination of OpenTelemetry receivers and
                processors that allows you to collect telemetry from a specific
                technology. Ensuring the right combination of these components is
                one of the most challenging aspects of building an OpenTelemetry
                configuration file. With CtrlB, we handle that all for you.
              </p>

              {existingDestination.length > 0 && (
                existingDestination
                  .filter((source: DestinationDetail) => source.name && source.description)
                  .map((source: DestinationDetail, index: number) => (
                    <div className="flex justify-between items-center border rounded-md border-gray-300 p-3" key={index}>
                      <div>{source.type} | {source.name} </div>
                      <div className="flex gap-2">
                        <Sheet open={editDestinationSheet} onOpenChange={(open) => setEditDestinationSheet(open)}>
                          <SheetTrigger asChild>
                            <Button variant={"outline"}>Edit</Button>
                          </SheetTrigger>
                          <SheetContent>
                            <EditDestinationConfiguration features={source.features} name={source.name} description={source.description} key={source.name} onClose={()=>{setEditDestinationSheet(false)}} />
                          </SheetContent>
                        </Sheet>
                        <Button variant={"destructive"} onClick={() => handleDeleteSource(index)}>Delete</Button>
                      </div>
                    </div>
                  ))
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="flex items-center w-full gap-1 px-4 py-1 bg-blue-500 text-white" variant="outline">Add Destination
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="p-4">
                    <p className="text-2xl mb-3">Add Destination</p>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search for a technology..."
                        className="pl-10 pr-4 py-2 border rounded-md w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <div className="p-4 h-[40rem]">
                      {filteredDestination.map((source: any) => (
                        <Sheet key={source.id} open={selectedSource?.id === source.id} onOpenChange={(open) => open ? handleSourceConfiguration(source) : setSelectedSource(null)}>
                          <SheetTrigger asChild>
                            <div onClick={() => handleSourceConfiguration(source)} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b cursor-pointer">
                              <div className="flex items-center">
                                <IconComponent source={source} />
                                <span className="ml-3 font-medium">{source.name}</span>
                              </div>
                              <div className="flex space-x-1">
                                {source.features.map((feature: string) => (
                                  <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </SheetTrigger>
                          <SheetContent>
                            <DestinationConfiguration type={source.type} features={source.features} description={source.description} icon={source.icon} name={source.name} id={source.id} onClose={handleCloseSheet} />
                          </SheetContent>
                        </Sheet>
                      ))}
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
      </div>

    </div>
  )
}

export default DestinationDetails;