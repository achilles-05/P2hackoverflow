import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Bell, Moon, User, Lock, LogOut } from "lucide-react"
import { signout } from "@/app/auth/actions"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Account Settings</h2>
                <p className="text-muted-foreground">Manage your profile and app preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[250px_1fr]">
                <nav className="flex flex-col space-y-1">
                    {/* Sidebar-like nav for settings if needed, or just use Tabs */}
                </nav>
                <Tabs defaultValue="profile" className="space-y-6 w-full -ml-[250px] md:ml-0">
                    <TabsList className="bg-muted/50 p-1 w-full justify-start">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                        <Card className="glass border-white/20">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Your details as registered in the hostel system.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                                        <AvatarFallback className="text-2xl bg-muted">
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h3 className="font-medium text-lg">{profile?.full_name || 'Student'}</h3>
                                        <p className="text-sm text-muted-foreground">{profile?.email}</p>
                                    </div>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={profile?.full_name} disabled className="bg-white/5" />
                                        <p className="text-[10px] text-muted-foreground">Contact Admin to change name.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" defaultValue={profile?.role} disabled className="bg-white/5 capitalize" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hostel">Hostel Block</Label>
                                        <Input id="hostel" defaultValue={profile?.hostel_block || 'Not Assigned'} disabled className="bg-white/5" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="room">Room Number</Label>
                                        <Input id="room" defaultValue={profile?.room_no || 'Not Assigned'} disabled className="bg-white/5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                        <Card className="glass border-white/20">
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Manage how you receive updates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Complaint Updates</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Get notified when status changes.
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Announcements</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Receive important hostel alerts.
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <Card className="glass border-white/20">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-medium">Sign Out</h4>
                                        <p className="text-sm text-muted-foreground">Sign out of your account on this device.</p>
                                    </div>
                                    <form action={signout}>
                                        <Button variant="destructive" size="sm">
                                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

