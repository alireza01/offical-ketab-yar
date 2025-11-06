import { FileText } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'chapter',
    title: 'Chapter',
    type: 'object',
    icon: FileText,
    fields: [
        defineField({
            name: 'title',
            title: 'Chapter Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
                { name: 'fa', title: 'Persian (فارسی)', type: 'string', validation: (Rule) => Rule.required() },
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'chapterNumber',
            title: 'Chapter Number',
            type: 'number',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'content',
            title: 'Chapter Content',
            type: 'array',
            of: [
                { type: 'bilingualParagraph' },
                {
                    type: 'image',
                    fields: [
                        {
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                        },
                        {
                            name: 'caption',
                            title: 'Caption',
                            type: 'object',
                            fields: [
                                { name: 'en', title: 'English', type: 'string' },
                                { name: 'fa', title: 'Persian', type: 'string' },
                            ],
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.required().min(1),
        }),
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleFa: 'title.fa',
            chapterNumber: 'chapterNumber',
        },
        prepare(selection) {
            const { titleEn, titleFa, chapterNumber } = selection
            return {
                title: `Chapter ${chapterNumber}: ${titleEn}`,
                subtitle: titleFa,
            }
        },
    },
})
