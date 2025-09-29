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

const createEmptyPersona = () => ({
  name: '',
  tagline: '',
  whatICanDo: [] as string[],
  whatILove: [] as string[],
  whoIWantToTalkTo: '',
  monetizationPlan: [] as string[],
  expertise: [] as string[],
  experience: '',
  personality: [] as string[],
  contentStyle: '',
  targetAge: '',
  targetInterests: [] as string[],
  targetPainPoints: [] as string[],
  primaryPlatform: [] as string[],
  contentFrequency: '',
  contentTopics: [] as string[],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const valueToArray = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
  }
  return []
}

const valueToString = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item : ''))
      .filter(Boolean)
      .join(', ')
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(item => (typeof item === 'string' ? item : ''))
      .filter(Boolean)
      .join(', ')
  }
  return ''
}

const normalizePersona = (raw: any) => {
  if (!raw) return null
  const base = createEmptyPersona()
  return {
    ...base,
    name: typeof raw.name === 'string' ? raw.name : '',
    tagline: typeof raw.tagline === 'string' ? raw.tagline : '',
    whatICanDo: valueToArray(raw.whatICanDo),
    whatILove: valueToArray(raw.whatILove),
    whoIWantToTalkTo: valueToString(raw.whoIWantToTalkTo ?? raw.whoCanIHelp),
    monetizationPlan: valueToArray(raw.monetizationPlan),
    expertise: valueToArray(raw.expertise),
    experience: typeof raw.experience === 'string' ? raw.experience : '',
    personality: valueToArray(raw.personality),
    contentStyle: typeof raw.contentStyle === 'string' ? raw.contentStyle : '',
    targetAge: typeof raw.targetAge === 'string' ? raw.targetAge : '',
    targetInterests: valueToArray(raw.targetInterests),
    targetPainPoints: valueToArray(raw.targetPainPoints),
    primaryPlatform: valueToArray(raw.primaryPlatform),
    contentFrequency: typeof raw.contentFrequency === 'string' ? raw.contentFrequency : '',
    contentTopics: valueToArray(raw.contentTopics),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : base.createdAt,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : base.updatedAt
  }
}

const serializePersona = (persona: any) => ({
  name: persona?.name || '',
  tagline: persona?.tagline || '',
  whatICanDo: Array.isArray(persona?.whatICanDo) ? persona.whatICanDo : [],
  whatILove: Array.isArray(persona?.whatILove) ? persona.whatILove : [],
  whoCanIHelp: persona?.whoIWantToTalkTo || persona?.whoCanIHelp || '',
  monetizationPlan: Array.isArray(persona?.monetizationPlan) ? persona.monetizationPlan : [],
  expertise: Array.isArray(persona?.expertise) ? persona.expertise : [],
  experience: persona?.experience || '',
  personality: Array.isArray(persona?.personality) ? persona.personality : [],
  contentStyle: persona?.contentStyle || '',
  targetAge: persona?.targetAge || '',
  targetInterests: Array.isArray(persona?.targetInterests) ? persona.targetInterests : [],
  targetPainPoints: Array.isArray(persona?.targetPainPoints) ? persona.targetPainPoints : [],
  primaryPlatform: Array.isArray(persona?.primaryPlatform) ? persona.primaryPlatform : [],
  contentFrequency: persona?.contentFrequency || '',
  contentTopics: Array.isArray(persona?.contentTopics) ? persona.contentTopics : []
})

// 페르소나 API
export const personaAPI = {
  async get() {
    try {
      const response = await fetch('/api/persona', withCredentials())
      if (!response.ok) throw new Error('Failed to fetch persona')
      const data = await response.json()
      const normalized = normalizePersona(data.persona)
      if (normalized) {
        writeStorage('drucker-persona', normalized)
        return normalized
      }
      const emptyPersona = createEmptyPersona()
      writeStorage('drucker-persona', emptyPersona)
      return emptyPersona
    } catch (error) {
      console.error('페르소나 조회 오류:', error)
      const stored = readStorage('drucker-persona', null as any)
      const normalized = stored ? normalizePersona(stored) : null
      if (normalized) return normalized
      const emptyPersona = createEmptyPersona()
      writeStorage('drucker-persona', emptyPersona)
      return emptyPersona
    }
  },

  async save(persona: any) {
    try {
      const response = await fetch('/api/persona', withCredentials({
        method: 'POST',
        body: JSON.stringify(serializePersona(persona))
      }))

      if (!response.ok) throw new Error('Failed to save persona')
      const data = await response.json()
      const normalized = normalizePersona(data.persona)
      if (normalized) {
        writeStorage('drucker-persona', normalized)
        return normalized
      }
      return persona
    } catch (error) {
      console.error('페르소나 저장 오류:', error)
      writeStorage('drucker-persona', persona)
      return persona
    }
  },

  empty: createEmptyPersona
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
