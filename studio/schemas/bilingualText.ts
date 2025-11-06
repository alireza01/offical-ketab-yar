import { defineType } from 'sanity'

export default defineType({
    name: 'bilingualText',
    title: 'Bilingual Text',
    type: 'object',
    fields: [
        {
            name: 'en',
            title: 'English',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'fa',
            title: 'Persian (فارسی)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            en: 'en',
            fa: 'fa',
        },
        prepare({ en, fa }) {
            return {
                title: en,
                subtitle: fa,
            }
        },
    },
})
