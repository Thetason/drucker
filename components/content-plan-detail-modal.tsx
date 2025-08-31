'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Target, Package, Users, TrendingUp, Lightbulb, Edit, Trash2, Copy } from 'lucide-react'

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
}

interface ContentPlanDetailModalProps {
  plan: ContentPlan | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (plan: ContentPlan) => void
  onDelete?: (planId: string) => void
  onDuplicate?: (plan: ContentPlan) => void
}

export default function ContentPlanDetailModal({
  plan,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate
}: ContentPlanDetailModalProps) {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !plan) return null

  const sections = [
    { id: 'overview', label: '개요', icon: Package },
    { id: 'target', label: '타겟', icon: Target },
    { id: 'content', label: '콘텐츠', icon: Lightbulb },
    { id: 'production', label: '제작', icon: Calendar },
    { id: 'metrics', label: '지표', icon: TrendingUp },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{plan.title}</h2>
              <div className="flex items-center gap-2">
                {onDuplicate && (
                  <button
                    onClick={() => onDuplicate(plan)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="복제"
                  >
                    <Copy className="w-5 h-5 text-white" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(plan)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="편집"
                  >
                    <Edit className="w-5 h-5 text-white" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm('정말로 이 기획서를 삭제하시겠습니까?')) {
                        onDelete(plan.id)
                      }
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-700 bg-gray-850">
            <div className="flex space-x-1 px-6">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                      activeSection === section.id
                        ? 'text-blue-400 border-blue-400'
                        : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Thumbnail */}
                  {plan.thumbnail && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">썸네일</h3>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <img
                          src={plan.thumbnail}
                          alt="Thumbnail"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Packaging */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">패키징</h3>
                    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm">제목:</span>
                        <p className="text-white font-medium">{plan.packaging.title}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">훅:</span>
                        <p className="text-gray-300">{plan.packaging.hook}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {plan.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">메모</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">{plan.notes}</p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>생성일: {new Date(plan.createdAt).toLocaleDateString('ko-KR')}</span>
                  <span>수정일: {new Date(plan.updatedAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            )}

            {activeSection === 'target' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">타겟 오디언스</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-300">{plan.target.audience}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">페인 포인트</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <ul className="space-y-2">
                      {plan.target.painPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">욕구</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <ul className="space-y-2">
                      {plan.target.desires.map((desire, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span className="text-gray-300">{desire}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">콘텐츠 구조</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-300 whitespace-pre-wrap">{plan.content.structure}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">핵심 포인트</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <ul className="space-y-2">
                      {plan.content.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">{index + 1}.</span>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">CTA (Call to Action)</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-300">{plan.content.cta}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'production' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">예상 소요 시간</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300">{plan.production.duration}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">마감일</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300">{plan.production.deadline}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">필요 리소스</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <ul className="space-y-2">
                      {plan.production.resources.map((resource, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-400 mt-0.5">✓</span>
                          <span className="text-gray-300">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'metrics' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">예상 조회수</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-2xl font-bold text-blue-400">{plan.metrics.expectedViews}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">예상 참여율</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-2xl font-bold text-green-400">{plan.metrics.expectedEngagement}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">성공 지표</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <ul className="space-y-2">
                      {plan.metrics.successMetrics.map((metric, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5">📊</span>
                          <span className="text-gray-300">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-850 px-6 py-4 border-t border-gray-700">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                닫기
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(plan)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  편집하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}