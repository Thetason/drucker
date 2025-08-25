"use client"

import React, { useState } from "react"
import { CheckCircle2, Circle, AlertTriangle, Info, X } from "lucide-react"

interface DecisionCriteria {
  id: string
  question: string
  answer: boolean | null
  weight: 'critical' | 'important' | 'nice'
}

export function DecisionHelper({ onClose }: { onClose?: () => void }) {
  const [criteria, setCriteria] = useState<DecisionCriteria[]>([
    {
      id: '1',
      question: '추상적인 것 말고 구체적인 것을 알려주겠습니까?',
      answer: null,
      weight: 'critical'
    },
    {
      id: '2',
      question: '무를 건강하는 법 (X) → 40세인데 벌써부터 무릎이 아프다면? (O)',
      answer: null,
      weight: 'critical'
    },
    {
      id: '3',
      question: '원리보다 공감을 전달하겠습니까?',
      answer: null,
      weight: 'important'
    },
    {
      id: '4',
      question: '양치 잘하는 방법 (X) → 양치 귀찮을 때는 이렇게 하세요 (O)',
      answer: null,
      weight: 'important'
    },
    {
      id: '5',
      question: '의사라는 사실을 밝히겠습니까?',
      answer: null,
      weight: 'nice'
    },
    {
      id: '6',
      question: '눈에 안좋은 음식 (X) → 안과의사가 알려주는 눈 좋아지는 음식 (O)',
      answer: null,
      weight: 'nice'
    }
  ])

  const [customCriteria, setCustomCriteria] = useState('')

  const updateAnswer = (id: string, answer: boolean) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, answer } : c
    ))
  }

  const addCustomCriteria = () => {
    if (customCriteria.trim()) {
      const newCriterion: DecisionCriteria = {
        id: Date.now().toString(),
        question: customCriteria,
        answer: null,
        weight: 'important'
      }
      setCriteria([...criteria, newCriterion])
      setCustomCriteria('')
    }
  }

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id))
  }

  const getScore = () => {
    const weights = { critical: 3, important: 2, nice: 1 }
    let totalScore = 0
    let maxScore = 0
    
    criteria.forEach(c => {
      maxScore += weights[c.weight]
      if (c.answer === true) {
        totalScore += weights[c.weight]
      }
    })
    
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  }

  const score = getScore()
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendation = () => {
    if (score >= 80) return '훌륭한 기획입니다! 진행하세요 🚀'
    if (score >= 60) return '괜찮지만 개선이 필요합니다 🤔'
    return '다시 고민해보세요 ⚠️'
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">의사결정 체크리스트</h2>
          <p className="text-sm text-gray-600 mt-1">콘텐츠 기획이 좋은지 체크해보세요</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Score Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">현재 점수</p>
            <p className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-medium ${getScoreColor()}`}>
              {getRecommendation()}
            </p>
          </div>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-4 mb-6">
        {criteria.map((criterion, index) => (
          <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    질문 {index + 1}
                  </span>
                  {criterion.weight === 'critical' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                      필수
                    </span>
                  )}
                  {criterion.weight === 'important' && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      중요
                    </span>
                  )}
                  {criterion.weight === 'nice' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      권장
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{criterion.question}</p>
                
                {/* Examples for original criteria */}
                {criterion.id === '2' && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-red-600 mb-1">❌ 무를 건강하는 법</p>
                    <p className="text-green-600">✅ 40세인데 벌써부터 무릎이 아프다면?</p>
                  </div>
                )}
                {criterion.id === '4' && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-red-600 mb-1">❌ 양치 잘하는 방법</p>
                    <p className="text-green-600">✅ 양치 귀찮을 때는 이렇게 하세요</p>
                  </div>
                )}
                {criterion.id === '6' && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-red-600 mb-1">❌ 눈에 안좋은 음식</p>
                    <p className="text-green-600">✅ 안과의사가 알려주는 눈 좋아지는 음식</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => updateAnswer(criterion.id, true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      criterion.answer === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {criterion.answer === true ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      예
                    </div>
                  </button>
                  <button
                    onClick={() => updateAnswer(criterion.id, false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      criterion.answer === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {criterion.answer === false ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      아니오
                    </div>
                  </button>
                </div>
              </div>
              {parseInt(criterion.id) > 6 && (
                <button
                  onClick={() => removeCriteria(criterion.id)}
                  className="ml-4 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Criteria */}
      <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">커스텀 체크 항목 추가</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customCriteria}
            onChange={(e) => setCustomCriteria(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addCustomCriteria()
              }
            }}
            placeholder="체크할 내용을 입력하세요"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addCustomCriteria}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            추가
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 mb-1">의사결정 팁</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 구체적일수록 시청자가 공감합니다</li>
              <li>• 원리보다 실제 상황이 더 와닿습니다</li>
              <li>• 권위를 밝히면 신뢰도가 올라갑니다</li>
              <li>• 80% 이상이면 좋은 기획입니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}