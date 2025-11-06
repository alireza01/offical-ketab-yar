import { defineType } from 'sanity'

export default defineType({
    name: 'book',
    title: 'Book',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Book Title',
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
            name: 'coverImage',
            title: 'Cover Image',
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
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'publishYear',
            title: 'Publication Year',
            type: 'number',
            validation: (Rule) => Rule.required().min(1000).max(new Date().getFullYear()),
        },
        {
            name: 'isbn',
            title: 'ISBN',
            type: 'string',
        },
        {
            name: 'publisher',
            title: 'Publisher',
            type: 'string',
        },
        {
            name: 'summary',
            title: 'Book Summary',
            type: 'bilingualText',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'genres',
            title: 'Genres',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Fiction', value: 'fiction' },
                    { title: 'Non-Fiction', value: 'non-fiction' },
                    { title: 'Science Fiction', value: 'sci-fi' },
                    { title: 'Fantasy', value: 'fantasy' },
                    { title: 'Mystery', value: 'mystery' },
                    { title: 'Thriller', value: 'thriller' },
                    { title: 'Romance', value: 'romance' },
                    { title: 'Horror', value: 'horror' },
                    { title: 'Biography', value: 'biography' },
                    { title: 'History', value: 'history' },
                    { title: 'Self-Help', value: 'self-help' },
                    { title: 'Business', value: 'business' },
                    { title: 'Classic', value: 'classic' },
                    { title: 'Poetry', value: 'poetry' },
                    { title: 'Drama', value: 'drama' },
                ],
            },
            validation: (Rule) => Rule.required().min(1),
        },
        {
            name: 'level',
            title: 'Reading Level',
            type: 'string',
            options: {
                list: [
                    { title: 'Beginner', value: 'beginner' },
                    { title: 'Intermediate', value: 'intermediate' },
                    { title: 'Advanced', value: 'advanced' },
                ],
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'chapters',
            title: 'Chapters',
            type: 'array',
            of: [{ type: 'chapter' }],
            validation: (Rule) => Rule.required().min(1),
        },
        {
            name: 'freePreviewPages',
            title: 'Free Preview Pages',
            type: 'number',
            description: 'Number of pages available for free preview',
            initialValue: 20,
            validation: (Rule) => Rule.required().min(0),
        },
        {
            name: 'isPremium',
            title: 'Premium Content',
            type: 'boolean',
            description: 'Requires subscription to read full book',
            initialValue: false,
        },
        {
            name: 'featured',
            title: 'Featured Book',
            type: 'boolean',
            description: 'Show on homepage',
            initialValue: false,
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleFa: 'title.fa',
            author: 'author.name',
            media: 'coverImage',
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
