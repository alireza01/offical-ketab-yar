'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    addToSyncQueue,
    clearSyncQueue,
    deleteOfflineBook,
    downloadBookForOffline,
    getOfflineBook,
    getOfflineBooksList,
    getSyncQueue
} from '@/lib/pwa/offline-storage'
import { Database, Download, RefreshCw, Trash2, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface OfflineBookInfo {
    bookId: string
    language: string
    downloadedAt: string
}

interface SyncQueueItem {
    id: string
    type: string
    data: Record<string, unknown>
    timestamp: string
}

export default function PWATestPage() {
    const [isOnline, setIsOnline] = useState(true)
    const [offlineBooks, setOfflineBooks] = useState<OfflineBookInfo[]>([])
    const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([])
    const [testBookContent, setTestBookContent] = useState('')
    const [isPWAInstalled, setIsPWAInstalled] = useState(false)

    // Mock user ID for testing
    const TEST_USER_ID = 'test-user-123'

    useEffect(() => {
        // Check online status
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            toast.success('Back online!')
        }

        const handleOffline = () => {
            setIsOnline(false)
            toast.error('You are offline')
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Check if PWA is installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsPWAInstalled(true)
        }

        // Load offline books list
        loadOfflineBooks()
        loadSyncQueue()

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const loadOfflineBooks = async () => {
        const books = await getOfflineBooksList()
        setOfflineBooks(books)
    }

    const loadSyncQueue = async () => {
        const queue = await getSyncQueue()
        setSyncQueue(queue)
    }

    const handleDownloadTestBook = async () => {
        const sampleContent = `
# The Great Gatsby - Chapter 1

In my younger and more vulnerable years my father gave me some advice that I&apos;ve been turning over in my mind ever since.

&quot;Whenever you feel like criticizing any one,&quot; he told me, &quot;just remember that all the people in this world haven&apos;t had the advantages that you&apos;ve had.&quot;

He didn&apos;t say any more, but we&apos;ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I&apos;m inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.
    `.trim()

        toast.loading('Downloading book...')

        const result = await downloadBookForOffline(
            'great-gatsby',
            'en',
            sampleContent,
            TEST_USER_ID
        )

        if (result.success) {
            toast.success('Book downloaded for offline reading!')
            await loadOfflineBooks()
        } else {
            toast.error('Failed to download book: ' + result.error)
        }
    }

    const handleReadOfflineBook = async () => {
        toast.loading('Loading offline book...')

        const content = await getOfflineBook('great-gatsby', 'en', TEST_USER_ID)

        if (content) {
            setTestBookContent(content)
            toast.success('Book loaded from offline storage!')
        } else {
            toast.error('Book not found in offline storage')
        }
    }

    const handleDeleteOfflineBook = async (bookId: string, language: string) => {
        const lang = language as 'en' | 'fa'
        const success = await deleteOfflineBook(bookId.replace(`-${language}`, ''), lang)

        if (success) {
            toast.success('Book deleted from offline storage')
            await loadOfflineBooks()
            if (testBookContent) setTestBookContent('')
        } else {
            toast.error('Failed to delete book')
        }
    }

    const handleAddToQueue = async () => {
        await addToSyncQueue('xp', {
            bookId: 'great-gatsby',
            xpEarned: 50,
            pagesRead: 10,
            timestamp: new Date().toISOString()
        })

        toast.success('Added XP to sync queue')
        await loadSyncQueue()
    }

    const handleClearQueue = async () => {
        await clearSyncQueue()
        toast.success('Sync queue cleared')
        await loadSyncQueue()
    }

    return (
        <div className="container max-w-6xl py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">PWA Testing Dashboard</h1>
                <p className="text-muted-foreground">
                    Test Progressive Web App features including offline storage, sync queue, and more
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                        {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isOnline ? 'Online' : 'Offline'}</div>
                        <p className="text-xs text-muted-foreground">
                            {isOnline ? 'Connected to internet' : 'Working offline'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">PWA Status</CardTitle>
                        <Database className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isPWAInstalled ? 'Installed' : 'Browser'}</div>
                        <p className="text-xs text-muted-foreground">
                            {isPWAInstalled ? 'Running as app' : 'Running in browser'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offline Books</CardTitle>
                        <Download className="h-4 w-4 text-gold" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{offlineBooks.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Books available offline
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Test Actions */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Offline Book Storage</CardTitle>
                        <CardDescription>
                            Test downloading and reading books offline with encryption
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button onClick={handleDownloadTestBook} className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                Download Test Book
                            </Button>
                            <Button onClick={handleReadOfflineBook} variant="outline" className="flex-1">
                                Read Offline Book
                            </Button>
                        </div>

                        {offlineBooks.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Downloaded Books:</p>
                                {offlineBooks.map((book) => (
                                    <div key={book.bookId} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="text-sm font-medium">{book.bookId}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(book.downloadedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteOfflineBook(book.bookId, book.language)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sync Queue</CardTitle>
                        <CardDescription>
                            Test offline action queuing and syncing when back online
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button onClick={handleAddToQueue} variant="outline" className="flex-1">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Add Test Item
                            </Button>
                            <Button onClick={handleClearQueue} variant="destructive" className="flex-1">
                                Clear Queue
                            </Button>
                        </div>

                        {syncQueue.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Queue Items: {syncQueue.length}</p>
                                {syncQueue.slice(0, 5).map((item) => (
                                    <div key={item.id} className="p-2 border rounded">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="outline">{item.type}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                            {JSON.stringify(item.data, null, 2)}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Book Content Display */}
            {testBookContent && (
                <Card>
                    <CardHeader>
                        <CardTitle>Offline Book Content</CardTitle>
                        <CardDescription>
                            This content was loaded from encrypted IndexedDB storage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap bg-muted p-4 rounded">
                                {testBookContent}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Instructions */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>How to Test PWA Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">1. Test Offline Storage:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Click &quot;Download Test Book&quot; to store encrypted content in IndexedDB</li>
                            <li>Open DevTools → Application → IndexedDB → ketab-yar-offline</li>
                            <li>You&apos;ll see the encrypted book content (unreadable without decryption key)</li>
                            <li>Click &quot;Read Offline Book&quot; to decrypt and display the content</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">2. Test Offline Mode:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Open DevTools → Network → Check &quot;Offline&quot;</li>
                            <li>The connection status card will show &quot;Offline&quot;</li>
                            <li>Try reading the offline book - it should still work!</li>
                            <li>Add items to sync queue while offline</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">3. Test Service Worker:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Open DevTools → Application → Service Workers</li>
                            <li>You should see the service worker registered and running</li>
                            <li>Check the Cache Storage to see cached assets</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">4. Test PWA Installation:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Look for the install icon in your browser&apos;s address bar</li>
                            <li>Click it to install the app</li>
                            <li>The PWA Status card will show &quot;Installed&quot; when running as standalone app</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
