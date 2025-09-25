'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Bell, BellOff, 
  Clock, AlertCircle, CheckCircle, Play, Film,
  User, Mail, BookOpen, X
} from 'lucide-react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description?: string
  date: string
  startTime?: string
  endTime?: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  priority: 'low' | 'medium' | 'high'
  platform?: string
  assignee?: string
  tags?: string[]
  reminder?: {
    enabled: boolean
    time: string
    method: 'browser' | 'email' | 'both'
  }
  color?: string
  planId?: string
  planTitle?: string
  planPlatform?: string
}

interface PlanOption {
  id: string
  title: string
  platform?: string
  hook?: string
  target?: string
  updatedAt?: string
}

interface TaskDraft {
  id: string
  title: string
  planId: string
  planPlatform?: string
  date: string
  startTime: string
  endTime: string
  status: Task['status']
  priority: Task['priority']
  reminderEnabled: boolean
  reminderTime: string
  reminderMethod: 'browser' | 'email' | 'both'
  notes: string
  color: string
}

const TASK_STORAGE_KEY = 'drucker-schedule-tasks'

const getPlatformColor = (platform?: string) => {
  switch (platform) {
    case 'youtube':
      return '#ef4444'
    case 'shorts':
      return '#f97316'
    case 'reels':
      return '#ec4899'
    case 'instagram':
      return '#c084fc'
    case 'tiktok':
      return '#14b8a6'
    default:
      return '#6366f1'
  }
}

const getPlatformLabel = (platform?: string) => {
  switch (platform) {
    case 'youtube':
      return 'YouTube'
    case 'shorts':
      return 'YouTube · Shorts'
    case 'reels':
      return 'Instagram · Reels'
    case 'instagram':
      return 'Instagram'
    case 'tiktok':
      return 'TikTok'
    default:
      return platform
  }
}

const createEmptyDraft = (options: PlanOption[], date?: string): TaskDraft => {
  const defaultPlan = options[0]
  return {
    id: `task-${Date.now()}`,
    title: defaultPlan?.title || '',
    planId: defaultPlan?.id || '',
    planPlatform: defaultPlan?.platform,
    date: date || new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    status: 'pending',
    priority: 'medium',
    reminderEnabled: false,
    reminderTime: '60',
    reminderMethod: 'browser',
    notes: '',
    color: getPlatformColor(defaultPlan?.platform)
  }
}

const createDraftFromTask = (task: Task): TaskDraft => ({
  id: task.id,
  title: task.title,
  planId: task.planId || '',
  planPlatform: task.planPlatform,
  date: task.date,
  startTime: task.startTime || '',
  endTime: task.endTime || '',
  status: task.status,
  priority: task.priority,
  reminderEnabled: Boolean(task.reminder?.enabled),
  reminderTime: task.reminder?.time || '60',
  reminderMethod: task.reminder?.method || 'browser',
  notes: task.description || '',
  color: task.color || getPlatformColor(task.planPlatform)
})

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [tasks, setTasks] = useState<Task[]>([])
  const [planOptions, setPlanOptions] = useState<PlanOption[]>([])
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<TaskDraft>(() => createEmptyDraft([]))
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)

  // 초기 알림 권한 상태 확인 및 로컬 데이터 로드
  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true)
    }

    const loadStoredTasks = () => {
      const stored = window.localStorage.getItem(TASK_STORAGE_KEY)
      if (!stored) {
        setTasks([])
        return
      }
      try {
        const parsed: Task[] = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setTasks(parsed)
        }
      } catch (error) {
        console.error('일정 로드 오류:', error)
      }
    }

    const loadPlans = () => {
      const rawPlans = window.localStorage.getItem('drucker-plans')
      if (!rawPlans) {
        setPlanOptions([])
        return
      }
      try {
        const parsed = JSON.parse(rawPlans)
        if (Array.isArray(parsed)) {
          const mapped: PlanOption[] = parsed
            .filter((plan: any) => plan && plan.id)
            .map((plan: any) => ({
              id: plan.id,
              title: plan.title || plan.goal || '제목 없는 기획',
              platform: plan.platform,
              hook: plan.hook,
              target: plan.target,
              updatedAt: plan.updatedAt
            }))
          setPlanOptions(mapped)
        } else {
          setPlanOptions([])
        }
      } catch (error) {
        console.error('기획서 로드 오류:', error)
        setPlanOptions([])
      }
    }

    loadStoredTasks()
    loadPlans()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'drucker-plans') {
        loadPlans()
      }
      if (event.key === TASK_STORAGE_KEY) {
        loadStoredTasks()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 알림을 지원하지 않습니다.')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
        new Notification('드러커 알림', {
          body: '알림이 활성화되었습니다!',
          icon: '/favicon.ico'
        })
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error)
    }
  }

  // 예정된 알림 체크
  const checkUpcomingReminders = (taskList: Task[]) => {
    const now = new Date()
    
    taskList.forEach(task => {
      if (task.reminder?.enabled && task.startTime) {
        const taskDateTime = new Date(`${task.date} ${task.startTime}`)
        const reminderTime = new Date(taskDateTime.getTime() - parseInt(task.reminder.time) * 60000)
        
        if (reminderTime > now && reminderTime < new Date(now.getTime() + 60000)) {
          // 1분 이내 알림
          sendNotification(task)
        }
      }
    })
  }

  // 알림 보내기
  const sendNotification = (task: Task) => {
    if (task.reminder?.method === 'browser' || task.reminder?.method === 'both') {
      if (notificationsEnabled) {
        new Notification(`📅 ${task.title}`, {
          body: `${task.reminder.time}분 후 시작됩니다\n${task.description || ''}`,
          icon: '/favicon.ico',
          tag: task.id
        })
      }
    }

    if (task.reminder?.method === 'email' || task.reminder?.method === 'both') {
      if (emailNotifications) {
        // 실제로는 백엔드 API 호출
        console.log('이메일 알림 전송:', task)
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
    }

    if (tasks.length > 0) {
      checkUpcomingReminders(tasks)
    }
  }, [tasks])

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault()
    if (!draggedTask) return

    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id 
        ? { ...task, date } 
        : task
    )
    setTasks(updatedTasks)
    setDraggedTask(null)
  }

  const openNewTask = (date: string) => {
    setEditorMode('create')
    setDraft(createEmptyDraft(planOptions, date))
    setIsEditorOpen(true)
  }

  const openExistingTask = (task: Task) => {
    setEditorMode('edit')
    setDraft(createDraftFromTask(task))
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setDraft(createEmptyDraft(planOptions))
  }

  const handlePlanSelect = (planId: string) => {
    const plan = planOptions.find(option => option.id === planId)
    setDraft(prev => {
      const previousPlan = planOptions.find(option => option.id === prev.planId)
      const shouldAdoptTitle =
        editorMode === 'create' ||
        prev.title.trim() === '' ||
        (previousPlan && prev.title === previousPlan.title)

      return {
        ...prev,
        planId,
        planPlatform: plan?.platform,
        title: shouldAdoptTitle ? (plan?.title || '') : prev.title,
        color: plan ? getPlatformColor(plan.platform) : prev.color
      }
    })
  }

  const handleSaveTask = () => {
    if (!draft.planId) {
      alert('연결할 기획서를 선택해주세요.')
      return
    }

    if (!draft.date) {
      alert('일정을 등록할 날짜를 선택해주세요.')
      return
    }

    const plan = planOptions.find(option => option.id === draft.planId)
    const taskId = draft.id || `task-${Date.now()}`
    const taskTitle = draft.title.trim() || plan?.title || '새 일정'

    const updatedTask: Task = {
      id: taskId,
      title: taskTitle,
      description: draft.notes.trim() ? draft.notes.trim() : undefined,
      date: draft.date,
      startTime: draft.startTime || undefined,
      endTime: draft.endTime || undefined,
      status: draft.status,
      priority: draft.priority,
      platform: getPlatformLabel(plan?.platform),
      reminder: draft.reminderEnabled
        ? {
            enabled: true,
            time: draft.reminderTime,
            method: draft.reminderMethod
          }
        : undefined,
      color: draft.color || getPlatformColor(plan?.platform),
      planId: draft.planId,
      planTitle: plan?.title || taskTitle,
      planPlatform: plan?.platform
    }

    setTasks(prev => {
      const exists = prev.some(task => task.id === updatedTask.id)
      return exists
        ? prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
        : [...prev, updatedTask]
    })

    closeEditor()
  }

  const handleDeleteTask = () => {
    if (editorMode !== 'edit') {
      closeEditor()
      return
    }

    setTasks(prev => prev.filter(task => task.id !== draft.id))
    closeEditor()
  }

  useEffect(() => {
    if (!isEditorOpen) return
    if (planOptions.length === 0) {
      setDraft(prev => ({ ...prev, planId: '', planPlatform: undefined }))
      return
    }

    const currentPlanExists = planOptions.some(option => option.id === draft.planId)
    if (!currentPlanExists) {
      const fallback = planOptions[0]
      setDraft(prev => ({
        ...prev,
        planId: fallback.id,
        planPlatform: fallback.platform,
        title:
          editorMode === 'create' || prev.title.trim() === '' ? fallback.title || '' : prev.title,
        color: getPlatformColor(fallback.platform)
      }))
    }
  }, [planOptions, isEditorOpen, draft.planId, draft.title, editorMode])

  // 달력 날짜 생성
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // 이전 달 날짜
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0]
      })
    }

    // 현재 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dateString: currentDate.toISOString().split('T')[0]
      })
    }

    // 다음 달 날짜
    const remainingDays = 42 - days.length // 6주 * 7일
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0]
      })
    }

    return days
  }

  const calendarDays = getDaysInMonth(currentDate)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  const getTasksForDate = (dateString: string) => {
    return tasks.filter(task => task.date === dateString)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'delayed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      default: return '🟢'
    }
  }

  const selectedPlan = draft.planId ? planOptions.find(option => option.id === draft.planId) : undefined
  const hasPlans = planOptions.length > 0

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">제작 스케줄</h1>
            <p className="text-gray-400">콘텐츠 제작 일정을 관리하고 알림을 받으세요</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            메인으로 돌아가기
          </Link>
        </div>

        {/* 툴바 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              {/* 달력 네비게이션 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold min-w-[150px] text-center">
                  {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* 오늘 버튼 */}
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                오늘
              </button>

              {/* 뷰 모드 */}
              <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  월
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded ${viewMode === 'week' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  주
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded ${viewMode === 'day' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  일
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* 알림 설정 */}
              <button
                onClick={() => {
                  if (notificationsEnabled) {
                    setNotificationsEnabled(false)
                  } else {
                    requestNotificationPermission()
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${
                  notificationsEnabled 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={notificationsEnabled ? '브라우저 알림 켜짐' : '브라우저 알림 꺼짐'}
              >
                {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`p-2 rounded-lg transition-colors ${
                  emailNotifications 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={emailNotifications ? '이메일 알림 켜짐' : '이메일 알림 꺼짐'}
              >
                <Mail className="w-5 h-5" />
              </button>

              {/* 새 일정 추가 */}
              <button
                onClick={() => openNewTask(new Date().toISOString().split('T')[0])}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                새 일정
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">이번 달 일정</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">진행중</span>
              <Play className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">완료</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">지연</span>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'delayed').length}
            </p>
          </div>
        </div>

        {/* 캘린더 */}
        {viewMode === 'month' && (
          <div className="bg-gray-800 rounded-lg p-4">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDate(day.dateString)
                const isToday = day.dateString === new Date().toISOString().split('T')[0]

                return (
                  <div
                    key={index}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day.dateString)}
                    onDoubleClick={() => openNewTask(day.dateString)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      openNewTask(day.dateString)
                    }}
                    className={`min-h-[120px] p-2 rounded-lg border transition-colors ${
                      day.isCurrentMonth 
                        ? 'bg-gray-700 border-gray-600 hover:border-blue-500' 
                        : 'bg-gray-800 border-gray-700 opacity-50'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-blue-400' : day.isCurrentMonth ? 'text-white' : 'text-gray-500'
                    }`}>
                      {day.date.getDate()}
                    </div>

                    {/* 태스크 목록 */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onClick={() => openExistingTask(task)}
                          className="text-xs p-1 rounded cursor-move hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: task.color || '#6b7280' }}
                          title={task.planTitle ? `${task.title} · ${task.planTitle}` : task.title}
                        >
                          <div className="flex items-center gap-1">
                            <span>{getPriorityIcon(task.priority)}</span>
                            <span className="truncate">{task.title}</span>
                          </div>
                          {task.planTitle && task.planTitle !== task.title && (
                            <div className="text-[10px] opacity-80 truncate">
                              {task.planTitle}
                            </div>
                          )}
                          {task.startTime && (
                            <div className="text-xs opacity-75">{task.startTime}</div>
                          )}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 주간/일간 뷰는 간단히 표시 */}
        {viewMode !== 'month' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {viewMode === 'week' ? '주간' : '일간'} 뷰는 준비 중입니다
            </p>
          </div>
        )}

        {/* 오늘의 일정 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">오늘의 일정</h2>
          <div className="space-y-4">
            {getTasksForDate(new Date().toISOString().split('T')[0]).map(task => (
              <div key={task.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        {task.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.startTime} - {task.endTime}
                          </span>
                        )}
                        {task.planTitle && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {task.planTitle}
                          </span>
                        )}
                        {task.platform && (
                          <span className="flex items-center gap-1">
                            <Film className="w-4 h-4" />
                            {task.platform}
                          </span>
                        )}
                        {task.assignee && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {task.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.reminder?.enabled && (
                      <Bell className="w-4 h-4 text-blue-400" />
                    )}
                    {task.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {getTasksForDate(new Date().toISOString().split('T')[0]).length === 0 && (
              <p className="text-gray-400 text-center py-8">오늘은 예정된 일정이 없습니다</p>
            )}
          </div>
        </div>
      </div>
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/40"
            onClick={closeEditor}
            role="presentation"
          />
          <div className="w-full max-w-md bg-gray-900 text-white border-l border-gray-800 shadow-2xl overflow-y-auto">
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  {editorMode === 'create' ? '새 일정 추가' : '일정 편집'}
                </p>
                <h2 className="text-xl font-semibold mt-1">
                  {draft.title || selectedPlan?.title || '새 일정'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="패널 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveTask()
              }}
              className="px-6 py-6 space-y-6"
            >
              <div>
                <label className="text-sm font-medium text-gray-300">
                  연결할 기획서
                </label>
                {!hasPlans ? (
                  <div className="mt-2 p-4 border border-dashed border-gray-700 rounded-lg text-sm text-gray-400 space-y-2">
                    <p>저장된 기획서가 없습니다.</p>
                    <Link href="/library" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                      <BookOpen className="w-3 h-3" /> 라이브러리로 이동
                    </Link>
                  </div>
                ) : (
                  <select
                    value={draft.planId}
                    onChange={(e) => handlePlanSelect(e.target.value)}
                    className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedPlan && (
                <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 text-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    {selectedPlan.title}
                  </div>
                  {selectedPlan.platform && (
                    <div className="text-xs text-gray-400">
                      플랫폼 · {getPlatformLabel(selectedPlan.platform)}
                    </div>
                  )}
                  {selectedPlan.hook && (
                    <p className="text-xs text-gray-400 line-clamp-2">훅: {selectedPlan.hook}</p>
                  )}
                  {selectedPlan.target && (
                    <p className="text-xs text-gray-400 line-clamp-2">타겟: {selectedPlan.target}</p>
                  )}
                  {selectedPlan.updatedAt && (
                    <p className="text-[11px] text-gray-500">
                      마지막 수정 {new Date(selectedPlan.updatedAt).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-300">일정 제목</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="예: 촬영 준비 회의"
                  className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-sm font-medium text-gray-300">날짜</label>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">시작 시간</label>
                  <input
                    type="time"
                    value={draft.startTime}
                    onChange={(e) => setDraft(prev => ({ ...prev, startTime: e.target.value }))}
                    className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">종료 시간</label>
                  <input
                    type="time"
                    value={draft.endTime}
                    onChange={(e) => setDraft(prev => ({ ...prev, endTime: e.target.value }))}
                    className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">상태</label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                    className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">예정</option>
                    <option value="in_progress">진행중</option>
                    <option value="completed">완료</option>
                    <option value="delayed">지연</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">우선순위</label>
                  <select
                    value={draft.priority}
                    onChange={(e) => setDraft(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                    className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">높음</option>
                    <option value="medium">보통</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">색상</label>
                  <input
                    type="color"
                    value={draft.color}
                    onChange={(e) => setDraft(prev => ({ ...prev, color: e.target.value }))}
                    className="mt-2 h-10 w-16 bg-gray-800 border border-gray-700 rounded"
                  />
                </div>
                {selectedPlan?.platform && (
                  <div className="text-xs text-gray-400">
                    추천 색상 · {getPlatformLabel(selectedPlan.platform)}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.reminderEnabled}
                    onChange={(e) => setDraft(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                  알림 사용
                </label>
                {draft.reminderEnabled && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={draft.reminderTime}
                      onChange={(e) => setDraft(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="5">5분 전</option>
                      <option value="10">10분 전</option>
                      <option value="30">30분 전</option>
                      <option value="60">1시간 전</option>
                      <option value="120">2시간 전</option>
                      <option value="1440">하루 전</option>
                    </select>
                    <select
                      value={draft.reminderMethod}
                      onChange={(e) => setDraft(prev => ({ ...prev, reminderMethod: e.target.value as 'browser' | 'email' | 'both' }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="browser">브라우저</option>
                      <option value="email">이메일</option>
                      <option value="both">브라우저 + 이메일</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">메모</label>
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  placeholder="일정에 대한 상세 내용을 적어주세요"
                  className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                {editorMode === 'edit' ? (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    일정 삭제
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="px-4 py-2 rounded-lg border border-gray-700 text-sm hover:border-gray-500"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={!hasPlans}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      hasPlans
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    저장
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
