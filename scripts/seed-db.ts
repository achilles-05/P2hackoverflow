
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function seed() {
    console.log("🌱 Starting Seed...")

    const users = [
        { email: 'student@resilink.com', password: 'student123', role: 'student', full_name: 'Rahul Sharma', block: 'Block A', room: '101' },
        { email: 'admin@resilink.com', password: 'admin123', role: 'admin', full_name: 'Warden Gupta', block: 'Admin Block', room: 'Office' }
    ]

    const userIds: Record<string, string> = {}

    for (const u of users) {
        console.log(`Processing ${u.role}...`)
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers()

        if (listError) {
            console.error("List Error:", listError)
            continue
        }

        let existing = listData.users.find(x => x.email === u.email)
        let uid = existing?.id

        if (!existing) {
            console.log(`Creating user ${u.email}...`)
            const { data, error } = await supabase.auth.admin.createUser({
                email: u.email,
                password: u.password,
                email_confirm: true,
                user_metadata: { full_name: u.full_name, role: u.role }
            })
            if (error) {
                console.error(`Error creating ${u.email}:`, error)
                continue
            }
            uid = data.user.id
        } else {
            console.log(`User ${u.email} already exists.`)
        }

        if (uid) {
            userIds[u.role] = uid

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
            else console.log(`Stats updated for ${u.role}`)
        }
    }

    const studentId = userIds['student']
    const adminId = userIds['admin']

    if (!studentId) {
        console.error("No student ID found, skipping data creation.")
        return
    }

    console.log("Creating Data...")

    // Issues
    const issues = [
        { title: "Geyser Short Circuit in Room 304", status: "reported", priority: "high", category: "electrical", location: "Block A - Room 304", description: "Sparking observed from the geyser plug.", user_id: studentId },
        { title: "Water Cooler Leaking on 2nd Floor", status: "in_progress", priority: "medium", category: "plumbing", location: "Block B - Corridor", description: "Water pooling near the cooler.", user_id: studentId },
        { title: "Study Table Leg Broken", status: "resolved", priority: "low", category: "furniture", location: "Block A - Room 102", description: "Leg wobbling dangerously.", user_id: studentId },
        { title: "WiFi Signal Weak in Common Room", status: "reported", priority: "medium", category: "internet", location: "Block C - Common Room", description: "Cannot connect to EduRoam.", user_id: studentId }
    ]

    for (const issue of issues) {
        await supabase.from('issues').insert(issue)
    }

    // Announcements
    if (adminId) {
        const announcements = [
            { title: "WiFi Maintenance Downtime", content: "Campus WiFi (Hostel-Net) will be down for scheduled maintenance tonight from 2:00 AM to 4:00 AM.", category: "maintenance", target_audience: "all", created_by: adminId },
            { title: "Strict Action on Mess Food Wastage", content: "Fines of ₹500 will be imposed on students found wasting food repeatedly.", category: "rules", target_audience: "all", created_by: adminId }
        ]

        for (const ann of announcements) {
            await supabase.from('announcements').insert(ann)
        }
    }

    console.log("✅ Seed Complete!")
}

seed()
