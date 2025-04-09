import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { usePipelineOverview } from "@/context/usePipelineDetailContext"
const DeleteAgentDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: () => void }) => {
    const {pipelineOverview}=usePipelineOverview()
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl mb-3">Delete Pipeline</DialogTitle>
                    <DialogDescription>
                        <div className="flex gap-2 text-[1.05rem] text-gray-700">
                            Are you sure you want to delete this pipeline ?
                        </div>
                        <div className="mt-5">
                            <p>{`Pipeline ID : ${pipelineOverview}`}</p>
                            <p>Pipeline : docker_1</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant={"destructive"}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAgentDialog
