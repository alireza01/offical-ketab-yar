import { BookOpen } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'book',
    title: 'Book',
    type: 'document',
    icon: BookOpen,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'metadata', title: 'Metadata' },
        { name: 'seo', title: 'SEO' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
        // ============================================
        // BASIC INFO
        // ============================================
        defineField({
            name: 'title',
            title: 'Title',
            type: 'object',
            group: 'metadata',
            fields: [
                { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
                { name: 'fa', title: 'Persian (فارسی)', type: 'string', validation: (Rule) => Rule.required() },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'metadata',
            options: {
                source: 'title.en',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'object',
            group: 'metadata',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'fa', title: 'Persian (فارسی)', type: 'string' },
            ],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            group: 'metadata',
            to: [{ type: 'author' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            group: 'metadata',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    description: 'Important for SEO and accessibility',
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'summary',
            title: 'Summary',
            type: 'object',
            group: 'metadata',
            fields: [
                { name: 'en', title: 'English', type: 'text', rows: 5 },
                { name: 'fa', title: 'Persian (فارسی)', type: 'text', rows: 5 },
            ],
        }),

        // ============================================
        // PUBLICATION INFO
        // ============================================
        defineField({
            name: 'publishYear',
            title: 'Publication Year',
            type: 'number',
            group: 'metadata',
        }),
        defineField({
            name: 'isbn',
            title: 'ISBN',
            type: 'string',
            group: 'metadata',
        }),
        defineField({
            name: 'publisher',
            title: 'Publisher',
            type: 'string',
            group: 'metadata',
        }),
        defineField({
            name: 'genres',
            title: 'Genres',
            type: 'array',
            group: 'metadata',
            of: [{ type: 'reference', to: [{ type: 'genre' }] }],
            validation: (Rule) => Rule.min(1).error('At least one genre is required'),
        }),
        defineField({
            name: 'level',
            title: 'Reading Level',
            type: 'string',
            group: 'metadata',
            options: {
                list: [
                    { title: 'Beginner (A1-A2)', value: 'beginner' },
                    { title: 'Intermediate (B1-B2)', value: 'intermediate' },
                    { title: 'Advanced (C1-C2)', value: 'advanced' },
                ],
            },
        }),

        // ============================================
        // BOOK CONTENT (CHAPTERS)
        // ============================================
        defineField({
            name: 'chapters',
            title: 'Chapters',
            type: 'array',
            group: 'content',
            of: [{ type: 'chapter' }],
            validation: (Rule) => Rule.required().min(1).error('Book must have at least one chapter'),
        }),

        // ============================================
        // SEO FIELDS
        // ============================================
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'object',
            group: 'seo',
            description: 'Override default title for search engines (recommended: 50-60 characters)',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'fa', title: 'Persian (فارسی)', type: 'string' },
            ],
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'object',
            group: 'seo',
            description: 'Meta description for search engines (recommended: 150-160 characters)',
            fields: [
                { name: 'en', title: 'English', type: 'text', rows: 3 },
                { name: 'fa', title: 'Persian (فارسی)', type: 'text', rows: 3 },
            ],
        }),
        defineField({
            name: 'seoKeywords',
            title: 'SEO Keywords',
            type: 'array',
            group: 'seo',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),

        // ============================================
        // SETTINGS
        // ============================================
        defineField({
            name: 'freePreviewPages',
            title: 'Free Preview Pages',
            type: 'number',
            group: 'settings',
            initialValue: 20,
            description: 'Number of pages free users can read',
        }),
        defineField({
            name: 'isPremium',
            title: 'Premium Only',
            type: 'boolean',
            group: 'settings',
            initialValue: false,
            description: 'Require premium subscription to read',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'settings',
            initialValue: false,
            description: 'Show on homepage and featured sections',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            group: 'settings',
            options: {
                list: [
                    { title: '📝 Draft', value: 'draft' },
                    { title: '✅ Published', value: 'published' },
                    { title: '📦 Archived', value: 'archived' },
                ],
                layout: 'radio',
            },
            initialValue: 'draft',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            group: 'settings',
            description: 'When this book was published on the platform',
        }),
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleFa: 'title.fa',
            author: 'author.name',
            media: 'coverImage',
            status: 'status',
        },
        prepare(selection) {
            const { titleEn, titleFa, author, status } = selection
            const statusEmoji = status === 'published' ? '✅' : status === 'archived' ? '📦' : '📝'
            return {
                ...selection,
                title: `${statusEmoji} ${titleEn}`,
                subtitle: `${titleFa} • by ${author || 'Unknown'}`,
            }
        },
    },
})
