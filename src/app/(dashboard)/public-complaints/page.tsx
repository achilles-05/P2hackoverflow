"use client"

import { useEffect, useState } from "react"
import { getPublicIssues } from "@/app/actions/issues"
import { IssueCard } from "@/components/issues/issue-card"
import { ViewComplaintDetails } from "@/components/issues/view-complaint-details"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, MessageSquare } from "lucide-react"

export default function PublicComplaintsPage() {
    const [issues, setIssues] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchIssues = async () => {
        setLoading(true)
        const data = await getPublicIssues()
        setIssues(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchIssues()
    }, [])

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Public Complaints</h2>
                    <p className="text-muted-foreground">Community issues reported by students. Discussions enabled.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchIssues} className="border-white/10 hover:bg-white/5">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {issues.length === 0 ? (
                        <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <MessageSquare className="h-10 w-10 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-primary">No Public Issues</h3>
                            <p className="text-muted-foreground mt-2">There are no community-wide complaints reported yet.</p>
                        </div>
                    ) : (
                        issues.map((issue) => (
                            <IssueCard
                                key={issue.id}
                                issue={issue}
                                isStudent={true}
                                actions={
                                    <ViewComplaintDetails issue={issue} isPublic={true} />
                                }
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
