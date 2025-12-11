'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FocusTrap } from '@/components/ui/focus-trap'
import { SidebarNav } from './SidebarNav'

export function MobileDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-64 p-0 sm:w-80"
        aria-label="Navigation menu"
      >
        <FocusTrap active={open}>
          <SheetHeader className="border-b p-4">
            <SheetTitle>Agent Studio</SheetTitle>
          </SheetHeader>
          <SidebarNav />
        </FocusTrap>
      </SheetContent>
    </Sheet>
  )
}

