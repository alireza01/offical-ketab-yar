/**
 * UNIFIED DATA API
 * 
 * This module provides a single interface for data access using Sanity CMS.
 * Agent 1 (SEO) - Optimized for static generation
 * Agent 2 (Performance) - Efficient queries, no mock data overhead
 */

// Re-export everything from the unified data/index.ts (Sanity CMS)
export * from './data/index'

// Note: Supabase queries are imported directly where needed
// export { getUserReadingProgress, updateReadingProgress } from './supabase/queries/reading-progress'

export {
    addVocabularyWord,
    deleteVocabularyWord,
    getUserVocabulary
} from './supabase/queries/vocabulary'

