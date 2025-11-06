import { defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Author Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Author Photo',
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
        },
        {
            name: 'nationality',
            title: 'Nationality',
            type: 'string',
        },
        {
            name: 'born',
            title: 'Birth Year',
            type: 'string',
            description: 'e.g., "1896" or "1896-1940"',
        },
        {
            name: 'bio',
            title: 'Biography',
            type: 'bilingualPortableText',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'website',
            title: 'Website',
            type: 'url',
        },
        {
            name: 'socialMedia',
            title: 'Social Media',
            type: 'object',
            fields: [
                {
                    name: 'twitter',
                    title: 'Twitter',
                    type: 'url',
                },
                {
                    name: 'instagram',
                    title: 'Instagram',
                    type: 'url',
                },
                {
                    name: 'goodreads',
                    title: 'Goodreads',
                    type: 'url',
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            nationality: 'nationality',
        },
        prepare({ title, media, nationality }) {
            return {
                title,
                subtitle: nationality || 'No nationality specified',
                media,
            }
        },
    },
})
