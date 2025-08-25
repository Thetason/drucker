"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Sparkles, ArrowDown, CheckCircle, Circle,
  AlertCircle, Clock, Zap, Target, 
  ChevronDown, ChevronUp, Hash, Save
} from "lucide-react"

export function ContentPlannerFlow() {
  const [expandedSection, setExpandedSection] = useState<string | null>('package')
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  
  // 전체 기획 데이터
  const [plan, setPlan] = useState({
    // 1. 패키징
    titles: ["", "", "", "", ""],
    thumbnails: ["", "", ""],
    hook: "",
    
    // 2. 타겟
    target: "",
    promise: "",
    
    // 3. 스토리
    story: {
      diagnosis: "",
      solution: "",
      result: ""
    },
    
    // 4. 리텐션
    retention: {
      sec15: "",
      sec45: "",
      sec90: ""
    },
    
    // 5. CTA
    cta: "",
    dmKeyword: ""
  })

  // 섹션 완성도 체크
  const checkSectionCompletion = (section: string) => {
    switch(section) {
      case 'package':
        return plan.titles[0] && plan.titles[1] && plan.hook
      case 'target':
        return plan.target && plan.promise
      case 'story':
        return plan.story.diagnosis && plan.story.solution
      case 'retention':
        return plan.retention.sec15
      case 'cta':
        return plan.cta
      default:
        return false
    }
  }

  // 섹션 완성시 자동으로 다음 섹션 열기
  useEffect(() => {
    const sections = ['package', 'target', 'story', 'retention', 'cta']
    sections.forEach(section => {
      if (checkSectionCompletion(section)) {
        setCompletedSections(prev => new Set(prev).add(section))
      }
    })
  }, [plan])

  const sections = [
    { id: 'package', label: '패키징', emoji: '📦' },
    { id: 'target', label: '타겟', emoji: '🎯' },
    { id: 'story', label: '스토리', emoji: '📖' },
    { id: 'retention', label: '리텐션', emoji: '⏱️' },
    { id: 'cta', label: 'CTA', emoji: '🔔' }
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">콘텐츠 기획서</CardTitle>
          <CardDescription className="text-blue-100">
            MrBeast x Colin & Samir 방법론 · 한 흐름으로 완성하기
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Progress Bar */}
          <div className="sticky top-0 bg-white z-10 px-6 py-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">진행률</span>
              <span className="text-xs font-medium">
                {completedSections.size}/5 완료
              </span>
            </div>
            <div className="flex gap-1">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                    completedSections.has(section.id) 
                      ? 'bg-green-500' 
                      : expandedSection === section.id
                      ? 'bg-blue-500'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => setExpandedSection(section.id)}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-4">
            {/* 1. 패키징 먼저 */}
            <div className="border rounded-lg overflow-hidden">
              <button
                className={`w-full p-4 flex items-center justify-between transition-all ${
                  expandedSection === 'package' ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setExpandedSection(expandedSection === 'package' ? null : 'package')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div className="text-left">
                    <p className="font-medium">패키징 먼저</p>
                    <p className="text-xs text-gray-500">제목과 썸네일이 콘텐츠를 이끈다</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {completedSections.has('package') && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {expandedSection === 'package' ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>
              
              {expandedSection === 'package' && (
                <div className="p-4 border-t bg-gray-50 space-y-4">
                  {/* 제목 입력 */}
                  <div>
                    <p className="text-sm font-medium mb-2">제목 후보 (최소 2개)</p>
                    <div className="space-y-2">
                      {plan.titles.slice(0, 3).map((title, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={title}
                            onChange={(e) => {
                              const newTitles = [...plan.titles]
                              newTitles[i] = e.target.value
                              setPlan({...plan, titles: newTitles})
                            }}
                            placeholder={
                              i === 0 ? "메인 제목 (예: 99%가 모르는...)" :
                              i === 1 ? "A/B 테스트용 (예: 이것만 알면...)" :
                              "백업 제목"
                            }
                            className="flex-1"
                          />
                          {i < 2 && (
                            <Badge className="bg-blue-500 text-white">A/B</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 썸네일 컨셉 */}
                  <div>
                    <p className="text-sm font-medium mb-2">썸네일 키워드</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['행동', '대조', '감정'].map((type, i) => (
                        <div key={i}>
                          <label className="text-xs text-gray-500">{type}</label>
                          <Input
                            value={plan.thumbnails[i]}
                            onChange={(e) => {
                              const newThumbnails = [...plan.thumbnails]
                              newThumbnails[i] = e.target.value
                              setPlan({...plan, thumbnails: newThumbnails})
                            }}
                            placeholder={
                              type === '행동' ? "하는 모습" :
                              type === '대조' ? "Before/After" :
                              "놀란 표정"
                            }
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 훅 */}
                  <div>
                    <p className="text-sm font-medium mb-2">0-3초 훅</p>
                    <Input
                      value={plan.hook}
                      onChange={(e) => setPlan({...plan, hook: e.target.value})}
                      placeholder="첫 문장 (20자 이하)"
                      maxLength={20}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 화살표 */}
            {completedSections.has('package') && (
              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
            )}

            {/* 2. 타겟 & 약속 */}
            <div className={`border rounded-lg overflow-hidden ${
              !completedSections.has('package') ? 'opacity-50' : ''
            }`}>
              <button
                className={`w-full p-4 flex items-center justify-between transition-all ${
                  expandedSection === 'target' ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setExpandedSection(expandedSection === 'target' ? null : 'target')}
                disabled={!completedSections.has('package')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div className="text-left">
                    <p className="font-medium">타겟 & 약속</p>
                    <p className="text-xs text-gray-500">누구에게 무엇을 약속하는가</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {completedSections.has('target') && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {expandedSection === 'target' ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>
              
              {expandedSection === 'target' && (
                <div className="p-4 border-t bg-gray-50 space-y-3">
                  <Input
                    value={plan.target}
                    onChange={(e) => setPlan({...plan, target: e.target.value})}
                    placeholder="타겟 (예: 유튜브를 처음 시작하는 20대)"
                  />
                  <Textarea
                    value={plan.promise}
                    onChange={(e) => setPlan({...plan, promise: e.target.value})}
                    placeholder="약속 (예: 이 영상 하나로 첫 수익화까지 가능합니다)"
                    className="h-20"
                  />
                </div>
              )}
            </div>

            {/* 화살표 */}
            {completedSections.has('target') && (
              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
            )}

            {/* 3. 스토리 구조 */}
            <div className={`border rounded-lg overflow-hidden ${
              !completedSections.has('target') ? 'opacity-50' : ''
            }`}>
              <button
                className={`w-full p-4 flex items-center justify-between transition-all ${
                  expandedSection === 'story' ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setExpandedSection(expandedSection === 'story' ? null : 'story')}
                disabled={!completedSections.has('target')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <div className="text-left">
                    <p className="font-medium">진→교→성 스토리</p>
                    <p className="text-xs text-gray-500">문제→해결→결과 흐름</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {completedSections.has('story') && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {expandedSection === 'story' ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>
              
              {expandedSection === 'story' && (
                <div className="p-4 border-t bg-gray-50 space-y-3">
                  <div>
                    <label className="text-xs text-red-600 font-medium">진 (문제/공감)</label>
                    <Textarea
                      value={plan.story.diagnosis}
                      onChange={(e) => setPlan({
                        ...plan, 
                        story: {...plan.story, diagnosis: e.target.value}
                      })}
                      placeholder="시청자가 공감할 문제 상황"
                      className="mt-1 h-16"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-yellow-600 font-medium">교 (해결/방법)</label>
                    <Textarea
                      value={plan.story.solution}
                      onChange={(e) => setPlan({
                        ...plan, 
                        story: {...plan.story, solution: e.target.value}
                      })}
                      placeholder="구체적인 해결 방법"
                      className="mt-1 h-16"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-green-600 font-medium">성 (결과/증거)</label>
                    <Textarea
                      value={plan.story.result}
                      onChange={(e) => setPlan({
                        ...plan, 
                        story: {...plan.story, result: e.target.value}
                      })}
                      placeholder="실제 결과와 증거"
                      className="mt-1 h-16"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 화살표 */}
            {completedSections.has('story') && (
              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
            )}

            {/* 4. 리텐션 설계 */}
            <div className={`border rounded-lg overflow-hidden ${
              !completedSections.has('story') ? 'opacity-50' : ''
            }`}>
              <button
                className={`w-full p-4 flex items-center justify-between transition-all ${
                  expandedSection === 'retention' ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setExpandedSection(expandedSection === 'retention' ? null : 'retention')}
                disabled={!completedSections.has('story')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <div className="text-left">
                    <p className="font-medium">리텐션 마커</p>
                    <p className="text-xs text-gray-500">15초/45초/90초 긴장 포인트</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {completedSections.has('retention') && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {expandedSection === 'retention' ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>
              
              {expandedSection === 'retention' && (
                <div className="p-4 border-t bg-gray-50 space-y-3">
                  <div className="flex gap-2">
                    <Badge variant="outline">15초</Badge>
                    <Input
                      value={plan.retention.sec15}
                      onChange={(e) => setPlan({
                        ...plan,
                        retention: {...plan.retention, sec15: e.target.value}
                      })}
                      placeholder="첫 전환점 (예: 하지만 여기서 중요한 건...)"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">45초</Badge>
                    <Input
                      value={plan.retention.sec45}
                      onChange={(e) => setPlan({
                        ...plan,
                        retention: {...plan.retention, sec45: e.target.value}
                      })}
                      placeholder="새 정보 투입 (예: 실제로 테스트해본 결과...)"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">90초</Badge>
                    <Input
                      value={plan.retention.sec90}
                      onChange={(e) => setPlan({
                        ...plan,
                        retention: {...plan.retention, sec90: e.target.value}
                      })}
                      placeholder="핵심 가치 전달 (예: 이제 당신도 할 수 있습니다)"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 화살표 */}
            {completedSections.has('retention') && (
              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
            )}

            {/* 5. CTA */}
            <div className={`border rounded-lg overflow-hidden ${
              !completedSections.has('retention') ? 'opacity-50' : ''
            }`}>
              <button
                className={`w-full p-4 flex items-center justify-between transition-all ${
                  expandedSection === 'cta' ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setExpandedSection(expandedSection === 'cta' ? null : 'cta')}
                disabled={!completedSections.has('retention')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>
                  <div className="text-left">
                    <p className="font-medium">CTA & 전환</p>
                    <p className="text-xs text-gray-500">행동 유도와 DM 키워드</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {completedSections.has('cta') && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {expandedSection === 'cta' ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>
              
              {expandedSection === 'cta' && (
                <div className="p-4 border-t bg-gray-50 space-y-3">
                  <Textarea
                    value={plan.cta}
                    onChange={(e) => setPlan({...plan, cta: e.target.value})}
                    placeholder="고정 댓글 (예: 📌 무료 체크리스트는 'START' 댓글)"
                    className="h-20"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={plan.dmKeyword}
                      onChange={(e) => setPlan({...plan, dmKeyword: e.target.value})}
                      placeholder="DM 키워드"
                      className="w-32"
                    />
                    <div className="flex gap-1">
                      {['CHECKLIST', 'START', 'LEARN'].map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setPlan({...plan, dmKeyword: keyword})}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 완료 액션 */}
            {completedSections.size === 5 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">기획서 완성!</p>
                    <p className="text-sm text-gray-600">이제 제작을 시작할 수 있습니다</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    기획서 저장
                  </Button>
                  <Button variant="outline" className="flex-1">
                    제작 스케줄에 추가
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Floating Tips */}
          <div className="fixed bottom-4 right-4 max-w-xs">
            <div className="bg-black text-white p-3 rounded-lg shadow-lg text-xs">
              <p className="font-medium mb-1">💡 현재 단계 팁</p>
              <p>
                {expandedSection === 'package' && "제목은 클릭을 결정합니다. 숫자와 호기심을 활용하세요."}
                {expandedSection === 'target' && "구체적인 타겟일수록 메시지가 명확해집니다."}
                {expandedSection === 'story' && "시청자가 공감할 수 있는 문제부터 시작하세요."}
                {expandedSection === 'retention' && "30-45초마다 새로운 정보나 전환을 넣으세요."}
                {expandedSection === 'cta' && "명확하고 단순한 행동 하나만 요청하세요."}
                {!expandedSection && "각 섹션을 클릭하여 기획을 시작하세요."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}