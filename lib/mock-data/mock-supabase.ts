/**
 * Complete mock Supabase client for local development
 * Returns realistic data without any database connection
 * Easy to remove when deploying - just delete lib/mock-data folder
 */

import {
    mockBookContent,
    mockBooks,
    mockComments,
    mockUser,
    mockUserLibrary,
    mockVocabulary,
} from './books'

// Helper to simulate async delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms))

export const createMockSupabaseClient = () => {
    const currentUser = mockUser
    let isAuthenticated = false

    return {
        auth: {
            getUser: async () => {
                await delay(50)
                return {
                    data: { user: isAuthenticated ? currentUser : null },
                    error: null,
                }
            },
            signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
                await delay(200)
                if (email && password) {
                    isAuthenticated = true
                    return {
                        data: { user: currentUser, session: { access_token: 'mock-token' } },
                        error: null,
                    }
                }
                return {
                    data: { user: null, session: null },
                    error: { message: 'Invalid credentials' },
                }
            },
            signUp: async ({ email, password }: { email: string; password: string }) => {
                await delay(200)
                if (email && password) {
                    isAuthenticated = true
                    return {
                        data: { user: currentUser, session: { access_token: 'mock-token' } },
                        error: null,
                    }
                }
                return {
                    data: { user: null, session: null },
                    error: { message: 'Signup failed' },
                }
            },
            signOut: async () => {
                await delay(100)
                isAuthenticated = false
                return { error: null }
            },
            getSession: async () => {
                await delay(50)
                return {
                    data: {
                        session: isAuthenticated ? { access_token: 'mock-token' } : null,
                    },
                    error: null,
                }
            },
        },

        from: (table: string) => {
            interface Filter {
                column: string
                op: string
                value: unknown
            }

            interface Order {
                column: string
                ascending: boolean
            }

            const queryBuilder = {
                _filters: [] as Filter[],
                _limit: 100,
                _order: null as Order | null,
                _single: false,

                select: function () {
                    return this
                },

                eq: function (column: string, value: unknown) {
                    this._filters.push({ column, op: 'eq', value })
                    return this
                },

                neq: function (column: string, value: unknown) {
                    this._filters.push({ column, op: 'neq', value })
                    return this
                },

                in: function (column: string, values: unknown[]) {
                    this._filters.push({ column, op: 'in', value: values })
                    return this
                },

                not: function (column: string, op: string, value: unknown) {
                    this._filters.push({ column, op: 'not', value: { op, value } })
                    return this
                },

                gte: function (column: string, value: unknown) {
                    this._filters.push({ column, op: 'gte', value })
                    return this
                },

                lte: function (column: string, value: unknown) {
                    this._filters.push({ column, op: 'lte', value })
                    return this
                },

                gt: function (column: string, value: unknown) {
                    this._filters.push({ column, op: 'gt', value })
                    return this
                },

                lt: function (column: string, value: unknown) {
                    this._filters.push({ column, op: 'lt', value })
                    return this
                },

                order: function (column: string, options?: { ascending?: boolean }) {
                    this._order = { column, ascending: options?.ascending !== false }
                    return this
                },

                limit: function (count: number) {
                    this._limit = count
                    return this
                },

                single: function () {
                    this._single = true
                    return this
                },

                then: async function (resolve: (value: { data: unknown; error: unknown }) => void) {
                    await delay(100)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let data: any = null

                    // Books table
                    if (table === 'books') {
                        data = [...mockBooks]

                        // Apply filters
                        this._filters.forEach((filter) => {
                            if (filter.op === 'eq') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] === filter.value)
                            } else if (filter.op === 'neq') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] !== filter.value)
                            } else if (filter.op === 'in') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => Array.isArray(filter.value) && filter.value.includes(item[filter.column]))
                            } else if (filter.op === 'not') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const notFilter = filter.value as any
                                if (notFilter.op === 'is' && notFilter.value === null) {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    data = data.filter((item: any) => item[filter.column] !== null && item[filter.column] !== undefined)
                                }
                            } else if (filter.op === 'gte') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] >= (filter.value as any))
                            } else if (filter.op === 'lte') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] <= (filter.value as any))
                            } else if (filter.op === 'gt') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] > (filter.value as any))
                            } else if (filter.op === 'lt') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] < (filter.value as any))
                            }
                        })

                        // Apply ordering
                        if (this._order) {
                            const order = this._order
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            data.sort((a: any, b: any) => {
                                const aVal = a[order.column]
                                const bVal = b[order.column]
                                if (order.ascending) {
                                    return aVal > bVal ? 1 : -1
                                } else {
                                    return aVal < bVal ? 1 : -1
                                }
                            })
                        }

                        // Apply limit
                        data = data.slice(0, this._limit)
                    }

                    // Reviews/Comments table
                    else if (table === 'reviews') {
                        data = [...mockComments]
                        this._filters.forEach((filter) => {
                            if (filter.op === 'eq') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] === filter.value)
                            }
                        })
                        data = data.slice(0, this._limit)
                    }

                    // Vocabulary table
                    else if (table === 'vocabulary') {
                        data = [...mockVocabulary]
                        this._filters.forEach((filter) => {
                            if (filter.op === 'eq') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] === filter.value)
                            }
                        })
                        data = data.slice(0, this._limit)
                    }

                    // User library table
                    else if (table === 'user_library') {
                        data = [...mockUserLibrary]
                        this._filters.forEach((filter) => {
                            if (filter.op === 'eq') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] === filter.value)
                            }
                        })

                        // Enrich with book data
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data = data.map((item: any) => ({
                            ...item,
                            book: mockBooks.find(b => b.id === item.book_id),
                        }))
                    }

                    // Users table
                    else if (table === 'users') {
                        data = [mockUser]
                        this._filters.forEach((filter) => {
                            if (filter.op === 'eq' && filter.column === 'id') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item.id === filter.value)
                            }
                        })
                    }

                    // Book completions table (for most read books)
                    else if (table === 'book_completions') {
                        // Return mock completion data for popular books
                        data = mockBooks.slice(0, 8).map((book, index) => ({
                            id: `completion-${index}`,
                            book_id: book.id,
                            user_id: mockUser.id,
                            completed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        }))

                        // Apply filters
                        this._filters.forEach((filter) => {
                            if (filter.op === 'eq') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] === filter.value)
                            } else if (filter.op === 'gte') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                data = data.filter((item: any) => item[filter.column] >= (filter.value as any))
                            }
                        })
                    }

                    // Default empty response
                    else {
                        data = []
                    }

                    // Return single or array
                    if (this._single) {
                        resolve({ data: data[0] || null, error: null })
                    } else {
                        resolve({ data, error: null })
                    }
                },

                // Insert operation
                insert: async function (values: unknown) {
                    await delay(150)
                    return { data: values, error: null }
                },

                // Update operation
                update: async function (values: unknown) {
                    await delay(150)
                    return { data: values, error: null }
                },

                // Delete operation
                delete: async function () {
                    await delay(150)
                    return { data: null, error: null }
                },

                // Upsert operation
                upsert: async function (values: unknown) {
                    await delay(150)
                    return { data: values, error: null }
                },
            }

            return queryBuilder
        },

        storage: {
            from: (bucket: string) => ({
                download: async (path: string) => {
                    await delay(200)

                    // Return mock book content
                    if (bucket === 'book-content') {
                        const bookId = path.split('-')[0]
                        const lang = path.includes('-en.json') ? 'en' : 'fa'
                        const content = mockBookContent[bookId as keyof typeof mockBookContent]

                        if (content) {
                            const blob = new Blob([JSON.stringify({ content: content[lang] })], {
                                type: 'application/json',
                            })
                            return { data: blob, error: null }
                        }
                    }

                    return { data: null, error: { message: 'File not found' } }
                },

                upload: async (path: string) => {
                    await delay(300)
                    return {
                        data: { path: `mock-storage/${path}` },
                        error: null,
                    }
                },

                getPublicUrl: (path: string) => {
                    return {
                        data: { publicUrl: `https://mock-storage.supabase.co/${path}` },
                    }
                },
            }),
        },

        // RPC calls
        rpc: async () => {
            await delay(150)
            return { data: null, error: null }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
}
