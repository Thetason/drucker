"use client"

import React, { useState, useEffect } from "react"
import { 
  User, Target, Heart, DollarSign, Sparkles,
  ChevronRight, CheckCircle2, Circle, AlertCircle,
  Brain, Rocket, Users, TrendingUp, Award,
  Lightbulb, MessageSquare, Save, ArrowRight,
  Youtube, Instagram, Music, Briefcase, Book,
  Camera, Mic, Edit3, Code, Palette, Coffee,
  Swords, Shield, Zap, Star, Gem, Trophy,
  Activity, BarChart3, Flame
} from "lucide-react"

interface PersonaData {
  // 기본 정보
  name: string
  tagline: string
  
  // 4가지 핵심 질문 (라이언 인사이트)
  whatICanDo: string[]  // 내가 잘하는 것
  whatILove: string[]   // 내가 좋아하는 것
  whoIWantToTalkTo: string  // 소통하고 싶은 사람들
  monetizationPlan: string  // 수익화 계획
  
  // 상세 페르소나
  expertise: string  // 전문 분야
  experience: string  // 경험/경력
  personality: string[]  // 성격/특징
  contentStyle: string  // 콘텐츠 스타일
  
  // 타겟 오디언스
  targetAge: string
  targetInterests: string[]
  targetPainPoints: string[]
  
  // 콘텐츠 전략
  primaryPlatform: string
  contentFrequency: string
  contentTopics: string[]
  
  createdAt: string
  updatedAt: string
}

const expertiseOptions = [
  { icon: <Briefcase />, label: "비즈니스/창업", value: "business" },
  { icon: <Code />, label: "개발/IT", value: "tech" },
  { icon: <Palette />, label: "디자인/아트", value: "design" },
  { icon: <Camera />, label: "사진/영상", value: "media" },
  { icon: <Book />, label: "교육/강의", value: "education" },
  { icon: <Coffee />, label: "라이프스타일", value: "lifestyle" },
  { icon: <Heart />, label: "건강/운동", value: "health" },
  { icon: <Music />, label: "음악/엔터", value: "entertainment" }
]

const platformOptions = [
  { icon: <Youtube />, label: "YouTube", value: "youtube" },
  { icon: <Instagram />, label: "Instagram", value: "instagram" },
  { icon: <Music />, label: "TikTok", value: "tiktok" },
  { icon: <MessageSquare />, label: "Threads", value: "threads" }
]

interface CreatorPersonaProps {
  onPersonaComplete?: () => void
}

export function CreatorPersona({ onPersonaComplete }: CreatorPersonaProps = {}) {
  const [step, setStep] = useState(1)
  const [persona, setPersona] = useState<PersonaData>({
    name: '',
    tagline: '',
    whatICanDo: [],
    whatILove: [],
    whoIWantToTalkTo: '',
    monetizationPlan: '',
    expertise: '',
    experience: '',
    personality: [],
    contentStyle: '',
    targetAge: '',
    targetInterests: [],
    targetPainPoints: [],
    primaryPlatform: '',
    contentFrequency: '',
    contentTopics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [isComplete, setIsComplete] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Load saved persona
  useEffect(() => {
    const saved = localStorage.getItem('drucker-persona')
    if (saved) {
      setPersona(JSON.parse(saved))
      setIsComplete(true)
    }
  }, [])

  // Auto-save
  useEffect(() => {
    if (persona.name) {
      localStorage.setItem('drucker-persona', JSON.stringify({
        ...persona,
        updatedAt: new Date().toISOString()
      }))
    }
  }, [persona])

  // Generate suggestions based on expertise
  useEffect(() => {
    if (persona.expertise) {
      const topicSuggestions: { [key: string]: string[] } = {
        business: ["스타트업 경험", "실패와 교훈", "성공 사례", "비즈니스 인사이트"],
        tech: ["개발 튜토리얼", "신기술 리뷰", "프로젝트 과정", "코딩 팁"],
        design: ["디자인 프로세스", "툴 사용법", "포트폴리오", "트렌드 분석"],
        media: ["촬영 팁", "편집 기법", "장비 리뷰", "비하인드"],
        education: ["학습법", "시험 대비", "멘토링", "진로 상담"],
        lifestyle: ["일상 루틴", "제품 리뷰", "라이프 해킹", "미니멀라이프"],
        health: ["운동 루틴", "식단 관리", "멘탈 케어", "습관 만들기"],
        entertainment: ["리액션", "커버", "챌린지", "콜라보"]
      }
      setSuggestions(topicSuggestions[persona.expertise] || [])
    }
  }, [persona.expertise])

  const addToList = (field: 'whatICanDo' | 'whatILove' | 'personality' | 'targetInterests' | 'targetPainPoints' | 'contentTopics', value: string) => {
    if (value && !persona[field].includes(value)) {
      setPersona({
        ...persona,
        [field]: [...persona[field], value]
      })
    }
  }

  const removeFromList = (field: 'whatICanDo' | 'whatILove' | 'personality' | 'targetInterests' | 'targetPainPoints' | 'contentTopics', value: string) => {
    setPersona({
      ...persona,
      [field]: persona[field].filter(item => item !== value)
    })
  }

  const getCompletionRate = () => {
    const requiredFields = [
      persona.name,
      persona.whatICanDo.length > 0,
      persona.whatILove.length > 0,
      persona.whoIWantToTalkTo,
      persona.monetizationPlan,
      persona.expertise,
      persona.targetAge,
      persona.primaryPlatform
    ]
    return Math.round((requiredFields.filter(Boolean).length / requiredFields.length) * 100)
  }

  const completionRate = getCompletionRate()

  // Calculate persona stats with advanced creator success metrics
  const getPersonaStats = () => {
    // 1. 진정성 점수 (Authenticity) - 라이언의 "내가 좋아하는 것과 잘하는 것의 교집합"
    const authenticityScore = () => {
      const loveCount = persona.whatILove?.length || 0
      const skillCount = persona.whatICanDo?.length || 0
      
      // 교집합 찾기 (실제로 겹치는 영역이 있는지)
      const hasOverlap = loveCount > 0 && skillCount > 0
      const overlapBonus = hasOverlap ? 30 : 0
      
      // 깊이 점수 (각 항목의 구체성)
      const depthScore = (loveCount * 10) + (skillCount * 10)
      
      // 일관성 점수 (전문 분야와 관심사의 연관성)
      const consistencyScore = persona.expertise && persona.contentTopics?.length > 0 ? 20 : 0
      
      return Math.min(100, overlapBonus + depthScore + consistencyScore)
    }
    
    // 2. 시장 적합성 (Market Fit) - "누구와 소통하고 싶은가"의 구체성
    const marketFitScore = () => {
      // 타겟 구체성 (단순히 있냐 없냐가 아니라 얼마나 구체적인지)
      const targetSpecificity = persona.whoIWantToTalkTo ? 
        (persona.whoIWantToTalkTo.length > 50 ? 30 : persona.whoIWantToTalkTo.length / 2) : 0
      
      // 페인포인트 이해도
      const painPointDepth = (persona.targetPainPoints?.length || 0) * 15
      
      // 타겟 관심사와 내 콘텐츠 주제의 매칭
      const interestAlignment = 
        (persona.targetInterests?.length || 0) > 0 && 
        (persona.contentTopics?.length || 0) > 0 ? 25 : 0
      
      // 연령대 타겟팅 정확도
      const ageTargeting = persona.targetAge && persona.targetAge !== '전연령' ? 15 : 5
      
      return Math.min(100, targetSpecificity + painPointDepth + interestAlignment + ageTargeting)
    }
    
    // 3. 콘텐츠 전략 (Content Strategy) - 실행 가능한 계획의 구체성
    const strategyScore = () => {
      // 플랫폼-콘텐츠 적합성
      const platformFit = () => {
        if (!persona.primaryPlatform) return 0
        
        // 플랫폼별 최적 업로드 주기 매칭
        const optimalFrequency: Record<string, string[]> = {
          'youtube': ['주 2회', '주 1회'],
          'instagram': ['매일', '주 3-4회'],
          'tiktok': ['매일', '주 3-4회'],
          'threads': ['매일', '주 3-4회']
        }
        
        const platform = persona.primaryPlatform
        const frequency = persona.contentFrequency
        
        return optimalFrequency[platform]?.includes(frequency) ? 30 : 15
      }
      
      // 콘텐츠 다양성과 집중도 밸런스
      const topicBalance = () => {
        const topicCount = persona.contentTopics?.length || 0
        // 2-3개가 최적 (너무 많으면 산만, 너무 적으면 단조로움)
        if (topicCount === 2 || topicCount === 3) return 30
        if (topicCount === 1 || topicCount === 4) return 20
        return 10
      }
      
      // 스타일 정의 명확성
      const styleClarity = persona.contentStyle ? 
        (persona.contentStyle.length > 30 ? 20 : 10) : 0
      
      // 실행 가능성 (업로드 주기가 현실적인지)
      const feasibility = () => {
        if (!persona.contentFrequency) return 0
        if (persona.contentFrequency === '매일' && !persona.experience) return 5 // 경험 없이 매일은 비현실적
        if (persona.contentFrequency === '주 2회' || persona.contentFrequency === '주 1회') return 20 // 가장 지속가능
        return 15
      }
      
      return Math.min(100, platformFit() + topicBalance() + styleClarity + feasibility())
    }
    
    // 4. 성장 잠재력 (Growth Potential) - 확장 가능성
    const growthScore = () => {
      // 전문성 깊이
      const expertiseDepth = () => {
        if (!persona.expertise) return 0
        const hasExperience = persona.experience ? 20 : 0
        const hasSkills = (persona.whatICanDo?.length || 0) > 1 ? 15 : 0
        return hasExperience + hasSkills + 15 // 기본 점수
      }
      
      // 수익화 모델 다양성
      const monetizationDiversity = () => {
        const plan = persona.monetizationPlan
        if (!plan || plan === '아직 없음') return 0
        
        // 확장 가능한 모델인지
        const scalableModels = ['온라인 강의', '제품 판매', '멘토링/컨설팅']
        const isScalable = scalableModels.includes(plan) ? 30 : 15
        
        // 전문성과 매칭되는지
        const expertiseMatch = persona.expertise && isScalable ? 10 : 0
        
        return isScalable + expertiseMatch
      }
      
      // 네트워크 효과 가능성
      const networkEffect = () => {
        // 타겟이 명확하고 페인포인트를 해결하면 바이럴 가능성 높음
        const viralPotential = 
          persona.whoIWantToTalkTo && 
          (persona.targetPainPoints?.length || 0) > 0 ? 20 : 0
        
        return viralPotential
      }
      
      return Math.min(100, expertiseDepth() + monetizationDiversity() + networkEffect())
    }
    
    // 5. 지속가능성 (Sustainability) - 번아웃 없이 장기적으로 가능한지
    const sustainabilityScore = () => {
      // 열정 지속성 (좋아하는 것 기반)
      const passionDriven = (persona.whatILove?.length || 0) * 20
      
      // 현실적 목표 설정
      const realisticGoals = () => {
        const frequency = persona.contentFrequency
        if (!frequency) return 0
        
        // 주 2회 이하가 가장 지속가능
        if (frequency === '주 1회' || frequency === '격주') return 30
        if (frequency === '주 2회') return 25
        if (frequency === '주 3-4회') return 15
        if (frequency === '매일') return 10 // 매일은 번아웃 위험
        return 20
      }
      
      // 수익화 계획의 현실성
      const monetizationRealism = () => {
        const plan = persona.monetizationPlan
        const hasExpertise = persona.expertise && persona.experience
        
        if (plan === '온라인 강의' || plan === '멘토링/컨설팅') {
          return hasExpertise ? 30 : 10 // 전문성 없이는 비현실적
        }
        if (plan === '광고 수익') return 20 // 시간이 오래 걸림
        if (plan === '아직 없음') return 15 // 괜찮음, 천천히 찾아가도 됨
        return 25
      }
      
      return Math.min(100, passionDriven + realisticGoals() + monetizationRealism())
    }
    
    // 멀티플라이어 계산 (시너지 효과)
    const calculateMultipliers = () => {
      const scores = {
        authenticity: authenticityScore(),
        marketFit: marketFitScore(),
        strategy: strategyScore(),
        growth: growthScore(),
        sustainability: sustainabilityScore()
      }
      
      // 황금 조합 체크 (모든 점수가 60점 이상이면 보너스)
      const goldenCombo = Object.values(scores).every(s => s >= 60) ? 1.2 : 1.0
      
      // 코어 밸런스 체크 (진정성과 시장적합성이 모두 높으면 보너스)
      const coreBalance = scores.authenticity >= 70 && scores.marketFit >= 70 ? 1.1 : 1.0
      
      return {
        scores,
        goldenCombo,
        coreBalance,
        totalMultiplier: goldenCombo * coreBalance
      }
    }
    
    const result = calculateMultipliers()
    
    // 최종 점수 (멀티플라이어 적용)
    const finalScores = {
      authenticity: Math.min(100, Math.round(result.scores.authenticity * result.totalMultiplier)),
      marketFit: Math.min(100, Math.round(result.scores.marketFit * result.totalMultiplier)),
      strategy: Math.min(100, Math.round(result.scores.strategy * result.totalMultiplier)),
      growth: Math.min(100, Math.round(result.scores.growth * result.totalMultiplier)),
      sustainability: Math.min(100, Math.round(result.scores.sustainability * result.totalMultiplier))
    }
    
    // 기존 UI와의 호환을 위해 매핑
    return {
      creativity: finalScores.authenticity,  // 진정성 = 창의력
      expertise: finalScores.growth,         // 성장잠재력 = 전문성
      audience: finalScores.marketFit,       // 시장적합성 = 오디언스
      consistency: finalScores.sustainability, // 지속가능성 = 꾸준함
      monetization: finalScores.strategy     // 전략 = 수익화
    }
  }

  const personaStats = getPersonaStats()

  if (isComplete) {
    // 완성된 페르소나 보기
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {persona.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{persona.name}</h1>
                <p className="text-gray-600">{persona.tagline}</p>
              </div>
            </div>
            <button
              onClick={() => setIsComplete(false)}
              className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              수정하기
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">타겟</span>
              </div>
              <p className="font-semibold">{persona.targetAge}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600">플랫폼</span>
              </div>
              <p className="font-semibold">{persona.primaryPlatform}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">업로드</span>
              </div>
              <p className="font-semibold">{persona.contentFrequency}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">수익화</span>
              </div>
              <p className="font-semibold">{persona.monetizationPlan}</p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                내가 잘하는 것
              </h3>
              <div className="flex flex-wrap gap-2">
                {persona.whatICanDo.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                내가 좋아하는 것
              </h3>
              <div className="flex flex-wrap gap-2">
                {persona.whatILove.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                타겟 관심사
              </h3>
              <div className="flex flex-wrap gap-2">
                {persona.targetInterests.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                콘텐츠 주제
              </h3>
              <div className="flex flex-wrap gap-2">
                {persona.contentTopics.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ 페르소나 설정 완료! 이제 일관성 있는 콘텐츠를 만들 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 페르소나 설정 단계별 UI
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Step by Step Form */}
        <div className="col-span-8 bg-white rounded-2xl shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">크리에이터 페르소나 설정</h2>
            <span className="text-sm text-gray-600">{completionRate}% 완성</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                step === s 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {s === 1 && "기본 정보"}
                {s === 2 && "핵심 질문"}
                {s === 3 && "타겟 설정"}
                {s === 4 && "콘텐츠 전략"}
              </span>
            </button>
          ))}
        </div>

        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-700 text-sm">
                💡 라이언 인사이트: "첫 단추를 잘 꿰야 합니다. 페르소나가 명확해야 일관된 콘텐츠가 나옵니다."
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">크리에이터 이름/닉네임</label>
              <input
                type="text"
                value={persona.name}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                placeholder="예: 개발하는 정대리"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">한 줄 소개</label>
              <input
                type="text"
                value={persona.tagline}
                onChange={(e) => setPersona({ ...persona, tagline: e.target.value })}
                placeholder="예: 퇴근 후 사이드 프로젝트로 월 500 버는 개발자"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">전문 분야</label>
              <div className="grid grid-cols-4 gap-3">
                {expertiseOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPersona({ ...persona, expertise: option.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      persona.expertise === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {React.cloneElement(option.icon, { 
                        className: `h-6 w-6 ${persona.expertise === option.value ? 'text-blue-500' : 'text-gray-400'}` 
                      })}
                      <span className="text-xs">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">경력/경험</label>
              <input
                type="text"
                value={persona.experience}
                onChange={(e) => setPersona({ ...persona, experience: e.target.value })}
                placeholder="예: 5년차 백엔드 개발자, 스타트업 3곳 경험"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: 핵심 질문 (라이언 4원칙) */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700 text-sm font-medium mb-2">🎯 라이언의 4가지 핵심 질문</p>
              <p className="text-blue-600 text-xs">
                "이 질문에 대한 답이 준비되셨다면, 첫 단추를 잘 꿴 거예요"
              </p>
            </div>

            {/* 1. 내가 잘하는 것 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                1. 내가 잘하는 것은 무엇인가요?
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="예: React 개발, API 설계"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('whatICanDo', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.whatICanDo.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      onClick={() => removeFromList('whatICanDo', item)}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 2. 내가 좋아하는 것 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                2. 내가 좋아하는 것은 무엇인가요?
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="예: 새로운 기술 학습, 사이드 프로젝트"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('whatILove', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.whatILove.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      onClick={() => removeFromList('whatILove', item)}
                      className="hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 3. 누구와 소통하고 싶은가 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                3. 나는 어떤 사람들과 소통하고 싶은가요?
              </label>
              <textarea
                value={persona.whoIWantToTalkTo}
                onChange={(e) => setPersona({ ...persona, whoIWantToTalkTo: e.target.value })}
                placeholder="예: 개발을 시작하려는 비전공자, 이직을 준비하는 주니어 개발자"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows={2}
              />
            </div>

            {/* 4. 수익화 계획 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                4. 수익화에 대한 계획은 있나요?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "광고 수익",
                  "온라인 강의",
                  "멘토링/컨설팅",
                  "제품 판매",
                  "스폰서십",
                  "아직 없음"
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setPersona({ ...persona, monetizationPlan: option })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      persona.monetizationPlan === option
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 타겟 설정 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700 text-sm">
                💡 "사람들은 자기가 뭘 원하는지 정확히 모릅니다. 니즈를 발굴해주세요."
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">타겟 연령대</label>
              <div className="grid grid-cols-3 gap-3">
                {["10대", "20대 초반", "20대 후반", "30대", "40대", "전연령"].map((age) => (
                  <button
                    key={age}
                    onClick={() => setPersona({ ...persona, targetAge: age })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      persona.targetAge === age
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{age}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">타겟의 관심사</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="예: 자기계발, 투자, 부업"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('targetInterests', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.targetInterests.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      onClick={() => removeFromList('targetInterests', item)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">타겟의 고민/문제점</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="예: 코딩 시작이 막막함, 이직 준비 방법을 모름"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('targetPainPoints', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.targetPainPoints.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      onClick={() => removeFromList('targetPainPoints', item)}
                      className="hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 콘텐츠 전략 */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">
                💡 "환경 설정을 하세요. 정해진 시간에, 정해진 장소에서, 꾸준히 만드세요."
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">주력 플랫폼</label>
              <div className="grid grid-cols-4 gap-3">
                {platformOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPersona({ ...persona, primaryPlatform: option.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      persona.primaryPlatform === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {React.cloneElement(option.icon, { 
                        className: `h-6 w-6 ${persona.primaryPlatform === option.value ? 'text-blue-500' : 'text-gray-400'}` 
                      })}
                      <span className="text-xs">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">업로드 주기</label>
              <div className="grid grid-cols-3 gap-3">
                {["매일", "주 3-4회", "주 2회", "주 1회", "격주", "월 2회"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setPersona({ ...persona, contentFrequency: freq })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      persona.contentFrequency === freq
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{freq}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">주요 콘텐츠 주제</label>
              {suggestions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">추천 주제:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => addToList('contentTopics', suggestion)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="예: React 튜토리얼, 개발 일상, 코딩 팁"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('contentTopics', (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.contentTopics.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      onClick={() => removeFromList('contentTopics', item)}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">콘텐츠 스타일</label>
              <textarea
                value={persona.contentStyle}
                onChange={(e) => setPersona({ ...persona, contentStyle: e.target.value })}
                placeholder="예: 친근하고 유머러스한 톤, 실용적인 정보 위주, 짧고 임팩트 있게"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              step === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            이전
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(Math.min(4, step + 1))}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              다음
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (completionRate >= 80) {
                  setIsComplete(true)
                  if (onPersonaComplete) {
                    onPersonaComplete()
                  }
                } else {
                  alert('필수 항목을 모두 입력해주세요')
                }
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                completionRate >= 80
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              완료
            </button>
          )}
        </div>
        </div>

        {/* Right Side - RPG Style Status Panel */}
        <div className="col-span-4 space-y-4">
        {/* Character Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Trophy className="h-32 w-32" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {persona.name ? persona.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="font-bold text-lg">{persona.name || '이름 미설정'}</h3>
                <p className="text-xs text-white/70">Lv. {Math.floor(completionRate / 10)}</p>
              </div>
            </div>

            {/* Stats Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> 진정성
                  </span>
                  <span className="text-xs">{personaStats.creativity}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${personaStats.creativity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center gap-1">
                    <Rocket className="h-3 w-3" /> 성장잠재력
                  </span>
                  <span className="text-xs">{personaStats.expertise}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${personaStats.expertise}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center gap-1">
                    <Target className="h-3 w-3" /> 시장적합성
                  </span>
                  <span className="text-xs">{personaStats.audience}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
                    style={{ width: `${personaStats.audience}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" /> 지속가능성
                  </span>
                  <span className="text-xs">{personaStats.consistency}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                    style={{ width: `${personaStats.consistency}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs flex items-center gap-1">
                    <Brain className="h-3 w-3" /> 콘텐츠전략
                  </span>
                  <span className="text-xs">{personaStats.monetization}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-500"
                    style={{ width: `${personaStats.monetization}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Power */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">총 전투력</span>
                <span className="text-xl font-bold flex items-center gap-1">
                  <Flame className="h-5 w-5 text-orange-400" />
                  {Math.round((personaStats.creativity + personaStats.expertise + personaStats.audience + personaStats.consistency + personaStats.monetization) / 5)}
                </span>
              </div>
              
              {/* Synergy Indicators */}
              {(personaStats.creativity + personaStats.expertise) > 150 && (
                <div className="mt-2 text-xs text-yellow-300 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  창의력×전문성 시너지 발동!
                </div>
              )}
              {(personaStats.audience + personaStats.monetization) > 140 && (
                <div className="mt-1 text-xs text-green-300 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  오디언스×수익화 시너지 발동!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Equipped Items (Current Settings) */}
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-600" />
            장착 아이템
          </h3>
          
          <div className="space-y-2">
            {persona.expertise && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <Gem className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-xs font-medium">전문 분야</p>
                  <p className="text-xs text-gray-600">
                    {expertiseOptions.find(e => e.value === persona.expertise)?.label}
                  </p>
                  <p className="text-xs text-blue-600 font-semibold">
                    전문성 +25
                  </p>
                </div>
              </div>
            )}
            
            {persona.primaryPlatform && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <Star className="h-4 w-4 text-purple-500" />
                <div className="flex-1">
                  <p className="text-xs font-medium">주력 플랫폼</p>
                  <p className="text-xs text-gray-600">
                    {platformOptions.find(p => p.value === persona.primaryPlatform)?.label}
                  </p>
                  <p className="text-xs text-purple-600 font-semibold">
                    꾸준함 +30
                  </p>
                </div>
              </div>
            )}
            
            {persona.contentFrequency && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <Zap className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-xs font-medium">업로드 주기</p>
                  <p className="text-xs text-gray-600">{persona.contentFrequency}</p>
                  <p className="text-xs text-green-600 font-semibold">
                    꾸준함 +{persona.contentFrequency === '매일' ? 50 : 
                             persona.contentFrequency === '주 3-4회' ? 40 :
                             persona.contentFrequency === '주 2회' ? 30 : 25}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Formula Guide */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-orange-600" />
            성공 공식 분석
          </h3>
          
          <div className="space-y-3 text-xs">
            {/* 진정성 체크 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-orange-700">진정성</span>
                <span className="text-gray-600">{personaStats.creativity}%</span>
              </div>
              <div className="text-gray-500">
                {personaStats.creativity >= 70 ? 
                  "✅ 좋아하는 것과 잘하는 것의 완벽한 교집합" :
                  personaStats.creativity >= 40 ?
                  "⚠️ 교집합 영역을 더 명확히 하세요" :
                  "❌ 내가 진짜 좋아하는 것을 찾아보세요"
                }
              </div>
            </div>
            
            {/* 시장적합성 체크 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-orange-700">시장적합성</span>
                <span className="text-gray-600">{personaStats.audience}%</span>
              </div>
              <div className="text-gray-500">
                {personaStats.audience >= 70 ?
                  "✅ 타겟과 페인포인트가 명확합니다" :
                  personaStats.audience >= 40 ?
                  "⚠️ 타겟을 더 구체화하세요" :
                  "❌ 누구와 소통할지 명확히 정의하세요"
                }
              </div>
            </div>
            
            {/* 황금 조합 체크 */}
            {personaStats.creativity >= 60 && 
             personaStats.expertise >= 60 && 
             personaStats.audience >= 60 && 
             personaStats.consistency >= 60 && 
             personaStats.monetization >= 60 && (
              <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300">
                <div className="flex items-center gap-1 text-orange-700 font-semibold">
                  <Flame className="h-3 w-3" />
                  황금 조합 달성! (+20% 보너스)
                </div>
              </div>
            )}
            
            {/* 추천 액션 */}
            <div className="pt-2 border-t border-orange-200">
              <p className="font-medium text-orange-700 mb-1">다음 단계:</p>
              {personaStats.creativity < 60 && (
                <p className="text-gray-600">• 좋아하는 것 더 추가하기</p>
              )}
              {personaStats.audience < 60 && (
                <p className="text-gray-600">• 타겟 페인포인트 구체화</p>
              )}
              {personaStats.consistency < 60 && (
                <p className="text-gray-600">• 현실적인 업로드 주기 설정</p>
              )}
            </div>
          </div>
        </div>

        {/* Quest Progress */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-600" />
            현재 퀘스트
          </h3>
          
          <div className="space-y-2">
            <div className={`p-2 rounded-lg ${step === 1 ? 'bg-blue-100 border border-blue-300' : 'bg-white'}`}>
              <div className="flex items-center gap-2">
                {step > 1 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-400" />}
                <span className="text-xs">기본 정보 입력</span>
              </div>
            </div>
            
            <div className={`p-2 rounded-lg ${step === 2 ? 'bg-blue-100 border border-blue-300' : 'bg-white'}`}>
              <div className="flex items-center gap-2">
                {step > 2 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-400" />}
                <span className="text-xs">핵심 질문 답변</span>
              </div>
            </div>
            
            <div className={`p-2 rounded-lg ${step === 3 ? 'bg-blue-100 border border-blue-300' : 'bg-white'}`}>
              <div className="flex items-center gap-2">
                {step > 3 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-400" />}
                <span className="text-xs">타겟 설정</span>
              </div>
            </div>
            
            <div className={`p-2 rounded-lg ${step === 4 ? 'bg-blue-100 border border-blue-300' : 'bg-white'}`}>
              <div className="flex items-center gap-2">
                {step > 4 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-400" />}
                <span className="text-xs">콘텐츠 전략</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-2 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              🎯 완료 보상: 맞춤형 콘텐츠 추천 해금
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}