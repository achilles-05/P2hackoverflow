"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"
import { Settings2 } from "lucide-react"

import { updateIssue } from "@/app/actions/issues"
import { useRouter } from "next/navigation"

interface ManageIssueDialogProps {
    issueId: string
    currentStatus: string
    currentPriority: string
    currentAssignee?: string
}

export function ManageIssueDialog({ issueId, currentStatus, currentPriority, currentAssignee }: ManageIssueDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(currentStatus)
    const [assignee, setAssignee] = useState(currentAssignee || "")
    const [remarks, setRemarks] = useState("")

    const handleUpdate = async () => {
        toast("Updating...", { duration: 1000 })

        const result = await updateIssue(issueId, {
            status,
            assigned_to: assignee,
            remarks
        })

        if (result.success) {
            setOpen(false)
            toast.success("Issue Updated", {
                description: `Issue status changed to ${status.replace('_', ' ')}.`
            })
            router.refresh()
        } else {
            toast.error("Update Failed", { description: result.error })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    <Settings2 className="mr-2 h-4 w-4" /> Assign
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Issue</DialogTitle>
                    <DialogDescription>
                        Update status, assign staff, or add official remarks.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="reported">Reported</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assignee" className="text-right">
                            Assign To
                        </Label>
                        <Select value={assignee} onValueChange={setAssignee}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select staff..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ramesh (Electrician)">Ramesh (Electrician)</SelectItem>
                                <SelectItem value="Suresh (Plumber)">Suresh (Plumber)</SelectItem>
                                <SelectItem value="Mukesh (Carpenter)">Mukesh (Carpenter)</SelectItem>
                                <SelectItem value="Mahesh (General)">Mahesh (General)</SelectItem>
                                <SelectItem value="Warden">Warden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="remarks" className="text-right">
                            Ref. Note
                        </Label>
                        <Input
                            id="remarks"
                            placeholder="Internal tracking note..."
                            className="col-span-3"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                            Message
                        </Label>
                        <Textarea id="message" placeholder="Message to student..." className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpdate}>Update Issue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
