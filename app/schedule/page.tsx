'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Bell, BellOff, 
  Clock, AlertCircle, CheckCircle, Play, Pause, Film,
  User, Tag, Settings, Mail
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
    time: string // minutes before
    method: 'browser' | 'email' | 'both'
  }
  color?: string
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true)
      }
    }

    // 임시 태스크 데이터
    const mockTasks: Task[] = [
      {
        id: '1',
        title: '봄 컬렉션 촬영',
        description: '새로운 봄 컬렉션 제품 촬영',
        date: '2025-09-02',
        startTime: '10:00',
        endTime: '15:00',
        status: 'pending',
        priority: 'high',
        platform: 'YouTube',
        assignee: '김PD',
        tags: ['촬영', '제품'],
        reminder: {
          enabled: true,
          time: '60',
          method: 'browser'
        },
        color: '#ef4444'
      },
      {
        id: '2',
        title: 'AI 도구 튜토리얼 편집',
        description: 'ChatGPT 활용법 영상 편집 작업',
        date: '2025-09-03',
        startTime: '14:00',
        endTime: '18:00',
        status: 'in_progress',
        priority: 'medium',
        platform: 'Instagram',
        assignee: '이편집',
        tags: ['편집', 'AI'],
        reminder: {
          enabled: true,
          time: '30',
          method: 'both'
        },
        color: '#f59e0b'
      },
      {
        id: '3',
        title: '월간 리뷰 스크립트 작성',
        date: '2025-09-05',
        status: 'pending',
        priority: 'low',
        platform: 'Blog',
        tags: ['기획', '글쓰기'],
        color: '#10b981'
      }
    ]
    setTasks(mockTasks)

    // 알림 체크 (실제로는 서버에서 체크)
    checkUpcomingReminders(mockTasks)
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
                onClick={() => setIsAddTaskModalOpen(true)}
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
                          onClick={() => {
                            setSelectedTask(task)
                            setIsTaskModalOpen(true)
                          }}
                          className="text-xs p-1 rounded cursor-move hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: task.color || '#6b7280' }}
                        >
                          <div className="flex items-center gap-1">
                            <span>{getPriorityIcon(task.priority)}</span>
                            <span className="truncate">{task.title}</span>
                          </div>
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
    </div>
  )
}
