import { CreateAnnouncementDialog } from "@/components/forms/create-announcement-dialog"
import { getAnnouncements } from "@/app/actions/announcements"
import { AnnouncementCard } from "@/components/announcements/announcement-card"
import { cookies } from "next/headers"

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements() || []
    const cookieStore = await cookies()
    const userRole = cookieStore.get('user_role')?.value || 'student'
    const isAdmin = userRole === 'admin'

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Announcements</h2>
                    <p className="text-muted-foreground">Latest updates from the hostel administration.</p>
                </div>
                {isAdmin && <CreateAnnouncementDialog />}
            </div>

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                        <p className="text-muted-foreground">No announcements posted yet.</p>
                    </div>
                ) : (
                    announcements.map((item: any) => (
                        <AnnouncementCard key={item.id} item={item} isAdmin={isAdmin} />
                    ))
                )}
            </div>
        </div>
    )
}