import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const slug = searchParams.get('slug')
    const type = searchParams.get('type') || 'book'

    // Check the secret
    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
        return new Response('Invalid token', { status: 401 })
    }

    // Check if slug is provided
    if (!slug) {
        return new Response('Missing slug', { status: 400 })
    }

    // Enable Draft Mode
    const draft = await draftMode()
    draft.enable()

    // Redirect to the path from the fetched post
    const redirectPath = type === 'author' ? `/authors/${slug}` : `/books/${slug}`
    redirect(redirectPath)
}
