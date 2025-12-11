import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the application URL with proper fallback logic
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (if set)
 * 2. window.location.origin (client-side)
 * 3. process.env.VERCEL_URL (server-side on Vercel)
 * 4. localhost:3000 (fallback for development)
 */
export function getAppUrl(): string {
  // Client-side: use window.location.origin (most reliable)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side: check environment variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Vercel provides VERCEL_URL automatically
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback for development
  return process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com' // This should never be reached if configured correctly
    : 'http://localhost:3000'
}
