'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ExamplesBlockProps {
  form: UseFormReturn<FieldValues>
}

export function ExamplesBlock({ form }: ExamplesBlockProps) {
  const { watch, setValue } = form
  const good = watch('good') || []
  const bad = watch('bad') || []
  const [newGood, setNewGood] = useState('')
  const [newBad, setNewBad] = useState('')

  const addGood = () => {
    if (newGood.trim()) {
      setValue('good', [...good, newGood.trim()])
      setNewGood('')
    }
  }

  const removeGood = (index: number) => {
    setValue('good', good.filter((_: string, i: number) => i !== index))
  }

  const addBad = () => {
    if (newBad.trim()) {
      setValue('bad', [...bad, newBad.trim()])
      setNewBad('')
    }
  }

  const removeBad = (index: number) => {
    setValue('bad', bad.filter((_: string, i: number) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="good">
        <TabsList>
          <TabsTrigger value="good">Good Examples</TabsTrigger>
          <TabsTrigger value="bad">Bad Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="good" className="space-y-2 mt-4">
          {good.map((example: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                value={example}
                onChange={(e) => {
                  const updated = [...good]
                  updated[index] = e.target.value
                  setValue('good', updated)
                }}
                rows={3}
                className="resize-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeGood(index)}
                className="mt-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <Textarea
              value={newGood}
              onChange={(e) => setNewGood(e.target.value)}
              placeholder="Add a good example..."
              rows={3}
              className="resize-none"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addGood}
              className="mt-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="bad" className="space-y-2 mt-4">
          {bad.map((example: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                value={example}
                onChange={(e) => {
                  const updated = [...bad]
                  updated[index] = e.target.value
                  setValue('bad', updated)
                }}
                rows={3}
                className="resize-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBad(index)}
                className="mt-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <Textarea
              value={newBad}
              onChange={(e) => setNewBad(e.target.value)}
              placeholder="Add a bad example..."
              rows={3}
              className="resize-none"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addBad}
              className="mt-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

