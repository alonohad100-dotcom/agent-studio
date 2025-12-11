'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from 'use-debounce'

interface AgentSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AgentSearch({ value, onChange, placeholder = 'Search agents...' }: AgentSearchProps) {
  const debouncedOnChange = useDebouncedCallback((val: string) => {
    onChange(val)
  }, 300)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        defaultValue={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}

