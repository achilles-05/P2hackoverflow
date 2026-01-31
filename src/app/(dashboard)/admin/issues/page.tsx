"use client"

import { useEffect, useState } from "react"
import { getAllIssues, updateIssue } from "@/app/actions/issues"
import { IssueCard } from "@/components/issues/issue-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, ArrowUpDown, Filter, RefreshCw, CheckCircle2, XCircle, Clock, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManageIssueDialog } from "@/components/issues/manage-issue-dialog"
import { CommentsSection } from "@/components/issues/comments-section"

export default function AdminIssuesPage() {
    const [issues, setIssues] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortOrder, setSortOrder] = useState("date")

    const fetchIssues = async () => {
        setLoading(true)
        const data = await getAllIssues()
        setIssues(data || [])
        setLoading(false)
    }

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateIssue(id, { status: newStatus })
            toast.success(`Issue marked as ${newStatus}`)
            fetchIssues() // Refresh data
        } catch (e) {
            toast.error("Failed to update status")
        }
    }

    useEffect(() => {
        fetchIssues()
    }, [])

    // Filter Logic
    const filterIssues = (list: any[]) => {
        return list
            .filter(i => statusFilter === "all" ? true : i.status === statusFilter)
            .sort((a, b) => {
                if (sortOrder === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                if (sortOrder === "priority") {
                    const pMap: any = { high: 3, medium: 2, low: 1 }
                    return pMap[b.priority] - pMap[a.priority]
                }
                if (sortOrder === "status") {
                    const sMap: any = { reported: 1, assigned: 2, in_progress: 3, resolved: 4, closed: 5 }
                    return (sMap[a.status] || 99) - (sMap[b.status] || 99)
                }
                return 0
            })
    }

    const privateIssues = filterIssues(issues.filter(i => !i.is_public))
    const publicIssues = filterIssues(issues.filter(i => i.is_public))

    const renderIssueGrid = (issueList: any[]) => (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {issueList.length === 0 ? (
                <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <h3 className="text-lg font-medium text-primary">No Issues Found</h3>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting filters or checking the other tab.</p>
                </div>
            ) : issueList.map((issue) => (
                <IssueCard
                    key={issue.id}
                    issue={issue}
                    actions={
                        <div className="flex gap-2 w-full">
                            <ViewAdminIssueDetails issue={issue} />

                            {/* Assign / Manage Button */}
                            <ManageIssueDialog
                                issueId={issue.id}
                                currentStatus={issue.status}
                                currentPriority={issue.priority}
                                currentAssignee={issue.assigned_to}
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary/10 px-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(issue.id, 'in_progress')}>
                                        <Clock className="mr-2 h-4 w-4 text-blue-400" /> Mark In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(issue.id, 'resolved')}>
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Mark Resolved
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusUpdate(issue.id, 'closed')}>
                                        <XCircle className="mr-2 h-4 w-4 text-slate-400" /> Close Issue
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    }
                />
            ))}
        </div>
    )

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Issues</h2>
                    <p className="text-muted-foreground">View, assign, and resolve student complaints.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] border-white/10 bg-white/5">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="reported">Reported</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[140px] border-white/10 bg-white/5">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Newest First</SelectItem>
                            <SelectItem value="priority">Priority (High)</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={fetchIssues} className="border-white/10 hover:bg-white/5">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Tabs defaultValue="private" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 p-1">
                        <TabsTrigger value="private" className="data-[state=active]:bg-primary fragment-active-text-white">Private Issues</TabsTrigger>
                        <TabsTrigger value="public" className="data-[state=active]:bg-primary fragment-active-text-white">Public Issues</TabsTrigger>
                    </TabsList>
                    <TabsContent value="private" className="mt-6">
                        {renderIssueGrid(privateIssues)}
                    </TabsContent>
                    <TabsContent value="public" className="mt-6">
                        {renderIssueGrid(publicIssues)}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}

function ViewAdminIssueDetails({ issue }: { issue: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/20 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary">{issue.title}</DialogTitle>
                    <DialogDescription>
                        Reported by {issue.profiles?.full_name || 'Student'} • {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Issue Description</h4>
                        <p className="text-sm leading-relaxed">{issue.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Location</h4>
                            <p className="font-medium text-primary">{issue.location}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Student Details</h4>
                            <p className="font-medium">{issue.profiles?.full_name}</p>
                            <p className="text-xs text-muted-foreground">Block {issue.profiles?.hostel_block}, Room {issue.profiles?.room_no}</p>
                        </div>
                    </div>

                    {issue.is_public && (
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Discussion
                            </h4>
                            <CommentsSection issueId={issue.id} />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
