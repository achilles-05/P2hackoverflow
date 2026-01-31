"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, MessageSquare, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { CommentsSection } from "@/components/issues/comments-section"
import { Timeline } from "@/components/issues/timeline"

interface ViewComplaintDetailsProps {
    issue: any
    isPublic?: boolean
}

export function ViewComplaintDetails({ issue, isPublic }: ViewComplaintDetailsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-xs font-medium border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-all">
                    {isPublic ? "View Discussions" : "See Progress"}
                </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/20 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start mr-8">
                        <div>
                            <DialogTitle className="text-xl font-bold text-primary">{issue.title}</DialogTitle>
                            <DialogDescription className="mt-1 flex flex-col gap-1">
                                <span className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Reported {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                </span>
                                {issue.profiles?.full_name && (
                                    <span className="flex items-center gap-2 text-emerald-300/80">
                                        <User className="h-3 w-3" /> by {issue.profiles.full_name}
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                        <Badge variant="outline" className="capitalize bg-white/5">{issue.status.replace('_', ' ')}</Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Description</h4>
                        <p className="text-sm leading-relaxed">{issue.description}</p>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium">{issue.location}</span>
                    </div>

                    {/* Progress Timeline - Always Visible */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Progress Timeline</h4>
                        </div>
                        <Timeline issue={issue} />
                    </div>

                    {/* Comments Section - Only for Public Issues */}
                    {isPublic && (
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
