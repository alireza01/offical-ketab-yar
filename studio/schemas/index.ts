// Object types (reusable)
import bilingualParagraph from './bilingualParagraph'
import bilingualPortableText from './bilingualPortableText'
import bilingualText from './bilingualText'
import chapter from './chapter'

// Document types
import author from './author'
import blogPost from './blogPost'
import book from './book'

export const schemaTypes = [
    // Object types first
    bilingualText,
    bilingualPortableText,
    bilingualParagraph,
    chapter,

    // Document types
    author,
    book,
    blogPost,
]
