/**
 * Environment configuration with validation
 * Centralized configuration for all environment variables
 */

interface EnvConfig {
  supabase: {
    url: string
    anonKey: string
  }
  app: {
    url?: string
  }
  dev: {
    bypassAuth: boolean
  }
}

function getEnvConfig(): EnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing: string[] = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        `Please check your .env.local file and ensure all required variables are set.`
    )

    // In production, log but don't crash
    if (process.env.NODE_ENV === 'production') {
      console.error(error.message)
      throw error
    } else {
      // In development, throw immediately for faster feedback
      throw error
    }
  }

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
    dev: {
      bypassAuth: process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true',
    },
  }
}

export const env = getEnvConfig()
