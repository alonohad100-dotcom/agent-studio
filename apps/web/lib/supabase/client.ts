import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/config/env'

export function createClient() {
  try {
    return createBrowserClient(env.supabase.url, env.supabase.anonKey)
  } catch (error) {
    console.error('Failed to create Supabase browser client:', error)
    throw error
  }
}
