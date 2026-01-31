"use client"

import { seedDemoData } from "@/app/actions/seed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"

export default function SetupPage() {
    const [loading, setLoading] = useState(false)

    const handleSeed = async () => {
        const secret = prompt("Enter the Service Role Key (from Supabase > Settings > API):")
        if (!secret) return

        // We can't easily pass the secret to the server action env without restart.
        // BUT, the server action reads process.env.SUPABASE_SERVICE_ROLE_KEY.
        // Meaning user MUST set it in .env.local first.

        setLoading(true)
        const result = await seedDemoData()
        setLoading(false)

        if (result.success) {
            toast.success("Database Seeded!", {
                description: "Demo accounts and data have been created. You can now Log In."
            })
        } else {
            toast.error("Seeding Failed", {
                description: result.error || "Check console/logs. Did you set SUPABASE_SERVICE_ROLE_KEY in .env.local?"
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="max-w-md w-full glass border-white/10">
                <CardHeader>
                    <CardTitle>🚀 Initial Setup</CardTitle>
                    <CardDescription>
                        Prepare the database for the Hackathon Demo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-500">
                        <strong>Prerequisite:</strong> Ensure <code>SUPABASE_SERVICE_ROLE_KEY</code> is set in your <code>.env.local</code> file.
                    </div>

                    <Button onClick={handleSeed} disabled={loading} className="w-full" size="lg">
                        {loading ? "Seeding..." : "Initialize Demo Data"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        This will create student@resilink.com and admin@resilink.com with correct passwords and sample data.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
