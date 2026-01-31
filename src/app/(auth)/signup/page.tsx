import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SignupPage() {
    return (
        <Card className="glass border-white/10 shadow-2xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                <CardDescription className="text-center">
                    Enter your details to get started with ResiLink
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={signup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input id="full_name" name="full_name" placeholder="John Doe" required className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hostel_block">Hostel Block</Label>
                            <Select name="hostel_block" defaultValue="Block A">
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Block" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Block A">Block A</SelectItem>
                                    <SelectItem value="Block B">Block B</SelectItem>
                                    <SelectItem value="Block C">Block C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="room_no">Room No</Label>
                            <Input id="room_no" name="room_no" placeholder="e.g. 101" required className="bg-white/5 border-white/10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue="student">
                            <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="admin">Admin (Warden)</SelectItem>
                                <SelectItem value="caretaker">Caretaker</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
