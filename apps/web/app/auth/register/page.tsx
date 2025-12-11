'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, SlideUp } from '@/components/ui'
import { UserPlus, Sparkles } from 'lucide-react'

export default function RegisterPage() {
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
              <h2 className="text-2xl font-semibold">Create Your Account</h2>
              <p className="text-muted-foreground text-lg">
                Join Agent Studio to start building and managing your AI agents. Get started in
                minutes.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right Side - Form */}
        <SlideUp delay={0.2}>
          <Card className="w-full max-w-md mx-auto shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              </div>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </div>
  )
}
