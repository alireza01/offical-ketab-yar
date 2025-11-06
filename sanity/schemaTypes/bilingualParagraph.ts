import { Languages } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'bilingualParagraph',
    title: 'Bilingual Paragraph',
    type: 'object',
    icon: Languages,
    fields: [
        defineField({
            name: 'english',
            title: 'English Text',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'Heading 1', value: 'h1' },
                        { title: 'Heading 2', value: 'h2' },
                        { title: 'Heading 3', value: 'h3' },
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
                            { title: 'Underline', value: 'underline' },
                            { title: 'Strike', value: 'strike-through' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [
                                    {
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'farsi',
            title: 'Persian Text (فارسی)',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'Heading 1', value: 'h1' },
                        { title: 'Heading 2', value: 'h2' },
                        { title: 'Heading 3', value: 'h3' },
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
                            { title: 'Underline', value: 'underline' },
                            { title: 'Strike', value: 'strike-through' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [
                                    {
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'alignment',
            title: 'Text Alignment',
            type: 'string',
            options: {
                list: [
                    { title: 'Left', value: 'left' },
                    { title: 'Center', value: 'center' },
                    { title: 'Right', value: 'right' },
                    { title: 'Justify', value: 'justify' },
                ],
                layout: 'radio',
            },
            initialValue: 'justify',
        }),
        defineField({
            name: 'pageBreakAfter',
            title: 'Page Break After',
            type: 'boolean',
            description: 'Add a page break after this paragraph',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            english: 'english',
            farsi: 'farsi',
        },
        prepare(selection) {
            const { english, farsi } = selection
            const englishText = english?.[0]?.children?.[0]?.text || 'No English text'
            const farsiText = farsi?.[0]?.children?.[0]?.text || 'No Persian text'
            return {
                title: englishText.substring(0, 60) + (englishText.length > 60 ? '...' : ''),
                subtitle: farsiText.substring(0, 60) + (farsiText.length > 60 ? '...' : ''),
            }
        },
    },
})
