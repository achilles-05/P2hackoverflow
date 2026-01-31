'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        let message = error.message
        if (message === 'Invalid login credentials') {
            message = 'Invalid credentials. If this is a demo account, please Sign Up first.'
        }
        return redirect('/login?error=' + encodeURIComponent(message))
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

    const userRole = profile?.role || 'student'

    const cookieStore = await cookies()
    cookieStore.set('user_role', userRole)

    revalidatePath('/', 'layout')

    if (userRole === 'admin') {
        redirect('/admin')
    } else {
        redirect('/dashboard')
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const fullName = formData.get('full_name') as string
    const userRole = formData.get('role') as string || 'student'
    const hostelBlock = formData.get('hostel_block') as string || 'Block A'
    const roomNum = formData.get('room_no') as string || '101'

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: userRole,
            }
        }
    })

    if (authError) {
        return redirect('/login?error=' + encodeURIComponent(authError.message))
    }

    if (authData.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                email: email,
                role: userRole,
                full_name: fullName,
                hostel_block: hostelBlock,
                room_no: roomNum
            })

        if (profileError) {
            console.error('Profile Creation Error:', profileError)
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=' + encodeURIComponent('Account created! Please log in.'))
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}