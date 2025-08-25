"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Heart, Zap, Target, Users, Lightbulb } from "lucide-react"

interface Rule {
  id: number
  rule: string
  tip: string
  category: "structure" | "character" | "emotion" | "creativity"
  checked: boolean
}

export function PixarRules() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      rule: "실패한 캐릭터가 성공한 캐릭터보다 더 매력적이다",
      tip: "시청자가 응원하고 싶은 언더독 스토리를 만드세요",
      category: "character",
      checked: false
    },
    {
      id: 2,
      rule: "시청자를 위해 만들어라, 당신을 위해서가 아니라",
      tip: "타겟 오디언스가 원하는 것이 무엇인지 항상 생각하세요",
      category: "emotion",
      checked: false
    },
    {
      id: 4,
      rule: "구조를 먼저, 디테일은 나중에",
      tip: "15초/30초 안에 명확한 기승전결을 만드세요",
      category: "structure",
      checked: false
    },
    {
      id: 5,
      rule: "단순하게 만들어라. 합치고, 줄이고, 버려라",
      tip: "한 릴스에 한 가지 메시지만 전달하세요",
      category: "structure",
      checked: false
    },
    {
      id: 6,
      rule: "캐릭터의 강점이 아닌 약점에 집중하라",
      tip: "진정성 있는 실수와 극복 과정을 보여주세요",
      category: "character",
      checked: false
    },
    {
      id: 7,
      rule: "끝을 먼저 정하고, 거기서부터 역으로 만들어라",
      tip: "마지막 장면(CTA)을 정하고 스토리를 구성하세요",
      category: "structure",
      checked: false
    },
    {
      id: 9,
      rule: "막히면 다음 불가능한 일을 리스트업하라",
      tip: "역발상으로 새로운 콘텐츠 아이디어를 찾으세요",
      category: "creativity",
      checked: false
    },
    {
      id: 11,
      rule: "종이에 적어야 수정할 수 있다",
      tip: "스크립트를 먼저 작성하고 촬영하세요",
      category: "creativity",
      checked: false
    },
    {
      id: 13,
      rule: "캐릭터에게 의견을 부여하라",
      tip: "당신만의 독특한 관점과 톤을 만드세요",
      category: "character",
      checked: false
    },
    {
      id: 14,
      rule: "왜 이 스토리를 꼭 해야 하는가?",
      tip: "시청자에게 줄 가치가 명확한지 확인하세요",
      category: "emotion",
      checked: false
    },
    {
      id: 15,
      rule: "캐릭터라면 이 상황에서 어떻게 느낄까?",
      tip: "감정을 전달하는 표정과 제스처를 활용하세요",
      category: "emotion",
      checked: false
    },
    {
      id: 19,
      rule: "우연은 문제를 만들 때, 노력은 해결할 때",
      tip: "해결책은 논리적이고 설득력 있게 제시하세요",
      category: "structure",
      checked: false
    },
    {
      id: 22,
      rule: "스토리의 본질은 무엇인가? 가장 경제적으로 전달하라",
      tip: "첫 3초 안에 핵심 메시지를 전달하세요",
      category: "structure",
      checked: false
    }
  ])

  const handleCheck = (id: number) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, checked: !rule.checked } : rule
      )
    )
  }

  const categoryIcons = {
    structure: <BookOpen className="h-3 w-3" />,
    character: <Users className="h-3 w-3" />,
    emotion: <Heart className="h-3 w-3" />,
    creativity: <Lightbulb className="h-3 w-3" />
  }

  const categoryColors = {
    structure: "bg-blue-500",
    character: "bg-purple-500",
    emotion: "bg-pink-500",
    creativity: "bg-yellow-500"
  }

  const completionRate = Math.round((rules.filter(r => r.checked).length / rules.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            픽사의 스토리텔링 체크리스트
          </span>
          <Badge variant="outline">{completionRate}% 완료</Badge>
        </CardTitle>
        <CardDescription>
          픽사의 22가지 스토리텔링 법칙을 릴스에 적용해보세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={rule.checked}
                onCheckedChange={() => handleCheck(rule.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={`${categoryColors[rule.category]} text-white`}>
                    {categoryIcons[rule.category]}
                    <span className="ml-1 text-xs">
                      Rule #{rule.id}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm font-medium">{rule.rule}</p>
                <p className="text-xs text-muted-foreground">
                  💡 {rule.tip}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-sm font-medium mb-2">✨ 오늘의 도전</p>
          <p className="text-xs text-muted-foreground">
            체크하지 않은 룰 중 하나를 선택해서 다음 릴스에 적용해보세요!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}