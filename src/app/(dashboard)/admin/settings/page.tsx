"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, Save, Building, Database, Download, AlertTriangle, FileText, Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettingsPage() {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Admin Administration</h2>
                <p className="text-muted-foreground">System-wide configuration, user management, and data controls.</p>
            </div>

            <Tabs defaultValue="system" className="space-y-4">
                <TabsList className="bg-muted/50 p-1 grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="hostels">Hostels & Rooms</TabsTrigger>
                    <TabsTrigger value="users">User Roles</TabsTrigger>
                    <TabsTrigger value="data">Data & Backup</TabsTrigger>
                </TabsList>

                {/* System Configuration */}
                <TabsContent value="system" className="space-y-4">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-emerald-400" /> Platform Controls
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg border-white/5 bg-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <p className="text-xs text-muted-foreground">Temporarily disable student access for updates.</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg border-white/5 bg-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Allow New Registrations</Label>
                                    <p className="text-xs text-muted-foreground">Enable or disable new student sign-ups.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg border-white/5 bg-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-base border-red-500 text-red-400">Emergency Lockdown</Label>
                                    <p className="text-xs text-muted-foreground">Triggers emergency alerts to all users.</p>
                                </div>
                                <Button variant="destructive" size="sm">
                                    <AlertTriangle className="mr-2 h-4 w-4" /> Trigger Alert
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-blue-400" /> Global Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>System Banner Message</Label>
                                    <Input placeholder="e.g. Server maintenance scheduled for..." />
                                </div>
                                <Button className="w-fit" onClick={() => toast.success("Banner Updated")}>Update Banner</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Users Roles */}
                <TabsContent value="users" className="space-y-4">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" /> Staff Management
                            </CardTitle>
                            <CardDescription>
                                Monitor and manage staff access levels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <RoleCard title="Admins" count={2} color="text-red-400" />
                                <RoleCard title="Wardens" count={4} color="text-orange-400" />
                                <RoleCard title="Maintenance" count={12} color="text-blue-400" />
                            </div>

                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Invite New Staff</h3>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input placeholder="Staff Email Address" />
                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="warden">Warden</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="security">Security</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={() => toast.success("Invitation Sent")}>Send Invite</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hostels */}
                <TabsContent value="hostels" className="space-y-4">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-purple-400" /> Hostel Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="border border-white/10 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Block A (Boys)</h4>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Total Rooms: 120</p>
                                        <p>Occupancy: 85%</p>
                                        <p>Warden: Mr. Sharma</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-4 w-full">Manage Block</Button>
                                </div>
                                <div className="border border-white/10 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Block B (Girls)</h4>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Total Rooms: 120</p>
                                        <p>Occupancy: 92%</p>
                                        <p>Warden: Mrs. Gupta</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-4 w-full">Manage Block</Button>
                                </div>
                            </div>
                            <Button className="w-full border-dashed border-2 border-white/20 hover:border-primary/50 hover:bg-white/5" variant="ghost">
                                + Add New Block
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data & Backup */}
                <TabsContent value="data" className="space-y-4">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-amber-400" /> Data Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg border-white/5">
                                <div>
                                    <div className="font-medium">Export Issues Data</div>
                                    <div className="text-xs text-muted-foreground">Download all issue reports as CSV.</div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => toast.success("Downloading CSV...")}>
                                    <Download className="mr-2 h-4 w-4" /> Export CSV
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg border-white/5">
                                <div>
                                    <div className="font-medium">System Logs</div>
                                    <div className="text-xs text-muted-foreground">View system activity and error logs.</div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <FileText className="mr-2 h-4 w-4" /> View Logs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function RoleCard({ title, count, color }: { title: string, count: number, color?: string }) {
    return (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="font-medium">{title}</div>
            <div className={`px-2 py-1 rounded bg-white/5 text-xs font-bold ${color || 'text-primary'}`}>
                {count} Active
            </div>
        </div>
    )
}
