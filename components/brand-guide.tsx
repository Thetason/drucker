"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Palette, Type, Image as ImageIcon, Layout,
  Sparkles, Copy, Download, Eye
} from "lucide-react"

export function BrandGuide() {
  const [channelName, setChannelName] = useState("")
  const [channelTheme, setChannelTheme] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string>("minimal")

  const brandStyles = {
    minimal: {
      name: "미니멀",
      colors: ["#FFFFFF", "#000000", "#E5E5E5", "#333333"],
      fonts: ["Helvetica", "Arial", "Noto Sans"],
      description: "깔끔하고 단순한 디자인",
      keywords: ["클린", "모던", "세련"],
      thumbnail: {
        layout: "중앙 정렬, 큰 타이포",
        elements: "단순한 아이콘, 여백 활용"
      }
    },
    vibrant: {
      name: "비브런트",
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
      fonts: ["Montserrat", "Bebas Neue", "Impact"],
      description: "화려하고 에너지 넘치는",
      keywords: ["다이나믹", "활기찬", "트렌디"],
      thumbnail: {
        layout: "대각선 배치, 레이어드",
        elements: "그라디언트, 패턴, 이모지"
      }
    },
    vintage: {
      name: "빈티지",
      colors: ["#8B7355", "#D2B48C", "#F5E6D3", "#4A4A4A"],
      fonts: ["Playfair Display", "Georgia", "Merriweather"],
      description: "따뜻하고 클래식한",
      keywords: ["레트로", "아날로그", "온화한"],
      thumbnail: {
        layout: "텍스처 배경, 빈티지 프레임",
        elements: "필름 효과, 손글씨 폰트"
      }
    },
    neon: {
      name: "네온",
      colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#000000"],
      fonts: ["Orbitron", "Rajdhani", "Audiowide"],
      description: "사이버펍크 테크 스타일",
      keywords: ["퓨처리스틱", "네온", "디지털"],
      thumbnail: {
        layout: "비대칭, 어두운 배경",
        elements: "네온 효과, 글로우, 홀로그램"
      }
    },
    pastel: {
      name: "파스텔",
      colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"],
      fonts: ["Quicksand", "Comfortaa", "Nunito"],
      description: "부드럽고 포근한",
      keywords: ["소프트", "쿠키", "커트"],
      thumbnail: {
        layout: "둥근 모서리, 책 배치",
        elements: "귀여운 일러스트, 스티커"
      }
    }
  }

  const colorPsychology = {
    "빨강": "열정, 에너지, 긴급함, 중요도",
    "파랑": "신뢰, 안정감, 전문성, 침착함",
    "녹색": "성장, 자연, 평화, 건강",
    "노랑": "행복, 낙관, 주의, 창의성",
    "보라": "고급, 창의성, 신비, 지혜",
    "주황": "활력, 친근함, 모험, 열정",
    "흰색": "깨끗함, 단순함, 순수, 새로움",
    "검정": "고급스러움, 권위, 미스테리, 세련"
  }

  const fontCategories = {
    serif: {
      name: "세리프",
      best: "교육, 뉴스, 전통적인 콘텐츠",
      examples: ["Georgia", "Times New Roman", "Playfair Display"]
    },
    sansSerif: {
      name: "산세리프",
      best: "테크, 비즈니스, 모던 콘텐츠",
      examples: ["Helvetica", "Arial", "Roboto"]
    },
    display: {
      name: "디스플레이",
      best: "썸네일, 타이틀, 강조",
      examples: ["Impact", "Bebas Neue", "Montserrat"]
    },
    script: {
      name: "스크립트",
      best: "패션, 뷰티, 웨딩",
      examples: ["Pacifico", "Dancing Script", "Great Vibes"]
    }
  }

  const generateBrandGuide = () => {
    if (!channelName || !channelTheme) {
      alert("채널명과 주제를 입력해주세요!")
      return
    }
    
    // AI 연동 또는 브랜드 가이드 생성 로직
    alert(`${channelName} 채널의 브랜드 가이드가 생성되었습니다!`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-500" />
          브랜드 가이드라인
        </CardTitle>
        <CardDescription>
          일관된 채널 브랜딩을 위한 비주얼 가이드
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Channel Info */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">채널명</label>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="예: 드러커TV"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">채널 주제</label>
            <Input
              value={channelTheme}
              onChange={(e) => setChannelTheme(e.target.value)}
              placeholder="예: 브이로그, 테크 리뷰, 요리..."
              className="mt-1"
            />
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <h3 className="font-medium">브랜드 스타일 선택</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(brandStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setSelectedStyle(key)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  selectedStyle === key
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-sm">{style.name}</p>
                <div className="flex gap-1 mt-2 justify-center">
                  {style.colors.slice(0, 4).map((color) => (
                    <div
                      key={color}
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {style.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Style Details */}
        {selectedStyle && (
          <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="font-medium mb-3">
              {brandStyles[selectedStyle as keyof typeof brandStyles].name} 스타일 상세
            </h3>
            
            {/* Color Palette */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="text-sm font-medium">컬러 파레트</span>
              </div>
              <div className="flex gap-2">
                {brandStyles[selectedStyle as keyof typeof brandStyles].colors.map((color) => (
                  <div key={color} className="text-center">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs mt-1">{color}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span className="text-sm font-medium">폰트 추천</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {brandStyles[selectedStyle as keyof typeof brandStyles].fonts.map((font) => (
                  <Badge key={font} variant="outline">
                    {font}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">키워드</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {brandStyles[selectedStyle as keyof typeof brandStyles].keywords.map((keyword) => (
                  <Badge key={keyword} className="bg-purple-500 text-white">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Thumbnail Guide */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm font-medium">썸네일 가이드</span>
              </div>
              <div className="p-3 bg-white rounded-lg text-sm">
                <p>🔸 레이아웃: {brandStyles[selectedStyle as keyof typeof brandStyles].thumbnail.layout}</p>
                <p>🔸 요소: {brandStyles[selectedStyle as keyof typeof brandStyles].thumbnail.elements}</p>
              </div>
            </div>
          </div>
        )}

        {/* Color Psychology */}
        <div className="space-y-3">
          <h3 className="font-medium">색상 심리학</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(colorPsychology).slice(0, 4).map(([color, meaning]) => (
              <div key={color} className="p-3 border rounded-lg text-sm">
                <p className="font-medium">{color}</p>
                <p className="text-xs text-muted-foreground">{meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Font Categories */}
        <div className="space-y-3">
          <h3 className="font-medium">폰트 카테고리</h3>
          <div className="space-y-2">
            {Object.entries(fontCategories).slice(0, 2).map(([key, category]) => (
              <div key={key} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">{category.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {category.best}
                  </Badge>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {category.examples.map((font) => (
                    <span key={font} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {font}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={generateBrandGuide}>
            <Eye className="h-4 w-4 mr-2" />
            브랜드 가이드 생성
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            PDF 다운로드
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}