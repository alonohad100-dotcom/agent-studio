'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AudienceBlockProps {
  form: UseFormReturn<FieldValues>
}

export function AudienceBlock({ form }: AudienceBlockProps) {
  const { register, watch, setValue } = form

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="persona" className="text-sm font-medium mb-2 block">
          Persona <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="persona"
          {...register('persona', { required: true })}
          placeholder="Describe your target audience persona..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div>
        <label htmlFor="skill_level" className="text-sm font-medium mb-2 block">
          Skill Level <span className="text-destructive">*</span>
        </label>
        <Select
          value={watch('skill_level')}
          onValueChange={(value) => setValue('skill_level', value)}
        >
          <SelectTrigger id="skill_level">
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="language" className="text-sm font-medium mb-2 block">
          Language
        </label>
        <Input
          id="language"
          {...register('language')}
          placeholder="e.g., English, Spanish..."
        />
      </div>

      <div>
        <label htmlFor="tone" className="text-sm font-medium mb-2 block">
          Tone
        </label>
        <Select value={watch('tone')} onValueChange={(value) => setValue('tone', value)}>
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

