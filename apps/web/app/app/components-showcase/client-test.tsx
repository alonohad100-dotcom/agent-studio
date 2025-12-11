'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ClientTest() {
  const handleToast = () => {
    toast.success('Toast notification works!')
  }

  return (
    <div className="mt-4">
      <Button onClick={handleToast}>Test Toast Notification</Button>
    </div>
  )
}

