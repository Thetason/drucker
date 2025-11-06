"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus, Sparkles, RefreshCw, Wand2 } from "lucide-react"

interface Idea {
  id: string
  content: string
  type: "original" | "plussed"
  parent?: string
}

export function IdeaGenerator() {
  const [baseIdea, setBaseIdea] = useState("")
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedCategory, setSelectedCategory] = useState("beauty")

  const categories = {
    beauty: {
      name: "뷰티",
      prompts: [
        "5분 메이크업",
        "스킨케어 루틴",
        "제품 리뷰",
        "비포애프터"
      ],
      trends: [
        "클린뷰티",
        "K-뷰티",
        "미니멀 메이크업",
        "글로우 피부"
      ]
    },
    food: {
      name: "푸드",
      prompts: [
        "간단 레시피",
        "맛집 리뷰",
        "다이어트 식단",
        "홈카페"
      ],
      trends: [
        "비건 요리",
        "에어프라이어",
        "다이어트 도시락",
        "홈베이킹"
      ]
    },
    lifestyle: {
      name: "라이프스타일",
      prompts: [
        "모닝루틴",
        "정리정돈",
        "자기계발",
        "취미생활"
      ],
      trends: [
        "미니멀라이프",
        "홈트레이닝",
        "독서 리뷰",
        "생산성 팁"
      ]
    },
    fashion: {
      name: "패션",
      prompts: [
        "데일리룩",
        "옷장 정리",
        "쇼핑 하울",
        "스타일링 팁"
      ],
      trends: [
        "Y2K",
        "미니멀 패션",
        "빈티지",
        "지속가능 패션"
      ]
    }
  }

  const plussingTemplates = [
    "Yes, and... [추가 아이디어]",
    "만약에... [상황 변경]이라면?",
    "이것과... [다른 요소]를 결합하면?",
    "[타겟]의 입장에서 보면?",
    "반대로... [역발상]하면?",
    "더 극단적으로... [과장]하면?",
    "이걸... [다른 상황]에 적용하면?"
  ]

  const generatePlussedIdea = (originalIdea: string) => {
    const templates = [
      `Yes, and ${originalIdea}를 라이브로 진행하면서 실시간 Q&A도 함께하면 어떨까?`,
      `만약에 ${originalIdea}를 초보자 버전과 고급 버전으로 나눠서 시리즈로 만들면?`,
      `${originalIdea}에 비포&애프터 요소를 추가해서 변화를 극적으로 보여주면?`,
      `${originalIdea}를 1분 챌린지로 만들어서 스피드하게 진행하면?`,
      `반대로 ${originalIdea}의 실패 사례들을 모아서 '이렇게 하지 마세요' 컨텐츠로?`,
      `${originalIdea}를 다른 크리에이터와 콜라보로 진행하면?`,
      `${originalIdea}에 ASMR 요소를 추가해서 힐링 콘텐츠로 만들면?`
    ]
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    return randomTemplate
  }

  const handleAddIdea = () => {
    if (!baseIdea.trim()) return
    
    const newIdea: Idea = {
      id: Date.now().toString(),
      content: baseIdea,
      type: "original"
    }
    
    setIdeas([...ideas, newIdea])
    setBaseIdea("")
  }

  const handlePlusIdea = (parentId: string) => {
    const parent = ideas.find(i => i.id === parentId)
    if (!parent) return
    
    const plussedIdea: Idea = {
      id: Date.now().toString(),
      content: generatePlussedIdea(parent.content),
      type: "plussed",
      parent: parentId
    }
    
    setIdeas([...ideas, plussedIdea])
  }

  const generateRandomIdea = () => {
    const category = categories[selectedCategory as keyof typeof categories]
    const prompt = category.prompts[Math.floor(Math.random() * category.prompts.length)]
    const trend = category.trends[Math.floor(Math.random() * category.trends.length)]
    
    const idea = `${trend} 트렌드를 활용한 ${prompt} 콘텐츠`
    setBaseIdea(idea)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI 아이디어 제너레이터 (Plussing)
        </CardTitle>
        <CardDescription>
          픽사의 "Yes, and..." 방식으로 아이디어를 발전시켜보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(categories).map(([key, cat]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Idea Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={baseIdea}
              onChange={(e) => setBaseIdea(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddIdea()}
              placeholder="기본 아이디어를 입력하세요..."
              className="flex-1 px-3 py-2 text-sm border rounded-md"
            />
            <Button size="sm" onClick={generateRandomIdea} variant="outline">
              <Wand2 className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleAddIdea}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1">
            {categories[selectedCategory as keyof typeof categories].prompts.map((prompt) => (
              <Badge
                key={prompt}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setBaseIdea(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </div>

        {/* Ideas Tree */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className={`p-3 rounded-lg border ${
                idea.type === "plussed" ? "ml-8 bg-blue-50 border-blue-200" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {idea.type === "plussed" && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Plussed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{idea.content}</p>
                </div>
                {idea.type === "original" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePlusIdea(idea.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Plus it
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Plussing Templates Helper */}
        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs font-medium mb-2">💡 Plussing 템플릿:</p>
          <div className="space-y-1">
            {plussingTemplates.slice(0, 3).map((template, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {template}</p>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={async () => {
              if (!baseIdea.trim() && ideas.length === 0) {
                alert("아이디어를 입력해주세요!")
                return
              }
              
              const ideaToImprove = baseIdea || ideas[ideas.length - 1]?.content
              
              try {
                const response = await fetch('/api/ai', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: ideaToImprove, type: 'idea' })
                })
                
                const data = await response.json()
                
                if (data.success) {
                  alert("💡 아이디어 발전 제안:

" + data.result)
                } else {
                  alert("오류가 발생했습니다. 다시 시도해주세요.")
                }
              } catch (error) {
                alert("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.")
              }
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            더 발전시키기
          </Button>
          <Button variant="outline" className="flex-1">
            아이디어 저장
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}