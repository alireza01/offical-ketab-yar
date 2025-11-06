import { defineType } from 'sanity'

export default defineType({
    name: 'chapter',
    title: 'Chapter',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Chapter Title',
            type: 'bilingualText',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'chapterNumber',
            title: 'Chapter Number',
            type: 'number',
            validation: (Rule) => Rule.required().min(1),
        },
        {
            name: 'content',
            title: 'Chapter Content',
            type: 'array',
            of: [
                { type: 'bilingualParagraph' },
                {
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
                        {
                            name: 'caption',
                            type: 'bilingualText',
                            title: 'Caption',
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.required().min(1),
        },
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleFa: 'title.fa',
            chapterNumber: 'chapterNumber',
        },
        prepare({ titleEn, titleFa, chapterNumber }) {
            return {
                title: `Chapter ${chapterNumber}: ${titleEn}`,
                subtitle: titleFa,
            }
        },
    },
})
