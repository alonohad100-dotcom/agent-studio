'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface StatusFilterProps {
  value?: 'draft' | 'published' | 'archived'
  onChange: (value: 'draft' | 'published' | 'archived' | undefined) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select
      value={value || 'all'}
      onValueChange={(val) => onChange(val === 'all' ? undefined : (val as typeof value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  )
}

