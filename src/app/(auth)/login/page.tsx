import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function LoginPage() {
    return (
        <Card className="glass border-white/10 shadow-2xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">ResiLink</CardTitle>
                <CardDescription className="text-center">
                    Enter your email to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={login} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10" />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign In</Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
