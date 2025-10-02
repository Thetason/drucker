"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, Hash, Type, Image, Target, Sparkles,
  ChevronRight, Clock, CheckCircle2, Circle,
  ArrowRight, Zap, TrendingUp, Users, MessageSquare,
  Lightbulb, BookOpen, Rocket, Flag, Save, Download,
  Upload, Trash2, Copy, Check, X, Edit, Film, Camera,
  CheckSquare
} from "lucide-react"
import { DecisionHelper } from "./decision-helper"

interface ContentPlan {
  id: string
  title: string
  altTitle?: string
  target: string
  duration: string
  platform: 'youtube' | 'shorts' | 'reels'
  goal: string
  hook: string
  storyType: 'problem-solution' | 'journey' | 'comparison' | 'list' | 'custom'
  story: {
    [key: string]: string
  }
  retentionEnabled: boolean
  retention?: {
    [key: string]: string
  }
  cta: string
  dmKeyword?: string
  thumbnailKeywords: string[]
  createdAt: string
  updatedAt: string
}

const storyTemplates = {
  'problem-solution': {
    name: '문제-해결',
    icon: '🔧',
    fields: [
      { key: 'problem', label: '문제 제시', placeholder: '시청자가 겪는 문제' },
      { key: 'solution', label: '해결 방법', placeholder: '구체적인 해결책' },
      { key: 'result', label: '결과', placeholder: '적용 후 변화' }
    ]
  },
  'journey': {
    name: '여정',
    icon: '🚀',
    fields: [
      { key: 'start', label: '시작', placeholder: '출발점/현재 상황' },
      { key: 'process', label: '과정', placeholder: '겪은 과정과 시행착오' },
      { key: 'achievement', label: '달성', placeholder: '최종 도달점' }
    ]
  },
  'comparison': {
    name: '비교',
    icon: '⚖️',
    fields: [
      { key: 'optionA', label: 'A안', placeholder: '첫 번째 선택지' },
      { key: 'optionB', label: 'B안', placeholder: '두 번째 선택지' },
      { key: 'conclusion', label: '결론', placeholder: '최종 추천' }
    ]
  },
  'list': {
    name: '리스트',
    icon: '📝',
    fields: [
      { key: 'intro', label: '도입', placeholder: '주제 소개' },
      { key: 'items', label: '항목들', placeholder: 'TOP 5, 3가지 방법 등' },
      { key: 'summary', label: '요약', placeholder: '핵심 정리' }
    ]
  },
  'custom': {
    name: '자유 구성',
    icon: '✨',
    fields: [
      { key: 'part1', label: '파트 1', placeholder: '자유롭게 구성' },
      { key: 'part2', label: '파트 2', placeholder: '자유롭게 구성' },
      { key: 'part3', label: '파트 3', placeholder: '자유롭게 구성' }
    ]
  }
}

const platformConfig = {
  youtube: {
    name: 'YouTube',
    icon: '📺',
    durations: ['5-10분', '10-15분', '15-20분', '20분+'],
    retentionPoints: ['15초', '45초', '90초', '3분', '5분'],
    maxRuntime: '최대 12시간 (최대 256GB)'
  },
  shorts: {
    name: 'Shorts',
    icon: '📱',
    durations: ['15초', '30초', '45초', '60초'],
    retentionPoints: ['3초', '10초', '20초'],
    maxRuntime: '최대 60초'
  },
  reels: {
    name: 'Reels',
    icon: '🎬',
    durations: ['15초', '30초', '60초', '90초', '3분'],
    retentionPoints: ['3초', '10초', '30초'],
    maxRuntime: '최대 90초 (최대 3분 클립 구성)'
  }
}

export function ContentPlannerAdvanced() {
  const [showDecisionHelper, setShowDecisionHelper] = useState(false)
  const [plan, setPlan] = useState<ContentPlan>({
    id: Date.now().toString(),
    title: '',
    altTitle: '',
    target: '',
    duration: '10분',
    platform: 'youtube',
    goal: '',
    hook: '',
    storyType: 'problem-solution',
    story: {},
    retentionEnabled: true,
    retention: {},
    cta: '',
    dmKeyword: '',
    thumbnailKeywords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [savedPlans, setSavedPlans] = useState<ContentPlan[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [completionRate, setCompletionRate] = useState(0)

  // Load saved plans from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('drucker-plans')
    if (saved) {
      setSavedPlans(JSON.parse(saved))
    }
  }, [])

  // Calculate completion rate
  useEffect(() => {
    const requiredFields = [
      plan.title,
      plan.target,
      plan.goal,
      plan.hook,
      Object.values(plan.story).filter(v => v).length > 0,
      plan.cta
    ]
    const completed = requiredFields.filter(Boolean).length
    setCompletionRate(Math.round((completed / requiredFields.length) * 100))
  }, [plan])

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (plan.title) {
        const tempPlan = { ...plan, updatedAt: new Date().toISOString() }
        localStorage.setItem('drucker-current', JSON.stringify(tempPlan))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [plan])

  const savePlan = () => {
    if (!plan.title) {
      alert('제목을 입력해주세요')
      return
    }

    setSaveStatus('saving')
    const newPlan = { ...plan, updatedAt: new Date().toISOString() }
    const existingIndex = savedPlans.findIndex(p => p.id === plan.id)
    
    let updatedPlans
    if (existingIndex >= 0) {
      updatedPlans = [...savedPlans]
      updatedPlans[existingIndex] = newPlan
    } else {
      updatedPlans = [...savedPlans, newPlan]
    }
    
    setSavedPlans(updatedPlans)
    localStorage.setItem('drucker-plans', JSON.stringify(updatedPlans))
    
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 500)
  }

  const loadPlan = (planToLoad: ContentPlan) => {
    setPlan(planToLoad)
    setShowSaved(false)
  }

  const deletePlan = (id: string) => {
    const updatedPlans = savedPlans.filter(p => p.id !== id)
    setSavedPlans(updatedPlans)
    localStorage.setItem('drucker-plans', JSON.stringify(updatedPlans))
  }

  const newPlan = () => {
    setPlan({
      id: Date.now().toString(),
      title: '',
      altTitle: '',
      target: '',
      duration: '10분',
      platform: 'youtube',
      goal: '',
      hook: '',
      storyType: 'problem-solution',
      story: {},
      retentionEnabled: true,
      retention: {},
      cta: '',
      dmKeyword: '',
      thumbnailKeywords: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  const exportPlan = () => {
    const dataStr = JSON.stringify(plan, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${plan.title || 'content-plan'}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importPlan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string)
          setPlan({ ...imported, id: Date.now().toString() })
        } catch (error) {
          alert('파일을 읽을 수 없습니다')
        }
      }
      reader.readAsText(file)
    }
  }

  const addThumbnailKeyword = (keyword: string) => {
    if (keyword && !plan.thumbnailKeywords.includes(keyword)) {
      setPlan({ ...plan, thumbnailKeywords: [...plan.thumbnailKeywords, keyword] })
    }
  }

  const removeThumbnailKeyword = (keyword: string) => {
    setPlan({ 
      ...plan, 
      thumbnailKeywords: plan.thumbnailKeywords.filter(k => k !== keyword) 
    })
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎬</div>
            <div>
              <h1 className="text-3xl font-bold">콘텐츠 기획</h1>
              <p className="text-sm text-gray-500">스마트한 콘텐츠 플래닝</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDecisionHelper(!showDecisionHelper)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <CheckSquare className="h-4 w-4" />
              의사결정
            </button>
            <button
              onClick={newPlan}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              새 기획
            </button>
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              저장된 기획 ({savedPlans.length})
            </button>
            <button
              onClick={exportPlan}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
            <label className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <input type="file" accept=".json" onChange={importPlan} className="hidden" />
            </label>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm font-medium">{completionRate}% 완성</span>
        </div>
      </div>

      {/* Decision Helper Modal */}
      {showDecisionHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <DecisionHelper onClose={() => setShowDecisionHelper(false)} />
          </div>
        </div>
      )}

      {/* Saved Plans List */}
      {showSaved && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">저장된 기획서</h3>
          {savedPlans.length === 0 ? (
            <p className="text-sm text-gray-500">저장된 기획서가 없습니다</p>
          ) : (
            <div className="space-y-2">
              {savedPlans.map((savedPlan) => (
                <div key={savedPlan.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{platformConfig[savedPlan.platform].icon}</span>
                    <div>
                      <p className="font-medium">{savedPlan.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(savedPlan.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadPlan(savedPlan)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => deletePlan(savedPlan.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">플랫폼</label>
        <div className="flex gap-2">
          {Object.entries(platformConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setPlan({ ...plan, platform: key as any, retentionEnabled: key === 'youtube' })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                plan.platform === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{config.icon}</span>
              {config.name}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">메인 제목</label>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => setPlan({ ...plan, title: e.target.value })}
            placeholder="시청자를 끌어당길 제목"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">A/B 테스트 제목</label>
          <input
            type="text"
            value={plan.altTitle}
            onChange={(e) => setPlan({ ...plan, altTitle: e.target.value })}
            placeholder="대체 제목 (선택)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">타겟</label>
          <input
            type="text"
            value={plan.target}
            onChange={(e) => setPlan({ ...plan, target: e.target.value })}
            placeholder="20대 직장인"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">길이</label>
          <select
            value={plan.duration}
            onChange={(e) => setPlan({ ...plan, duration: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {platformConfig[plan.platform].durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            최대 러닝타임 · {platformConfig[plan.platform].maxRuntime}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">목표</label>
          <input
            type="text"
            value={plan.goal}
            onChange={(e) => setPlan({ ...plan, goal: e.target.value })}
            placeholder="조회수 10K"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Hook */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">🎣 훅 (0-3초)</label>
        <textarea
          value={plan.hook}
          onChange={(e) => setPlan({ ...plan, hook: e.target.value })}
          placeholder="첫 3초에 시청자를 사로잡을 한 마디"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          rows={2}
        />
      </div>

      {/* Story Structure Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">📖 스토리 구조</label>
          <div className="flex gap-2">
            {Object.entries(storyTemplates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => setPlan({ ...plan, storyType: key as any, story: {} })}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  plan.storyType === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {template.icon} {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Story Fields */}
        <div className="space-y-3">
          {storyTemplates[plan.storyType].fields.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {field.label}
              </label>
              <input
                type="text"
                value={plan.story[field.key] || ''}
                onChange={(e) => setPlan({
                  ...plan,
                  story: { ...plan.story, [field.key]: e.target.value }
                })}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Retention Markers (Optional) */}
      {plan.platform === 'youtube' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">⏱️ 리텐션 마커</label>
            <button
              onClick={() => setPlan({ ...plan, retentionEnabled: !plan.retentionEnabled })}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                plan.retentionEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {plan.retentionEnabled ? '사용' : '미사용'}
            </button>
          </div>
          
          {plan.retentionEnabled && (
            <div className="grid grid-cols-3 gap-3">
              {platformConfig[plan.platform].retentionPoints.slice(0, 3).map((point) => (
                <div key={point}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{point}</label>
                  <input
                    type="text"
                    value={plan.retention?.[point] || ''}
                    onChange={(e) => setPlan({
                      ...plan,
                      retention: { ...plan.retention, [point]: e.target.value }
                    })}
                    placeholder="전환점"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thumbnail Keywords */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">🖼️ 썸네일 키워드</label>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="키워드 입력 후 Enter"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addThumbnailKeyword((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {plan.thumbnailKeywords.map((keyword) => (
            <span
              key={keyword}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
            >
              {keyword}
              <button
                onClick={() => removeThumbnailKeyword(keyword)}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">🔔 CTA</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={plan.cta}
            onChange={(e) => setPlan({ ...plan, cta: e.target.value })}
            placeholder="구독과 좋아요 부탁드려요!"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={plan.dmKeyword}
            onChange={(e) => setPlan({ ...plan, dmKeyword: e.target.value })}
            placeholder="DM 키워드"
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={savePlan}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            saveStatus === 'saved'
              ? 'bg-green-500 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {saveStatus === 'saving' ? (
            <>저장 중...</>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="h-4 w-4" />
              저장됨
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              저장
            </>
          )}
        </button>
      </div>
    </div>
  )
}
