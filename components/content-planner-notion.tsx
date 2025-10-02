"use client"

import { useState } from "react"
import { 
  Plus, Hash, Type, Image, Target, Sparkles,
  ChevronRight, Clock, CheckCircle2, Circle,
  ArrowRight, Zap, TrendingUp, Users, MessageSquare,
  Lightbulb, BookOpen, Rocket, Flag
} from "lucide-react"

export function ContentPlannerNotion() {
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'title', content: '', emoji: '🎬', placeholder: '제목을 입력하세요...' },
  ])
  
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const addBlock = (type: string) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      emoji: type === 'hook' ? '🎣' : type === 'target' ? '🎯' : '📝',
      placeholder: getPlaceholder(type)
    }
    setBlocks([...blocks, newBlock])
  }

  const getPlaceholder = (type: string) => {
    switch(type) {
      case 'title': return '콘텐츠 제목...'
      case 'hook': return '첫 3초 훅...'
      case 'target': return '타겟 오디언스...'
      case 'story': return '스토리 구조...'
      default: return '내용을 입력하세요...'
    }
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const toggleComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl">
      {/* Notion Style Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">📺</div>
          <h1 className="text-3xl font-bold">콘텐츠 기획</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>마지막 수정: 방금 전</span>
          <span className="mx-2">•</span>
          <Users className="h-4 w-4" />
          <span>드러커</span>
        </div>
      </div>

      {/* Progress Bar - Notion Style */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">진행 상황</span>
          <span className="text-sm text-gray-500">{completedSteps.size}/5 완료</span>
        </div>
        <div className="flex gap-2">
          {['패키징', '타겟', '스토리', '리텐션', 'CTA'].map((step, index) => (
            <button
              key={step}
              onClick={() => toggleComplete(step)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                completedSteps.has(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {completedSteps.has(step) ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                {step}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Blocks - Notion Style */}
      <div className="space-y-1">
        {/* Title Block */}
        <div className="group relative">
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mt-1">🎬</span>
            <input
              type="text"
              placeholder="제목을 입력하세요..."
              className="flex-1 text-2xl font-bold placeholder-gray-300 border-none outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4" />

        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <span>🎯</span>
              <span className="text-sm font-medium">타겟</span>
            </div>
            <input
              type="text"
              placeholder="20대 직장인"
              className="w-full text-sm bg-transparent border-none outline-none placeholder-blue-300"
            />
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <span>⏱️</span>
              <span className="text-sm font-medium">길이</span>
            </div>
            <input
              type="text"
              placeholder="10분"
              className="w-full text-sm bg-transparent border-none outline-none placeholder-green-300"
            />
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <span>📊</span>
              <span className="text-sm font-medium">목표</span>
            </div>
            <input
              type="text"
              placeholder="조회수 10K"
              className="w-full text-sm bg-transparent border-none outline-none placeholder-purple-300"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {/* Hook Section */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎣</span>
              <h3 className="font-semibold">훅 (0-3초)</h3>
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">중요</span>
            </div>
            <textarea
              placeholder="시청자를 사로잡을 첫 문장..."
              className="w-full p-3 bg-gray-50 rounded-md border-none outline-none resize-none placeholder-gray-400"
              rows={2}
            />
          </div>

          {/* Story Structure */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📖</span>
              <h3 className="font-semibold">스토리 구조</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-12 text-xs font-medium text-red-500">진단</span>
                <input
                  type="text"
                  placeholder="문제 상황..."
                  className="flex-1 p-2 bg-gray-50 rounded border-none outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-xs font-medium text-yellow-500">교정</span>
                <input
                  type="text"
                  placeholder="해결 방법..."
                  className="flex-1 p-2 bg-gray-50 rounded border-none outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-xs font-medium text-green-500">성과</span>
                <input
                  type="text"
                  placeholder="결과와 증거..."
                  className="flex-1 p-2 bg-gray-50 rounded border-none outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Retention Markers */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⏱️</span>
            <h3 className="font-semibold">리텐션 마커</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            최대 러닝타임 · Shorts 60초 / Reels 90초(최대 3분) / YouTube 12시간
          </p>
          <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs font-medium text-orange-600 mb-1">15초</div>
                <input
                  type="text"
                  placeholder="첫 전환점"
                  className="w-full text-sm bg-transparent border-none outline-none"
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs font-medium text-blue-600 mb-1">45초</div>
                <input
                  type="text"
                  placeholder="새 정보"
                  className="w-full text-sm bg-transparent border-none outline-none"
                />
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-xs font-medium text-purple-600 mb-1">Shorts 60초 · Reels 90초</div>
                <input
                  type="text"
                  placeholder="핵심 가치"
                  className="w-full text-sm bg-transparent border-none outline-none"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔔</span>
              <h3 className="font-semibold">CTA</h3>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="고정 댓글 내용..."
                className="flex-1 p-2 bg-gray-50 rounded border-none outline-none text-sm"
              />
              <input
                type="text"
                placeholder="DM 키워드"
                className="w-32 p-2 bg-gray-50 rounded border-none outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Add Block Button */}
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center gap-2 mt-4">
          <Plus className="h-4 w-4" />
          <span className="text-sm">블록 추가</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <button className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          저장
        </button>
        <button className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          템플릿으로 저장
        </button>
      </div>
    </div>
  )
}
