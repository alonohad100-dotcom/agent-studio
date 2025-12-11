'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, SlideUp, StaggerList } from '@/components/ui'
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Shield, 
  Code, 
  FileText,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Agent Creation',
    description: 'Build sophisticated AI agents with comprehensive specifications and prompt engineering.',
  },
  {
    icon: Sparkles,
    title: 'Spec-Driven Development',
    description: 'Define your agent\'s mission, scope, and capabilities through structured specifications.',
  },
  {
    icon: Zap,
    title: 'Prompt Compilation',
    description: 'Automatically compile specifications into optimized prompt packages for your AI models.',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Built-in linting, scoring, and validation to ensure high-quality agent configurations.',
  },
  {
    icon: Code,
    title: 'Version Control',
    description: 'Track changes, manage versions, and maintain immutable snapshots of your agents.',
  },
  {
    icon: FileText,
    title: 'Export & Deploy',
    description: 'Export complete agent configurations and prompt packages for deployment.',
  },
]

const stats = [
  { value: '100+', label: 'Agents Created' },
  { value: '50+', label: 'Active Users' },
  { value: '99%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20" role="main">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32" aria-labelledby="hero-title">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeIn delay={0.1}>
            <motion.h1
              id="hero-title"
              className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Agent Studio
            </motion.h1>
          </FadeIn>

          <SlideUp delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Build, manage, and deploy AI agents with comprehensive specifications and quality assurance.
            </p>
          </SlideUp>

          <SlideUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/sign-in">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/app/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16" aria-labelledby="features-title">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create and manage production-ready AI agents
              </p>
            </div>
          </FadeIn>

          <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} variants={{}}>
                <Card hoverable className="h-full transition-all duration-200">
                  <CardHeader>
                    <div className="mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of developers building the next generation of AI agents
                </p>
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/auth/sign-in">
                    Create Your First Agent
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </FadeIn>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
