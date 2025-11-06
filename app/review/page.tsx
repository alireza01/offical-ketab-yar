import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Review Books | Ketab-Yar',
    description: 'Review and rate books you have read',
}

export default async function ReviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Review Books</h1>
            <p className="text-muted-foreground">
                This page is under construction. You can review books from the book detail pages.
            </p>
        </div>
    )
}
