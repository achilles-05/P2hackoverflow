import { DataTable } from "@/components/issues/data-table"
import { columns, Issue } from "@/components/issues/columns"
import { OverviewChart } from "@/components/charts/overview"
import { ResponseTimeChart } from "@/components/charts/response-time"
import { HostelDensityChart } from "@/components/charts/hostel-density"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/app/actions/analytics"
import { createClient } from "@/utils/supabase/server"
import { Clock } from "lucide-react"

export default async function AdminPage() {
    const { stats, recentActivity, announcements, chartData } = await getDashboardStats()
    const supabase = await createClient()

    const { data: allIssues } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">Manage and track all hostel issues.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">{stats.resolutionRate}% Resolution Rate</p>
                    </CardContent>
                </Card>
                <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgResponse || '2.4 hrs'}</div>
                        <p className="text-xs text-muted-foreground">
                            -0.5 hrs from last week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="glass border-white/10 col-span-4">
                    <CardHeader>
                        <CardTitle>Issue Distribution by Block</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <HostelDensityChart data={chartData.density} />
                    </CardContent>
                </Card>
                <Card className="glass border-white/10 col-span-3">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={chartData.overview} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass border-white/10">
                    <CardHeader>
                        <CardTitle>Avg. Resolution Time (Hours)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponseTimeChart data={chartData.responseTime} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-7 glass border-white/10">
                    <CardHeader>
                        <CardTitle>Recent Hostel Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentActivity.map((activityItem: any, i: number) => (
                                <div key={activityItem.id || i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activityItem.action}</p>
                                        <p className="text-sm text-muted-foreground">{activityItem.target}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                                        {new Date(activityItem.time).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">All Issues</h3>
                <DataTable columns={columns} data={(allIssues as Issue[]) || []} />
            </div>
        </div>
    )
}