import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'bio',
            title: 'Biography',
            type: 'text',
            rows: 5,
        }),
        defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'birthYear',
            title: 'Birth Year',
            type: 'number',
        }),
        defineField({
            name: 'nationality',
            title: 'Nationality',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'photo',
        },
    },
})
