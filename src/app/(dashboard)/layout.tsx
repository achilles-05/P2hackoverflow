import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { cookies } from "next/headers"

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const cookieStore = await cookies()
    const userRole = cookieStore.get('user_role')?.value || 'student' // Default to student

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar userRole={userRole} />
            </div>
            <main className="md:pl-72 pb-10">
                <Navbar userRole={userRole} />
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;
