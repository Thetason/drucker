// API 클라이언트 - DB와 통신하는 헬퍼 함수들

const withCredentials = (options: RequestInit = {}) => ({
  credentials: 'include' as RequestCredentials,
  ...options,
  headers: {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
})

// 페르소나 API
export const personaAPI = {
  async get() {
    try {
      const response = await fetch('/api/persona', withCredentials())
      if (!response.ok) throw new Error('Failed to fetch persona')
      const data = await response.json()
      localStorage.setItem('drucker-persona', JSON.stringify(data.persona))
      return data.persona
    } catch (error) {
      console.error('페르소나 조회 오류:', error)
      const localData = localStorage.getItem('drucker-persona')
      return localData ? JSON.parse(localData) : null
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
      localStorage.setItem('drucker-persona', JSON.stringify(data.persona))
      return data.persona
    } catch (error) {
      console.error('페르소나 저장 오류:', error)
      localStorage.setItem('drucker-persona', JSON.stringify(persona))
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
      localStorage.setItem('drucker-plans', JSON.stringify(data.plans || []))
      return data.plans || []
    } catch (error) {
      console.error('기획서 조회 오류:', error)
      const localData = localStorage.getItem('drucker-plans')
      return localData ? JSON.parse(localData) : []
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
      localStorage.setItem('drucker-plans', JSON.stringify(stored))
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
      localStorage.setItem('drucker-plans', JSON.stringify(stored))
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
      localStorage.setItem('drucker-plans', JSON.stringify(stored))
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
      localStorage.setItem('drucker-tasks', JSON.stringify(data.tasks || []))
      return data.tasks || []
    } catch (error) {
      console.error('작업 조회 오류:', error)
      const localData = localStorage.getItem('drucker-tasks')
      return localData ? JSON.parse(localData) : []
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
    localStorage.setItem('drucker-tasks', JSON.stringify(stored))
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
    localStorage.setItem('drucker-tasks', JSON.stringify(stored))
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
    localStorage.setItem('drucker-tasks', JSON.stringify(stored))
    return true
  }
}
