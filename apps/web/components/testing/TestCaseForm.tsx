'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
import type { TestCaseInput, TestCaseType } from '@core/types/test'

const testCaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['functional', 'safety', 'regression']),
  input: z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().min(1, 'Message content is required'),
        })
      )
      .min(1, 'At least one message is required'),
  }),
  expected: z.object({
    must_include: z.array(z.string()),
    must_not_include: z.array(z.string()),
    traits: z.array(z.string()),
  }),
})

type TestCaseFormData = z.infer<typeof testCaseSchema>

interface TestCaseFormProps {
  initialData?: Partial<TestCaseInput>
  onSubmit: (data: TestCaseInput) => Promise<void>
  onCancel?: () => void
}

export function TestCaseForm({ initialData, onSubmit, onCancel }: TestCaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'functional',
      input: {
        messages: initialData?.input?.messages || [{ role: 'user', content: '' }],
      },
      expected: {
        must_include: initialData?.expected?.must_include || [],
        must_not_include: initialData?.expected?.must_not_include || [],
        traits: initialData?.expected?.traits || [],
      },
    },
  })

  const handleSubmit = async (data: TestCaseFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Failed to submit test case:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMessage = () => {
    const messages = form.getValues('input.messages')
    form.setValue('input.messages', [...messages, { role: 'user' as const, content: '' }])
  }

  const removeMessage = (index: number) => {
    const messages = form.getValues('input.messages')
    form.setValue('input.messages', messages.filter((_, i) => i !== index))
  }

  const addArrayItem = (field: 'must_include' | 'must_not_include' | 'traits') => {
    const current = form.getValues(`expected.${field}`)
    form.setValue(`expected.${field}`, [...current, ''])
  }

  const removeArrayItem = (field: 'must_include' | 'must_not_include' | 'traits', index: number) => {
    const current = form.getValues(`expected.${field}`)
    form.setValue(`expected.${field}`, current.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Case Details</CardTitle>
          <CardDescription>Define the test case name and type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={form.watch('type')}
              onValueChange={(value) => form.setValue('type', value as TestCaseType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="functional">Functional</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="regression">Regression</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input Messages</CardTitle>
          <CardDescription>Conversation messages to send to the agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.watch('input.messages').map((message, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <Select
                  value={message.role}
                  onValueChange={(value) => {
                    const messages = form.getValues('input.messages')
                    messages[index].role = value as 'user' | 'assistant'
                    form.setValue('input.messages', messages)
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  {...form.register(`input.messages.${index}.content`)}
                  placeholder="Message content..."
                  className="flex-1"
                />
                {form.watch('input.messages').length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMessage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addMessage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Message
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Output</CardTitle>
          <CardDescription>Define what the agent should and should not include</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Must Include</Label>
            <div className="space-y-2 mt-2">
              {form.watch('expected.must_include').map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    {...form.register(`expected.must_include.${index}`)}
                    placeholder="Required text..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('must_include', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('must_include')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Required Text
              </Button>
            </div>
          </div>

          <div>
            <Label>Must Not Include</Label>
            <div className="space-y-2 mt-2">
              {form.watch('expected.must_not_include').map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    {...form.register(`expected.must_not_include.${index}`)}
                    placeholder="Forbidden text..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('must_not_include', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('must_not_include')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Forbidden Text
              </Button>
            </div>
          </div>

          <div>
            <Label>Traits</Label>
            <div className="space-y-2 mt-2">
              {form.watch('expected.traits').map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    {...form.register(`expected.traits.${index}`)}
                    placeholder="Trait (e.g., helpful, concise)..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('traits', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('traits')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Trait
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Test Case'}
        </Button>
      </div>
    </form>
  )
}

