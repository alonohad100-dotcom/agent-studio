'use client'

import { ReactNode } from 'react'
import { SidebarNav } from './SidebarNav'
import { TopBar } from './TopBar'
import { SkipLink } from '@/components/ui/skip-link'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <SkipLink />
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside 
          className="hidden w-64 border-r bg-card md:block"
          aria-label="Main navigation"
        >
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">Agent Studio</h2>
            </div>
            <nav aria-label="Primary navigation">
              <SidebarNav />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          tabIndex={-1}
          aria-label="Main content"
        >
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

