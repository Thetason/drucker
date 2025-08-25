"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown, Zap, Heart, AlertCircle } from "lucide-react"

interface EmotionPoint {
  time: number
  intensity: number
  label: string
  type: "hook" | "tension" | "peak" | "resolution"
}

export function EmotionTimeline() {
  const [duration, setDuration] = useState<15 | 30 | 60>(15)
  const [emotionPoints, setEmotionPoints] = useState<EmotionPoint[]>([
    { time: 0, intensity: 50, label: "시작", type: "hook" },
    { time: 3, intensity: 80, label: "훅", type: "hook" },
    { time: 7, intensity: 40, label: "긴장", type: "tension" },
    { time: 12, intensity: 90, label: "클라이맥스", type: "peak" },
    { time: 15, intensity: 70, label: "마무리", type: "resolution" }
  ])

  const templates = {
    15: {
      name: "15초 임팩트",
      points: [
        { time: 0, intensity: 30, label: "도입", type: "hook" as const },
        { time: 2, intensity: 90, label: "훅 포인트", type: "hook" as const },
        { time: 5, intensity: 50, label: "설명", type: "tension" as const },
        { time: 10, intensity: 85, label: "핵심 전달", type: "peak" as const },
        { time: 14, intensity: 70, label: "CTA", type: "resolution" as const }
      ]
    },
    30: {
      name: "30초 스토리",
      points: [
        { time: 0, intensity: 40, label: "문제 제기", type: "hook" as const },
        { time: 5, intensity: 70, label: "관심 유발", type: "hook" as const },
        { time: 10, intensity: 30, label: "갈등", type: "tension" as const },
        { time: 20, intensity: 95, label: "해결", type: "peak" as const },
        { time: 28, intensity: 60, label: "마무리", type: "resolution" as const }
      ]
    },
    60: {
      name: "60초 튜토리얼",
      points: [
        { time: 0, intensity: 50, label: "인트로", type: "hook" as const },
        { time: 10, intensity: 75, label: "문제 상황", type: "hook" as const },
        { time: 20, intensity: 40, label: "과정 설명", type: "tension" as const },
        { time: 40, intensity: 90, label: "결과 공개", type: "peak" as const },
        { time: 55, intensity: 70, label: "요약/CTA", type: "resolution" as const }
      ]
    }
  }

  const applyTemplate = (templateDuration: 15 | 30 | 60) => {
    setDuration(templateDuration)
    setEmotionPoints(templates[templateDuration].points)
  }

  const getPointColor = (type: string) => {
    switch(type) {
      case "hook": return "bg-blue-500"
      case "tension": return "bg-yellow-500"
      case "peak": return "bg-red-500"
      case "resolution": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getEmotionTip = (intensity: number) => {
    if (intensity >= 80) return "🔥 최고조! 시청자의 감정을 폭발시키세요"
    if (intensity >= 60) return "📈 상승! 흥미를 끌어올리는 구간"
    if (intensity >= 40) return "💭 준비! 다음 피크를 위한 빌드업"
    return "😌 차분! 정보 전달이나 전환 구간"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          감정 곡선 타임라인
        </CardTitle>
        <CardDescription>
          릴스의 감정 흐름을 설계하고 시청자의 몰입도를 높이세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Duration Selector */}
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">길이 선택:</span>
          {([15, 30, 60] as const).map((d) => (
            <Button
              key={d}
              variant={duration === d ? "default" : "outline"}
              size="sm"
              onClick={() => applyTemplate(d)}
            >
              {d}초 {templates[d].name}
            </Button>
          ))}
        </div>

        {/* Timeline Visualization */}
        <div className="relative h-48 bg-gray-50 rounded-lg p-4">
          <div className="absolute inset-0 p-4">
            {/* Grid Lines */}
            <div className="absolute inset-x-4 top-1/4 border-t border-gray-200" />
            <div className="absolute inset-x-4 top-1/2 border-t border-gray-300" />
            <div className="absolute inset-x-4 top-3/4 border-t border-gray-200" />

            {/* Emotion Curve */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                points={emotionPoints.map((point, i) => {
                  const x = (point.time / duration) * 100
                  const y = 100 - point.intensity
                  return `${x}%,${y}%`
                }).join(' ')}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            </svg>

            {/* Emotion Points */}
            {emotionPoints.map((point, i) => (
              <div
                key={i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(point.time / duration) * 100}%`,
                  top: `${100 - point.intensity}%`
                }}
              >
                <div className={`w-3 h-3 rounded-full ${getPointColor(point.type)} border-2 border-white shadow-lg`} />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <Badge variant="outline" className="text-xs">
                    {point.time}s: {point.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intensity Legend */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" /> 낮음
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" /> 중간
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 높음
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> 최고조
          </span>
        </div>

        {/* Current Point Analysis */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">감정 설계 팁</p>
              <p className="text-xs text-muted-foreground">
                {getEmotionTip(emotionPoints[emotionPoints.length - 1]?.intensity || 50)}
              </p>
              <p className="text-xs text-muted-foreground">
                • 첫 3초가 가장 중요해요 - 강력한 훅으로 시작하세요
              </p>
              <p className="text-xs text-muted-foreground">
                • 감정의 고저차를 만들어 지루하지 않게 하세요
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            포인트 편집
          </Button>
          <Button className="flex-1">
            타임라인 적용
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}