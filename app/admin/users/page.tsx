import { CompleteUsersManagement } from '@/components/admin/complete-users-management'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'User Management | Admin | کتاب‌یار',
    description: 'Manage users, subscriptions, and permissions',
}

export const dynamic = 'force-dynamic'

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">
                    Manage users, ban/unban, create test accounts, assign admin roles
                </p>
            </div>

            <CompleteUsersManagement />
        </div>
    )
}
