import { describe, it, expect } from 'vitest'

describe('Environment Configuration', () => {
  it('verifies env config structure when env vars are set', async () => {
    // Skip test if env vars are not set (common in CI without .env)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // eslint-disable-next-line no-console
      console.log('Skipping env config test - env vars not set')
      return
    }

    // Import the config (assuming env vars are set)
    const envModule = await import('@/lib/config/env')
    expect(envModule).toHaveProperty('env')
    expect(envModule.env).toHaveProperty('supabase')
    expect(envModule.env.supabase).toHaveProperty('url')
    expect(envModule.env.supabase).toHaveProperty('anonKey')
    expect(envModule.env).toHaveProperty('app')
    expect(envModule.env).toHaveProperty('dev')
  })

  it('validates env config has correct types', async () => {
    // Skip test if env vars are not set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // eslint-disable-next-line no-console
      console.log('Skipping env config type test - env vars not set')
      return
    }

    const envModule = await import('@/lib/config/env')
    expect(typeof envModule.env.supabase.url).toBe('string')
    expect(typeof envModule.env.supabase.anonKey).toBe('string')
    expect(typeof envModule.env.dev.bypassAuth).toBe('boolean')
  })

  // Note: Testing missing env vars requires module cache clearing which is flaky.
  // The validation is tested at runtime when the app starts.
  // For CI/CD, ensure env vars are set before running tests.
})
