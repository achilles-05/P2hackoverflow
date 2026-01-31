'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reportLostItem(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const contactInformation = formData.get('contact_info') as string

    const { error } = await supabase
        .from('lost_items')
        .insert({
            user_id: user.id,
            title,
            location,
            description,
            type,
            status: 'open',
            contact_info: contactInformation,
            image_url: type === 'lost' ? '❓' : '🧥'
        })

    if (error) {
        console.error("Report Item Error:", error)
        return { error: error.message }
    }

    revalidatePath('/lost-found')
    return { success: true }
}

export async function getLostItems() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Fetch Lost Items Error:", error)
        return []
    }

    return data
}

export async function claimItem(itemId: string, remarks: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('lost_items')
        .update({
            status: 'claimed',
            description: `Claimed by ${user.email}. Remarks: ${remarks}`
        })
        .eq('id', itemId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/lost-found')
    return { success: true }
}