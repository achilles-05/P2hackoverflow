"use client"

import { formatDistanceToNow } from "date-fns"

export function Timeline({ issue }: { issue: any }) {
    const assignee = issue.assigned_to ? `(${issue.assigned_to})` : ""

    const steps = [
        { status: 'reported', label: 'Reported', date: issue.created_at, sub: null },
        { status: 'viewed', label: 'Viewed by Warden', date: null, sub: "Acknowledged" },
        { status: 'assigned', label: `Assigned ${assignee}`, date: null, sub: assignee ? "Action pending" : "Waiting assignment" },
        { status: 'in_progress', label: 'In Progress', date: null, sub: "Work started" },
        { status: 'resolved', label: 'Resolved', date: null, sub: "Issue fixed" },
    ]

    const statusMap: any = { 'reported': 0, 'viewed': 1, 'assigned': 2, 'in_progress': 3, 'resolved': 4, 'closed': 4 }
    let currentStepIdx = statusMap[issue.status] || 0

    return (
        <div className="relative pl-4 border-l-2 border-white/10 space-y-8 my-4">
            {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx
                const isCurrent = idx === currentStepIdx

                return (
                    <div key={step.label} className="relative">
                        <div className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 
                            ${isCompleted ? 'bg-primary border-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]' : 'bg-background border-muted-foreground/30'}`}>
                        </div>

                        <div className="flex flex-col">
                            <p className={`text-sm font-medium transition-colors ${isCompleted ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                                {step.label}
                            </p>
                            {step.sub && <p className="text-xs text-muted-foreground/70">{step.sub}</p>}

                            {idx === 0 && <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(step.date), { addSuffix: true })}</p>}

                            {isCurrent && idx > 0 && (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 w-fit">
                                    Current Status
                                </span>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}