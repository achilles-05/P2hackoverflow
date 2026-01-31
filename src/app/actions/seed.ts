'use server'

import { createAdminClient } from '@/utils/supabase/admin'

export async function seedDemoData() {
    try {
        const supabase = createAdminClient()

        // 1. Create Users
        const users = [
            { email: 'student@resilink.com', password: 'student123', role: 'student', full_name: 'Rahul Sharma', block: 'Block A', room: '101' },
            { email: 'admin@resilink.com', password: 'admin123', role: 'admin', full_name: 'Warden Gupta', block: 'Admin Block', room: 'Office' }
        ]

        const userIds: Record<string, string> = {}

        for (const u of users) {
            // Check if user exists (by trying to sign in or get user by email if possible? 
            // Admin API 'listUsers' is better but for speed let's just try create and catch error, or list first)
            // Actually, createAdminClient gives us access to auth.admin

            const { data: listData } = await supabase.auth.admin.listUsers()
            const existing = listData.users.find(x => x.email === u.email)

            let uid = existing?.id

            if (!existing) {
                const { data, error } = await supabase.auth.admin.createUser({
                    email: u.email,
                    password: u.password,
                    email_confirm: true,
                    user_metadata: { full_name: u.full_name, role: u.role }
                })
                if (error) {
                    console.error(`Error creating ${u.email}:`, error)
                    // If error is "User already registered", we might not get the ID easily without list.
                    // But we listed above.
                    if (error.message.includes('already registered')) continue
                    return { error: `Failed to create user ${u.email}: ${error.message}` }
                }
                uid = data.user.id
            }

            if (uid) {
                userIds[u.role] = uid

                // Upsert Profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: uid,
                        email: u.email,
                        full_name: u.full_name,
                        role: u.role,
                        hostel_block: u.block,
                        room_no: u.room
                    })

                if (profileError) console.error(`Profile error for ${u.role}:`, profileError)
            }
        }

        const studentId = userIds['student']
        const adminId = userIds['admin']

        if (!studentId || !adminId) return { error: 'Failed to retrieve User IDs after creation.' }

        // 2. Clear existing demo data (optional, but good for reset)
        // await supabase.from('issues').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Dangerous
        // Let's just append for now to be safe.

        // 3. Create Issues (Mock Data adapted for DB)
        const issues = [
            { title: "Geyser Short Circuit in Room 304", status: "reported", priority: "high", category: "electrical", location: "Block A - Room 304", description: "Sparking observed from the geyser plug.", user_id: studentId },
            { title: "Water Cooler Leaking on 2nd Floor", status: "in_progress", priority: "medium", category: "plumbing", location: "Block B - Corridor", description: "Water pooling near the cooler.", user_id: studentId }, // Self-report or other? Let's say student reported all.
            { title: "Study Table Leg Broken", status: "resolved", priority: "low", category: "furniture", location: "Block A - Room 102", description: "Leg wobbling dangerously.", user_id: studentId },
            { title: "WiFi Signal Weak in Common Room", status: "reported", priority: "medium", category: "internet", location: "Block C - Common Room", description: "Cannot connect to EduRoam.", user_id: studentId }
        ]

        for (const issue of issues) {
            await supabase.from('issues').insert(issue)
        }

        // 4. Create Announcements
        const announcements = [
            { title: "WiFi Maintenance Downtime", content: "Campus WiFi (Hostel-Net) will be down for scheduled maintenance tonight from 2:00 AM to 4:00 AM.", category: "maintenance", target_audience: "all", created_by: adminId },
            { title: "Strict Action on Mess Food Wastage", content: "Fines of ₹500 will be imposed on students found wasting food repeatedly.", category: "rules", target_audience: "all", created_by: adminId }
        ]

        for (const ann of announcements) {
            await supabase.from('announcements').insert(ann)
        }

        return { success: true }
    } catch (e: any) {
        console.error("Seed Error:", e)
        return { error: e.message }
    }
}
