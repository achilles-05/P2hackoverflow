
import { createClient } from '@supabase/supabase-js'

// Inline admin creation to avoid import issues if aliases fail
const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing.')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

async function seed() {
    try {
        console.log("Starting seed...")
        const supabase = createAdminClient()

        // 1. Get Users
        console.log("Fetching users...")
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError || !users || users.length === 0) {
            console.error('No users found. Please sign in at least one user first.')
            process.exit(1)
        }

        const studentA = users[0]
        const studentB = users.length > 1 ? users[1] : users[0]
        const studentC = users.length > 2 ? users[2] : studentB

        console.log(`Using Main User (Student A): ${studentA.email}`)

        // 2. Clear Database
        console.log("Clearing database...")
        await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('issues').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000')

        // 3. Seed Announcements
        console.log("Seeding announcements...")
        const announcements = [
            { title: "Hostel Maintenance Schedule", content: "Regular maintenance checks for electrical fittings will be conducted this weekend. Please secure your sensitive belongings.", category: "maintenance", created_by: studentA.id, created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
            { title: "Inter-Hostel Sports Meet", content: "The annual sports meet is scheduled for next month. Register your teams at the warden's office by Friday.", category: "events", created_by: studentA.id, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
            { title: "New Mess Timing Rules", content: "Dinner timings have been extended by 30 minutes. New timing: 7:30 PM to 9:30 PM effective immediately.", category: "rules", created_by: studentA.id, created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
            { title: "Wi-Fi Upgrade Notice", content: "Fiber optic cables are being laid in Block B. Internet connectivity might be intermittent on Tuesday.", category: "maintenance", created_by: studentA.id, created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
        ]
        await supabase.from('announcements').insert(announcements)

        // 4. Seed Public Issues (3 Items)
        console.log("Seeding public issues...")
        const publicIssuesInsert = [
            {
                user_id: studentB.id,
                title: "Corridor Light Fuse Blown",
                description: "The main light in the 2nd floor corridor of Block A is constantly flickering and causing disturbance.",
                category: "electrical",
                priority: "medium",
                status: "reported",
                location: "Block A, 2nd Floor Corridor",
                is_public: true,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
            },
            {
                user_id: studentC.id,
                title: "Water Cooler Leaking",
                description: "The RO Water Cooler in the common area is leaking water on the floor. Slipping hazard.",
                category: "plumbing",
                priority: "high",
                status: "assigned",
                assigned_to: "Plumber",
                location: "Block B, Common Area",
                is_public: true,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
            },
            {
                user_id: studentB.id,
                title: "Washing Machine #4 Malfunction",
                description: "The washing machine stops mid-cycle and makes a loud banging noise.",
                category: "electrical",
                priority: "low",
                status: "in_progress",
                assigned_to: "Electrician",
                location: "Block A, Laundry Room",
                is_public: true,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
            }
        ]
        const { data: insertedPublic, error: pubError } = await supabase.from('issues').insert(publicIssuesInsert).select()
        if (pubError) throw pubError

        // 5. Seed Private Issues (4 Items)
        console.log("Seeding private issues...")
        const privateIssuesInsert = [
            {
                user_id: studentA.id,
                title: "Study Table Broken Leg",
                description: "One leg of the study table in my room is wobbly. I cannot work properly.",
                category: "furniture",
                priority: "medium",
                status: "reported",
                location: "Block A, Room 101",
                is_public: false,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
            },
            {
                user_id: studentA.id,
                title: "Fan Making Weird Noise",
                description: "The ceiling fan is making a rhythmic ticking sound at high speeds.",
                category: "electrical",
                priority: "low",
                status: "assigned",
                assigned_to: "Electrician",
                location: "Block A, Room 101",
                is_public: false,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
            },
            {
                user_id: studentA.id,
                title: "LAN Port Not Working",
                description: "The ethernet port next to my bed is dead. No internet connection.",
                category: "internet",
                priority: "high",
                status: "in_progress",
                assigned_to: "Network Tech",
                location: "Block A, Room 101",
                is_public: false,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
            },
            {
                user_id: studentA.id,
                title: "Bathroom Tap Leak",
                description: "Constant dripping from the tap even when tightly closed.",
                category: "plumbing",
                priority: "medium",
                status: "resolved",
                location: "Block A, Room 101",
                is_public: false,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString()
            }
        ]
        await supabase.from('issues').insert(privateIssuesInsert)

        // 6. Seed Comments
        console.log("Seeding comments...")
        if (insertedPublic && insertedPublic.length > 0) {
            const comments = [
                {
                    issue_id: insertedPublic[0].id,
                    user_id: studentC.id,
                    content: "I noticed this too. It's very distracting."
                },
                {
                    issue_id: insertedPublic[0].id,
                    user_id: studentA.id,
                    content: "Has anyone reported this to the warden yet?"
                },
                {
                    issue_id: insertedPublic[1].id,
                    user_id: studentA.id,
                    content: "This is dangerous, someone could slip."
                }
            ]
            await supabase.from('comments').insert(comments)
        }

        console.log("Seeding complete!")
    } catch (error: any) {
        console.error("Error seeding:", error.message)
        process.exit(1)
    }
}

seed()
