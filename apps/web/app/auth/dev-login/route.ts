import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Development-only route to create a dev session
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { email = 'dev@agentstudio.local', password = 'dev123456' } = await request.json()
    const supabase = await createClient()

    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // If user doesn't exist, create one
      if (signInError.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/app/dashboard`,
          },
        })

        if (signUpError) {
          return NextResponse.json({ error: signUpError.message }, { status: 400 })
        }

        // Auto sign in after sign up
        const { data: finalData, error: finalError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (finalError) {
          return NextResponse.json({ error: finalError.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, user: finalData.user })
      }

      return NextResponse.json({ error: signInError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: signInData.user })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

