'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resetDatabase } from '@/lib/storage/offline-storage'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function ResetDatabasePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleReset = async () => {
        setStatus('loading')
        setMessage('Resetting database...')

        try {
            await resetDatabase()
            setStatus('success')
            setMessage('Database reset successfully! Please refresh the page.')
        } catch (error) {
            setStatus('error')
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Reset IndexedDB Database
                    </CardTitle>
                    <CardDescription>
                        This will delete and recreate the offline database with the correct schema.
                        Use this if you're experiencing IndexedDB errors.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'idle' && (
                        <Button onClick={handleReset} size="lg" className="w-full">
                            Reset Database
                        </Button>
                    )}

                    {status === 'loading' && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>{message}</span>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span>{message}</span>
                            </div>
                            <Button
                                onClick={() => window.location.href = '/'}
                                size="lg"
                                className="w-full"
                            >
                                Go to Homepage
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-5 h-5" />
                                <span>{message}</span>
                            </div>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> This will clear all offline data including liked books,
                            reading progress, vocabulary, and highlights that haven't been synced to your account.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
