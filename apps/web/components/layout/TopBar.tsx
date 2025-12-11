'use client'

import { CommandPalette } from './CommandPalette'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { MobileDrawer } from './MobileDrawer'

export function TopBar() {
  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex flex-1 items-center gap-4">
          <MobileDrawer />
          <div className="hidden md:block flex-1 max-w-md">
            <CommandPalette />
          </div>
          <div className="md:hidden flex-1 max-w-xs">
            <CommandPalette />
          </div>
        </div>
        <div className="flex items-center gap-2" role="toolbar" aria-label="User actions">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

