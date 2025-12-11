'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { InputEnhanced } from '@/components/ui/input-enhanced'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FadeIn, SlideUp } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Mail, Sparkles, Code } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = new URL('/auth/callback', window.location.origin)
      redirectTo.searchParams.set('next', '/app/dashboard')

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo.toString(),
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Check your email for the magic link!',
        })
        setEmail('')
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
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <FadeIn className="hidden md:block">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Agent Studio</h1>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Welcome Back</h2>
                <p className="text-muted-foreground text-lg">
                Sign in to continue building and managing your AI agents. We&apos;ll send you a magic link - no password needed!
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Secure authentication</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>No password required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Instant access</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right Side - Form */}
        <SlideUp delay={0.2}>
          <Card className="w-full max-w-md mx-auto shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your email to receive a magic link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <InputEnhanced
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="you@example.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    success={message?.type === 'success'}
                    error={message?.type === 'error' ? message.text : undefined}
                  />
                </div>

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
                  {loading ? 'Sending...' : 'Send magic link'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>We&apos;ll send you a magic link to sign in.</p>
                  <p className="mt-1">No password needed!</p>
                </div>

                {process.env.NODE_ENV === 'development' && (
                  <div className="pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = '/auth/dev-login'}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Development Login (Bypass)
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </div>
  )
}
