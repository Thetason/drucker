// API 클라이언트 - DB와 통신하는 헬퍼 함수들

const withCredentials = (options: RequestInit = {}) => ({
  credentials: 'include' as RequestCredentials,
  ...options,
  headers: {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
})

const getStorageKey = (base: string) => {
  if (typeof window === 'undefined') return base

  try {
    const rawAuth = localStorage.getItem('drucker-auth')
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth)
      if (parsed?.email) {
        return `${base}-${parsed.email}`
      }
    }
  } catch (error) {
    console.warn('Storage key parsing error:', error)
  }

  return base
}

const removeLegacyKey = (legacyKey: string) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(legacyKey)
  } catch (error) {
    console.warn('Legacy key cleanup error:', error)
  }
}

const writeStorage = (base: string, value: unknown) => {
  if (typeof window === 'undefined') return
  const key = getStorageKey(base)
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to persist ${key}:`, error)
  }
  if (!key.endsWith(base)) {
    removeLegacyKey(base)
  }
}

const readStorage = <T>(base: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  const key = getStorageKey(base)
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`Failed to parse ${key}:`, error)
    try {
      localStorage.removeItem(key)
    } catch (removeError) {
      console.warn(`Failed to clear ${key}:`, removeError)
    }
    return fallback
  }
}

// 페르소나 API
export const personaAPI = {
  async get() {
    try {
      const response = await fetch('/api/persona', withCredentials())
      if (!response.ok) throw new Error('Failed to fetch persona')
      const data = await response.json()
      writeStorage('drucker-persona', data.persona)
      return data.persona
    } catch (error) {
      console.error('페르소나 조회 오류:', error)
      return readStorage('drucker-persona', null)
    }
  },

  async save(persona: any) {
    try {
      const response = await fetch('/api/persona', withCredentials({
        method: 'POST',
        body: JSON.stringify(persona)
      }))

      if (!response.ok) throw new Error('Failed to save persona')
      const data = await response.json()
      writeStorage('drucker-persona', data.persona)
      return data.persona
    } catch (error) {
      console.error('페르소나 저장 오류:', error)
      writeStorage('drucker-persona', persona)
      return persona
    }
  }
}

// 기획서 API
export const plansAPI = {
  async getAll() {
    try {
      const response = await fetch('/api/plans', withCredentials())
      if (!response.ok) throw new Error('Failed to fetch plans')
      const data = await response.json()
      writeStorage('drucker-plans', data.plans || [])
      return data.plans || []
    } catch (error) {
      console.error('기획서 조회 오류:', error)
      return readStorage('drucker-plans', [] as any[])
    }
  },

  async create(plan: any) {
    try {
      const response = await fetch('/api/plans', withCredentials({
        method: 'POST',
        body: JSON.stringify(plan)
      }))

      if (!response.ok) throw new Error('Failed to create plan')
      const data = await response.json()
      const stored = await plansAPI.getAll()
      writeStorage('drucker-plans', stored)
      return data.plan
    } catch (error) {
      console.error('기획서 생성 오류:', error)
      throw error
    }
  },

  async update(plan: any) {
    try {
      const response = await fetch('/api/plans', withCredentials({
        method: 'PUT',
        body: JSON.stringify(plan)
      }))

      if (!response.ok) throw new Error('Failed to update plan')
      const data = await response.json()
      const stored = await plansAPI.getAll()
      writeStorage('drucker-plans', stored)
      return data.plan
    } catch (error) {
      console.error('기획서 수정 오류:', error)
      throw error
    }
  },

  async delete(planId: string) {
    try {
      const response = await fetch(`/api/plans?id=${planId}`, withCredentials({
        method: 'DELETE'
      }))

      if (!response.ok) throw new Error('Failed to delete plan')
      const stored = await plansAPI.getAll()
      writeStorage('drucker-plans', stored)
      return true
    } catch (error) {
      console.error('기획서 삭제 오류:', error)
      throw error
    }
  }
}

// 작업 API
export const tasksAPI = {
  async getAll() {
    try {
      const response = await fetch('/api/tasks', withCredentials())
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      writeStorage('drucker-tasks', data.tasks || [])
      return data.tasks || []
    } catch (error) {
      console.error('작업 조회 오류:', error)
      return readStorage('drucker-tasks', [] as any[])
    }
  },

  async create(task: any) {
    const response = await fetch('/api/tasks', withCredentials({
      method: 'POST',
      body: JSON.stringify(task)
    }))

    if (!response.ok) {
      throw new Error('Failed to create task')
    }

    const data = await response.json()
    const stored = await tasksAPI.getAll()
    writeStorage('drucker-tasks', stored)
    return data.task
  },

  async update(task: any) {
    const response = await fetch('/api/tasks', withCredentials({
      method: 'PUT',
      body: JSON.stringify(task)
    }))

    if (!response.ok) {
      throw new Error('Failed to update task')
    }

    const data = await response.json()
    const stored = await tasksAPI.getAll()
    writeStorage('drucker-tasks', stored)
    return data.task
  },

  async delete(taskId: string) {
    const response = await fetch(`/api/tasks?id=${taskId}`, withCredentials({
      method: 'DELETE'
    }))

    if (!response.ok) {
      throw new Error('Failed to delete task')
    }

    const stored = await tasksAPI.getAll()
    writeStorage('drucker-tasks', stored)
    return true
  }
}
