"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, Target, TrendingUp, Clock, 
  Eye, ThumbsUp, MessageCircle, Share2,
  Video, Camera, Edit,
  CheckCircle,
  FileText, Users
} from "lucide-react"

interface ContentPlan {
  // 패키징 (제목 & 썸네일)
  titles: string[]  // 5개 후보
  selectedTitle: number
  thumbnailConcepts: string[]  // 3개 컨셉
  shortHook: string  // 0-3초 훅
  
  // 목표 & 타겟
  goal: string  // KPI + 기한
  targetSituation: string  // 타겟/상황
  promise: string  // 한 문장 약속
  
  // 스토리 구조 (진-교-성)
  diagnosis: string  // 진단/공감
  solution: string  // 교정/방법
  result: string  // 성과/다음 행동
  evidence: string  // 증거
  
  // 리텐션 설계
  retentionMarkers: {
    sec15: string
    sec45: string
    sec90: string
  }
  
  // CTA & 전환
  cta: string
  dmKeyword: string
  
  // 플랫폼 계획
  platform: 'youtube' | 'shorts' | 'reels'
  contentMix: {
    help: number  // %
    hub: number   // %
    hero: number  // %
  }
  
  // 체크리스트
  checklist: {
    packageFirst: boolean
    promiseMatch: boolean
    retentionPlan: boolean
    evidenceIncluded: boolean
    ctaClear: boolean
  }
}

export function ContentPlanner() {
  const [currentStep, setCurrentStep] = useState<'package' | 'story' | 'retention' | 'review'>('package')
  const [showInspiration, setShowInspiration] = useState(true)
  const [savedPlans, setSavedPlans] = useState<any[]>([])
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [plan, setPlan] = useState<any>({
    // 패키징
    titles: ["", "", "", "", ""],
    selectedTitle: 0,
    thumbnailConcepts: ["", "", ""],
    shortHook: "",
    
    // 목표
    goal: "",
    targetSituation: "",
    promise: "",
    
    // 스토리
    diagnosis: "",
    solution: "",
    result: "",
    evidence: "",
    
    // 리텐션
    retentionMarkers: {
      sec15: "",
      sec45: "",
      sec90: ""
    },
    
    // CTA
    cta: "",
    dmKeyword: "",
    
    // 플랫폼
    platform: "youtube",
    contentMix: {
      help: 60,
      hub: 30,
      hero: 10
    },
    
    // 체크
    checklist: {
      packageFirst: false,
      promiseMatch: false,
      retentionPlan: false,
      evidenceIncluded: false,
      ctaClear: false
    },
    
    // Additional fields for compatibility
    title: "",
    targetAudience: "",
    hook: "",
    mainContent: ["", "", ""],
    keywords: [],
    duration: "10분"
  })

  const steps = [
    { id: 'package', label: '패키징 먼저', icon: <Package className="h-4 w-4" /> },
    { id: 'story', label: '스토리 구조', icon: <FileText className="h-4 w-4" /> },
    { id: 'retention', label: '리텐션 설계', icon: <Clock className="h-4 w-4" /> },
    { id: 'review', label: '검토 & 저장', icon: <CheckCircle className="h-4 w-4" /> }
  ]

  const platforms = {
    youtube: {
      name: "유튜브",
      icon: <Video className="h-4 w-4" />,
      durations: ["5-10분", "10-15분", "15-20분", "20분+"],
      color: "bg-red-500"
    },
    shorts: {
      name: "쇼츠",
      icon: <Camera className="h-4 w-4" />,
      durations: ["15초", "30초", "60초"],
      color: "bg-pink-500"
    },
    reels: {
      name: "릴스",
      icon: <Edit className="h-4 w-4" />,
      durations: ["15초", "30초", "60초", "90초"],
      color: "bg-purple-500"
    }
  }

  const contentTemplates = {
    youtube: {
      "튜토리얼": {
        hook: "이 영상을 끝까지 보시면 [결과]를 얻으실 수 있습니다",
        structure: ["문제 제시", "해결 방법 단계별 설명", "실제 시연", "결과 및 팁"],
        cta: "구독과 좋아요, 알림설정 부탁드려요!"
      },
      "브이로그": {
        hook: "오늘은 특별한 하루를 보냈어요",
        structure: ["인트로/일정 소개", "메인 활동", "하이라이트 순간", "마무리 소감"],
        cta: "다음 브이로그도 기대해주세요!"
      },
      "리뷰": {
        hook: "[제품]을 한 달 사용해본 솔직 후기",
        structure: ["제품 소개", "장단점 분석", "실사용 경험", "추천 여부"],
        cta: "더 많은 리뷰를 원하시면 구독해주세요!"
      }
    },
    shorts: {
      "꿀팁": {
        hook: "이거 모르면 손해!",
        structure: ["문제 상황", "해결책 제시", "결과"],
        cta: "더 많은 꿀팁은 팔로우!"
      },
      "비포애프터": {
        hook: "단 30초만에 변화를!",
        structure: ["비포 상태", "과정 빠르게", "애프터 공개"],
        cta: "놀라우셨다면 좋아요!"
      }
    },
    reels: {
      "트렌드": {
        hook: "지금 핫한 [트렌드]",
        structure: ["어텐션", "메인 콘텐츠", "반전/재미"],
        cta: "저장하고 친구에게 공유!"
      },
      "일상": {
        hook: "[시간]의 나",
        structure: ["상황 소개", "메인 장면", "마무리 멘트"],
        cta: "공감되시면 댓글 남겨주세요!"
      }
    }
  }

  const trendingKeywords = {
    "2024": ["MZ", "갓생", "부업", "AI", "힐링", "미니멀", "루틴", "꿀팁"],
    "유튜브": ["첫공개", "TMI", "Q&A", "챌린지", "브이로그", "하울", "루틴"],
    "릴스": ["POV", "GRWM", "transition", "aesthetic", "relatable", "storytime"]
  }

  // Load saved plans from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('drucker-plans')
    if (saved) {
      try {
        const plans = JSON.parse(saved)
        setSavedPlans(plans)
      } catch (error) {
        console.error('Failed to load saved plans:', error)
      }
    }

    // Check if there's a plan to open from production schedule
    const openPlanId = localStorage.getItem('drucker-open-plan')
    if (openPlanId) {
      const saved = localStorage.getItem('drucker-plans')
      if (saved) {
        const plans = JSON.parse(saved)
        const planToOpen = plans.find((p: any) => p.id === openPlanId)
        if (planToOpen) {
          setPlan(planToOpen)
          setEditingPlanId(openPlanId)
        }
      }
      localStorage.removeItem('drucker-open-plan')
    }
  }, [])

  // Save plans to localStorage whenever they change
  useEffect(() => {
    if (savedPlans.length > 0) {
      localStorage.setItem('drucker-plans', JSON.stringify(savedPlans))
    }
  }, [savedPlans])

  const savePlan = () => {
    if (!plan.title) {
      alert("콘텐츠 제목을 입력해주세요!")
      return
    }

    const planToSave = {
      ...plan,
      id: editingPlanId || Date.now().toString(),
      goal: plan.goal || `${plan.platform} 콘텐츠 제작`,
      target: plan.targetAudience || '타겟 미설정',
      updatedAt: new Date().toISOString()
    }

    if (editingPlanId) {
      // Update existing plan
      setSavedPlans(savedPlans.map(p => p.id === editingPlanId ? planToSave : p))
      alert("기획서가 수정되었습니다!")
      setEditingPlanId(null)
    } else {
      // Add new plan
      setSavedPlans([...savedPlans, planToSave])
      alert("기획서가 저장되었습니다!")
    }

    // Reset form
    setPlan({
      titles: ["", "", "", "", ""],
      selectedTitle: 0,
      thumbnailConcepts: ["", "", ""],
      shortHook: "",
      goal: "",
      targetSituation: "",
      promise: "",
      diagnosis: "",
      solution: "",
      result: "",
      evidence: "",
      retentionMarkers: {
        sec15: "",
        sec45: "",
        sec90: ""
      },
      cta: "",
      dmKeyword: "",
      platform: "youtube",
      contentMix: {
        help: 60,
        hub: 30,
        hero: 10
      },
      checklist: {
        packageFirst: false,
        promiseMatch: false,
        retentionPlan: false,
        evidenceIncluded: false,
        ctaClear: false
      },
      title: "",
      targetAudience: "",
      hook: "",
      mainContent: ["", "", ""],
      keywords: [],
      duration: "10분"
    })
  }

  const loadPlanForEdit = (planId: string) => {
    const planToEdit = savedPlans.find(p => p.id === planId)
    if (planToEdit) {
      setPlan(planToEdit)
      setEditingPlanId(planId)
    }
  }

  const deletePlan = (planId: string) => {
    if (confirm('이 기획서를 삭제하시겠습니까?')) {
      setSavedPlans(savedPlans.filter(p => p.id !== planId))
      if (planId === editingPlanId) {
        setEditingPlanId(null)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          콘텐츠 기획서
        </CardTitle>
        <CardDescription>
          유튜브/릴스 콘텐츠를 체계적으로 기획해보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 영감과 가이드 섹션 */}
        {showInspiration && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm">💡 기획 영감</h3>
              <button 
                onClick={() => setShowInspiration(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* 픽사 스토리 스파인 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-purple-700">📖 픽사 스토리 공식</p>
              <div className="text-xs space-y-1 text-gray-600">
                <p>1️⃣ <strong>평범한 일상</strong> - "매일 이렇게 지내던..."</p>
                <p>2️⃣ <strong>변화의 순간</strong> - "그런데 어느 날..."</p>
                <p>3️⃣ <strong>도전과 성장</strong> - "그래서 나는..."</p>
                <p>4️⃣ <strong>결과와 교훈</strong> - "결국 깨달았다..."</p>
              </div>
            </div>

            {/* 핵심 질문들 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-700">🎯 스스로에게 물어보세요</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded text-xs">
                  <p className="font-medium mb-1">Why (왜)</p>
                  <p className="text-gray-500">시청자가 이걸 왜 봐야 할까?</p>
                </div>
                <div className="p-2 bg-white rounded text-xs">
                  <p className="font-medium mb-1">What (무엇)</p>
                  <p className="text-gray-500">정확히 무엇을 전달할 건가?</p>
                </div>
                <div className="p-2 bg-white rounded text-xs">
                  <p className="font-medium mb-1">Who (누구)</p>
                  <p className="text-gray-500">누가 이걸 필요로 할까?</p>
                </div>
                <div className="p-2 bg-white rounded text-xs">
                  <p className="font-medium mb-1">How (어떻게)</p>
                  <p className="text-gray-500">어떤 방식이 가장 효과적일까?</p>
                </div>
              </div>
            </div>

            {/* 감정 곡선 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-green-700">📈 감정 곡선 설계</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 rounded">호기심</span>
                <span>→</span>
                <span className="px-2 py-1 bg-yellow-100 rounded">공감</span>
                <span>→</span>
                <span className="px-2 py-1 bg-orange-100 rounded">긴장</span>
                <span>→</span>
                <span className="px-2 py-1 bg-red-100 rounded">해결</span>
                <span>→</span>
                <span className="px-2 py-1 bg-purple-100 rounded">만족</span>
              </div>
            </div>

            {/* 오늘의 영감 */}
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs font-medium mb-2">✨ 오늘의 기획 팁</p>
              <p className="text-xs text-gray-600 italic">
                "스토리는 정보 전달이 아니라 감정 전달입니다. <br/>
                시청자가 '아, 나도 저런 적 있어'라고 공감하는 순간, <br/>
                당신의 콘텐츠는 성공한 것입니다."
              </p>
            </div>
          </div>
        )}
        {/* Quick Templates */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => {
              setPlan({
                ...plan,
                hook: "99%가 모르는...",
                mainContent: ["문제 제시", "해결 방법", "실제 적용"],
                cta: "더 많은 꿀팁을 원하시면 구독!"
              })
            }}
            className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50"
          >
            🎯 문제 해결형
          </button>
          <button
            onClick={() => {
              setPlan({
                ...plan,
                hook: "오늘 특별한 하루를...",
                mainContent: ["일상 소개", "특별한 순간", "느낀 점"],
                cta: "다음 이야기도 기대해주세요!"
              })
            }}
            className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50"
          >
            📅 일상 공유형
          </button>
          <button
            onClick={() => {
              setPlan({
                ...plan,
                hook: "이걸 알았다면...",
                mainContent: ["비포 상황", "변화 과정", "애프터 결과"],
                cta: "여러분도 할 수 있어요!"
              })
            }}
            className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50"
          >
            🔄 비포애프터형
          </button>
          <button
            onClick={() => {
              setPlan({
                ...plan,
                hook: "솔직한 후기를...",
                mainContent: ["첫인상", "사용 경험", "장단점 정리"],
                cta: "도움이 되셨다면 좋아요!"
              })
            }}
            className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50"
          >
            ⭐ 리뷰형
          </button>
        </div>

        {/* Platform Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">플랫폼 선택</label>
          <div className="flex gap-2">
            {Object.entries(platforms).map(([key, platform]) => (
              <Button
                key={key}
                type="button"
                variant={plan.platform === key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  console.log('Platform clicked:', key)
                  setPlan((prev: any) => ({...prev, platform: key as 'youtube' | 'shorts' | 'reels'}))
                }}
                className="flex items-center gap-2"
              >
                {platform.icon}
                {platform.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">콘텐츠 제목</label>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => setPlan({...plan, title: e.target.value})}
            placeholder="시청자의 관심을 끌 제목을 작성하세요"
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-xs text-muted-foreground">
            💡 숫자, 질문, 혜택을 포함하면 클릭률이 올라가요
          </p>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            타겟 오디언스
          </label>
          <input
            type="text"
            value={plan.targetAudience}
            onChange={(e) => setPlan({...plan, targetAudience: e.target.value})}
            placeholder="예: 20대 직장인, 육아맘, 다이어터"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Story Arc Helper */}
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <p className="text-xs font-medium">📊 스토리 구조 체크</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`p-2 rounded ${plan.hook ? 'bg-green-100' : 'bg-gray-100'}`}>
              <p className="font-medium">시작</p>
              <p className="text-gray-600">궁금증 유발</p>
            </div>
            <div className={`p-2 rounded ${plan.mainContent[1] ? 'bg-green-100' : 'bg-gray-100'}`}>
              <p className="font-medium">중간</p>
              <p className="text-gray-600">핵심 전달</p>
            </div>
            <div className={`p-2 rounded ${plan.cta ? 'bg-green-100' : 'bg-gray-100'}`}>
              <p className="font-medium">끝</p>
              <p className="text-gray-600">행동 유도</p>
            </div>
          </div>
        </div>

        {/* Hook (First 3 seconds) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">🎣 훅 (첫 3초)</label>
          <textarea
            value={plan.hook}
            onChange={(e) => setPlan({...plan, hook: e.target.value})}
            placeholder="시청자가 영상을 계속 보게 만들 강력한 오프닝"
            className="w-full px-3 py-2 border rounded-md h-20"
          />
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">예시:</span>
            {plan.platform === 'youtube' && (
              <>
                <Badge variant="outline" className="text-xs">이 영상 끝까지 보면...</Badge>
                <Badge variant="outline" className="text-xs">충격적인 결과</Badge>
                <Badge variant="outline" className="text-xs">99%가 모르는</Badge>
              </>
            )}
            {(plan.platform === 'shorts' || plan.platform === 'reels') && (
              <>
                <Badge variant="outline" className="text-xs">Wait for it...</Badge>
                <Badge variant="outline" className="text-xs">POV:</Badge>
                <Badge variant="outline" className="text-xs">저만 이런가요?</Badge>
              </>
            )}
          </div>
        </div>

        {/* Main Content Structure */}
        <div className="space-y-2">
          <label className="text-sm font-medium">📋 콘텐츠 구성</label>
          {plan.mainContent.map((content: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium w-20">파트 {index + 1}</span>
              <input
                type="text"
                value={content}
                onChange={(e) => {
                  const newContent = [...plan.mainContent]
                  newContent[index] = e.target.value
                  setPlan({...plan, mainContent: newContent})
                }}
                placeholder={
                  plan.platform === 'youtube' 
                    ? `${index === 0 ? '도입부' : index === 1 ? '메인 콘텐츠' : '마무리'}`
                    : `${index === 0 ? '어텐션' : index === 1 ? '메인' : 'CTA'}`
                }
                className="flex-1 px-3 py-2 border rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Trending Keywords */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            트렌딩 키워드
          </label>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords["2024"].map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => {
                  if (!plan.keywords.includes(keyword)) {
                    setPlan({...plan, keywords: [...plan.keywords, keyword]})
                  }
                }}
              >
                #{keyword}
              </Badge>
            ))}
          </div>
          {plan.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-muted-foreground">선택됨:</span>
              {plan.keywords.map((keyword: string) => (
                <Badge key={keyword} className="bg-blue-500">
                  #{keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <label className="text-sm font-medium">📢 CTA (행동 유도)</label>
          <input
            type="text"
            value={plan.cta}
            onChange={(e) => setPlan({...plan, cta: e.target.value})}
            placeholder="구독, 좋아요, 댓글, 공유 등 원하는 행동"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Expected Metrics */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">📊 예상 성과 지표</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <Eye className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-muted-foreground">조회수</p>
              <p className="text-sm font-bold">10K+</p>
            </div>
            <div>
              <ThumbsUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-muted-foreground">좋아요</p>
              <p className="text-sm font-bold">500+</p>
            </div>
            <div>
              <MessageCircle className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-muted-foreground">댓글</p>
              <p className="text-sm font-bold">50+</p>
            </div>
            <div>
              <Share2 className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs text-muted-foreground">공유</p>
              <p className="text-sm font-bold">20+</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={savePlan}
          >
            {editingPlanId ? '기획서 수정' : '기획서 저장'}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              setPlan({
                title: "",
                platform: "youtube",
                duration: "10분",
                targetAudience: "",
                hook: "",
                mainContent: ["", "", ""],
                cta: "",
                keywords: []
              })
            }}
          >
            초기화
          </Button>
        </div>

        {/* Saved Plans List */}
        {savedPlans.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3">저장된 기획서</h3>
            <div className="space-y-2">
              {savedPlans.map((savedPlan) => (
                <div key={savedPlan.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{savedPlan.title}</p>
                    <p className="text-xs text-gray-500">
                      {savedPlan.platform} | {savedPlan.targetAudience || '타겟 미설정'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadPlanForEdit(savedPlan.id)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deletePlan(savedPlan.id)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}