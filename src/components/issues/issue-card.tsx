"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface IssueCardProps {
    issue: any
    isStudent?: boolean // varies actions
    actions?: React.ReactNode // Slot for "View Details" etc
}

export function IssueCard({ issue, isStudent, actions }: IssueCardProps) {
    const statusColor = {
        reported: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
        assigned: "bg-blue-500/20 text-blue-500 border-blue-500/50",
        in_progress: "bg-purple-500/20 text-purple-500 border-purple-500/50",
        resolved: "bg-primary/20 text-primary border-primary/50",
        closed: "bg-slate-500/20 text-slate-500 border-slate-500/50"
    }

    const priorityColor = {
        high: "bg-red-500/20 text-red-500 border-red-500/50",
        medium: "bg-orange-500/20 text-orange-500 border-orange-500/50",
        low: "bg-primary/20 text-primary border-primary/50"
    }

    const getCategoryStyle = (cat: string) => {
        // Simple mapping to icons with primary color
        const iconClass = "w-5 h-5 text-primary"
        switch (cat?.toLowerCase()) {
            case 'electrical': return { icon: <Clock className={iconClass} /> } // Should use Zap if imported
            case 'plumbing': return { icon: <CheckCircle2 className={iconClass} /> } // Droplet if imported
            case 'furniture': return { icon: <MapPin className={iconClass} /> } // Armchair if imported
            case 'internet': return { icon: <AlertCircle className={iconClass} /> } // Wifi if imported
            default: return { icon: <AlertCircle className={iconClass} /> }
        }
    }

    // Better Lucide Imports would be Zap, Droplets, Armchair, Wifi (Checking availability)
    // For now using generic icons but coloured backgrounds make it look "Image-like"

    const style = getCategoryStyle(issue.category)

    return (
        <Card className="glass border-white/10 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex gap-2">
                    <Badge variant="outline" className={`${priorityColor[issue.priority as keyof typeof priorityColor]} backdrop-blur-md`}>
                        {issue.priority}
                    </Badge>
                    <Badge variant="outline" className={`${statusColor[issue.status as keyof typeof statusColor]} backdrop-blur-md`}>
                        {issue.status.replace('_', ' ')}
                    </Badge>
                </div>
                {/* Category Icon */}
                <div className="bg-primary/10 p-2 rounded-full">
                    {style.icon}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg truncate flex-1" title={issue.title}>{issue.title}</h3>
                </div>

                {issue.profiles?.full_name && (
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span>{issue.profiles.full_name}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="truncate">{issue.location}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                </div>

                {issue.category && (
                    <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs">
                        {issue.category}
                    </Badge>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
                {actions}
            </CardFooter>
        </Card>
    )
}
