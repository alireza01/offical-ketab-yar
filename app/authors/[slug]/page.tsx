import { AuthorDetailClient } from '@/components/authors/author-detail-client'
import { sanityClient } from '@/lib/sanity/client'
import { authorBySlugQuery } from '@/lib/sanity/queries'
import { Metadata } from 'next'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'

interface AuthorPageProps {
    params: Promise<{
        slug: string
    }>
}

// Force static generation for SEO (Agent 1)
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

// Generate static params for all authors
export async function generateStaticParams() {
    try {
        const authors = await sanityClient.fetch(
            groq`*[_type == "author" && !(_id in path("drafts.**"))] { "slug": slug.current }`
        )
        return authors.map((author: any) => ({ slug: author.slug }))
    } catch (error) {
        console.error('Error generating static params:', error)
        return []
    }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
    try {
        const { slug } = await params
        const author = await sanityClient.fetch(authorBySlugQuery, { slug })

        if (!author) {
            return {
                title: 'Author Not Found | کتاب‌یار',
            }
        }

        return {
            title: `${author.name} - Author | کتاب‌یار`,
            description: `Explore books by ${author.name}. ${author.nationality ? `${author.nationality} author` : 'Author'} ${author.born ? `(${author.born})` : ''}.`,
            keywords: [author.name, 'author', 'books', 'نویسنده', ...(author.nationality ? [author.nationality] : [])],
            alternates: {
                canonical: `https://ketabyar.ir/authors/${slug}`,
            },
            openGraph: {
                title: `${author.name} - Author`,
                description: `Explore books by ${author.name}`,
                images: author.image ? [{ url: author.image, width: 400, height: 400, alt: author.name }] : [],
                type: 'profile',
                url: `https://ketabyar.ir/authors/${slug}`,
            },
        }
    } catch {
        return {
            title: 'Author Not Found | کتاب‌یار',
        }
    }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
    try {
        const { slug } = await params
        const author = await sanityClient.fetch(authorBySlugQuery, { slug })

        if (!author) {
            notFound()
        }

        // JSON-LD Person Schema for SEO (Agent 1)
        const personSchema = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author.name,
            image: author.image,
            nationality: author.nationality,
            birthDate: author.born,
            url: `https://ketabyar.ir/authors/${slug}`,
            sameAs: [
                author.website,
                author.socialMedia?.twitter,
                author.socialMedia?.instagram,
                author.socialMedia?.goodreads,
            ].filter(Boolean),
        }

        return (
            <>
                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />

                <AuthorDetailClient author={author} />
            </>
        )
    } catch (error) {
        console.error('Error loading author:', error)
        notFound()
    }
}
