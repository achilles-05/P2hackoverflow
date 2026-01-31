"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"
import { CommentsSection } from "@/components/issues/comments-section"
import { ManageStatusDialog } from "@/components/issues/manage-status-dialog"
import { use } from "react"

export default function IssueDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the params promise using React.use()
    const { id } = use(params)

    // In a real app, fetch issue by params.id
    const issue = {
        id: id,
        title: "Broken Fan in Room 101",
        description: " The ceiling fan creates a very loud noise when switched on and wobbles dangerously. It seems like the bearing is damaged. Please fix it urgently as it's getting very hot.",
        status: "reported",
        priority: "high",
        category: "electrical",
        location: "Room 101, Block A",
        reportedBy: "Rahul Sharma",
        createdAt: "Jan 28, 2024",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="destructive" className="uppercase">{issue.priority}</Badge>
                            <Badge variant="outline" className="uppercase">{issue.category}</Badge>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {issue.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {issue.createdAt}
                            </div>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p>{issue.description}</p>
                    </div>

                    {/* Evidence Image */}
                    <div className="rounded-xl overflow-hidden border border-white/10">
                        <img src={issue.image} alt="Issue Evidence" className="w-full h-[300px] object-cover" />
                    </div>

                    <div className="pt-8 border-t border-white/10">
                        <CommentsSection />
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 glass space-y-4">
                        <h3 className="font-semibold text-lg">Status</h3>
                        <div className="flex items-center gap-2 text-yellow-500">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium capitalize">{issue.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This issue is currently pending assignment to a maintenance staff.
                        </p>
                        <ManageStatusDialog />
                    </div>

                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 glass space-y-4">
                        <h3 className="font-semibold text-lg">Reporters</h3>
                        <div className="flex -space-x-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs border-2 border-background">RS</div>
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs border-2 border-background">+2</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Rahul Sharma and 2 others reported this.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
