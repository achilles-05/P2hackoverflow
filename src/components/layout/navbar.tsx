"use client"

import { Menu, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar({ userRole = 'student' }: { userRole?: string }) {
    const settingsLink = userRole === 'admin' ? '/admin/settings' : '/settings';

    return (
        <div className="flex items-center p-4 border-b border-white/10 h-16 bg-background/50 backdrop-blur-md sticky top-0 z-50">
            {/* Mobile Sidebar */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-sidebar border-r-white/10">
                    <Sidebar userRole={userRole} />
                </SheetContent>
            </Sheet>

            <div className="flex w-full justify-end items-center gap-x-4">
                <ModeToggle />
                <div className="flex items-center gap-x-2">
                    <Link href={settingsLink}>
                        <Avatar className="h-9 w-9 border border-primary/50 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                            {userRole === 'admin' ? (
                                <AvatarFallback className="bg-primary/20 text-primary font-bold">AD</AvatarFallback>
                            ) : (
                                <AvatarFallback className="bg-primary/20 text-primary">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </Link>
                </div>
            </div>
        </div>
    )
}
