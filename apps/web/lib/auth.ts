/**
 * Authentication Utilities
 *
 * Server-side authentication helpers for Agent Studio
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { env } from '@/lib/config/env'

/**
 * Get the current server session
 * Returns null if user is not authenticated
 */
export async function getServerSession() {
  // Development mode: allow bypassing auth if flag is set
  const DEV_MODE = process.env.NODE_ENV === 'development'

  if (DEV_MODE && env.dev.bypassAuth) {
    // Return a mock user for development
    return {
      user: {
        id: 'dev-user-id',
        email: 'dev@agentstudio.local',
      },
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return { user }
}

/**
 * Require authentication
 * Redirects to login if user is not authenticated
 * Returns user if authenticated
 */
export async function requireAuth() {
  // Development mode: allow bypassing auth if flag is set
  const DEV_MODE = process.env.NODE_ENV === 'development'

  if (DEV_MODE && env.dev.bypassAuth) {
    // Return a mock user for development
    return {
      id: 'dev-user-id',
      email: 'dev@agentstudio.local',
    }
  }

  const session = await getServerSession()

  if (!session) {
    redirect('/auth/login')
  }

  return session.user
}

/**
 * Get current user
 * Returns null if not authenticated (does not redirect)
 */
export async function getUser() {
  const session = await getServerSession()
  return session?.user ?? null
}

/**
 * Get user ID
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const user = await getUser()
  return user?.id ?? null
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}
