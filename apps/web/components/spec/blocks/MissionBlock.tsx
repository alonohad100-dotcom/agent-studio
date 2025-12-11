'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

interface MissionBlockProps {
  form: UseFormReturn<FieldValues>
}

export function MissionBlock({ form }: MissionBlockProps) {
  const { register, watch, setValue } = form
  const successCriteria = watch('success_criteria') || []
  const nonGoals = watch('non_goals') || []
  const [newCriteria, setNewCriteria] = useState('')
  const [newNonGoal, setNewNonGoal] = useState('')

  const addSuccessCriteria = () => {
    if (newCriteria.trim()) {
      setValue('success_criteria', [...successCriteria, newCriteria.trim()])
      setNewCriteria('')
    }
  }

  const removeSuccessCriteria = (index: number) => {
    setValue(
      'success_criteria',
      successCriteria.filter((_: string, i: number) => i !== index)
    )
  }

  const addNonGoal = () => {
    if (newNonGoal.trim()) {
      setValue('non_goals', [...nonGoals, newNonGoal.trim()])
      setNewNonGoal('')
    }
  }

  const removeNonGoal = (index: number) => {
    setValue('non_goals', nonGoals.filter((_: string, i: number) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="problem" className="text-sm font-medium mb-2 block">
          Problem Statement <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="problem"
          {...register('problem', { required: true })}
          placeholder="Describe the problem this agent solves..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Success Criteria <span className="text-destructive">*</span>
        </label>
        <div className="space-y-2">
          {successCriteria.map((criteria: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={criteria}
                onChange={(e) => {
                  const updated = [...successCriteria]
                  updated[index] = e.target.value
                  setValue('success_criteria', updated)
                }}
                placeholder="Success criteria..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSuccessCriteria(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newCriteria}
              onChange={(e) => setNewCriteria(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSuccessCriteria()
                }
              }}
              placeholder="Add success criteria..."
            />
            <Button type="button" variant="outline" size="icon" onClick={addSuccessCriteria}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Non-Goals</label>
        <div className="space-y-2">
          {nonGoals.map((goal: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={goal}
                onChange={(e) => {
                  const updated = [...nonGoals]
                  updated[index] = e.target.value
                  setValue('non_goals', updated)
                }}
                placeholder="Non-goal..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeNonGoal(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newNonGoal}
              onChange={(e) => setNewNonGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addNonGoal()
                }
              }}
              placeholder="Add non-goal..."
            />
            <Button type="button" variant="outline" size="icon" onClick={addNonGoal}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

