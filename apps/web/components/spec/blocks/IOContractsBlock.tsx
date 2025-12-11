'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface IOContractsBlockProps {
  form: UseFormReturn<FieldValues>
}

export function IOContractsBlock({ form }: IOContractsBlockProps) {
  const { register, watch, setValue } = form
  const inputs = watch('inputs') || []
  const outputs = watch('outputs') || { format: '', sections: [], style_rules: [] }
  const [newConstraint, setNewConstraint] = useState<{ inputIndex: number; value: string } | null>(
    null
  )
  const [newSection, setNewSection] = useState('')
  const [newStyleRule, setNewStyleRule] = useState('')

  const addInput = () => {
    setValue('inputs', [
      ...inputs,
      {
        name: '',
        format: '',
        constraints: [],
      },
    ])
  }

  const removeInput = (index: number) => {
    setValue('inputs', inputs.filter((_: unknown, i: number) => i !== index))
  }

  const addConstraint = (inputIndex: number) => {
    if (newConstraint && newConstraint.inputIndex === inputIndex && newConstraint.value.trim()) {
      const updated = [...inputs]
      updated[inputIndex].constraints = [
        ...updated[inputIndex].constraints,
        newConstraint.value.trim(),
      ]
      setValue('inputs', updated)
      setNewConstraint(null)
    }
  }

  const removeConstraint = (inputIndex: number, constraintIndex: number) => {
    const updated = [...inputs]
    updated[inputIndex].constraints = updated[inputIndex].constraints.filter(
      (_: string, i: number) => i !== constraintIndex
    )
    setValue('inputs', updated)
  }

  const addSection = () => {
    if (newSection.trim()) {
      setValue('outputs', {
        ...outputs,
        sections: [...outputs.sections, newSection.trim()],
      })
      setNewSection('')
    }
  }

  const removeSection = (index: number) => {
    setValue('outputs', {
      ...outputs,
      sections: outputs.sections.filter((_: string, i: number) => i !== index),
    })
  }

  const addStyleRule = () => {
    if (newStyleRule.trim()) {
      setValue('outputs', {
        ...outputs,
        style_rules: [...outputs.style_rules, newStyleRule.trim()],
      })
      setNewStyleRule('')
    }
  }

  const removeStyleRule = (index: number) => {
    setValue('outputs', {
      ...outputs,
      style_rules: outputs.style_rules.filter((_: string, i: number) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inputs">
        <TabsList>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="outputs">Outputs</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs" className="space-y-4 mt-4">
          <div className="space-y-4">
            {inputs.map((input: { name: string; format: string; constraints: string[] }, index: number) => {
              return (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Input {index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeInput(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={input.name}
                    onChange={(e) => {
                      const updated = [...inputs]
                      updated[index].name = e.target.value
                      setValue('inputs', updated)
                    }}
                    placeholder="Input name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Format</label>
                  <Input
                    value={input.format}
                    onChange={(e) => {
                      const updated = [...inputs]
                      updated[index].format = e.target.value
                      setValue('inputs', updated)
                    }}
                    placeholder="e.g., JSON, text, markdown..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Constraints</label>
                  <div className="space-y-2">
                    {input.constraints.map((constraint: string, cIndex: number) => (
                      <div key={cIndex} className="flex items-center gap-2">
                        <Input value={constraint} readOnly />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeConstraint(index, cIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newConstraint?.inputIndex === index ? newConstraint.value : ''}
                        onChange={(e) =>
                          setNewConstraint({ inputIndex: index, value: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addConstraint(index)
                          }
                        }}
                        placeholder="Add constraint..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addConstraint(index)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              )
            })}
    <Button type="button" variant="outline" onClick={addInput}>
              <Plus className="mr-2 h-4 w-4" />
              Add Input
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="outputs" className="space-y-4 mt-4">
          <div>
            <label htmlFor="output_format" className="text-sm font-medium mb-2 block">
              Output Format <span className="text-destructive">*</span>
            </label>
            <Input
              id="output_format"
              {...register('outputs.format', { required: true })}
              placeholder="e.g., JSON, markdown, plain text..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Sections</label>
            <div className="space-y-2">
              {outputs.sections.map((section: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={section} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSection()
                    }
                  }}
                  placeholder="Add section..."
                />
                <Button type="button" variant="outline" size="icon" onClick={addSection}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Style Rules</label>
            <div className="space-y-2">
              {outputs.style_rules.map((rule: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={rule} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStyleRule(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newStyleRule}
                  onChange={(e) => setNewStyleRule(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addStyleRule()
                    }
                  }}
                  placeholder="Add style rule..."
                />
                <Button type="button" variant="outline" size="icon" onClick={addStyleRule}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

