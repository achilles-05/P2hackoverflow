"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, Edit2, Megaphone, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { deleteAnnouncement, updateAnnouncement } from "@/app/actions/announcements"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export function AnnouncementCard({ item, isAdmin }: { item: any, isAdmin: boolean }) {
    const [editOpen, setEditOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this announcement?")) return
        setIsDeleting(true)
        const result = await deleteAnnouncement(item.id)
        if (result.success) {
            toast.success("Announcement Deleted")
        } else {
            toast.error("Failed to delete", { description: result.error })
        }
        setIsDeleting(false)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        const formData = new FormData(e.target as HTMLFormElement)
        const result = await updateAnnouncement(item.id, formData)

        if (result.success) {
            setEditOpen(false)
            toast.success("Announcement Updated")
        } else {
            toast.error("Update Failed", { description: result.error })
        }
        setIsUpdating(false)
    }

    return (
        <>
            <Card className="glass border-white/10 hover:bg-white/5 transition-colors group relative">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                                <CardDescription>
                                    {format(new Date(item.created_at), 'PPP')}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                            {isAdmin && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm text-muted-foreground">{item.content}</p>
                    <p className="text-xs text-muted-foreground mt-4 text-right opacity-50 block">Posted by {item.profiles?.full_name}</p>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Announcement</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={item.title} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={item.category}>
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
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                defaultValue={item.content}
                                className="min-h-[100px]"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
