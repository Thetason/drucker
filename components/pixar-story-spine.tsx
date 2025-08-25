"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Lightbulb, Target, TrendingUp, Heart } from "lucide-react"

interface StoryElement {
  id: string
  label: string
  placeholder: string
  icon: React.ReactNode
  value: string
}

export function PixarStorySpine() {
  const [storyElements, setStoryElements] = useState<StoryElement[]>([
    {
      id: "setup",
      label: "배경 설정 (Once upon a time...)",
      placeholder: "어떤 상황/배경에서 시작하나요?",
      icon: <Target className="h-4 w-4" />,
      value: ""
    },
    {
      id: "routine",
      label: "일상 (Every day...)",
      placeholder: "평소에는 어떤 일이 일어나나요?",
      icon: <TrendingUp className="h-4 w-4" />,
      value: ""
    },
    {
      id: "catalyst",
      label: "전환점 (Until one day...)",
      placeholder: "어떤 변화/사건이 일어나나요?",
      icon: <Sparkles className="h-4 w-4" />,
      value: ""
    },
    {
      id: "consequence",
      label: "결과 (Because of that...)",
      placeholder: "그로 인해 어떤 일이 벌어지나요?",
      icon: <Lightbulb className="h-4 w-4" />,
      value: ""
    },
    {
      id: "climax",
      label: "클라이맥스 (Until finally...)",
      placeholder: "최종적으로 어떻게 해결되나요?",
      icon: <Heart className="h-4 w-4" />,
      value: ""
    }
  ])

  const handleInputChange = (id: string, value: string) => {
    setStoryElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, value } : element
      )
    )
  }

  const generateReelsScript = () => {
    const script = storyElements
      .filter(el => el.value)
      .map(el => el.value)
      .join(" → ")
    
    return script || "각 단계를 채워주세요!"
  }

  const reelsTemplates = [
    {
      title: "뷰티 튜토리얼",
      setup: "많은 사람들이 피부 고민을 가지고 있죠",
      routine: "매일 복잡한 루틴에 지쳐있었는데",
      catalyst: "이 한 가지 제품을 만나고",
      consequence: "피부가 놀랍게 변했어요",
      climax: "이제 5분 루틴으로 완벽한 피부!"
    },
    {
      title: "요리 레시피",
      setup: "배달음식에 질렸다면",
      routine: "늘 같은 메뉴만 반복하다가",
      catalyst: "이 레시피를 발견했고",
      consequence: "집밥이 완전히 달라졌어요",
      climax: "5분만에 레스토랑 퀄리티!"
    },
    {
      title: "라이프스타일",
      setup: "아침마다 피곤하셨나요?",
      routine: "늦잠과 커피로 버티다가",
      catalyst: "이 습관 하나를 바꿨더니",
      consequence: "하루가 완전히 달라졌어요",
      climax: "활력 넘치는 하루의 시작!"
    }
  ]

  const applyTemplate = (template: typeof reelsTemplates[0]) => {
    setStoryElements(prev => prev.map(element => {
      const key = element.id as keyof typeof template
      return {
        ...element,
        value: template[key] || ""
      }
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          픽사 스토리 스파인
        </CardTitle>
        <CardDescription>
          픽사의 스토리텔링 공식으로 매력적인 릴스 스토리를 만들어보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Templates */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">빠른 템플릿:</span>
          {reelsTemplates.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              onClick={() => applyTemplate(template)}
            >
              {template.title}
            </Button>
          ))}
        </div>

        {/* Story Elements */}
        <div className="space-y-3">
          {storyElements.map((element) => (
            <div key={element.id} className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                {element.icon}
                {element.label}
              </label>
              <textarea
                value={element.value}
                onChange={(e) => handleInputChange(element.id, e.target.value)}
                placeholder={element.placeholder}
                className="w-full p-2 text-sm border rounded-md resize-none h-16"
              />
            </div>
          ))}
        </div>

        {/* Generated Script */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium mb-2">생성된 스토리 플로우:</p>
          <p className="text-sm">{generateReelsScript()}</p>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={async () => {
              const story = generateReelsScript()
              if (!story || story === "각 단계를 채워주세요!") {
                alert("먼저 스토리를 작성해주세요!")
                return
              }
              
              try {
                const response = await fetch('/api/ai', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: story, type: 'story' })
                })
                
                const data = await response.json()
                
                if (data.success) {
                  alert("AI 제안:\n\n" + data.result)
                } else {
                  alert(data.error || "AI 서비스를 사용할 수 없습니다.")
                }
              } catch (error) {
                alert("AI 연결 실패. Ollama가 실행 중인지 확인해주세요.")
              }
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI로 개선하기
          </Button>
          <Button variant="outline" className="flex-1">
            스토리 저장
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}