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
import { Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"

type LostFoundItem = {
    id: number;
    title: string;
    location: string;
    date: string;
    status: string;
    image: string;
};

import { reportLostItem } from "@/app/actions/lost-found"
import { useRouter } from "next/navigation"

export function ReportLostItemDialog({ onReport }: { onReport?: () => void }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        toast("Submitting...", { duration: 1000 })

        const formData = new FormData(e.target as HTMLFormElement);

        const result = await reportLostItem(formData)

        if (result.success) {
            setOpen(false)
            toast.success("Item Reported", {
                description: "Your item has been listed."
            })
            router.refresh()
            if (onReport) onReport()
        } else {
            toast.error("Failed to report", { description: result.error })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Report Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report Lost/Found Item</DialogTitle>
                    <DialogDescription>
                        Provide details about the item.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Select name="type" defaultValue="lost">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lost">I Lost Something</SelectItem>
                                <SelectItem value="found">I Found Something</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Item Name
                        </Label>
                        <Input id="title" name="title" placeholder="e.g. Blue Hoodie" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                            Location
                        </Label>
                        <Input id="location" name="location" placeholder="Last seen / Found at" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact_info" className="text-right">
                            Contact
                        </Label>
                        <Input id="contact_info" name="contact_info" placeholder="Phone / Room No" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea id="description" name="description" placeholder="Details (color, brand, etc.)" className="col-span-3" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Submit Report</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}