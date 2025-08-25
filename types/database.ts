export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'planning' | 'shooting' | 'editing' | 'uploading' | 'analyzing' | 'completed'
  platform: 'instagram' | 'tiktok' | 'youtube' | 'other'
  created_at: string
  updated_at: string
  target_date?: string
  views?: number
  likes?: number
  shares?: number
  comments?: number
}

export interface Checklist {
  id: string
  project_id: string
  title: string
  is_completed: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface ProjectStage {
  id: string
  project_id: string
  stage: 'planning' | 'shooting' | 'editing' | 'uploading' | 'analyzing'
  is_completed: boolean
  completed_at?: string
  notes?: string
}