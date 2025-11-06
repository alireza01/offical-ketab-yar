import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Add New Book | Admin',
    description: 'Add a new book to the library',
}

export default async function NewBookPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
            <p className="text-muted-foreground">
                This page is under construction. Please use the Sanity Studio to add books.
            </p>
        </div>
    )
}
