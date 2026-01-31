"use client"

import { useEffect, useState } from "react"
import { getUserIssues } from "@/app/actions/issues"
import { IssueCard } from "@/components/issues/issue-card"
import { ViewComplaintDetails } from "@/components/issues/view-complaint-details"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, PlusCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function MyComplaintsPage() {
    const [issues, setIssues] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchIssues = async () => {
        setLoading(true)
        const data = await getUserIssues()
        // STRICT FILTER: Only Private Issues
        const privateIssues = (data || []).filter((i: any) => !i.is_public)
        setIssues(privateIssues)
        setLoading(false)
    }

    useEffect(() => {
        fetchIssues()
    }, [])

    // Fallback for demo: if no issues, show placeholders
    const displayIssues = issues.length > 0 ? issues : [
        { id: 'mock-1', title: 'Broken Fan Regulator', location: 'Room 304', status: 'reported', priority: 'medium', category: 'electrical', created_at: new Date().toISOString(), is_public: false },
        { id: 'mock-2', title: 'Leaking Tap', location: 'Bathroom 2nd Floor', status: 'in_progress', priority: 'low', category: 'plumbing', created_at: new Date(Date.now() - 86400000).toISOString(), is_public: false }
    ]

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">My Complaints</h2>
                    <p className="text-muted-foreground">Track the status of your reported issues.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchIssues} className="border-white/10 hover:bg-white/5">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Link href="/report-issue">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <PlusCircle className="mr-2 h-4 w-4" /> New Complaint
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayIssues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            isStudent={true}
                            actions={
                                <ViewComplaintDetails issue={issue} isPublic={false} />
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
