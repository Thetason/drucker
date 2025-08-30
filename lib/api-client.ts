// API 클라이언트 - DB와 통신하는 헬퍼 함수들

// 페르소나 API
export const personaAPI = {
  // 페르소나 조회
  async get() {
    try {
      const response = await fetch('/api/persona')
      if (!response.ok) throw new Error('Failed to fetch persona')
      const data = await response.json()
      return data.persona
    } catch (error) {
      console.error('페르소나 조회 오류:', error)
      // localStorage에서 백업 데이터 반환
      const localData = localStorage.getItem('drucker-persona')
      return localData ? JSON.parse(localData) : null
    }
  },

  // 페르소나 저장
  async save(persona: any) {
    try {
      // localStorage에 먼저 저장 (백업)
      localStorage.setItem('drucker-persona', JSON.stringify(persona))
      
      // DB에 저장
      const response = await fetch('/api/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
      })
      
      if (!response.ok) throw new Error('Failed to save persona')
      const data = await response.json()
      return data.persona
    } catch (error) {
      console.error('페르소나 저장 오류:', error)
      // localStorage 저장은 성공했으므로 true 반환
      return persona
    }
  }
}

// 기획서 API
export const plansAPI = {
  // 기획서 목록 조회
  async getAll() {
    try {
      const response = await fetch('/api/plans')
      if (!response.ok) throw new Error('Failed to fetch plans')
      const data = await response.json()
      
      // localStorage와 동기화
      if (data.plans && data.plans.length > 0) {
        localStorage.setItem('drucker-plans', JSON.stringify(data.plans))
      }
      
      return data.plans
    } catch (error) {
      console.error('기획서 조회 오류:', error)
      // localStorage에서 백업 데이터 반환
      const localData = localStorage.getItem('drucker-plans')
      return localData ? JSON.parse(localData) : []
    }
  },

  // 기획서 생성
  async create(plan: any) {
    try {
      // localStorage 업데이트
      const localPlans = localStorage.getItem('drucker-plans')
      const plans = localPlans ? JSON.parse(localPlans) : []
      const newPlan = { ...plan, id: plan.id || Date.now().toString() }
      plans.push(newPlan)
      localStorage.setItem('drucker-plans', JSON.stringify(plans))
      
      // DB에 저장
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      })
      
      if (!response.ok) throw new Error('Failed to create plan')
      const data = await response.json()
      
      // DB에서 받은 ID로 localStorage 업데이트
      if (data.plan && data.plan.id) {
        const updatedPlans = plans.map((p: any) => 
          p.id === newPlan.id ? { ...p, id: data.plan.id } : p
        )
        localStorage.setItem('drucker-plans', JSON.stringify(updatedPlans))
      }
      
      return data.plan
    } catch (error) {
      console.error('기획서 생성 오류:', error)
      return plan
    }
  },

  // 기획서 수정
  async update(plan: any) {
    try {
      // localStorage 업데이트
      const localPlans = localStorage.getItem('drucker-plans')
      const plans = localPlans ? JSON.parse(localPlans) : []
      const updatedPlans = plans.map((p: any) => 
        p.id === plan.id ? plan : p
      )
      localStorage.setItem('drucker-plans', JSON.stringify(updatedPlans))
      
      // DB에 저장
      const response = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      })
      
      if (!response.ok) throw new Error('Failed to update plan')
      const data = await response.json()
      return data.plan
    } catch (error) {
      console.error('기획서 수정 오류:', error)
      return plan
    }
  },

  // 기획서 삭제
  async delete(planId: string) {
    try {
      // localStorage에서 삭제
      const localPlans = localStorage.getItem('drucker-plans')
      const plans = localPlans ? JSON.parse(localPlans) : []
      const updatedPlans = plans.filter((p: any) => p.id !== planId)
      localStorage.setItem('drucker-plans', JSON.stringify(updatedPlans))
      
      // DB에서 삭제
      const response = await fetch(`/api/plans?id=${planId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete plan')
      return true
    } catch (error) {
      console.error('기획서 삭제 오류:', error)
      return true // localStorage 삭제는 성공했으므로 true 반환
    }
  }
}

// 작업 API
export const tasksAPI = {
  // 작업 목록 조회
  async getAll() {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      
      // localStorage와 동기화
      if (data.tasks && data.tasks.length > 0) {
        localStorage.setItem('drucker-tasks', JSON.stringify(data.tasks))
      }
      
      return data.tasks
    } catch (error) {
      console.error('작업 조회 오류:', error)
      // localStorage에서 백업 데이터 반환
      const localData = localStorage.getItem('drucker-tasks')
      return localData ? JSON.parse(localData) : []
    }
  },

  // 작업 생성
  async create(task: any) {
    try {
      // localStorage 업데이트
      const localTasks = localStorage.getItem('drucker-tasks')
      const tasks = localTasks ? JSON.parse(localTasks) : []
      tasks.push(task)
      localStorage.setItem('drucker-tasks', JSON.stringify(tasks))
      
      // DB에 저장
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      })
      
      if (!response.ok) throw new Error('Failed to create task')
      const data = await response.json()
      return data.task
    } catch (error) {
      console.error('작업 생성 오류:', error)
      return task
    }
  }
}