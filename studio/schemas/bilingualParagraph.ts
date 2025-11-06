import { defineType } from 'sanity'

export default defineType({
    name: 'bilingualParagraph',
    title: 'Bilingual Paragraph',
    type: 'object',
    fields: [
        {
            name: 'english',
            title: 'English Paragraph',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                        ],
                    },
                },
            ],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'farsi',
            title: 'Persian Paragraph (پاراگراف فارسی)',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                        ],
                    },
                },
            ],
            validation: (Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            english: 'english',
            farsi: 'farsi',
        },
        prepare({ english, farsi }) {
            const enText = english?.[0]?.children?.[0]?.text || 'No English text'
            const faText = farsi?.[0]?.children?.[0]?.text || 'No Persian text'
            return {
                title: enText.substring(0, 50) + (enText.length > 50 ? '...' : ''),
                subtitle: faText.substring(0, 50) + (faText.length > 50 ? '...' : ''),
            }
        },
    },
})
