import { type SchemaTypeDefinition } from 'sanity'

import author from './author'
import bilingualParagraph from './bilingualParagraph'
import blogPost from './blogPost'
import book from './book'
import chapter from './chapter'
import genre from './genre'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    book,
    author,
    genre,
    blogPost,
    // Objects
    chapter,
    bilingualParagraph,
  ],
}
