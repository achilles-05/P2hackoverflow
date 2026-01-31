"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlusCircle, Search, ListTodo, Settings, Megaphone, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    // Mock recent activity with priorities
    const recentActivity = [
        { id: 1, type: 'issue', title: 'Leaking Tap in Row A', status: 'resolved', time: '2h ago', priority: 'medium' },
        { id: 2, type: 'announcement', title: 'WiFi Maintenance Schedule', status: 'urgent', time: '5h ago', priority: 'high' },
        { id: 3, type: 'lost', title: 'Found: Blue Umbrella', status: 'new', time: '1d ago', priority: 'low' },
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                        Student Dashboard
                    </h2>
                    <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening in your hostel.</p>
                </div>
                <Link href="/report-issue">
                    <Button className="shadow-lg hover:shadow-primary/25 transition-all">
                        <PlusCircle className="mr-2 h-4 w-4" /> Report Issue
                    </Button>
                </Link>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                    href="/report-issue"
                    icon={<PlusCircle className="h-6 w-6 text-primary" />}
                    title="Report Issue"
                    desc="Submit a new complaint"
                    delay={0.1}
                />
                <QuickActionCard
                    href="/my-issues"
                    icon={<ListTodo className="h-6 w-6 text-blue-500" />}
                    title="My Issues"
                    desc="Track your requests"
                    delay={0.2}
                />
                <QuickActionCard
                    href="/lost-found"
                    icon={<Search className="h-6 w-6 text-primary" />}
                    title="Lost & Found"
                    desc="Find missing items"
                    delay={0.3}
                />
                <QuickActionCard
                    href="/settings"
                    icon={<Settings className="h-6 w-6 text-gray-500" />}
                    title="Settings"
                    desc="Manage preferences"
                    delay={0.4}
                />
            </div>

            <div className="grid gap-8 md:grid-cols-7">
                {/* Main Content Area - 4 cols */}
                <div className="md:col-span-4 space-y-8">
                    {/* Community Pulse */}
                    <motion.div variants={item}>
                        <Card className="glass border-white/20 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" /> Recent Activity
                                </CardTitle>
                                <CardDescription>Real-time updates from the community</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${activity.type === 'issue' ? 'bg-orange-500/10 text-orange-500' :
                                                activity.type === 'announcement' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-gray-500/10 text-gray-500'
                                                }`}>
                                                {activity.type === 'issue' ? <ListTodo className="h-4 w-4" /> :
                                                    activity.type === 'announcement' ? <Megaphone className="h-4 w-4" /> :
                                                        <Search className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{activity.title}</p>
                                                    {/* Priority Badge */}
                                                    <Badge variant="outline" className={`text-[10px] px-1.5 h-5 ${activity.priority === 'high' ? 'text-destructive border-destructive/50' : activity.priority === 'medium' ? 'text-orange-400 border-orange-400/50' : 'text-primary border-primary/50'}`}>
                                                        {activity.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                        <Badge variant={activity.status === 'resolved' ? 'default' : 'secondary'}>
                                            {activity.status}
                                        </Badge>
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary mt-2">
                                    View All Activity
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Sidebar Area - 3 cols */}
                <div className="md:col-span-3 space-y-8">
                    {/* Hostel Map / Info Widget */}
                    <motion.div variants={item}>
                        <Card className="glass border-white/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Your Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold">Block A, Room 304</p>
                                        <p className="text-xs text-muted-foreground">Engineering Hostel</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Announcements Widget */}
                    <motion.div variants={item}>
                        <Card className="glass border-white/20 bg-gradient-to-br from-primary/5 to-transparent">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Megaphone className="h-5 w-5 text-primary" /> Announcements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-background/50 border border-white/10 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-sm">Mess Menu Update</h4>
                                        <Badge variant="destructive" className="text-[10px] px-1.5 h-5">URGENT</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        The dinner menu for tonight has been changed due to supply chain issues. Please check the notice board.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-background/50 border border-white/10 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-sm">Library Hours Extended</h4>
                                        <Badge variant="outline" className="text-[10px] px-1.5 h-5">INFO</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        Starting tomorrow, the library will remain open until 2 AM for exam preparation.
                                    </p>
                                </div>
                                <Link href="/announcements" className="block">
                                    <Button variant="outline" className="w-full mt-2">Read All</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

function QuickActionCard({ href, icon, title, desc, delay }: { href: string, icon: React.ReactNode, title: string, desc: string, delay: number }) {
    return (
        <Link href={href}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
                className="h-full p-4 rounded-xl border border-white/10 bg-white/5 glass hover:bg-white/20 transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[140px]"
            >
                <div className="p-2 bg-background/50 rounded-lg w-fit mb-3 group-hover:bg-background/80 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
            </motion.div>
        </Link>
    )
}
