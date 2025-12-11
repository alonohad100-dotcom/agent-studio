import { requireAuth } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import { PageWrapper } from '@/components/ui'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // requireAuth handles dev bypass internally
  await requireAuth()

  return (
    <ErrorBoundary>
      <AppShell>
        <PageWrapper>{children}</PageWrapper>
      </AppShell>
    </ErrorBoundary>
  )
}

