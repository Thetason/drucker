"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StageTrackerProps {
  currentStage: 'planning' | 'shooting' | 'editing' | 'uploading' | 'analyzing'
  completedStages: string[]
}

const stages = [
  { id: 'planning', label: '기획', icon: '📝' },
  { id: 'shooting', label: '촬영', icon: '📹' },
  { id: 'editing', label: '편집', icon: '✂️' },
  { id: 'uploading', label: '업로드', icon: '📤' },
  { id: 'analyzing', label: '분석', icon: '📊' },
]

export function StageTracker({ currentStage, completedStages }: StageTrackerProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {stages.map((stage, index) => {
        const isCompleted = completedStages.includes(stage.id)
        const isCurrent = stage.id === currentStage
        
        return (
          <div key={stage.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isCompleted && "bg-green-500 border-green-500",
                  isCurrent && !isCompleted && "bg-blue-500 border-blue-500",
                  !isCompleted && !isCurrent && "bg-gray-100 border-gray-300"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <span className="text-lg">{stage.icon}</span>
                )}
              </div>
              <span className={cn(
                "text-xs mt-2",
                (isCompleted || isCurrent) ? "font-semibold" : "text-muted-foreground"
              )}>
                {stage.label}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}