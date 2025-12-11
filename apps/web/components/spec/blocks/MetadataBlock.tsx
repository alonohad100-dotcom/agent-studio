'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

interface MetadataBlockProps {
  form: UseFormReturn<FieldValues>
}

export function MetadataBlock({ form }: MetadataBlockProps) {
  const { watch, setValue } = form
  const domainTags = watch('domain_tags') || []
  const templateId = watch('template_id')
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    if (newTag.trim()) {
      setValue('domain_tags', [...domainTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setValue('domain_tags', domainTags.filter((_: string, i: number) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="template_id" className="text-sm font-medium mb-2 block">
          Template ID
        </label>
        <Input
          id="template_id"
          value={templateId || ''}
          onChange={(e) => setValue('template_id', e.target.value || null)}
          placeholder="Template ID (optional)..."
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Domain Tags</label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {domainTags.map((tag: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
              >
                <span>{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => removeTag(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder="Add domain tag..."
            />
            <Button type="button" variant="outline" size="icon" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

