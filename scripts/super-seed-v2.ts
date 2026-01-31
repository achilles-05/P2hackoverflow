
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

const STATUSES = ['reported', 'in_progress', 'resolved']
const PRIORITIES = ['low', 'medium', 'high']

async function superSeedV2() {
    console.log("🚀 Starting SUPER SEED V2 (Winning Edition)...")

    // 1. Ensure Users
    const users = [
        { email: 'student@resilink.com', role: 'student', full_name: 'Rahul Student' },
        { email: 'admin@resilink.com', role: 'admin', full_name: 'Warden Admin' }
    ]
    const userIds: Record<string, string> = {}

    for (const u of users) {
        let uid;
        const { data } = await supabase.auth.admin.listUsers()
        const existing = data.users.find(x => x.email === u.email)
        if (existing) {
            uid = existing.id
            // Update password if needed? No, keep it simple.
        } else {
            console.log(`Creating ${u.email}...`)
            const { data: newData } = await supabase.auth.admin.createUser({
                email: u.email,
                password: u.role + '123',
                email_confirm: true,
                user_metadata: { full_name: u.full_name, role: u.role }
            })
            uid = newData.user?.id
        }
        if (uid) {
            userIds[u.role] = uid
            await supabase.from('profiles').upsert({ id: uid, email: u.email, role: u.role, full_name: u.full_name })
        }
    }

    const studentId = userIds['student']
    const adminId = userIds['admin']
    if (!studentId) return

    console.log("✅ Users Ready. Clearing Junk...")

    // 2. Wipe Clean for quality
    await supabase.from('issues').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('announcements').delete().neq('id', 0)
    await supabase.from('lost_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    console.log("✅ Junk Cleared. Injecting High-Quality Data...")

    // 3. Create 5 High Quality Issues
    const issues = [
        {
            title: "Geyser Sparking in Room 304",
            cat: "electrical",
            loc: "Block A - Room 304",
            desc: "The geyser plug socket is sparking whenever turned on. Dangerous.",
            status: "reported",
            prio: "high"
        },
        {
            title: "Water Cooler Leaking",
            cat: "plumbing",
            loc: "Block B - 2nd Floor Corridor",
            desc: "Continuous water leakage from the main cooler unit. Floor is slippery.",
            status: "in_progress",
            prio: "medium"
        },
        {
            title: "Broken Study Chair",
            cat: "furniture",
            loc: "Block A - Room 105",
            desc: "The backrest of the wooden chair has come off completely.",
            status: "resolved",
            prio: "low"
        },
        {
            title: "WiFi Not Connecting",
            cat: "internet",
            loc: "Block C - Common Room",
            desc: "Router lights are blinking red. No internet access since morning.",
            status: "reported",
            prio: "high"
        },
        {
            title: "Corridor Light Fused",
            cat: "electrical",
            loc: "Block B - Entrance",
            desc: "Main entrance light is not working. Area is very dark at night.",
            status: "resolved",
            prio: "medium"
        }
    ]

    for (const i of issues) {
        await supabase.from('issues').insert({
            title: i.title,
            category: i.cat,
            location: i.loc,
            description: i.desc,
            status: i.status,
            priority: i.prio,
            user_id: studentId,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString() // Last 3 days
        })
    }

    // 4. Create 4 High Quality Lost & Found items
    const lostItems = [
        { title: "Blue Yeti Water Bottle", type: "lost", loc: "Library Reading Hall", img: "🥤" },
        { title: "Black North Face Hoodie", type: "found", loc: "Mess Hall Table 4", img: "🧥" },
        { title: "Casio G-Shock Watch", type: "lost", loc: "Block A Washroom", img: "⌚" },
        { title: "Calculus Textbook (Stewarts)", type: "found", loc: "Common Room Sofa", img: "📘" }
    ]

    for (const item of lostItems) {
        await supabase.from('lost_items').insert({
            title: item.title,
            type: item.type,
            location: item.loc,
            description: `A ${item.title} was ${item.type} near ${item.loc}.`,
            status: 'open',
            user_id: studentId,
            image_url: item.img,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 2)).toISOString()
        })
    }

    // 5. Create 3 Reality Announcements
    const anns = [
        { title: "Scheduled Power Maintenance", content: "Electricity will be cut off in Block A & B tomorrow from 2 PM to 5 PM for transformer repairs.", cat: "maintenance" },
        { title: "Fresher's Welcome Party", content: "Join us this Friday at the Main Ground for the official Fresher's Welcome. Dinner provided!", cat: "events" },
        { title: "Library Book Return Deadline", content: "All issued books must be returned before the semester break starts on 15th.", cat: "academics" }
    ]
    for (const a of anns) {
        await supabase.from('announcements').insert({
            title: a.title,
            content: a.content,
            category: a.cat,
            target_audience: 'all',
            created_by: adminId
        })
    }

    console.log("🏆 Super Seed V2 Complete! High Quality Data Injected.")
}

superSeedV2()
