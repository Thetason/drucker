"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Calendar, CheckCircle, Circle, AlertCircle,
  Clock, Bell, Plus, Trash2, Edit
} from "lucide-react"

interface Task {
  id: string
  title: string
  stage: "planning" | "filming" | "editing" | "review" | "upload" | "complete"
  dueDate: string
  reminder: boolean
  notes: string
  completed: boolean
}

export function ProductionSchedule() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "요리 브이로그 EP.5",
      stage: "editing",
      dueDate: "2025-08-27",
      reminder: true,
      notes: "썸네일 제작 필요",
      completed: false
    },
    {
      id: "2",
      title: "쇼츠 - 꿀팁 시리즈 #3",
      stage: "planning",
      dueDate: "2025-08-26",
      reminder: false,
      notes: "스크립트 작성 중",
      completed: false
    }
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    stage: "planning" as const,
    dueDate: "",
    notes: ""
  })

  const stages = {
    planning: { label: "기획", color: "bg-gray-500", icon: <Edit /> },
    filming: { label: "촬영", color: "bg-red-500", icon: <Circle /> },
    editing: { label: "편집", color: "bg-yellow-500", icon: <Circle /> },
    review: { label: "검토", color: "bg-blue-500", icon: <Circle /> },
    upload: { label: "업로드", color: "bg-green-500", icon: <Circle /> },
    complete: { label: "완료", color: "bg-purple-500", icon: <CheckCircle /> }
  }

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      stage: newTask.stage,
      dueDate: newTask.dueDate,
      reminder: false,
      notes: newTask.notes,
      completed: false
    }
    
    setTasks([...tasks, task])
    setNewTask({ title: "", stage: "planning", dueDate: "", notes: "" })
  }

  const updateTaskStage = (taskId: string, newStage: Task["stage"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, stage: newStage, completed: newStage === "complete" }
        : task
    ))
  }

  const toggleReminder = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, reminder: !task.reminder }
        : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const getDaysLeft = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-500" />
          제작 스케줄 관리
        </CardTitle>
        <CardDescription>
          콘텐츠 제작 단계별 진행 상황 추적 및 알림
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Task */}
        <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 콘텐츠 추가
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="콘텐츠 제목"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            <select
              value={newTask.stage}
              onChange={(e) => setNewTask({...newTask, stage: e.target.value as Task["stage"]})}
              className="px-3 py-2 border rounded-md"
            >
              {Object.entries(stages).filter(([key]) => key !== "complete").map(([key, stage]) => (
                <option key={key} value={key}>{stage.label}</option>
              ))}
            </select>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            />
            <Input
              placeholder="메모 (선택사항)"
              value={newTask.notes}
              onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
            />
          </div>
          <Button onClick={addTask} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            콘텐츠 추가
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h3 className="font-medium">현재 진행 중인 콘텐츠</h3>
          {tasks.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              아직 등록된 콘텐츠가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((task) => {
                const daysLeft = getDaysLeft(task.dueDate)
                const isUrgent = daysLeft <= 2 && !task.completed
                
                return (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg ${
                      isUrgent ? "border-red-500 bg-red-50" : ""
                    } ${task.completed ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{task.title}</h4>
                          {isUrgent && (
                            <Badge className="bg-red-500 text-white text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              긴급
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {daysLeft > 0 ? `${daysLeft}일 남음` : daysLeft === 0 ? "오늘" : "기한 경과"}
                          </span>
                          {task.notes && (
                            <span className="text-xs">📝 {task.notes}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={task.reminder ? "default" : "outline"}
                          onClick={() => toggleReminder(task.id)}
                        >
                          <Bell className={`h-4 w-4 ${task.reminder ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Stage Progress */}
                    <div className="flex items-center gap-1">
                      {Object.entries(stages).map(([key, stage], index) => (
                        <button
                          key={key}
                          onClick={() => updateTaskStage(task.id, key as Task["stage"])}
                          className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                            task.stage === key
                              ? `${stage.color} text-white`
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {task.stage === key ? (
                              stage.icon
                            ) : index < Object.keys(stages).indexOf(task.stage) ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Circle className="h-3 w-3" />
                            )}
                            <span>{stage.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
            <p className="text-xs text-muted-foreground">진행 중</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{tasks.filter(t => getDaysLeft(t.dueDate) <= 2 && !t.completed).length}</p>
            <p className="text-xs text-muted-foreground">긴급 항목</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
            <p className="text-xs text-muted-foreground">완료</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}