'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputEnhanced } from '@/components/ui/input-enhanced'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SlideUp } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Mail, Code } from 'lucide-react'

export default function DevLoginPage() {
  const [email, setEmail] = useState('dev@agentstudio.local')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      
      // For development: Sign in with password or create a dev session
      const loginEmail = email || 'dev@agentstudio.local'
      const loginPassword = 'dev123456'
      
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        // If user doesn't exist, try to sign up
        if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
          // First try sign up
          const { error: signUpError } = await supabase.auth.signUp({
            email: loginEmail,
            password: loginPassword,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/app/dashboard`,
            },
          })

          if (signUpError && !signUpError.message.includes('already registered')) {
            setMessage({ type: 'error', text: signUpError.message })
            setLoading(false)
            return
          }

          // Wait a bit then try to sign in
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
          })

          if (signInError) {
            setMessage({ 
              type: 'error', 
              text: `Sign in failed: ${signInError.message}. You may need to check your Supabase settings for email confirmation.` 
            })
          } else {
            router.push('/app/dashboard')
            router.refresh()
          }
        } else {
          setMessage({ type: 'error', text: error.message })
        }
      } else {
        router.push('/app/dashboard')
        router.refresh()
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <SlideUp delay={0.2}>
        <Card className="w-full max-w-md mx-auto shadow-xl border-orange-500/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-2xl font-bold">Dev Login</CardTitle>
            </div>
            <CardDescription>
              Development-only login bypass. Use any email and password &quot;dev123456&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDevLogin} className="space-y-6">
              <div className="space-y-2">
                <InputEnhanced
                  type="email"
                  label="Email (any email works)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="dev@agentstudio.local"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                <InputEnhanced
                  type="password"
                  label="Password"
                  defaultValue="dev123456"
                  disabled={true}
                  placeholder="dev123456 (auto-filled)"
                  className="opacity-60"
                />
              </div>

              <Alert className="bg-orange-500/10 border-orange-500/20">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-sm">
                  This is a development-only feature. Do not use in production.
                </AlertDescription>
              </Alert>

              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert
                      variant={message.type === 'error' ? 'destructive' : 'default'}
                      className={
                        message.type === 'success'
                          ? 'border-success bg-success/10'
                          : ''
                      }
                    >
                      {message.type === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading || !email}
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing in...' : 'Dev Login'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/auth/sign-in')}
                >
                  Use Production Sign-In Instead
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}

