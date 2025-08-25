"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrandGuide } from "@/components/brand-guide"
import { 
  Image, Type, Palette, Zap, 
  ArrowRight, Eye, MousePointer
} from "lucide-react"

export function ThumbnailGuide() {
  const [showBrandGuide, setShowBrandGuide] = useState(false)
  
  if (showBrandGuide) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowBrandGuide(false)}
        >
          ← 썸네일 가이드로 돌아가기
        </Button>
        <BrandGuide />
      </div>
    )
  }
  const thumbnailTips = {
    "구성 요소": [
      { icon: "😲", title: "표정", desc: "과장된 리액션, 감정 표현" },
      { icon: "🔴", title: "화살표/원", desc: "시선 유도, 강조 포인트" },
      { icon: "🔤", title: "텍스트", desc: "3-5단어, 큰 폰트, 대비 색상" },
      { icon: "🎨", title: "색상", desc: "빨강/노랑 등 고채도 색상" }
    ],
    "클릭률 높이는 법": [
      "숫자 포함 (TOP 5, 3가지 방법)",
      "Before/After 대비",
      "궁금증 유발 (충격적인, 몰랐던)",
      "얼굴 클로즈업",
      "명확한 가치 제시"
    ],
    "피해야 할 것": [
      "너무 많은 텍스트",
      "작은 폰트 사용",
      "어두운 배경",
      "복잡한 구성",
      "클릭베이트"
    ]
  }

  const platformSpecs = {
    youtube: {
      ratio: "16:9",
      size: "1280x720px",
      format: "JPG, PNG",
      maxSize: "2MB"
    },
    shorts: {
      ratio: "9:16",
      size: "1080x1920px",
      format: "JPG, PNG",
      maxSize: "2MB"
    }
  }

  const colorPalettes = [
    { name: "고대비", colors: ["#000000", "#FFFFFF", "#FF0000"] },
    { name: "활기찬", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"] },
    { name: "네온", colors: ["#FF00FF", "#00FFFF", "#FFFF00"] },
    { name: "파스텔", colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF"] }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-purple-500" />
          썸네일 제작 가이드
        </CardTitle>
        <CardDescription>
          클릭률을 높이는 썸네일 만들기
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CTR Stats */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">평균 클릭률 (CTR)</span>
            <Badge className="bg-purple-500">중요도: 매우 높음</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-500">2-3%</p>
              <p className="text-xs text-muted-foreground">나쁨</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">4-6%</p>
              <p className="text-xs text-muted-foreground">보통</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">7%+</p>
              <p className="text-xs text-muted-foreground">우수</p>
            </div>
          </div>
        </div>

        {/* Key Elements */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            필수 구성 요소
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {thumbnailTips["구성 요소"].map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 p-3 border rounded-lg">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <p className="font-medium text-sm">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palettes */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            추천 색상 조합
          </h3>
          <div className="space-y-2">
            {colorPalettes.map((palette) => (
              <div key={palette.name} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">{palette.name}</span>
                <div className="flex gap-1">
                  {palette.colors.map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Guidelines */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Type className="h-4 w-4" />
            텍스트 가이드
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">메인 텍스트</span>
              <Badge variant="outline">3-5 단어</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">폰트 크기</span>
              <Badge variant="outline">화면의 1/3</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">위치</span>
              <Badge variant="outline">상단 or 중앙</Badge>
            </div>
          </div>
        </div>

        {/* Platform Specs */}
        <div className="space-y-3">
          <h3 className="font-medium">📐 플랫폼별 규격</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(platformSpecs).map(([platform, spec]) => (
              <div key={platform} className="p-3 border rounded-lg">
                <p className="font-medium text-sm capitalize mb-2">{platform}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>비율: {spec.ratio}</p>
                  <p>크기: {spec.size}</p>
                  <p>형식: {spec.format}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          <h3 className="font-medium">💡 프로 팁</h3>
          <div className="space-y-2">
            {thumbnailTips["클릭률 높이는 법"].map((tip, index) => (
              <div key={index} className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-green-500" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* A/B Test Suggestion */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MousePointer className="h-4 w-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">A/B 테스트 추천</p>
              <p className="text-xs text-muted-foreground mt-1">
                2-3개의 다른 썸네일을 만들어 테스트하세요. 
                유튜브 스튜디오에서 어떤 썸네일이 더 효과적인지 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">
            썸네일 체크리스트 생성
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowBrandGuide(true)}
          >
            <Palette className="h-4 w-4 mr-2" />
            브랜드 가이드
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}