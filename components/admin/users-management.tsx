'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Mail, Search, Shield, UserCheck, UserX } from 'lucide-react'
import { useState } from 'react'

// TODO: Fetch real data from Supabase
const mockUsers = [
    {
        id: '1',
        email: 'user1@example.com',
        name: 'علی احمدی',
        role: 'user',
        subscription: 'premium',
        status: 'active',
        joinedAt: '2025-01-15',
    },
    {
        id: '2',
        email: 'user2@example.com',
        name: 'سارا محمدی',
        role: 'user',
        subscription: 'free',
        status: 'active',
        joinedAt: '2025-01-10',
    },
]

export function UsersManagement() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by email or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline">
                            <Shield className="h-4 w-4 mr-2" />
                            Filter by Role
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users ({mockUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.subscription === 'premium' ? 'default' : 'outline'}>
                                            {user.subscription}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.joinedAt}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <UserCheck className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <UserX className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* TODO: Add pagination, bulk actions, user details modal */}
        </div>
    )
}
