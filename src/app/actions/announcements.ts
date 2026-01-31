'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Forbidden' }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const targetAudience = formData.get('target') as string

    const { error } = await supabase
        .from('announcements')
        .insert({
            title,
            content,
            category,
            target_audience: targetAudience,
            created_by: user.id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/announcements')
    revalidatePath('/dashboard')

    return { success: true }
}

export async function getAnnouncements() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('announcements')
        .select(`
            *,
            profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(4)

    if (error) return []

    return data
}

export async function deleteAnnouncement(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase.from('announcements').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/announcements')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateAnnouncement(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string

    const { error } = await supabase
        .from('announcements')
        .update({ title, content, category })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/announcements')
    revalidatePath('/dashboard')
    return { success: true }
}