"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, CheckCircle, Circle, AlertCircle,
  Clock, Bell, Plus, Trash2, Edit, ArrowRight,
  FileText, Play, Film, Camera, Upload, Package,
  ChevronRight, ChevronLeft, MoreVertical, Copy, ExternalLink,
  AlertTriangle, Target, Timer, TrendingUp, 
  CheckSquare, XCircle, RefreshCw, BellRing,
  CalendarClock, Zap, Shield, Award, Minus
} from "lucide-react"

interface Task {
  id: string
  planId?: string  // 연결된 기획서 ID
  title: string
  stage: "planning" | "filming" | "editing" | "review" | "upload" | "complete"
  dueDate: string
  dueTime?: string  // 시간 추가
  reminder: boolean
  reminderTime?: 'ontime' | '1hour' | '3hours' | '1day' | '3days'  // 알림 시간
  notes: string
  completed: boolean
  completedAt?: string  // 완료 시간
  platform?: 'youtube' | 'shorts' | 'reels'
  target?: string
  hook?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'  // 우선순위
  progress?: number  // 진행률 (0-100)
  subtasks?: {  // 세부 작업
    id: string
    title: string
    completed: boolean
  }[]
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

// 알림 시간 옵션
const reminderOptions = {
  'ontime': '정시',
  '1hour': '1시간 전',
  '3hours': '3시간 전',
  '1day': '1일 전',
  '3days': '3일 전'
}

// 우선순위 설정
const priorityConfig = {
  urgent: { label: '긴급', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500', icon: '🔥' },
  high: { label: '높음', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500', icon: '⚡' },
  medium: { label: '보통', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500', icon: '💫' },
  low: { label: '낮음', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-300', icon: '☁️' }
}

export function ProductionScheduleV2() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])
  const [draggedPlan, setDraggedPlan] = useState<SavedPlan | null>(null)
  const [showPlanLibrary, setShowPlanLibrary] = useState(true)
  const [libraryWidth, setLibraryWidth] = useState(3) // 1-6 grid columns
  const [isResizing, setIsResizing] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'kanban'>('list')
  const [filterStage, setFilterStage] = useState<'all' | Task['stage']>('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  
  const [newTask, setNewTask] = useState<{
    title: string
    stage: Task["stage"]
    dueDate: string
    dueTime: string
    priority: Task["priority"]
    notes: string
    reminderTime: Task["reminderTime"]
  }>({
    title: "",
    stage: "planning",
    dueDate: "",
    dueTime: "09:00",
    priority: "medium",
    notes: "",
    reminderTime: "1day"
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

  // Check for due tasks and show notifications
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date()
      
      tasks.forEach(task => {
        if (task.completed || !task.reminder) return
        
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`)
        const timeDiff = dueDateTime.getTime() - now.getTime()
        const hoursLeft = timeDiff / (1000 * 60 * 60)
        
        // Check reminder time
        let shouldNotify = false
        switch (task.reminderTime) {
          case 'ontime':
            shouldNotify = timeDiff <= 0 && timeDiff > -60000 // Within 1 minute
            break
          case '1hour':
            shouldNotify = hoursLeft <= 1 && hoursLeft > 0.95
            break
          case '3hours':
            shouldNotify = hoursLeft <= 3 && hoursLeft > 2.95
            break
          case '1day':
            shouldNotify = hoursLeft <= 24 && hoursLeft > 23.95
            break
          case '3days':
            shouldNotify = hoursLeft <= 72 && hoursLeft > 71.95
            break
        }
        
        if (shouldNotify) {
          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification(`📅 ${task.title}`, {
              body: `데드라인: ${task.dueDate} ${task.dueTime || ''}`,
              icon: '/icon.png'
            })
          }
        }
      })
    }
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    
    // Check every minute
    const interval = setInterval(checkDeadlines, 60000)
    checkDeadlines() // Initial check
    
    return () => clearInterval(interval)
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

      // Create new task from plan with default deadline
      const defaultDeadline = new Date()
      defaultDeadline.setDate(defaultDeadline.getDate() + 7) // 7일 후
      
      const newTask: Task = {
        id: Date.now().toString(),
        planId: draggedPlan.id,
        title: draggedPlan.title,
        stage: 'planning',
        dueDate: defaultDeadline.toISOString().split('T')[0],
        dueTime: '18:00', // Default 6 PM
        reminder: true,
        reminderTime: '1day',
        notes: `목표: ${draggedPlan.goal} | 타겟: ${draggedPlan.target}`,
        completed: false,
        platform: draggedPlan.platform,
        target: draggedPlan.target,
        hook: draggedPlan.hook,
        priority: 'medium',
        progress: 0,
        subtasks: [
          { id: '1', title: '기획 검토', completed: false },
          { id: '2', title: '촬영 준비', completed: false },
          { id: '3', title: '편집 완료', completed: false },
          { id: '4', title: '썸네일 제작', completed: false },
          { id: '5', title: '최종 검토', completed: false }
        ]
      }
      
      setTasks([...tasks, newTask])
      setDraggedPlan(null)
    }
  }

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      alert('제목과 데드라인을 입력해주세요')
      return
    }
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      stage: newTask.stage,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      reminder: true,
      reminderTime: newTask.reminderTime,
      notes: newTask.notes,
      completed: false,
      priority: newTask.priority,
      progress: 0,
      subtasks: []
    }
    
    setTasks([...tasks, task])
    setNewTask({ 
      title: "", 
      stage: "planning", 
      dueDate: "", 
      dueTime: "09:00",
      priority: "medium",
      notes: "",
      reminderTime: "1day"
    })
  }

  const updateTaskStage = (taskId: string, newStage: Task["stage"]) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const isComplete = newStage === "complete"
        const progress = getProgressByStage(newStage)
        return { 
          ...task, 
          stage: newStage, 
          completed: isComplete,
          completedAt: isComplete ? new Date().toISOString() : undefined,
          progress
        }
      }
      return task
    }))
  }

  const getProgressByStage = (stage: Task["stage"]): number => {
    switch (stage) {
      case 'planning': return 20
      case 'filming': return 40
      case 'editing': return 60
      case 'review': return 80
      case 'upload': return 90
      case 'complete': return 100
      default: return 0
    }
  }

  const toggleReminder = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, reminder: !task.reminder }
        : task
    ))
  }

  const updateTaskPriority = (taskId: string, priority: Task["priority"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, priority }
        : task
    ))
  }

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks?.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
        const completedCount = updatedSubtasks?.filter(st => st.completed).length || 0
        const totalCount = updatedSubtasks?.length || 1
        const baseProgress = getProgressByStage(task.stage)
        const stageRange = 20 // Each stage has 20% range
        const subtaskProgress = (completedCount / totalCount) * stageRange
        const progress = Math.min(baseProgress - stageRange + subtaskProgress, baseProgress)
        
        return { ...task, subtasks: updatedSubtasks, progress }
      }
      return task
    }))
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
      completed: false,
      progress: 0,
      subtasks: task.subtasks?.map(st => ({ ...st, completed: false }))
    }
    setTasks([...tasks, newTask])
  }

  const getDaysLeft = (dueDate: string, dueTime?: string) => {
    const now = new Date()
    const due = new Date(`${dueDate}T${dueTime || '23:59'}`)
    const diff = due.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (diff < 0) return { days: 0, hours: 0, overdue: true }
    return { days, hours, overdue: false }
  }

  const getDeadlineStatus = (dueDate: string, dueTime?: string) => {
    const { days, hours, overdue } = getDaysLeft(dueDate, dueTime)
    
    if (overdue) return { color: 'text-red-600', bg: 'bg-red-50', label: '기한 초과', icon: '🚨' }
    if (days === 0) return { color: 'text-red-600', bg: 'bg-red-50', label: `${hours}시간 남음`, icon: '⏰' }
    if (days <= 1) return { color: 'text-orange-600', bg: 'bg-orange-50', label: '내일까지', icon: '⚠️' }
    if (days <= 3) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: `${days}일 남음`, icon: '📅' }
    if (days <= 7) return { color: 'text-blue-600', bg: 'bg-blue-50', label: `${days}일 남음`, icon: '📆' }
    return { color: 'text-gray-600', bg: 'bg-gray-50', label: `${days}일 남음`, icon: '📅' }
  }

  const openPlanInEditor = (planId: string) => {
    localStorage.setItem('drucker-open-plan', planId)
    alert('기획서 탭에서 확인하세요')
  }

  // Get stats for dashboard
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const overdue = tasks.filter(t => !t.completed && getDaysLeft(t.dueDate, t.dueTime).overdue).length
    const urgent = tasks.filter(t => !t.completed && (t.priority === 'urgent' || t.priority === 'high')).length
    const todayTasks = tasks.filter(t => {
      const { days } = getDaysLeft(t.dueDate, t.dueTime)
      return !t.completed && days === 0
    })
    
    return { total, completed, overdue, urgent, todayTasks: todayTasks.length }
  }

  const stats = getTaskStats()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 작업</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">완료</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">기한 초과</p>
              <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">긴급 작업</p>
              <p className="text-2xl font-bold text-orange-700">{stats.urgent}</p>
            </div>
            <Zap className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">오늘 마감</p>
              <p className="text-2xl font-bold text-blue-700">{stats.todayTasks}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Saved Plans Library */}
        <div className={`${
          !showPlanLibrary ? 'col-span-1' :
          libraryWidth === 2 ? 'col-span-2' :
          libraryWidth === 3 ? 'col-span-3' :
          libraryWidth === 4 ? 'col-span-4' :
          libraryWidth === 5 ? 'col-span-5' :
          'col-span-6'
        } transition-all relative`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${!showPlanLibrary && 'hidden'}`}>
                  기획서 라이브러리
                </h3>
                <div className="flex items-center gap-1">
                  {showPlanLibrary && (
                    <>
                      <button
                        onClick={() => setLibraryWidth(Math.max(2, libraryWidth - 1))}
                        disabled={libraryWidth <= 2}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                        title="축소"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-gray-500 px-1">{libraryWidth}/6</span>
                      <button
                        onClick={() => setLibraryWidth(Math.min(6, libraryWidth + 1))}
                        disabled={libraryWidth >= 6}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                        title="확대"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowPlanLibrary(!showPlanLibrary)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {showPlanLibrary ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
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
        <div className={`${
          !showPlanLibrary ? 'col-span-11' :
          libraryWidth === 2 ? 'col-span-10' :
          libraryWidth === 3 ? 'col-span-9' :
          libraryWidth === 4 ? 'col-span-8' :
          libraryWidth === 5 ? 'col-span-7' :
          'col-span-6'
        } space-y-6`}>
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

          {/* Add New Task Form */}
          <div className="p-4 border-2 border-dashed rounded-lg space-y-3 bg-white">
            <h3 className="font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 작업 추가
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="콘텐츠 제목"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none w-full"
                />
                <select
                  value={newTask.stage}
                  onChange={(e) => setNewTask({...newTask, stage: e.target.value as Task["stage"]})}
                  className="px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none w-full"
                >
                  {Object.entries(stages).filter(([key]) => key !== "complete").map(([key, stage]) => (
                    <option key={key} value={key}>{stage.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="flex-1 px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                    className="px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task["priority"]})}
                  className="px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none w-full"
                >
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.icon} {config.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={newTask.reminderTime}
                  onChange={(e) => setNewTask({...newTask, reminderTime: e.target.value as Task["reminderTime"]})}
                  className="px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none w-full"
                >
                  <option value="">알림 설정</option>
                  {Object.entries(reminderOptions).map(([key, label]) => (
                    <option key={key} value={key}>🔔 {label} 알림</option>
                  ))}
                </select>
                
                <input
                  placeholder="메모 (선택사항)"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  className="px-3 py-2 border rounded-md focus:border-blue-500 focus:outline-none w-full"
                />
              </div>
            </div>
            <button
              onClick={addTask}
              className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              작업 추가
            </button>
          </div>

          {/* Filter and View Options */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStage('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStage === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {Object.entries(stages).map(([key, stage]) => (
                <button
                  key={key}
                  onClick={() => setFilterStage(key as Task['stage'])}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    filterStage === key ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="h-3 w-3">{stage.icon}</span>
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks
              .filter(task => filterStage === 'all' || task.stage === filterStage)
              .sort((a, b) => {
                // Sort by priority and due date
                const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
                const aPriority = priorityOrder[a.priority || 'medium']
                const bPriority = priorityOrder[b.priority || 'medium']
                if (aPriority !== bPriority) return aPriority - bPriority
                
                return new Date(`${a.dueDate}T${a.dueTime || '23:59'}`).getTime() - 
                       new Date(`${b.dueDate}T${b.dueTime || '23:59'}`).getTime()
              })
              .map((task) => {
                const deadlineStatus = getDeadlineStatus(task.dueDate, task.dueTime)
                const priority = priorityConfig[task.priority || 'medium']
                
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                      task.completed ? 'opacity-60 border-gray-200' : stages[task.stage].borderColor
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {task.platform && (
                            <span className="text-2xl">{platformIcons[task.platform]}</span>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium text-lg ${task.completed && 'line-through'}`}>
                                {task.title}
                              </h3>
                              {task.priority && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                                  {priority.icon} {priority.label}
                                </span>
                              )}
                            </div>
                            
                            {/* Deadline Display */}
                            <div className="flex items-center gap-4 mb-2">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${deadlineStatus.bg}`}>
                                <CalendarClock className={`h-4 w-4 ${deadlineStatus.color}`} />
                                <span className={`text-sm font-medium ${deadlineStatus.color}`}>
                                  {deadlineStatus.icon} {task.dueDate} {task.dueTime}
                                </span>
                                <span className={`text-xs ${deadlineStatus.color}`}>
                                  ({deadlineStatus.label})
                                </span>
                              </div>
                              
                              {task.reminder && (
                                <div className="flex items-center gap-1">
                                  <BellRing className="h-4 w-4 text-blue-500" />
                                  <span className="text-xs text-blue-600">
                                    {reminderOptions[task.reminderTime || '1day']}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">진행률</span>
                                <span className="text-xs font-medium">{task.progress || 0}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    task.completed ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${task.progress || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* Subtasks */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="space-y-1 mb-3">
                                {task.subtasks.map(subtask => (
                                  <div 
                                    key={subtask.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <button
                                      onClick={() => toggleSubtask(task.id, subtask.id)}
                                      className={`p-0.5 rounded ${
                                        subtask.completed ? 'text-green-600' : 'text-gray-400'
                                      }`}
                                    >
                                      {subtask.completed ? <CheckSquare className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                    </button>
                                    <span className={subtask.completed ? 'line-through text-gray-400' : ''}>
                                      {subtask.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {task.notes && (
                              <p className="text-sm text-gray-600">{task.notes}</p>
                            )}
                            
                            {task.target && (
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>타겟: {task.target}</span>
                                {task.hook && <span>훅: {task.hook}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {/* Stage Selector */}
                        <select
                          value={task.stage}
                          onChange={(e) => updateTaskStage(task.id, e.target.value as Task["stage"])}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${stages[task.stage].color} text-white`}
                        >
                          {Object.entries(stages).map(([key, stage]) => (
                            <option key={key} value={key}>{stage.label}</option>
                          ))}
                        </select>
                        
                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleReminder(task.id)}
                            className={`p-1.5 rounded hover:bg-gray-100 ${
                              task.reminder ? 'text-blue-600' : 'text-gray-400'
                            }`}
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                          
                          {task.planId && (
                            <button
                              onClick={() => openPlanInEditor(task.planId!)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => duplicateTask(task)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 rounded hover:bg-gray-100 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              
            {tasks.filter(task => filterStage === 'all' || task.stage === filterStage).length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">작업이 없습니다</p>
                <p className="text-sm text-gray-400 mt-1">
                  기획서를 드래그하거나 직접 추가해보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}