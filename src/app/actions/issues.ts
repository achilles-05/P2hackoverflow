'use server'

import { createClient } from '@/utils/supabase/server'

export async function getUserIssues() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Fetch User Issues Error:", error)
        return []
    }
    return data
}

export async function getAllIssues() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('issues')
        .select(`
            *,
            profiles(full_name, room_no, hostel_block)
        `)
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}

export async function getPublicIssues() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('issues')
        .select(`
            *,
            profiles(full_name, room_no, hostel_block)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

    if (error) return []
    return data
}

export async function updateIssue(id: string, updates: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('issues')
        .update(updates)
        .eq('id', id)

    if (error) return { error: error.message }
    return { success: true }
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) return null
    return data
}

export async function createIssue(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const priority = formData.get("priority") as string
    const location = formData.get("location") as string
    const isPublic = formData.get("isPublic") === "true"

    const { error } = await supabase
        .from('issues')
        .insert({
            title,
            description,
            category,
            priority,
            location,
            is_public: isPublic,
            status: 'reported',
            user_id: user.id
        })

    if (error) {
        console.error("Create Issue Error:", error)
        return { error: error.message }
    }

    return { success: true }
}

export async function getComments(issueId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('comments')
        .select(`
            *,
            profiles(full_name, role)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true })

    return data || []
}

export async function addComment(issueId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('comments')
        .insert({
            issue_id: issueId,
            user_id: user.id,
            content
        })

    if (error) return { error: error.message }
    return { success: true }
}