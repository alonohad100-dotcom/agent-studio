'use client'

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ScopeBlockProps {
  form: UseFormReturn<FieldValues>
}

export function ScopeBlock({ form }: ScopeBlockProps) {
  const { watch, setValue } = form
  const [newItem, setNewItem] = useState('')
  const [activeTab, setActiveTab] = useState('must_do')

  const getCurrentList = () => (watch(activeTab) as string[]) || []
  const setCurrentList = (items: string[]) => setValue(activeTab, items)

  const addItem = () => {
    if (newItem.trim()) {
      setCurrentList([...getCurrentList(), newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    setCurrentList(getCurrentList().filter((_, i) => i !== index))
  }

  const currentList = getCurrentList()

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="must_do">Must Do</TabsTrigger>
          <TabsTrigger value="should_do">Should Do</TabsTrigger>
          <TabsTrigger value="nice_to_have">Nice to Have</TabsTrigger>
          <TabsTrigger value="out_of_scope">Out of Scope</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-2 mt-4">
          <div className="space-y-2">
            {currentList.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const updated = [...currentList]
                    updated[index] = e.target.value
                    setCurrentList(updated)
                  }}
                  placeholder={`${activeTab.replace('_', ' ')} item...`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder={`Add ${activeTab.replace('_', ' ')} item...`}
              />
              <Button type="button" variant="outline" size="icon" onClick={addItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

