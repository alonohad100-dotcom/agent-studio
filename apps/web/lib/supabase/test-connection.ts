/**
 * Test Supabase Connection
 * 
 * This utility helps verify that your Supabase configuration is correct.
 * Run this from a Server Component or Server Action to test the connection.
 */

import { createClient } from './server'

export async function testSupabaseConnection() {
  try {
    const supabase = await createClient()
    
    // Test basic connection
    const { data, error } = await supabase.from('_test').select('count').limit(1)
    
    if (error) {
      // If table doesn't exist, that's okay - connection works
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return {
          success: true,
          message: '✅ Supabase connection successful! (Table does not exist yet - this is normal)',
        }
      }
      
      return {
        success: false,
        message: `❌ Supabase connection error: ${error.message}`,
        error: error,
      }
    }
    
    return {
      success: true,
      message: '✅ Supabase connection successful!',
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Failed to connect to Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error,
    }
  }
}

/**
 * Check if required environment variables are set
 */
export function checkEnvVariables() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missing: string[] = []
  const present: string[] = []
  
  for (const key of required) {
    if (process.env[key]) {
      present.push(key)
    } else {
      missing.push(key)
    }
  }
  
  return {
    allPresent: missing.length === 0,
    missing,
    present,
  }
}

