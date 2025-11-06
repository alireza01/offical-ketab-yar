import { FileEdit } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    icon: FileEdit,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'seo', title: 'SEO' },
        { name: 'settings', title: 'Settings' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'object',
            group: 'content',
            fields: [
                { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
                { name: 'fa', title: 'Persian (فارسی)', type: 'string' },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            options: {
                source: 'title.en',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'object',
            group: 'content',
            fields: [
                { name: 'en', title: 'English', type: 'text', rows: 3 },
                { name: 'fa', title: 'Persian (فارسی)', type: 'text', rows: 3 },
            ],
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            group: 'content',
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
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H1', value: 'h1' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    lists: [
                        { title: 'Bullet', value: 'bullet' },
                        { title: 'Numbered', value: 'number' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                            { title: 'Code', value: 'code' },
                            { title: 'Underline', value: 'underline' },
                            { title: 'Strike', value: 'strike-through' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'External Link',
                                fields: [
                                    {
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                        validation: (Rule) =>
                                            Rule.uri({
                                                scheme: ['http', 'https', 'mailto', 'tel'],
                                            }),
                                    },
                                    {
                                        title: 'Open in new tab',
                                        name: 'blank',
                                        type: 'boolean',
                                    },
                                ],
                            },
                            {
                                name: 'internalLink',
                                type: 'object',
                                title: 'Internal Link',
                                fields: [
                                    {
                                        name: 'reference',
                                        type: 'reference',
                                        title: 'Reference',
                                        to: [{ type: 'book' }, { type: 'blogPost' }, { type: 'author' }],
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alt Text',
                        },
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            group: 'content',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            group: 'content',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Book Reviews', value: 'book-reviews' },
                    { title: 'Language Learning', value: 'language-learning' },
                    { title: 'Reading Tips', value: 'reading-tips' },
                    { title: 'Author Interviews', value: 'author-interviews' },
                    { title: 'News', value: 'news' },
                ],
            },
        }),
        defineField({
            name: 'relatedBooks',
            title: 'Related Books',
            type: 'array',
            group: 'content',
            of: [{ type: 'reference', to: [{ type: 'book' }] }],
            description: 'Books mentioned or related to this post (great for internal linking)',
        }),

        // SEO Fields
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo',
            description: 'Override default title for search engines (50-60 characters)',
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            group: 'seo',
            rows: 3,
            description: 'Meta description for search engines (150-160 characters)',
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

        // Settings
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            group: 'settings',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'settings',
            initialValue: false,
            description: 'Show on homepage',
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
                ],
                layout: 'radio',
            },
            initialValue: 'draft',
        }),
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleFa: 'title.fa',
            media: 'mainImage',
            status: 'status',
        },
        prepare(selection) {
            const { titleEn, titleFa, status } = selection
            const statusEmoji = status === 'published' ? '✅' : '📝'
            return {
                ...selection,
                title: `${statusEmoji} ${titleEn}`,
                subtitle: titleFa || 'No Persian title',
            }
        },
    },
})
