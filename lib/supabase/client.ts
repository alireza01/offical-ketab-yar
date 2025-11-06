import type { Database } from '@/types/database.types'
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export createBrowserClient for components that need it
export { createSupabaseBrowserClient as createBrowserClient }

