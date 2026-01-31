'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardStats() {
    const supabase = await createClient()

    const [issuesResult, announcementsResult] = await Promise.all([
        supabase.from('issues').select(`
            id, status, created_at, category, location, title,
            profiles:user_id (full_name, role, hostel_block, room_no)
        `).order('created_at', { ascending: false }),
        supabase.from('announcements').select('id, title, created_at').order('created_at', { ascending: false }).limit(5)
    ])

    const issues = issuesResult.data || []
    const totalIssues = issues.length
    const pendingIssues = issues.filter(i => ['reported', 'assigned', 'in_progress'].includes(i.status)).length
    const resolvedIssues = issues.filter(i => ['resolved', 'closed'].includes(i.status)).length

    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0

    const blocks = ['Block A', 'Block B', 'Block C', 'Other']
    const categories = ['electrical', 'plumbing', 'furniture', 'internet', 'other']

    const densityData = blocks.map(block => {
        const blockIssues = issues.filter(i => {
            const loc = (i.location || '').toLowerCase()
            const b = block.toLowerCase().replace(' ', '')
            if (block === 'Other') return !loc.includes('block')
            return loc.includes(b) || loc.includes(block.toLowerCase())
        })

        const counts: any = { name: block, total: blockIssues.length }
        categories.forEach(cat => {
            counts[cat] = blockIssues.filter(i => (i.category || 'other').toLowerCase() === cat).length
        })
        return counts
    })

    const overviewData = categories.map(cat => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        total: issues.filter(i => (i.category || 'other').toLowerCase() === cat).length,
        fill: cat === 'electrical' ? '#3B6064' :
            cat === 'plumbing' ? '#55828B' :
                cat === 'furniture' ? '#87BBA2' :
                    cat === 'internet' ? '#C9E4CA' :
                        '#E8F3E8'
    })).filter(x => x.total > 0)

    const responseTimeTrend = [
        { name: 'Mon', time: 4.2 },
        { name: 'Tue', time: 3.5 },
        { name: 'Wed', time: 2.8 },
        { name: 'Thu', time: 2.4 },
        { name: 'Fri', time: 2.1 },
        { name: 'Sat', time: 1.8 },
        { name: 'Sun', time: 1.5 },
    ]
    const avgResponseTime = "2.4 hrs"

    const recentActivity: any[] = []

    const latestReported = issues.find(i => i.status === 'reported')
    if (latestReported) {
        const reporterName = (latestReported.profiles as { full_name: string })?.full_name || 'Student'
        recentActivity.push({
            id: latestReported.id,
            action: `New Issue Reported`,
            target: `"${latestReported.title}" by ${reporterName} (${latestReported.location})`,
            time: latestReported.created_at,
            type: 'issue_reported'
        })
    }

    const latestResolved = issues.find(i => i.status === 'resolved' || i.status === 'closed')
    if (latestResolved) {
        recentActivity.push({
            id: latestResolved.id,
            action: `Issue Resolved`,
            target: `"${latestResolved.title}" - Fixed`,
            time: latestResolved.created_at,
            type: 'issue_resolved'
        })
    }

    const latestAnnouncements = announcementsResult.data?.slice(0, 2) || []
    latestAnnouncements.forEach((ann: any) => {
        recentActivity.push({
            id: ann.id,
            action: `Announcement Posted`,
            target: `"${ann.title}"`,
            time: ann.created_at,
            type: 'announcement'
        })
    })

    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return {
        stats: {
            total: totalIssues,
            pending: pendingIssues,
            resolved: resolvedIssues,
            resolutionRate,
            avgResponse: avgResponseTime
        },
        recentActivity,
        announcements: announcementsResult.data || [],
        chartData: {
            density: densityData,
            overview: overviewData,
            responseTime: responseTimeTrend
        }
    }
}