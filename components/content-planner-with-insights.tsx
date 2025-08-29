"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, Hash, Type, Image, Target, Sparkles,
  ChevronRight, Clock, CheckCircle2, Circle,
  ArrowRight, Zap, TrendingUp, Users, MessageSquare,
  Lightbulb, BookOpen, Rocket, Flag, Save, Download,
  Upload, Trash2, Copy, Check, X, Edit, Film, Camera,
  CheckSquare, AlertTriangle, ThumbsUp, ThumbsDown,
  Eye, Brain, Heart, AlertCircle, Info, FileText
} from "lucide-react"

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
  script?: string  // 추가: 전체 대본
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
    retentionPoints: ['15초', '45초', '90초', '3분', '5분']
  },
  shorts: {
    name: 'Shorts',
    icon: '📱',
    durations: ['15초', '30초', '60초'],
    retentionPoints: ['3초', '10초', '20초']
  },
  reels: {
    name: 'Reels',
    icon: '🎬',
    durations: ['15초', '30초', '60초', '90초'],
    retentionPoints: ['3초', '10초', '30초']
  }
}

// Real-time insights
const getInsights = (plan: ContentPlan) => {
  const insights = []
  
  // Title Analysis
  if (plan.title) {
    // Check for specificity
    const hasNumber = /\d/.test(plan.title)
    const hasQuestion = plan.title.includes('?')
    const hasEmotionalTrigger = /놀라운|충격|실화|진짜|대박|최초|비밀/.test(plan.title)
    
    if (hasNumber) {
      insights.push({
        type: 'good',
        icon: <ThumbsUp className="h-4 w-4" />,
        text: '숫자 포함 - CTR 증가 효과',
        category: 'title'
      })
    }
    
    if (hasQuestion) {
      insights.push({
        type: 'good',
        icon: <Brain className="h-4 w-4" />,
        text: '질문형 제목 - 호기심 유발',
        category: 'title'
      })
    }
    
    if (plan.title.length > 40) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: '제목이 너무 길어요 (40자 초과)',
        category: 'title'
      })
    }
    
    if (!hasEmotionalTrigger && !hasNumber && !hasQuestion) {
      insights.push({
        type: 'suggestion',
        icon: <Lightbulb className="h-4 w-4" />,
        text: '감정 트리거나 숫자를 추가해보세요',
        category: 'title'
      })
    }
  }
  
  // Target Analysis
  if (plan.target) {
    const isSpecific = plan.target.length > 5 && /\d|대|세|살/.test(plan.target)
    
    if (isSpecific) {
      insights.push({
        type: 'good',
        icon: <Target className="h-4 w-4" />,
        text: '구체적인 타겟 설정',
        category: 'target'
      })
    } else {
      insights.push({
        type: 'warning',
        icon: <Users className="h-4 w-4" />,
        text: '타겟을 더 구체적으로 (나이, 상황 등)',
        category: 'target'
      })
    }
  }
  
  // Hook Analysis
  if (plan.hook) {
    if (plan.hook.length <= 20) {
      insights.push({
        type: 'good',
        icon: <Zap className="h-4 w-4" />,
        text: '간결한 훅 - 3초 내 주목',
        category: 'hook'
      })
    }
    
    const hasActionWord = /하세요|보세요|들어보세요|알아보세요/.test(plan.hook)
    if (hasActionWord) {
      insights.push({
        type: 'good',
        icon: <Rocket className="h-4 w-4" />,
        text: '행동 유도 동사 사용',
        category: 'hook'
      })
    }
  }
  
  // Story Completeness
  const storyFields = Object.values(plan.story).filter(v => v.length > 0)
  if (storyFields.length === 3) {
    insights.push({
      type: 'good',
      icon: <CheckCircle2 className="h-4 w-4" />,
      text: '완성된 스토리 구조',
      category: 'story'
    })
  }
  
  return insights
}

// Decision criteria check
const checkDecisionCriteria = (plan: ContentPlan) => {
  const criteria = []
  
  // 1. 구체적인가?
  const isSpecific = plan.title && (
    /\d/.test(plan.title) || 
    /구체적|실제|진짜|직접/.test(plan.title)
  )
  criteria.push({
    label: '구체적인 내용',
    met: isSpecific,
    example: isSpecific ? null : '예: "건강 팁" → "40대가 꼭 알아야 할 무릎 관리법"'
  })
  
  // 2. 공감 포인트가 있는가?
  const hasEmpathy = plan.hook && (
    /귀찮|힘들|어려|못하|안되|실패/.test(plan.hook) ||
    /우리|여러분|당신/.test(plan.hook)
  )
  criteria.push({
    label: '공감 포인트',
    met: hasEmpathy,
    example: hasEmpathy ? null : '예: "방법 소개" → "이것 때문에 계속 실패하시죠?"'
  })
  
  // 3. 권위/신뢰 요소가 있는가?
  const hasAuthority = plan.title && (
    /전문가|의사|교수|년차|경력|경험/.test(plan.title) ||
    /실제|직접|검증/.test(plan.title)
  )
  criteria.push({
    label: '신뢰 요소',
    met: hasAuthority,
    example: hasAuthority ? null : '예: "다이어트 팁" → "10년차 트레이너가 알려주는 다이어트"'
  })
  
  // 4. 시청자 이익이 명확한가?
  const hasBenefit = plan.title && (
    /하는 법|하는 방법|되는|만드는|바꾸는/.test(plan.title)
  )
  criteria.push({
    label: '명확한 이익',
    met: hasBenefit,
    example: hasBenefit ? null : '예: "요리 영상" → "10분만에 완성하는 일주일 도시락"'
  })
  
  return criteria
}

export function ContentPlannerWithInsights() {
  const [persona, setPersona] = useState<any>(null)
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
    script: '',  // 추가: 대본 초기값
    thumbnailKeywords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [savedPlans, setSavedPlans] = useState<ContentPlan[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  
  // Real-time insights
  const insights = getInsights(plan)
  const decisionCriteria = checkDecisionCriteria(plan)
  const decisionScore = Math.round((decisionCriteria.filter(c => c.met).length / decisionCriteria.length) * 100)

  // Load saved plans and persona from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('drucker-plans')
    if (saved) {
      setSavedPlans(JSON.parse(saved))
    }
    
    // Load persona data
    const savedPersona = localStorage.getItem('drucker-persona')
    if (savedPersona) {
      const personaData = JSON.parse(savedPersona)
      setPersona(personaData)
      
      // Auto-populate target from persona if not already set
      if (personaData.whoIWantToTalkTo && !plan.target) {
        setPlan(prev => ({
          ...prev,
          target: personaData.whoIWantToTalkTo
        }))
      }
    }
  }, [])

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
      script: '',  // 추가: 대본 초기값
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Main Form */}
        <div className="col-span-8 bg-white rounded-2xl p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎬</div>
                <div>
                  <h1 className="text-2xl font-bold">콘텐츠 기획</h1>
                  <p className="text-sm text-gray-500">스마트한 콘텐츠 플래닝</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={newPlan}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowSaved(!showSaved)}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <BookOpen className="h-4 w-4" />
                </button>
                <button
                  onClick={exportPlan}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                </button>
                <label className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm">
                  <Upload className="h-4 w-4" />
                  <input type="file" accept=".json" onChange={importPlan} className="hidden" />
                </label>
              </div>
            </div>
          </div>

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
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">📖 스토리 구조</label>
              <div className="flex gap-2">
                {Object.entries(storyTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setPlan({ ...plan, storyType: key as any, story: {} })}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      plan.storyType === key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {template.icon} {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Story Fields */}
            <div className="space-y-3">
              {storyTemplates[plan.storyType].fields.map((field, index) => (
                <div key={field.key} className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <label className="text-xs font-medium text-gray-600">
                      {field.label}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={plan.story[field.key] || ''}
                    onChange={(e) => setPlan({
                      ...plan,
                      story: { ...plan.story, [field.key]: e.target.value }
                    })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  {index < storyTemplates[plan.storyType].fields.length - 1 && (
                    <div className="absolute -bottom-3 left-2 h-3 w-0.5 bg-blue-300"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Story Flow Visualization */}
            {Object.values(plan.story).filter(v => v).length === storyTemplates[plan.storyType].fields.length && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-medium text-green-700 mb-1">✅ 스토리 구조 완성!</p>
                <p className="text-xs text-green-600">
                  이제 아래 대본 섹션에서 전체 스크립트를 작성해보세요.
                </p>
              </div>
            )}
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

          {/* Script Section - 추가된 부분 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">📝 전체 대본</label>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Film className="h-3 w-3" />
                <span>{plan.script ? `${plan.script.length}자` : '0자'}</span>
              </div>
            </div>
            
            {/* Auto-generate helper */}
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">대본 작성 가이드</p>
                  <p className="text-xs text-blue-700 mt-1">
                    훅 → 스토리 전개 ({storyTemplates[plan.storyType].name}) → CTA 순으로 자연스럽게 연결하세요
                  </p>
                  {plan.hook && plan.story && Object.values(plan.story).some(v => v) && plan.cta && (
                    <button
                      onClick={() => {
                        // Generate script from existing content
                        const storyParts = storyTemplates[plan.storyType].fields
                          .map(field => plan.story[field.key])
                          .filter(Boolean)
                          .join('\n\n')
                        
                        const generatedScript = `[오프닝 - 훅]
${plan.hook}

[본론 - ${storyTemplates[plan.storyType].name}]
${storyParts}

[마무리 - CTA]
${plan.cta}${plan.dmKeyword ? `

자세한 자료가 필요하신 분들은 댓글에 "${plan.dmKeyword}"라고 남겨주세요!` : ''}`
                        
                        setPlan({ ...plan, script: generatedScript })
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      → 입력한 내용으로 초안 생성하기
                    </button>
                  )}
                </div>
              </div>
            </div>

            <textarea
              value={plan.script || ''}
              onChange={(e) => setPlan({ ...plan, script: e.target.value })}
              placeholder={`[오프닝 - 훅]
${plan.hook || '시청자를 사로잡을 첫 문장을 작성하세요'}

[본론 - ${storyTemplates[plan.storyType].name}]
${storyTemplates[plan.storyType].fields.map(f => f.label).join(' → ')} 순서로 전개하세요

[마무리 - CTA]
${plan.cta || '행동 유도 메시지를 작성하세요'}

[추가 팁/정보] (선택)
마지막 한 마디나 추가 정보를 넣으세요`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
              rows={12}
            />

            {/* Script Templates */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  const template = plan.platform === 'youtube' 
                    ? `[인트로]
안녕하세요, ${persona?.name || '크리에이터'}입니다.
${plan.hook}

[문제 인식]
${plan.story.problem || '많은 분들이 이런 고민을 하시죠...'}

[해결책 제시]
${plan.story.solution || '제가 찾은 해결 방법은...'}

[실제 적용 사례]
${plan.story.result || '실제로 이렇게 해보니...'}

[핵심 정리]
오늘 알려드린 핵심은 3가지입니다.
1. 
2. 
3. 

[CTA]
${plan.cta}
${plan.dmKeyword ? `더 자세한 자료는 댓글에 "${plan.dmKeyword}"를 남겨주세요!` : ''}

[아웃트로]
다음 영상에서는 더 유용한 정보로 찾아뵙겠습니다.
감사합니다!`
                    : `[훅 - 3초]
${plan.hook}

[메인 메시지 - 10초]
${Object.values(plan.story).filter(Boolean).join(' ')}

[CTA - 3초]
${plan.cta}
${plan.dmKeyword ? `"${plan.dmKeyword}" 댓글 남기고 자료받아가세요!` : ''}`
                  
                  setPlan({ ...plan, script: template })
                }}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <FileText className="h-3 w-3" />
                템플릿 적용
              </button>
              
              <button
                onClick={() => {
                  if (plan.script) {
                    navigator.clipboard.writeText(plan.script)
                    alert('대본이 클립보드에 복사되었습니다!')
                  }
                }}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                disabled={!plan.script}
              >
                <Copy className="h-3 w-3" />
                복사
              </button>
            </div>

            {/* Script Analysis */}
            {plan.script && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">예상 시간</p>
                  <p className="text-sm font-bold text-orange-600">
                    {(() => {
                      // 정교한 시간 계산 알고리즘
                      const text = plan.script
                      const charCount = text.length
                      const wordCount = text.split(/\s+/).filter(Boolean).length
                      const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length
                      
                      // 한국어 감지
                      const koreanChars = (text.match(/[가-힣]/g) || []).length
                      const isKorean = koreanChars / charCount > 0.3
                      
                      let seconds = 0
                      
                      if (isKorean) {
                        // 한국어: 평균 분당 280-320자
                        const baseSpeed = plan.platform === 'youtube_shorts' ? 350 : 300
                        seconds = (charCount / baseSpeed) * 60
                        // 문장 사이 pause (0.3초/문장)
                        seconds += sentenceCount * 0.3
                      } else {
                        // 영어: 평균 분당 140-160단어
                        const baseSpeed = plan.platform === 'youtube_shorts' ? 170 : 150
                        seconds = (wordCount / baseSpeed) * 60
                        // 문장 사이 pause (0.5초/문장)
                        seconds += sentenceCount * 0.5
                      }
                      
                      // 플랫폼별 템포 조정
                      if (plan.platform === 'youtube_shorts' || plan.platform === 'instagram_reels') {
                        seconds *= 0.85 // 숏폼은 15% 빠름
                      } else if (plan.platform === 'youtube') {
                        seconds *= 1.05 // 롱폼은 5% 느림
                      }
                      
                      const minutes = Math.floor(seconds / 60)
                      const remainingSeconds = Math.round(seconds % 60)
                      
                      if (minutes === 0) return `${remainingSeconds}초`
                      return `${minutes}분 ${remainingSeconds}초`
                    })()}
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">문장 수</p>
                  <p className="text-sm font-bold text-orange-600">
                    {plan.script.split(/[.!?]+/).filter(Boolean).length}개
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">단락 수</p>
                  <p className="text-sm font-bold text-orange-600">
                    {plan.script.split('\n\n').filter(Boolean).length}개
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">단어 수</p>
                  <p className="text-sm font-bold text-orange-600">
                    {plan.script.split(' ').filter(Boolean).length}개
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
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

        {/* Right Side - Real-time Insights */}
        <div className="col-span-4 space-y-4">
          {/* Persona-based Suggestions */}
          {persona && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">페르소나 기반 추천</h3>
              </div>
              
              <div className="space-y-3">
                {persona.whatICanDo?.length > 0 && (
                  <div>
                    <p className="text-xs text-purple-700 mb-1">내 강점 활용:</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.whatICanDo.slice(0, 3).map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {persona.contentTopics?.length > 0 && (
                  <div>
                    <p className="text-xs text-purple-700 mb-1">추천 주제:</p>
                    <div className="space-y-1">
                      {persona.contentTopics.slice(0, 2).map((topic: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (!plan.title.includes(topic)) {
                              setPlan(prev => ({
                                ...prev,
                                title: prev.title ? `${prev.title} - ${topic}` : topic
                              }))
                            }
                          }}
                          className="text-xs text-left text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          + {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {persona.targetPainPoints?.length > 0 && (
                  <div>
                    <p className="text-xs text-purple-700 mb-1">타겟 고민 해결:</p>
                    <p className="text-xs text-gray-700 italic">
                      "{persona.targetPainPoints[0]}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decision Score Card */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">의사결정 점수</h3>
              <div className={`text-2xl font-bold ${
                decisionScore >= 75 ? 'text-green-600' : 
                decisionScore >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {decisionScore}%
              </div>
            </div>
            
            <div className="space-y-2">
              {decisionCriteria.map((criterion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`mt-0.5 ${
                    criterion.met ? 'text-green-500' : 'text-gray-300'
                  }`}>
                    {criterion.met ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${criterion.met ? 'text-gray-700' : 'text-gray-400'}`}>
                      {criterion.label}
                    </p>
                    {!criterion.met && criterion.example && (
                      <p className="text-xs text-gray-500 mt-1">{criterion.example}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 rounded-lg ${
              decisionScore >= 75 ? 'bg-green-50 text-green-700' : 
              decisionScore >= 50 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
            }`}>
              <p className="text-sm font-medium">
                {decisionScore >= 75 ? '✅ 좋은 기획입니다!' : 
                 decisionScore >= 50 ? '⚠️ 개선이 필요합니다' : '❌ 다시 검토해보세요'}
              </p>
            </div>
          </div>

          {/* Real-time Insights */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
            <h3 className="font-semibold mb-4">실시간 인사이트</h3>
            
            {insights.length === 0 ? (
              <p className="text-sm text-gray-500">내용을 입력하면 인사이트가 표시됩니다</p>
            ) : (
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className={`flex items-start gap-2 p-2 rounded-lg ${
                    insight.type === 'good' ? 'bg-green-50' :
                    insight.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    <div className={`mt-0.5 ${
                      insight.type === 'good' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {insight.icon}
                    </div>
                    <p className="text-sm text-gray-700">{insight.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Creator Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              크리에이터 팁
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>제목의 첫 10자가 CTR의 80%를 결정합니다</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>구체적인 숫자와 기한이 있으면 신뢰도가 올라갑니다</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>3초 훅은 20자 이내로, 동사로 시작하세요</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <p>"왜"보다 "어떻게"가 더 많은 클릭을 유도합니다</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold mb-3">예상 성과</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Eye className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-gray-600">예상 CTR</p>
                <p className="font-bold">{plan.title ? '8-12%' : '-'}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <p className="text-xs text-gray-600">시청 지속</p>
                <p className="font-bold">{plan.hook ? '45-60%' : '-'}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <ThumbsUp className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                <p className="text-xs text-gray-600">좋아요율</p>
                <p className="font-bold">{plan.cta ? '3-5%' : '-'}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-gray-600">댓글율</p>
                <p className="font-bold">{plan.story ? '1-2%' : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}