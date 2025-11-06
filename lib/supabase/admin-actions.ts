import { createClient } from '@/lib/supabase/client'

export interface AdminAction {
    id: string
    admin_id: string
    action_type: string
    target_user_id: string | null
    details: Record<string, unknown>
    created_at: string
}

export interface UserProfile {
    id: string
    email: string
    full_name: string | null
    username: string | null
    role: 'user' | 'admin' | 'test_user'
    is_banned: boolean
    banned_at: string | null
    banned_reason: string | null
    subscription_tier: string
    subscription_status: string
    created_at: string
}

/**
 * Ban a user
 */
export async function banUser(userId: string, reason: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({
            is_banned: true,
            banned_at: new Date().toISOString(),
            banned_reason: reason
        })
        .eq('id', userId)

    if (error) throw error

    // Log action
    await supabase.rpc('log_admin_action', {
        p_action_type: 'ban_user',
        p_target_user_id: userId,
        p_details: { reason }
    })

    return { success: true }
}

/**
 * Unban a user
 */
export async function unbanUser(userId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({
            is_banned: false,
            banned_at: null,
            banned_reason: null
        })
        .eq('id', userId)

    if (error) throw error

    // Log action
    await supabase.rpc('log_admin_action', {
        p_action_type: 'unban_user',
        p_target_user_id: userId,
        p_details: {}
    })

    return { success: true }
}

/**
 * Make a user admin
 */
export async function makeUserAdmin(userId: string) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('profiles')
        .update({
            role: 'admin',
            made_admin_by: user.id,
            made_admin_at: new Date().toISOString()
        })
        .eq('id', userId)

    if (error) throw error

    // Log action
    await supabase.rpc('log_admin_action', {
        p_action_type: 'make_admin',
        p_target_user_id: userId,
        p_details: {}
    })

    return { success: true }
}

/**
 * Remove admin role from user
 */
export async function removeUserAdmin(userId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({
            role: 'user',
            made_admin_by: null,
            made_admin_at: null
        })
        .eq('id', userId)

    if (error) throw error

    // Log action
    await supabase.rpc('log_admin_action', {
        p_action_type: 'remove_admin',
        p_target_user_id: userId,
        p_details: {}
    })

    return { success: true }
}

/**
 * Create a test user account
 */
export async function createTestUser(email: string, password: string, fullName: string) {
    const supabase = createClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'test_user'
            }
        }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user')

    // Update profile to test_user with unlimited features
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            role: 'test_user',
            subscription_tier: 'annual', // Give them premium features
            subscription_status: 'active',
            subscription_expires_at: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString() // 100 years
        })
        .eq('id', authData.user.id)

    if (profileError) throw profileError

    // Log action
    await supabase.rpc('log_admin_action', {
        p_action_type: 'create_test_user',
        p_target_user_id: authData.user.id,
        p_details: { email, full_name: fullName }
    })

    return { success: true, userId: authData.user.id }
}

/**
 * Get all users with filters
 */
export async function getAllUsers(filters?: {
    role?: string
    subscription?: string
    banned?: boolean
    search?: string
}) {
    const supabase = createClient()

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters?.role) {
        query = query.eq('role', filters.role)
    }

    if (filters?.subscription) {
        query = query.eq('subscription_tier', filters.subscription)
    }

    if (filters?.banned !== undefined) {
        query = query.eq('is_banned', filters.banned)
    }

    if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return data as UserProfile[]
}

/**
 * Get admin action logs
 */
export async function getAdminLogs(limit = 50) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('admin_actions')
        .select(`
            *,
            admin:profiles!admin_actions_admin_id_fkey(full_name, email),
            target:profiles!admin_actions_target_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error

    return data
}

/**
 * Get platform statistics
 */
export async function getPlatformStats() {
    const supabase = createClient()

    const [
        { count: totalUsers },
        { count: adminUsers },
        { count: testUsers },
        { count: bannedUsers },
        { count: premiumUsers },
        { count: activeUsers },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'test_user'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    return {
        totalUsers: totalUsers || 0,
        adminUsers: adminUsers || 0,
        testUsers: testUsers || 0,
        bannedUsers: bannedUsers || 0,
        premiumUsers: premiumUsers || 0,
        activeUsers: activeUsers || 0,
    }
}

/**
 * Export users to CSV
 */
export async function exportUsersToCSV() {
    const users = await getAllUsers()

    const headers = ['Email', 'Name', 'Role', 'Subscription', 'Status', 'Banned', 'Created At']
    const rows = users.map(user => [
        user.email || '',
        user.full_name || '',
        user.role,
        user.subscription_tier,
        user.subscription_status,
        user.is_banned ? 'Yes' : 'No',
        new Date(user.created_at).toLocaleDateString()
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csvContent
}
