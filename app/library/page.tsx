'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Grid, List, Clock, TrendingUp, Eye, Calendar, Film } from 'lucide-react'
import ContentPlanDetailModal from '@/components/content-plan-detail-modal'
import Link from 'next/link'

// 임시 데이터 타입
interface ContentPlan {
  id: string
  title: string
  thumbnail?: string
  packaging: {
    title: string
    thumbnail: string
    hook: string
  }
  target: {
    audience: string
    painPoints: string[]
    desires: string[]
  }
  content: {
    structure: string
    keyPoints: string[]
    cta: string
  }
  production: {
    duration: string
    resources: string[]
    deadline: string
  }
  metrics: {
    expectedViews: string
    expectedEngagement: string
    successMetrics: string[]
  }
  notes?: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'in_production' | 'published'
  platform: string
  source?: 'sample' | 'user'
}

const DEFAULT_THUMBNAIL = '/api/placeholder/400/225'
const DEFAULT_RESOURCES = ['기획', '촬영', '편집']

const SAMPLE_PLANS: ContentPlan[] = [
  {
    id: 'sample-1',
    title: '노래로 자신의 감정을 자유롭게 표현하고 듣는 사람에게 감동을 줄 수 있게 될 거예요',
    thumbnail: DEFAULT_THUMBNAIL,
    packaging: {
      title: '10분만에 노래 실력 늘리는 방법',
      thumbnail: DEFAULT_THUMBNAIL,
      hook: '프로 가수들이 숨겨온 연습법 공개'
    },
    target: {
      audience: '노래를 좋아하는 20-30대',
      painPoints: ['노래 실력이 늘지 않음', '고음이 안 올라감'],
      desires: ['노래방 스타되기', '감정 표현 잘하기']
    },
    content: {
      structure: '도입 → 문제 제기 → 해결책 → 실습 → 마무리',
      keyPoints: ['호흡법', '발성법', '감정 표현'],
      cta: '구독하고 더 많은 팁 받기'
    },
    production: {
      duration: '3일',
      resources: ['카메라', '마이크', '조명'],
      deadline: '2025.09.05'
    },
    metrics: {
      expectedViews: '10K+',
      expectedEngagement: '15%',
      successMetrics: ['조회수 1만 이상', '좋아요 1천 이상']
    },
    createdAt: '2025-08-31',
    updatedAt: '2025-08-31',
    status: 'draft',
    platform: 'YouTube',
    source: 'sample'
  },
  {
    id: 'sample-2',
    title: 'AI 도구 활용법 - 업무 생산성 2배 높이기',
    thumbnail: DEFAULT_THUMBNAIL,
    packaging: {
      title: 'ChatGPT로 일 잘하는 직장인 되기',
      thumbnail: DEFAULT_THUMBNAIL,
      hook: '월급은 그대로인데 일은 반으로 줄이는 방법'
    },
    target: {
      audience: '20-40대 직장인',
      painPoints: ['반복 업무 스트레스', '야근 지옥'],
      desires: ['워라밸', '연봉 상승']
    },
    content: {
      structure: '문제 상황 → AI 도구 소개 → 실제 활용 사례 → 팁',
      keyPoints: ['ChatGPT 활용법', '자동화 도구', '프롬프트 작성법'],
      cta: '더 많은 AI 활용법 보러가기'
    },
    production: {
      duration: '2일',
      resources: ['화면 녹화 프로그램', '편집 툴'],
      deadline: '2025.09.03'
    },
    metrics: {
      expectedViews: '50K+',
      expectedEngagement: '20%',
      successMetrics: ['조회수 5만 이상', '저장 5천 이상']
    },
    createdAt: '2025-08-30',
    updatedAt: '2025-08-30',
    status: 'in_production',
    platform: 'Instagram',
    source: 'sample'
  }
]

const mapPlatformLabel = (platform?: string) => {
  switch (platform) {
    case 'youtube':
      return 'YouTube'
    case 'shorts':
      return 'YouTube · Shorts'
    case 'reels':
      return 'Instagram · Reels'
    case 'instagram':
      return 'Instagram'
    case 'tiktok':
      return 'TikTok'
    default:
      return platform || '기타'
  }
}

const toPlanStructure = (story: Record<string, string> | undefined, storyType?: string) => {
  if (!story || typeof story !== 'object') {
    return storyType ? `스토리 타입: ${storyType}` : '스토리 구조 없음'
  }

  const entries = Object.entries(story)
    .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)

  if (entries.length === 0) {
    return storyType ? `스토리 타입: ${storyType}` : '스토리 구조 없음'
  }

  return entries.map(([key, value]) => `${key.toUpperCase()}: ${value}`).join(' → ')
}

const transformSavedPlan = (rawPlan: any): ContentPlan | null => {
  if (!rawPlan || typeof rawPlan !== 'object') return null

  const {
    id,
    title,
    altTitle,
    target,
    duration,
    platform,
    goal,
    hook,
    storyType,
    story,
    retention,
    cta,
    dmKeyword,
    script,
    thumbnailKeywords,
    createdAt,
    updatedAt,
    status,
    targetPainPoints,
    targetInterests
  } = rawPlan

  const safeId = typeof id === 'string' ? id : Date.now().toString()
  const lastUpdated = typeof updatedAt === 'string' ? updatedAt : createdAt || new Date().toISOString()
  const storyStructure = toPlanStructure(story, storyType)
  const keyPoints = story && typeof story === 'object'
    ? Object.values(story).filter((value) => typeof value === 'string' && value.trim().length > 0)
    : []
  const retentionHighlights = retention && typeof retention === 'object'
    ? Object.values(retention).filter((value) => typeof value === 'string' && value.trim().length > 0)
    : []
  const contentMix = rawPlan?.contentMix && typeof rawPlan.contentMix === 'object'
    ? Object.entries(rawPlan.contentMix).map(([key, value]) => `${key.toUpperCase()}: ${value}%`)
    : []

  return {
    id: safeId,
    title: goal || title || '콘텐츠 기획서',
    thumbnail: DEFAULT_THUMBNAIL,
    packaging: {
      title: title || goal || '제목 없음 콘텐츠',
      thumbnail: DEFAULT_THUMBNAIL,
      hook: hook || altTitle || dmKeyword || '훅을 추가해보세요'
    },
    target: {
      audience: target || '타겟 미정',
      painPoints: Array.isArray(targetPainPoints) ? targetPainPoints : retentionHighlights,
      desires: Array.isArray(targetInterests) ? targetInterests : []
    },
    content: {
      structure: storyStructure,
      keyPoints,
      cta: cta || 'CTA 미정'
    },
    production: {
      duration: duration || '미정',
      resources: contentMix.length > 0 ? contentMix : (Array.isArray(thumbnailKeywords) && thumbnailKeywords.length > 0 ? thumbnailKeywords : DEFAULT_RESOURCES),
      deadline: lastUpdated.split('T')[0]
    },
    metrics: {
      expectedViews: '-',
      expectedEngagement: '-',
      successMetrics: retentionHighlights.length > 0 ? retentionHighlights : (Array.isArray(thumbnailKeywords) ? thumbnailKeywords : [])
    },
    notes: typeof script === 'string' ? script : undefined,
    createdAt: typeof createdAt === 'string' ? createdAt : lastUpdated,
    updatedAt: lastUpdated,
    status: status === 'in_production' || status === 'published' ? status : 'draft',
    platform: mapPlatformLabel(platform),
    source: 'user'
  }
}

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [selectedPlan, setSelectedPlan] = useState<ContentPlan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [plans, setPlans] = useState<ContentPlan[]>([])
  const userPlans = plans.filter(plan => plan.source === 'user')

  useEffect(() => {
    const loadPlans = () => {
      if (typeof window === 'undefined') return

      const raw = window.localStorage.getItem('drucker-plans')
      let userPlans: ContentPlan[] = []

      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            userPlans = parsed
              .map(transformSavedPlan)
              .filter((plan): plan is ContentPlan => plan !== null)
          }
        } catch (error) {
          console.error('라이브러리 기획서 로드 오류:', error)
        }
      }

      const combined = userPlans.length > 0
        ? [...userPlans, ...SAMPLE_PLANS]
        : SAMPLE_PLANS

      // 기존 사용자 기획서는 유지하면서 샘플 데이터를 보조로 제공
      setPlans(combined)
    }

    loadPlans()
  }, [])

  // 기획서 더블클릭 핸들러
  const handlePlanDoubleClick = (plan: ContentPlan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  // 필터링된 기획서
  const filteredPlans = plans.filter(plan => {
    const query = searchQuery.trim().toLowerCase()
    const searchableFields = [
      plan.title,
      plan.packaging.title,
      plan.packaging.hook,
      plan.target.audience
    ]
    const matchesSearch =
      query.length === 0 ||
      searchableFields.some(field => (field ?? '').toLowerCase().includes(query))

    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus
    const matchesPlatform = filterPlatform === 'all' || plan.platform.includes(filterPlatform)
    
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-500'
      case 'in_production': return 'bg-yellow-500'
      case 'published': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'draft': return '초안'
      case 'in_production': return '제작중'
      case 'published': return '게시됨'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">기획서 라이브러리</h1>
          <p className="text-gray-400">모든 콘텐츠 기획서를 한눈에 관리하세요</p>
        </div>

        {/* 툴바 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="기획서 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 필터 */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="draft">초안</option>
                <option value="in_production">제작중</option>
                <option value="published">게시됨</option>
              </select>

              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 플랫폼</option>
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
              </select>

              {/* 뷰 모드 전환 */}
              <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 새 기획서 버튼 */}
            <Link
              href="/planning"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              새 기획서
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">전체 기획서</span>
            <Film className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold">{userPlans.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">제작중</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold">
            {userPlans.filter(p => p.status === 'in_production').length}
          </p>
        </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">이번 주 마감</span>
              <Calendar className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">평균 조회수</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold">25K</p>
          </div>
        </div>

        {/* 기획서 목록 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onDoubleClick={() => handlePlanDoubleClick(plan)}
                className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
              >
                {/* 썸네일 */}
                <div className="relative h-48 bg-gray-700">
                  {plan.thumbnail ? (
                    <img
                      src={plan.thumbnail}
                      alt={plan.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  {plan.source === 'sample' && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                      샘플
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(plan.status)}`}>
                      {getStatusText(plan.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-black/50 rounded text-xs">
                      {plan.platform}
                    </span>
                  </div>
                </div>

                {/* 내용 */}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{plan.packaging.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{plan.packaging.hook}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{plan.metrics.expectedViews}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{plan.production.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onDoubleClick={() => handlePlanDoubleClick(plan)}
                className="bg-gray-800 rounded-lg p-4 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* 썸네일 */}
                  <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0">
                    {plan.thumbnail ? (
                      <img
                        src={plan.thumbnail}
                        alt={plan.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{plan.packaging.title}</h3>
                      <p className="text-sm text-gray-400">{plan.packaging.hook}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.source === 'sample' && (
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">샘플</span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(plan.status)}`}>
                        {getStatusText(plan.status)}
                      </span>
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {plan.platform}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{plan.metrics.expectedViews}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{plan.production.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{plan.production.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">기획서가 없습니다</h3>
            <p className="text-gray-400 mb-4">첫 번째 콘텐츠 기획서를 만들어보세요</p>
            <Link
              href="/planning"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              새 기획서 만들기
            </Link>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <ContentPlanDetailModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPlan(null)
        }}
        onEdit={(plan) => {
          console.log('Edit plan:', plan)
          // TODO: 편집 페이지로 이동
        }}
        onDelete={(planId) => {
          console.log('Delete plan:', planId)
          // TODO: 삭제 API 호출
          setPlans(plans.filter(p => p.id !== planId))
          setIsModalOpen(false)
        }}
        onDuplicate={(plan) => {
          console.log('Duplicate plan:', plan)
          // TODO: 복제 API 호출
        }}
      />
    </div>
  )
}
