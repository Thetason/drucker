"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  title: string
  is_completed: boolean
}

interface ChecklistProps {
  items: ChecklistItem[]
  onUpdate?: (items: ChecklistItem[]) => void
  editable?: boolean
}

export function Checklist({ items, onUpdate, editable = false }: ChecklistProps) {
  const [localItems, setLocalItems] = useState(items)
  const [newItem, setNewItem] = useState("")

  const handleToggle = (id: string) => {
    const updated = localItems.map(item =>
      item.id === id ? { ...item, is_completed: !item.is_completed } : item
    )
    setLocalItems(updated)
    onUpdate?.(updated)
  }

  const handleAdd = () => {
    if (!newItem.trim()) return
    
    const newChecklistItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newItem,
      is_completed: false
    }
    
    const updated = [...localItems, newChecklistItem]
    setLocalItems(updated)
    onUpdate?.(updated)
    setNewItem("")
  }

  const handleDelete = (id: string) => {
    const updated = localItems.filter(item => item.id !== id)
    setLocalItems(updated)
    onUpdate?.(updated)
  }

  const completedCount = localItems.filter(item => item.is_completed).length
  const progress = localItems.length > 0 ? Math.round((completedCount / localItems.length) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">체크리스트</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{localItems.length} 완료 ({progress}%)
        </span>
      </div>

      <div className="space-y-2">
        {localItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50",
              item.is_completed && "opacity-60"
            )}
          >
            <Checkbox
              checked={item.is_completed}
              onCheckedChange={() => handleToggle(item.id)}
            />
            <span
              className={cn(
                "flex-1 text-sm",
                item.is_completed && "line-through"
              )}
            >
              {item.title}
            </span>
            {editable && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
                className="h-6 w-6"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {editable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="새 항목 추가..."
            className="flex-1 px-3 py-2 text-sm border rounded-md"
          />
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}