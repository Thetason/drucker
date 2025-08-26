"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, CheckCircle, Circle, AlertCircle,
  Clock, Bell, Plus, Trash2, Edit, ArrowRight,
  FileText, Play, Film, Camera, Upload, Package,
  ChevronRight, MoreVertical, Copy, ExternalLink
} from "lucide-react"

interface Task {
  id: string
  planId?: string  // 연결된 기획서 ID
  title: string
  stage: "planning" | "filming" | "editing" | "review" | "upload" | "complete"
  dueDate: string
  reminder: boolean
  notes: string
  completed: boolean
  platform?: 'youtube' | 'shorts' | 'reels'
  target?: string
  hook?: string
}

interface SavedPlan {
  id: string
  title: string
  platform: 'youtube' | 'shorts' | 'reels'
  target: string
  hook: string
  goal: string
  duration: string
  updatedAt: string
}

export function ProductionScheduleV2() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])
  const [draggedPlan, setDraggedPlan] = useState<SavedPlan | null>(null)
  const [showPlanLibrary, setShowPlanLibrary] = useState(true)
  
  const [newTask, setNewTask] = useState<{
    title: string
    stage: Task["stage"]
    dueDate: string
    notes: string
  }>({
    title: "",
    stage: "planning",
    dueDate: "",
    notes: ""
  })

  const stages = {
    planning: { label: "기획", color: "bg-gray-500", icon: <Edit />, borderColor: "border-gray-500" },
    filming: { label: "촬영", color: "bg-red-500", icon: <Camera />, borderColor: "border-red-500" },
    editing: { label: "편집", color: "bg-yellow-500", icon: <Film />, borderColor: "border-yellow-500" },
    review: { label: "검토", color: "bg-blue-500", icon: <Play />, borderColor: "border-blue-500" },
    upload: { label: "업로드", color: "bg-green-500", icon: <Upload />, borderColor: "border-green-500" },
    complete: { label: "완료", color: "bg-purple-500", icon: <CheckCircle />, borderColor: "border-purple-500" }
  }

  const platformIcons = {
    youtube: '📺',
    shorts: '📱',
    reels: '🎬'
  }

  // Load saved plans from localStorage
  useEffect(() => {
    const plans = localStorage.getItem('drucker-plans')
    if (plans) {
      setSavedPlans(JSON.parse(plans))
    }

    const savedTasks = localStorage.getItem('drucker-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('drucker-tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const handleDragStart = (e: React.DragEvent, plan: SavedPlan) => {
    setDraggedPlan(plan)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (draggedPlan) {
      // Check if this plan is already in the schedule
      const existingTask = tasks.find(t => t.planId === draggedPlan.id)
      if (existingTask) {
        alert('이 기획서는 이미 스케줄에 있습니다')
        return
      }

      // Create new task from plan
      const newTask: Task = {
        id: Date.now().toString(),
        planId: draggedPlan.id,
        title: draggedPlan.title,
        stage: 'planning',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7일 후
        reminder: true,
        notes: `목표: ${draggedPlan.goal} | 타겟: ${draggedPlan.target}`,
        completed: false,
        platform: draggedPlan.platform,
        target: draggedPlan.target,
        hook: draggedPlan.hook
      }
      
      setTasks([...tasks, newTask])
      setDraggedPlan(null)
    }
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

  const duplicateTask = (task: Task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (복사본)`,
      stage: 'planning' as const,
      completed: false
    }
    setTasks([...tasks, newTask])
  }

  const getDaysLeft = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const openPlanInEditor = (planId: string) => {
    // Store the plan ID to open in editor
    localStorage.setItem('drucker-open-plan', planId)
    // You could trigger a tab switch here if needed
    alert('기획서 탭에서 확인하세요')
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Saved Plans Library */}
        <div className={`${showPlanLibrary ? 'col-span-3' : 'col-span-1'} transition-all`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${!showPlanLibrary && 'hidden'}`}>
                  기획서 라이브러리
                </h3>
                <button
                  onClick={() => setShowPlanLibrary(!showPlanLibrary)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {showPlanLibrary ? '←' : '→'}
                </button>
              </div>
            </div>
            
            {showPlanLibrary && (
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {savedPlans.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    저장된 기획서가 없습니다
                  </p>
                ) : (
                  savedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, plan)}
                      className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-blue-300"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">{platformIcons[plan.platform]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{plan.title}</p>
                          <p className="text-xs text-gray-500 truncate">{plan.target}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(plan.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    기획서를 드래그하여 스케줄에 추가
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Schedule */}
        <div className={`${showPlanLibrary ? 'col-span-9' : 'col-span-11'} space-y-6`}>
          {/* Drop Zone for Plans */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 transition-all ${
              draggedPlan ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                {draggedPlan ? '여기에 놓아서 스케줄 추가' : '기획서를 여기로 드래그'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                또는 아래에서 직접 작업 추가
              </p>
            </div>
          </div>

          {/* Add New Task Manually */}
          <div className="p-4 border-2 border-dashed rounded-lg space-y-3 bg-white">
            <h3 className="font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 작업 추가
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="콘텐츠 제목"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="px-3 py-2 border rounded-md"
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
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="px-3 py-2 border rounded-md"
              />
              <input
                placeholder="메모 (선택사항)"
                value={newTask.notes}
                onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                className="px-3 py-2 border rounded-md"
              />
            </div>
            <button 
              onClick={addTask}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              작업 추가
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            <h3 className="font-medium">현재 진행 중인 작업</h3>
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  기획서를 드래그하거나 새 작업을 추가하세요
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((task) => {
                  const daysLeft = getDaysLeft(task.dueDate)
                  const isUrgent = daysLeft <= 2 && !task.completed
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-4 bg-white border-2 rounded-lg transition-all ${
                        isUrgent ? "border-red-500 bg-red-50" : stages[task.stage].borderColor
                      } ${task.completed ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {task.platform && (
                              <span className="text-lg">{platformIcons[task.platform]}</span>
                            )}
                            <h4 className="font-medium">{task.title}</h4>
                            {task.planId && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                기획서 연결됨
                              </span>
                            )}
                            {isUrgent && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                긴급
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {task.dueDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {daysLeft > 0 ? `${daysLeft}일 남음` : daysLeft === 0 ? "오늘" : "기한 경과"}
                            </span>
                            {task.notes && (
                              <span className="text-xs truncate max-w-xs">📝 {task.notes}</span>
                            )}
                          </div>
                          {task.hook && (
                            <p className="text-xs text-gray-500 mt-1">
                              훅: {task.hook}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.planId && (
                            <button
                              onClick={() => openPlanInEditor(task.planId!)}
                              className="p-2 hover:bg-gray-100 rounded"
                              title="기획서 열기"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleReminder(task.id)}
                            className={`p-2 rounded ${
                              task.reminder ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                            }`}
                          >
                            <Bell className={`h-4 w-4 ${task.reminder ? "fill-current" : ""}`} />
                          </button>
                          <div className="relative group">
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-10">
                              <button
                                onClick={() => duplicateTask(task)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Copy className="h-3 w-3" />
                                복제
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="h-3 w-3" />
                                삭제
                              </button>
                            </div>
                          </div>
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
          <div className="grid grid-cols-4 gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
              <p className="text-xs text-gray-600">진행 중</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{tasks.filter(t => t.stage === 'filming').length}</p>
              <p className="text-xs text-gray-600">촬영 대기</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {tasks.filter(t => getDaysLeft(t.dueDate) <= 2 && !t.completed).length}
              </p>
              <p className="text-xs text-gray-600">긴급 항목</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{tasks.filter(t => t.completed).length}</p>
              <p className="text-xs text-gray-600">완료</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}