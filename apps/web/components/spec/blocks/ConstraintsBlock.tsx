'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ConstraintsBlockProps {
  form: UseFormReturn<FieldValues>
}

export function ConstraintsBlock({ form }: ConstraintsBlockProps) {
  const { register } = form

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="length" className="text-sm font-medium mb-2 block">
          Length Constraints <span className="text-destructive">*</span>
        </label>
        <Input
          id="length"
          {...register('length', { required: true })}
          placeholder="e.g., Maximum 500 words, Minimum 100 characters..."
        />
      </div>

      <div>
        <label htmlFor="citation_policy" className="text-sm font-medium mb-2 block">
          Citation Policy
        </label>
        <Textarea
          id="citation_policy"
          {...register('citation_policy')}
          placeholder="Describe citation requirements..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div>
        <label htmlFor="verification" className="text-sm font-medium mb-2 block">
          Verification Requirements
        </label>
        <Textarea
          id="verification"
          {...register('verification')}
          placeholder="Describe verification requirements..."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  )
}

