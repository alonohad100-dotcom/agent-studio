import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Agent Studio',
    template: '%s | Agent Studio',
  },
  description: 'A specification-driven web platform that compiles user requirements into high-quality AI agent prompt packages',
  keywords: ['AI agents', 'prompt engineering', 'AI development', 'agent specification'],
  authors: [{ name: 'Agent Studio' }],
  creator: 'Agent Studio',
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Agent Studio',
    description: 'A specification-driven web platform that compiles user requirements into high-quality AI agent prompt packages',
    siteName: 'Agent Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Studio',
    description: 'A specification-driven web platform that compiles user requirements into high-quality AI agent prompt packages',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}

