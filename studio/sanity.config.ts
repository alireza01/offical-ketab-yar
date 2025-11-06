import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
    name: 'default',
    title: 'Ketab-Yar CMS',

    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Books')
                            .icon(() => '📚')
                            .child(
                                S.documentTypeList('book')
                                    .title('Books')
                                    .filter('_type == "book"')
                            ),
                        S.listItem()
                            .title('Authors')
                            .icon(() => '✍️')
                            .child(
                                S.documentTypeList('author')
                                    .title('Authors')
                                    .filter('_type == "author"')
                            ),
                        S.listItem()
                            .title('Blog Posts')
                            .icon(() => '📝')
                            .child(
                                S.documentTypeList('blogPost')
                                    .title('Blog Posts')
                                    .filter('_type == "blogPost"')
                            ),
                        S.divider(),
                        ...S.documentTypeListItems().filter(
                            (listItem) =>
                                !['book', 'author', 'blogPost'].includes(listItem.getId() || '')
                        ),
                    ]),
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes,
    },
})
