
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

const LOCATIONS = ['Block A - Room 101', 'Block A - Room 202', 'Block B - 3rd Floor', 'Block C - Common Room', 'Mess Hall', 'Main Gate', 'Library', 'Block B - Room 305']
const CATEGORIES = ['electrical', 'plumbing', 'furniture', 'internet', 'cleaning', 'other']
const STATUSES = ['reported', 'in_progress', 'resolved', 'closed']
const PRIORITIES = ['low', 'medium', 'high']

async function superSeed() {
    console.log("🚀 Starting SUPER SEED for Winning Demo...")

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

    console.log("✅ Users Ready. Injecting Content...")

    // 2. Clear previous demo data (optional, but cleaner)
    await supabase.from('issues').delete().like('description', '%(Demo)%')
    await supabase.from('announcements').delete().like('content', '%(Demo)%')
    await supabase.from('lost_items').delete().like('description', '%(Demo)%')

    // 3. Create 20 Issues
    const issues = [
        { title: "Geyser Sparking", cat: "electrical", loc: "Block A - Room 101" },
        { title: "Tap Leaking continuously", cat: "plumbing", loc: "Block B - Bathroom" },
        { title: "WiFi Router Broken", cat: "internet", loc: "Block C - Corridor" },
        { title: "Broken Chair", cat: "furniture", loc: "Block A - Room 204" },
        { title: "Mess Food Cold", cat: "other", loc: "Mess Hall" },
        { title: "Water Cooler Dirty", cat: "cleaning", loc: "Block B - 2nd Floor" },
        { title: "Switchboard Hanging", cat: "electrical", loc: "Block A - Room 303" },
        { title: "Window Glass Broken", cat: "furniture", loc: "Block C - Room 105" },
        { title: "Tube light flickering", cat: "electrical", loc: "Block B - Room 102" },
        { title: "Flush not working", cat: "plumbing", loc: "Block A - Common Toilet" },
        { title: "Internet slow", cat: "internet", loc: "Library" },
        { title: "Door Lock Jammed", cat: "furniture", loc: "Block C - Room 202" },
        { title: "Garbage Pile up", cat: "cleaning", loc: "Block B - Entrance" },
        { title: "Fan making noise", cat: "electrical", loc: "Block A - Room 401" },
        { title: "Shower head missing", cat: "plumbing", loc: "Block B - Bathroom" },
    ]

    for (const i of issues) {
        await supabase.from('issues').insert({
            title: i.title,
            category: i.cat,
            location: i.loc,
            description: `Generated for Demo. Detailed description of ${i.title}. (Demo)`,
            status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
            priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
            user_id: studentId,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
        })
    }

    // 4. Create Lost & Found Items (Crucial!)
    const lostItems = [
        { title: "Blue Water Bottle", type: "lost", loc: "Library", img: "🥤" },
        { title: "Black Hoodie", type: "found", loc: "Mess Hall", img: "🧥" },
        { title: "Casio Watch", type: "lost", loc: "Block A Washroom", img: "⌚" },
        { title: "Calculus Textbook", type: "found", loc: "Common Room", img: "📘" },
        { title: "Hostel ID Card", type: "found", loc: "Main Gate", img: "🪪" }
    ]

    for (const item of lostItems) {
        await supabase.from('lost_items').insert({
            title: item.title,
            type: item.type,
            location: item.loc,
            description: `A ${item.title} was ${item.type} near ${item.loc}. (Demo)`,
            status: 'open',
            user_id: studentId, // Student reported
            image_url: item.img,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 500000000)).toISOString()
        })
    }

    // 5. Create Announcements
    const anns = [
        { title: "Power Cut Schedule", content: "Maintenance on Sunday 2PM-4PM. (Demo)", cat: "maintenance" },
        { title: "Fresher's Party", content: "Welcome party for new batch this Friday! (Demo)", cat: "events" },
        { title: "Library Due Date", content: "Return all books before semester break. (Demo)", cat: "academics" }
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

    console.log("🏆 Super Seed Complete! App is now populated.")
}

superSeed()
