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
import { Plus, Megaphone, Loader2 } from "lucide-react"
import { createAnnouncement } from "@/app/actions/announcements"
import { useRouter } from "next/navigation"

export function CreateAnnouncementDialog() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.target as HTMLFormElement)

        const result = await createAnnouncement(formData)

        if (result.success) {
            setOpen(false)
            toast.success("Announcement Posted", {
                description: "All targeted students have been notified."
            })
            router.refresh()
        } else {
            toast.error("Failed to post", { description: result.error })
        }
        setIsSubmitting(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> New Announcement
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                    <DialogDescription>
                        Broadcast important updates to students.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Water Supply Disruption" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="target">Target Audience</Label>
                            <Select name="target" defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="All Hostels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Hostels</SelectItem>
                                    <SelectItem value="block-a">Block A Only</SelectItem>
                                    <SelectItem value="block-b">Block B Only</SelectItem>
                                    <SelectItem value="staff">Staff Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue="maintenance">
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="events">Events</SelectItem>
                                    <SelectItem value="rules">Rules & Discipline</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Detailed message..."
                            className="min-h-[100px]"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Megaphone className="mr-2 h-4 w-4" />}
                            {isSubmitting ? "Broadcasting..." : "Broadcast"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}