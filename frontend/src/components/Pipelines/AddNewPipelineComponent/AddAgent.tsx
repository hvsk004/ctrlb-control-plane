import ProgressFlow from './ProgressFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { usePipelineStatus } from '@/context/usePipelineStatus';
import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Code2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/hooks/use-toast';
import Tabs from './Tabs';
import PipelineCanvas from '@/components/CanvasForPipelines/PipelineCanvas';
import { useAgentValues } from '@/context/useAgentsValues';
import { AgentValuesType } from '@/types/agentValues.type';

const AddAgent = () => {
  const pipelineStatus = usePipelineStatus();
  if (!pipelineStatus) {
    return null;
  }
  let { currentStep, setCurrentStep } = pipelineStatus;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<AgentValuesType[]>([]);
  const [rollOut, setRollOut] = useState(false)
  const { toast } = useToast()
  const { agentValues } = useAgentValues()
  const [check, setCheck] = useState(true)


  const toggleSelectAll = () => {
    if (selectedRows.length === agentValues.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(agentValues.map(agent => agent.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleApply = () => {
    const selectedAgentsData = agentValues.filter(agent => selectedRows.includes(agent.id));
    setSelectedAgents(selectedAgentsData);
    setIsDialogOpen(false);
  };

  const handleRollout = () => {
    setRollOut(true);
    setTimeout(() => {
      setRollOut(false);
      toast({
        title: "Success",
        description: "Rolled out successfully",
        duration: 3000,
      });
    }, 2000);
  }

  const handleEditAgent = (agent: AgentValuesType) => {
    setSelectedAgents([agent])
    setIsDialogOpen(true)
  }

  const handleCheck = () => {
    setCheck(!check)
  }


  return (
    <div className='flex flex-col gap-5'>
      <Tabs />
      <div className="mx-auto flex gap-5 w-full">
        <ProgressFlow />
        <Card className="w-full h-[40rem] bg-white shadow-sm">
          <CardHeader>
            <div className='flex flex-col gap-2'>
              <p className='text-xl'>Add Agent</p>
              <p className='text-md text-gray-600 mb-4'>Agents Collect Data from the sources in the pipeline and route them to desired destination.</p>
            </div>
          </CardHeader>
          <CardContent className='h-[29rem] w-full'>
            <div className='flex flex-col '>{selectedAgents.length > 0 ? (
              <ul>
                {selectedAgents.map((agent, index) => (
                  <div key={index} className='flex border justify-between rounded-md mb-2 p-3 border-gray-00 gap-4'>
                    <div className='flex justify-start gap-2 items-center'>
                      <Code2 className='text-gray-500' />
                      <p className=''>{agent.name}</p>
                    </div>

                    <div className='flex gap-2 justify-end items-center'>
                      <Button onClick={() => handleEditAgent(agent)} className='bg-blue-500'>
                        Edit
                      </Button>
                      <Button variant={"destructive"}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              ""
            )}</div>
            {selectedAgents.length > 0 && <Button disabled={rollOut} onClick={handleRollout} className='bg-blue-500 mb-5 w-full mt-2'>RollOut</Button>}
            {rollOut && <div className='flex border border-blue-400 p-5 mb-2 rounded-md justify-center items-center gap-2 text-blue-700'>
              <Loader2 className='animate-spin' />
              <p>Rollout in progress, we will notify once it's completed mean while you can navigate to pipeline map</p>
            </div>}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div className='mt-2'>
                  <Button className='w-full' variant="outline">Add Agent</Button>
                </div>
              </DialogTrigger>
              <DialogContent className="w-full h-screen">
                <DialogHeader>
                  <DialogTitle className='text-xl'>Apply Configuration</DialogTitle>
                  <DialogDescription>
                    <div className="w-full mt-5 border rounded-md shadow-sm h-[38rem] bg-white">
                      <div className="p-4 flex gap-2 border-b">
                        <div className="relative">
                          <Button variant="outline" size="sm" className="flex items-center">
                            Filters <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                        <Input
                          placeholder="--configuration:Test platform:darwin"
                          className="flex-1"
                        />
                      </div>
                      <div className='flex flex-col'>
                        <div className="w-full h-[29rem] overflow-auto">
                          <table className="w-full  text-sm">
                            <thead>
                              <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 text-left w-12">
                                  <Checkbox
                                    checked={selectedRows.length === agentValues.length && agentValues.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                  />
                                </th>
                                <th
                                  className="px-4 py-3 text-left font-medium cursor-pointer"
                                  onClick={handleSort}
                                >
                                  Name
                                  <ChevronUp className={`w-4 h-4 inline ml-1 ${sortDirection === 'asc' ? 'opacity-100' : 'opacity-30'}`} />
                                </th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Version</th>
                                <th className="px-4 py-3 text-left font-medium">Configuration</th>
                                <th className="px-4 py-3 text-left font-medium">Logs</th>
                                <th className="px-4 py-3 text-left font-medium">Metrics</th>
                                <th className="px-4 py-3 text-left font-medium">Traces</th>
                                <th className="px-4 py-3 text-left font-medium">Operating System</th>
                              </tr>
                            </thead>
                            <tbody>
                              {agentValues.map((agent) => (
                                <tr key={agent.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <Checkbox
                                      checked={selectedRows.includes(agent.id)}
                                      onCheckedChange={() => toggleSelectRow(agent.id)}
                                    />
                                  </td>
                                  <td className="px-4 py-3 font-medium text-blue-500">
                                    {agent.name}
                                  </td>
                                  <td className='px-4 py-3'>
                                    <p className='bg-green-700 rounded-full flex justify-center items-center p-1 text-white'>{agent.status}</p>
                                  </td>
                                  <td className="px-4 py-3">{agent.version}</td>
                                  <td className="px-4 py-3">{agent.configuration}</td>
                                  <td className="px-4 py-3">{agent.logs}</td>
                                  <td className="px-4 py-3">{agent.metrics}</td>
                                  <td className="px-4 py-3">{agent.traces}</td>
                                  <td className="px-4 py-3">{agent.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-4 border-t flex justify-end items-center">
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600 mr-auto">1 row selected</div>
                            <div className="text-sm text-gray-600">Rows per page:</div>
                            <Button variant="outline" size="sm" className="flex items-center">
                              100 <ChevronDown className="w-4 h-4 ml-1" />
                            </Button>
                            <div className="text-sm text-gray-600">1-1 of 1</div>
                            <Button variant="outline" size="sm" disabled>
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="p-4 border-t flex justify-end gap-2 pb-5">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleApply}>Apply</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              <Sheet>
                <SheetTrigger>
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 px-6 disabled:opacity-50"
                    onClick={() => setCurrentStep(++currentStep)}
                  >
                    {selectedAgents.length > 0 ? "Save & View Pipeline" : "Skip & Save Pipeline"}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      <div className='flex justify-between px-4 p-2'>
                        <p className='text-2xl'>Ctrlb</p>
                        <div className='flex gap-3'>
                          <Button>Review</Button>
                          <div className="flex items-center space-x-2">
                            <Switch checked={check} onCheckedChange={handleCheck} id="edit-mode" />
                            <Label htmlFor="edit-mode">Edit Mode</Label>
                          </div>
                        </div>
                      </div>
                    </SheetTitle>
                    <SheetDescription>
                      <PipelineCanvas />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </CardFooter>
        </Card>

      </div>
    </div>
  )
}

export default AddAgent