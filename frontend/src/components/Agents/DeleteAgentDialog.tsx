import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
const DeleteAgentDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: () => void }) => {
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
                            <p>Pipeline ID : 5edea737-1eea-419d-a5ed-305a05a4b9b1</p>
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
