'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

interface SafetyBlockProps {
  form: UseFormReturn<FieldValues>
}

export function SafetyBlock({ form }: SafetyBlockProps) {
  const { watch, setValue } = form
  const refusals = watch('refusals') || []
  const sensitiveTopics = watch('sensitive_topics') || []
  const [newRefusal, setNewRefusal] = useState('')
  const [newTopic, setNewTopic] = useState('')

  const addRefusal = () => {
    if (newRefusal.trim()) {
      setValue('refusals', [...refusals, newRefusal.trim()])
      setNewRefusal('')
    }
  }

  const removeRefusal = (index: number) => {
    setValue('refusals', refusals.filter((_: string, i: number) => i !== index))
  }

  const addTopic = () => {
    if (newTopic.trim()) {
      setValue('sensitive_topics', [...sensitiveTopics, newTopic.trim()])
      setNewTopic('')
    }
  }

  const removeTopic = (index: number) => {
    setValue('sensitive_topics', sensitiveTopics.filter((_: string, i: number) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Refusal Scenarios <span className="text-destructive">*</span>
        </label>
        <div className="space-y-2">
          {refusals.map((refusal: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={refusal}
                onChange={(e) => {
                  const updated = [...refusals]
                  updated[index] = e.target.value
                  setValue('refusals', updated)
                }}
                placeholder="Refusal scenario..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRefusal(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newRefusal}
              onChange={(e) => setNewRefusal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addRefusal()
                }
              }}
              placeholder="Add refusal scenario..."
            />
            <Button type="button" variant="outline" size="icon" onClick={addRefusal}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Sensitive Topics</label>
        <div className="space-y-2">
          {sensitiveTopics.map((topic: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={topic}
                onChange={(e) => {
                  const updated = [...sensitiveTopics]
                  updated[index] = e.target.value
                  setValue('sensitive_topics', updated)
                }}
                placeholder="Sensitive topic..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTopic(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTopic()
                }
              }}
              placeholder="Add sensitive topic..."
            />
            <Button type="button" variant="outline" size="icon" onClick={addTopic}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

