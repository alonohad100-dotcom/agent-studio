'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, SlideUp } from '@/components/ui'
import { Lock, Sparkles } from 'lucide-react'

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12"
      role="main"
      aria-label="Sign in page"
    >
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <FadeIn className="hidden md:block">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10" aria-hidden="true">
                <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold">Agent Studio</h1>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Welcome Back</h2>
              <p className="text-muted-foreground text-lg">
                Sign in to continue building and managing your AI agents.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right Side - Form */}
        <SlideUp delay={0.2}>
          <Card
            className="w-full max-w-md mx-auto shadow-xl"
            role="region"
            aria-label="Sign in form"
          >
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              </div>
              <CardDescription>Enter your email and password to sign in</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </div>
  )
}
