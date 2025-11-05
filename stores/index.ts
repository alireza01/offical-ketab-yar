/**
 * Stores Index - Central Export
 * All Zustand stores for Ketab-Yar platform
 */

// Core Stores
export { useAuthStore } from './auth-store'
export type { UserProfile } from './auth-store'

export { useReaderStore } from './reader-store'
export type {
    FontFamily,
    FontSize, Language, LineHeight, ReaderTheme, ReadingMode, TextAlign
} from './reader-store'

export { useLibraryStore } from './library-store'
export type { BookStatus, LibraryBook } from './library-store'

export { useModal, useSidebar, useToast, useUIStore } from './ui-store'
export type { ModalType } from './ui-store'

export { useGamificationStore } from './gamification-store'

export { useVocabularyStore } from './vocabulary-store'
export type { VocabularyStats } from './vocabulary-store'

export { useOfflineQueueStore, useOfflineSync } from './offline-queue-store'
export type { QueuedOperationType } from './offline-queue-store'

