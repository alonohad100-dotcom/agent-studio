/**
 * Environment validation script
 * Run this script to validate all required environment variables are set
 *
 * Note: Validation also happens automatically when the app starts via lib/config/env.ts
 * This script is for manual validation before starting the app
 */

/* eslint-disable no-console */
import { env } from '../lib/config/env'

try {
  // Import the env config - this will throw if env vars are missing
  console.log('✅ Environment variables validated successfully')
  console.log('Supabase URL:', env.supabase.url ? 'Set ✓' : 'Missing ✗')
  console.log('Supabase Anon Key:', env.supabase.anonKey ? 'Set ✓' : 'Missing ✗')
  console.log('App URL:', env.app.url || 'Not set (optional)')
  console.log('Dev Bypass Auth:', env.dev.bypassAuth ? 'Enabled' : 'Disabled')
  console.log('\nAll required environment variables are set. You can start the app.')
} catch (error) {
  console.error('❌ Environment validation failed:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
