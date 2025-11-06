import { defineType } from 'sanity'

export default defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Post Title',
            type: 'bilingualText',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title.en',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    validation: (Rule) => Rule.required(),
                },
            ],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'summary',
            title: 'Summary',
            type: 'bilingualText',
            validation: (Rule) => Rule.required().max(200),
        },
        {
            name: 'body',
            title: 'Body Content',
            type: 'bilingualPortableText',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Reading Tips', value: 'reading-tips' },
                    { title: 'Language Learning', value: 'language-learning' },
                    { title: 'Book Reviews', value: 'book-reviews' },
                    { title: 'Author Interviews', value: 'author-interviews' },
                    { title: 'Platform Updates', value: 'platform-updates' },
                ],
            },
        },
        {
            name: 'relatedBooks',
            title: 'Related Books',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'book' }] }],
            description: 'Books mentioned in this post (for internal linking)',
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
        {
            name: 'featured',
            title: 'Featured Post',
            type: 'boolean',
            initialValue: false,
        },
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleFa: 'title.fa',
            author: 'author.name',
            media: 'mainImage',
            featured: 'featured',
        },
        prepare({ titleEn, titleFa, author, media, featured }) {
            return {
                title: titleEn,
                subtitle: `${titleFa} • ${author || 'No author'}${featured ? ' ⭐' : ''}`,
                media,
            }
        },
    },
})
