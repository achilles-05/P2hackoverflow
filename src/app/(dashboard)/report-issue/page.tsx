import { ReportIssueForm } from "@/components/forms/report-issue-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportIssuePage() {
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Report an Issue</h2>
                <p className="text-muted-foreground">Submit a new maintenance request for your hostel block/room.</p>
            </div>

            <Card className="glass border-white/10">
                <CardHeader>
                    <CardTitle>Issue Details</CardTitle>
                    <CardDescription>Please provide as much information as possible to help us resolve it quickly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReportIssueForm />
                </CardContent>
            </Card>
        </div>
    )
}
