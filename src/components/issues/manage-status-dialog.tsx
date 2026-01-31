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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { Settings2 } from "lucide-react"

export function ManageStatusDialog() {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState("reported")

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setOpen(false)
        toast.success("Status Updated", {
            description: `Issue status changed to ${status.toUpperCase().replace("_", " ")}.`
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Settings2 className="mr-2 h-4 w-4" /> Manage Status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Issue Status</DialogTitle>
                    <DialogDescription>
                        Change the status of this issue and add remarks.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select onValueChange={setStatus} defaultValue={status}>
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
                        <Label htmlFor="remarks" className="text-right">
                            Remarks
                        </Label>
                        <Textarea id="remarks" placeholder="Add internal notes..." className="col-span-3 min-h-[100px]" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Update Status</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}