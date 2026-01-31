"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, History, Megaphone, Settings, LogOut, Search, Users, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signout } from "@/app/auth/actions"

const studentRoutes = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
    },
    {
        label: "Report Issue",
        icon: PlusCircle,
        href: "/report-issue",
    },
    {
        label: "My Complaints",
        icon: History,
        href: "/my-issues",
    },
    {
        label: "Public Complaints",
        icon: Users,
        href: "/public-complaints",
    },
    {
        label: "Announcements",
        icon: Megaphone,
        href: "/announcements",
    },
    {
        label: "Lost & Found",
        icon: Search,
        href: "/lost-found",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

const adminRoutes = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/admin",
    },
    {
        label: "Manage Issues",
        icon: ShieldAlert,
        href: "/admin/issues",
    },
    {
        label: "Lost & Found",
        icon: Search,
        href: "/lost-found",
    },
    {
        label: "Announcements",
        icon: Megaphone,
        href: "/announcements", // Admins might want to post here
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
]

export function Sidebar({ userRole = "student" }: { userRole?: string }) {
    const pathname = usePathname()
    const routes = userRole === "admin" ? adminRoutes : studentRoutes
    const homeLink = userRole === "admin" ? "/admin" : "/dashboard"

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar/50 backdrop-blur-xl border-r border-white/10 text-sidebar-foreground">
            <div className="px-3 py-2 flex-1">
                <Link href={homeLink} className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        {/* Logo placeholder - replace with Image if available */}
                        <div className="absolute inset-0 bg-primary rounded-lg blur-sm opacity-50"></div>
                        <div className="relative bg-primary w-full h-full rounded-lg flex items-center justify-center font-bold text-primary-foreground">R</div>
                    </div>
                    <h1 className="text-2xl font-bold">
                        ResiLink
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-primary bg-white/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                {/* User User Profile / Logout - minimal */}
                <form action={signout}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </Button>
                </form>
            </div>
        </div>
    )
}
