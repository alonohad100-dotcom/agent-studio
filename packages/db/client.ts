/**
 * Database Client
 * 
 * Creates a Supabase client instance with proper typing
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Create a Supabase client with database types
 * 
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase anon key or service role key
 * @returns Typed Supabase client
 */
export function createClient(supabaseUrl: string, supabaseKey: string) {
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

