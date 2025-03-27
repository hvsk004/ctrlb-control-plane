import ProgressFlow from './ProgressFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { usePipelineStatus } from '@/context/usePipelineStatus';
import { useEffect, useState } from 'react';
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
import { AgentValuesTable } from '@/types/agentValues.type';
import { usePipelineTab } from '@/context/useAddNewPipelineActiveTab';
import CreateNewAgent from '@/components/Agents/CreateNewAgent';
import agentServices from '@/services/agentServices';

const AddAgent = () => {
  const pipelineStatus = usePipelineStatus();
  if (!pipelineStatus) {
    return null;
  }
  let { currentStep, setCurrentStep } = pipelineStatus;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<AgentValuesTable[]>([]);
  const [rollOut, setRollOut] = useState(false)
  const { toast } = useToast()
  const { agentValues } = useAgentValues()
  const [check, setCheck] = useState(true)
  const { currentTab } = usePipelineTab()
  const [agent, setAgent] = useState<AgentValuesTable[]>([])
  const [filteredAgents, setFilteredAgents] = useState<AgentValuesTable[]>([]); // Use filteredAgents for rendering

  const toggleSelectAll = () => {
    if (selectedRows.length === agent.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(agent.map(agent => agent.id));
    }
  };

  const toggleSelectRow = (id: string) => {
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
    const selectedAgentsData = agent.filter(agent => selectedRows.includes(agent.id));
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

  const handleEditAgent = (agent: AgentValuesTable) => {
    setSelectedAgents([agent])
    setIsDialogOpen(true)
  }

  const handleCheck = () => {
    setCheck(!check)
  }

  const handleGetAgent = async () => {
    const res = await agentServices.getAllAgents();
    setAgent(res);
    setFilteredAgents(res); // Initialize filteredAgents with the full list
  };

  useEffect(() => {
    handleGetAgent();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = agent.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchValue) ||
        agent.status.toLowerCase().includes(searchValue) ||
        agent.version.toLowerCase().includes(searchValue)
    );
    setFilteredAgents(filtered); // Update filteredAgents with the search results
  };

  return (
    <div className='flex flex-col gap-5'>
      <Tabs />
      {currentTab == "pipelines" ? <div className="mx-auto flex gap-5 w-full">
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
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          const updatedAgents = selectedAgents.filter((_, i) => i !== index);
                          setSelectedAgents(updatedAgents);
                          setSelectedRows(updatedAgents.map(agent => agent.id));
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No agents selected.</p>
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
                        <Input
                          placeholder="Search by name"
                          className="flex-1"
                          onChange={handleSearch}
                        />
                      </div>
                      <div className='flex flex-col'>
                        <div className="w-full h-[29rem] overflow-auto">
                          <table className="w-full  text-sm">
                            <thead>
                              <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 text-left w-12">
                                  <Checkbox
                                    checked={selectedRows.length === agent.length && agent.length > 0}
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
                                <th className="px-4 py-3 text-left font-medium">Log Rate</th>
                                <th className="px-4 py-3 text-left font-medium">Trace Rate</th>
                                <th className="px-4 py-3 text-left font-medium">Metrics Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredAgents.filter(agent => agent.pipeline_name == "").map((agent) => (
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
                                  <td className="px-4 py-3">{agent.log_rate}</td>
                                  <td className="px-4 py-3">{agent.trace_rate}</td>
                                  <td className="px-4 py-3">{agent.metrics_rate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

      </div> : <CreateNewAgent />}
    </div>
  )
}

export default AddAgent;