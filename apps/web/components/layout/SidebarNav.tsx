'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Bot,
  FileText,
  FlaskConical,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/agents', label: 'Agents', icon: Bot },
  { href: '/app/templates', label: 'Templates', icon: FileText },
  { href: '/app/test-lab', label: 'Test Lab', icon: FlaskConical },
  { href: '/app/settings', label: 'Settings', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

        return (
          <motion.div
            key={item.href}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative',
                'min-h-[44px] touch-manipulation', // Touch target size
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavItem"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </motion.div>
              <span>{item.label}</span>
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
}

