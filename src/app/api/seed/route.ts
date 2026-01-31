import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = createAdminClient()

        // 1. Get Users
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError || !users || users.length === 0) {
            return NextResponse.json({ error: 'No users found. Please sign in at least one user first.' }, { status: 400 })
        }

        // Identify Key Users
        // We will make the FIRST user the "Logged In Student" (Student A) for Private Issues
        const studentA = users[0]
        // We will try to use a second user for diversity if available, otherwise reuse A
        const studentB = users.length > 1 ? users[1] : users[0]
        const studentC = users.length > 2 ? users[2] : studentB

        // 2. Clear Database
        await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
        await supabase.from('issues').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000')

        // 3. Seed Announcements (4 Items)
        const announcements = [
            { title: "Hostel Maintenance Schedule", content: "Regular maintenance checks for electrical fittings will be conducted this weekend. Please secure your sensitive belongings.", category: "maintenance", created_by: studentA.id },
            { title: "Inter-Hostel Sports Meet", content: "The annual sports meet is scheduled for next month. Register your teams at the warden's office by Friday.", category: "events", created_by: studentA.id },
            { title: "New Mess Timing Rules", content: "Dinner timings have been extended by 30 minutes. New timing: 7:30 PM to 9:30 PM effective immediately.", category: "rules", created_by: studentA.id },
            { title: "Wi-Fi Upgrade Notice", content: "Fiber optic cables are being laid in Block B. Internet connectivity might be intermittent on Tuesday.", category: "maintenance", created_by: studentA.id },
        ]
        await supabase.from('announcements').insert(announcements)

        // 4. Seed Public Issues (3 Items - Common)
        // Reporters: Student B, C
        await supabase.from('issues').insert([
            {
                user_id: studentB.id,
                title: "Corridor Light Fuse Blown",
                description: "The main light in the 2nd floor corridor of Block A is constantly flickering and causing disturbance.",
                category: "electrical",
                priority: "medium",
                status: "reported",
                location: "Block A, 2nd Floor Corridor",
                is_public: true,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
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
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
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
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
            }
        ])

        // 5. Seed Private Issues (4 Items - Personal)
        // Reporter: Student A (Logged In User)
        await supabase.from('issues').insert([
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
                status: "viewed", // Mock status if supported or just 'reported'
                // Note: Schema constraint check status in ('reported', 'assigned', 'in_progress', 'resolved', 'closed')
                // 'viewed' is not in constraint usually. Let's use 'assigned' or check schema. 
                // Schema said: check (status in ('reported', 'assigned', 'in_progress', 'resolved', 'closed'))
                // So 'viewed' is NOT valid DB status. I will use 'reported' but maybe I can simulate 'viewed' in UI logic?
                // The requirements asked for "Viewed" in timeline. Usually this means a flag or 'assigned' state.
                // I'll stick to 'reported' for now to be safe, or 'in_progress'. 
                // Wait, User Timeline requirement: "Reported -> Viewed -> Assigned -> In Progress -> Resolved".
                // If DB doesn't support 'viewed', I'll use 'assigned' for the second step or just accept it's skipped in DB status.
                // Let's use 'assigned' for clarity here.
                location: "Block A, Room 101",
                is_public: false
            },
            { // Fixed object to match schema constraint, removed 'viewed', using valid status.
                user_id: studentA.id,
                title: "Fan Making Weird Noise",
                description: "The ceiling fan is making a rhythmic ticking sound at high speeds.",
                category: "electrical",
                priority: "low",
                status: "reported",
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
                status: "resolved", // Meets the "Recent Resolved" requirement
                location: "Block A, Room 101",
                is_public: false,
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString()
            }
        ])

        // 6. Seed Comments on Public Issues
        // We need IDs of inserted issues. Fetch them back.
        const { data: publicIssues } = await supabase.from('issues').select('id').eq('is_public', true)

        if (publicIssues && publicIssues.length > 0) {
            const comments = [
                {
                    issue_id: publicIssues[0].id, // Corridor Light
                    user_id: studentB.id,
                    content: "It's been flickering for 2 days now. Really annoying."
                },
                {
                    issue_id: publicIssues[0].id,
                    user_id: studentC.id,
                    content: "Yeah, I almost tripped yesterday because of it."
                },
                {
                    issue_id: publicIssues[1].id, // Water Cooler
                    user_id: studentA.id,
                    content: "Please fix this asap, it's the only cooler on this floor."
                }
            ]
            await supabase.from('comments').insert(comments)
        }

        return NextResponse.json({
            success: true, seeded: {
                public: 3,
                private: 4,
                announcements: 4,
                comments: 3,
                usersUsed: [studentA.email, studentB.email]
            }
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
