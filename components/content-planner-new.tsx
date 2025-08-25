"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Package, Target, TrendingUp, Clock, 
  Eye, ThumbsUp, MessageCircle, Share2,
  Video, Camera, Edit, Upload, 
  CheckCircle, Circle, AlertCircle,
  FileText, Image, TestTube, ChevronRight,
  Lightbulb, BarChart
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

export function ContentPlannerNew() {
  const [currentStep, setCurrentStep] = useState<'package' | 'story' | 'retention' | 'review'>('package')
  const [plan, setPlan] = useState<ContentPlan>({
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
    }
  })

  const steps = [
    { id: 'package', label: '패키징 먼저', icon: <Package className="h-4 w-4" /> },
    { id: 'story', label: '스토리 구조', icon: <FileText className="h-4 w-4" /> },
    { id: 'retention', label: '리텐션 설계', icon: <Clock className="h-4 w-4" /> },
    { id: 'review', label: '검토 & 저장', icon: <CheckCircle className="h-4 w-4" /> }
  ]

  const updateTitles = (index: number, value: string) => {
    const newTitles = [...plan.titles]
    newTitles[index] = value
    setPlan({...plan, titles: newTitles})
  }

  const updateThumbnails = (index: number, value: string) => {
    const newConcepts = [...plan.thumbnailConcepts]
    newConcepts[index] = value
    setPlan({...plan, thumbnailConcepts: newConcepts})
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          크리에이터 실전 기획서
        </CardTitle>
        <CardDescription>
          MrBeast, Colin & Samir의 검증된 기획 방법론
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentStep(step.id as any)}
            >
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                currentStep === step.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {step.icon}
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 패키징 먼저 */}
        {currentStep === 'package' && (
          <div className="space-y-6">
            {/* 원칙 설명 */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <p className="text-sm font-medium mb-2">🎯 Colin & Samir 원칙</p>
              <p className="text-xs text-gray-600">
                "제목과 썸네일을 먼저 완성하고, 그것을 실현할 콘텐츠를 만들어라"
              </p>
            </div>

            {/* 제목 5개 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">제목 후보 5개</h3>
                <Badge variant="outline" className="text-xs">A/B 테스트용</Badge>
              </div>
              {plan.titles.map((title, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm w-8">{index + 1}.</span>
                  <Input
                    value={title}
                    onChange={(e) => updateTitles(index, e.target.value)}
                    placeholder={
                      index === 0 ? "99%가 모르는..." :
                      index === 1 ? "이것만 알면..." :
                      index === 2 ? "실제로 해본..." :
                      index === 3 ? "왜 아무도..." :
                      "충격적인..."
                    }
                    className="flex-1"
                  />
                  {index < 2 && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      A/B
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* 썸네일 컨셉 3개 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">썸네일 컨셉 3개</h3>
                <Badge variant="outline" className="text-xs">메시지 키워드만</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['행동', '대조', '감정'].map((type, index) => (
                  <div key={index} className="space-y-2">
                    <Badge variant="outline" className="text-xs">{type}</Badge>
                    <Textarea
                      value={plan.thumbnailConcepts[index]}
                      onChange={(e) => updateThumbnails(index, e.target.value)}
                      placeholder={
                        type === '행동' ? "동작 중인 모습" :
                        type === '대조' ? "Before/After" :
                        "놀란 표정"
                      }
                      className="h-20 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shorts 훅 */}
            <div className="space-y-2">
              <h3 className="font-medium">Shorts 훅 (0-3초)</h3>
              <Input
                value={plan.shortHook}
                onChange={(e) => setPlan({...plan, shortHook: e.target.value})}
                placeholder="20자 이하, 동사 포함 (예: 이거 하나면 끝)"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                첫 3초 = 30% 이탈 결정점
              </p>
            </div>
          </div>
        )}

        {/* Step 2: 스토리 구조 */}
        {currentStep === 'story' && (
          <div className="space-y-6">
            {/* 목표 설정 */}
            <div className="space-y-3">
              <h3 className="font-medium">목표 & 약속</h3>
              <Input
                value={plan.goal}
                onChange={(e) => setPlan({...plan, goal: e.target.value})}
                placeholder="KPI + 기한 (예: 7일 안에 조회수 10K)"
              />
              <Input
                value={plan.targetSituation}
                onChange={(e) => setPlan({...plan, targetSituation: e.target.value})}
                placeholder="타겟/상황 (예: 초보자가 처음 시작할 때)"
              />
              <Input
                value={plan.promise}
                onChange={(e) => setPlan({...plan, promise: e.target.value})}
                placeholder="한 문장 약속 (예: 5분만에 완벽하게 마스터할 수 있다)"
              />
            </div>

            {/* 진-교-성 구조 */}
            <div className="space-y-3">
              <h3 className="font-medium">진→교→성 스토리 구조</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500 text-white">진</Badge>
                    <span className="text-sm font-medium">진단/공감</span>
                  </div>
                  <Textarea
                    value={plan.diagnosis}
                    onChange={(e) => setPlan({...plan, diagnosis: e.target.value})}
                    placeholder="문제 상황과 공감대 형성 (예: 매번 실패하는 이유는...)"
                    className="h-16"
                  />
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-yellow-500 text-white">교</Badge>
                    <span className="text-sm font-medium">교정/방법</span>
                  </div>
                  <Textarea
                    value={plan.solution}
                    onChange={(e) => setPlan({...plan, solution: e.target.value})}
                    placeholder="해결 방법 제시 (예: 이 3단계만 따라하면...)"
                    className="h-16"
                  />
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-500 text-white">성</Badge>
                    <span className="text-sm font-medium">성과/다음</span>
                  </div>
                  <Textarea
                    value={plan.result}
                    onChange={(e) => setPlan({...plan, result: e.target.value})}
                    placeholder="결과와 다음 행동 (예: 실제로 100명이 성공했고...)"
                    className="h-16"
                  />
                </div>
              </div>
            </div>

            {/* 증거 */}
            <div className="space-y-2">
              <h3 className="font-medium">증거 1개</h3>
              <Input
                value={plan.evidence}
                onChange={(e) => setPlan({...plan, evidence: e.target.value})}
                placeholder="데이터/방법/데모 (예: A/B 테스트 결과 87% 개선)"
              />
            </div>
          </div>
        )}

        {/* Step 3: 리텐션 설계 */}
        {currentStep === 'retention' && (
          <div className="space-y-6">
            {/* MrBeast 원칙 */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <p className="text-sm font-medium mb-2">🎬 MrBeast 리텐션 설계</p>
              <p className="text-xs text-gray-600">
                "매 30-45초마다 긴장을 재가동시켜라. 리텐션이 떨어지면 그 부분을 다시 찍어라"
              </p>
            </div>

            {/* 리텐션 마커 */}
            <div className="space-y-3">
              <h3 className="font-medium">리텐션 마커 설계</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 pt-1">
                    <Badge variant="outline">0-15초</Badge>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={plan.retentionMarkers.sec15}
                      onChange={(e) => setPlan({
                        ...plan, 
                        retentionMarkers: {...plan.retentionMarkers, sec15: e.target.value}
                      })}
                      placeholder="훅 + 약속 명확화 (예: 이 영상 끝까지 보면 당신도 할 수 있습니다)"
                      className="h-16"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-16 pt-1">
                    <Badge variant="outline">30-45초</Badge>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={plan.retentionMarkers.sec45}
                      onChange={(e) => setPlan({
                        ...plan, 
                        retentionMarkers: {...plan.retentionMarkers, sec45: e.target.value}
                      })}
                      placeholder="첫 번째 전환점/새로운 정보 (예: 하지만 여기서 중요한 건...)"
                      className="h-16"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-16 pt-1">
                    <Badge variant="outline">90초</Badge>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={plan.retentionMarkers.sec90}
                      onChange={(e) => setPlan({
                        ...plan, 
                        retentionMarkers: {...plan.retentionMarkers, sec90: e.target.value}
                      })}
                      placeholder="핵심 가치 전달/데모 (예: 실제로 해보면 이렇게 됩니다)"
                      className="h-16"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA & 전환 */}
            <div className="space-y-3">
              <h3 className="font-medium">CTA & 전환</h3>
              <Textarea
                value={plan.cta}
                onChange={(e) => setPlan({...plan, cta: e.target.value})}
                placeholder="고정 댓글 문안 (예: 📌 무료 체크리스트는 댓글에 'START' 입력)"
                className="h-16"
              />
              <div className="flex gap-2">
                <Input
                  value={plan.dmKeyword}
                  onChange={(e) => setPlan({...plan, dmKeyword: e.target.value})}
                  placeholder="DM 키워드"
                  className="w-32"
                />
                <div className="flex gap-2">
                  {['CHECKLIST', 'LEARN', 'BETA', 'FOCUS'].map((keyword) => (
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

            {/* 콘텐츠 믹스 */}
            <div className="space-y-3">
              <h3 className="font-medium">Help-Hub-Hero 믹스</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-sm font-medium">Help</p>
                  <p className="text-2xl font-bold text-blue-500">{plan.contentMix.help}%</p>
                  <p className="text-xs text-muted-foreground">검색/해결</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Hub</p>
                  <p className="text-2xl font-bold text-green-500">{plan.contentMix.hub}%</p>
                  <p className="text-xs text-muted-foreground">시리즈</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Hero</p>
                  <p className="text-2xl font-bold text-purple-500">{plan.contentMix.hero}%</p>
                  <p className="text-xs text-muted-foreground">이벤트</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 검토 & 저장 */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            {/* 가드레일 체크 */}
            <div className="space-y-3">
              <h3 className="font-medium">출고 전 체크리스트</h3>
              <div className="space-y-2">
                {[
                  { key: 'packageFirst', label: '제목/썸네일 먼저 완성', desc: '패키징이 콘텐츠를 이끈다' },
                  { key: 'promiseMatch', label: '약속 = 결과 일치', desc: '제목의 약속이 본문에서 실현' },
                  { key: 'retentionPlan', label: '리텐션 마커 설정', desc: '15/45/90초 지점 계획' },
                  { key: 'evidenceIncluded', label: '증거 1개 포함', desc: '데이터/데모/방법론' },
                  { key: 'ctaClear', label: 'CTA 명확', desc: '고정댓글/DM 키워드 준비' }
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      plan.checklist[item.key as keyof typeof plan.checklist]
                        ? 'bg-green-50 border-green-300'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setPlan({
                        ...plan,
                        checklist: {
                          ...plan.checklist,
                          [item.key]: !plan.checklist[item.key as keyof typeof plan.checklist]
                        }
                      })
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {plan.checklist[item.key as keyof typeof plan.checklist] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kill Rate 원칙 */}
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium mb-2">🎯 MrBeast Kill Rate</p>
              <p className="text-xs text-gray-600 mb-3">
                "아이디어 20개 중 3개만 제작. 나머지는 과감히 버려라"
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Kill (폐기)
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Iterate (수정)
                </Button>
                <Button className="flex-1 bg-green-500 hover:bg-green-600">
                  Ship (출고)
                </Button>
              </div>
            </div>

            {/* 저장 */}
            <div className="flex gap-2">
              <Button className="flex-1" size="lg">
                기획서 저장
              </Button>
              <Button variant="outline" size="lg">
                <TestTube className="h-4 w-4 mr-2" />
                A/B 테스트 준비
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>진행률</span>
            <span>
              {Object.values(plan.checklist).filter(Boolean).length}/5 완료
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ 
                width: `${(Object.values(plan.checklist).filter(Boolean).length / 5) * 100}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}