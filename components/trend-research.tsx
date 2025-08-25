"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  TrendingUp, Search, Calendar, Hash, 
  BarChart, Clock, Globe, AlertCircle,
  Youtube, Camera
} from "lucide-react"

export function TrendResearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<"youtube" | "shorts" | "all">("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  // 실시간 트렌드 데이터 (실제로는 API 연동)
  const trendData = {
    realtime: [
      { 
        keyword: "AI 툴",
        growth: "+312%",
        volume: "5.2M",
        competition: "낮음",
        opportunity: 95,
        relatedTopics: ["ChatGPT", "자동화", "생산성"]
      },
      { 
        keyword: "미니멀 라이프",
        growth: "+189%",
        volume: "3.8M",
        competition: "중간",
        opportunity: 78,
        relatedTopics: ["정리", "절약", "단순한 삶"]
      },
      { 
        keyword: "GRWM",
        growth: "+156%",
        volume: "2.9M",
        competition: "높음",
        opportunity: 62,
        relatedTopics: ["메이크업", "루틴", "브이로그"]
      },
      { 
        keyword: "숏폼 요리",
        growth: "+245%",
        volume: "4.1M",
        competition: "중간",
        opportunity: 83,
        relatedTopics: ["간단 레시피", "1분 요리", "편의점"]
      }
    ],
    seasonal: [
      { month: "새해", keywords: ["계획", "루틴", "다이어트", "공부"], peak: "1월 1-15일" },
      { month: "봄", keywords: ["봄철", "환절기", "피크닉", "패션"], peak: "3-4월" },
      { month: "여름", keywords: ["휴가", "여행", "비키니", "다이어트"], peak: "6-8월" },
      { month: "가을", keywords: ["학교", "가을코디", "대학", "취업"], peak: "9-10월" },
      { month: "겨울", keywords: ["크리스마스", "선물", "연말", "수능"], peak: "11-12월" }
    ],
    niches: [
      { 
        category: "마이크로 니시",
        examples: ["고양이 ASMR", "식물 일기", "미니어차 수집"],
        potential: "높음",
        competition: "낮음"
      },
      { 
        category: "로컬 콘텐츠",
        examples: ["동네 맛집", "지역 축제", "로컬 크리에이터"],
        potential: "중간",
        competition: "낮음"
      },
      { 
        category: "전문가 콘텐츠",
        examples: ["의사가 알려주는", "변호사가 말하는", "개발자 팁"],
        potential: "높음",
        competition: "중간"
      }
    ]
  }

  const contentFormats = [
    { format: "숏폼 (15-60초)", trend: "+85%", bestFor: "퀸별한 팁, 비포&애프터" },
    { format: "롭폼 (1-3분)", trend: "+45%", bestFor: "튜토리얼, 리뷰, 분석" },
    { format: "라이브 (30분+)", trend: "+67%", bestFor: "Q&A, 게임, 소통" },
    { format: "시리즈물", trend: "+92%", bestFor: "교육, 브이로그, 도전" }
  ]

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          트렌드 리서치 도구
        </CardTitle>
        <CardDescription>
          실시간 트렌드와 기회를 분석해 콘텐츠 아이디어를 발굴하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="키워드 검색..."
              className="pl-10"
            />
          </div>
          <Button>검색</Button>
        </div>

        {/* Platform Filter */}
        <div className="flex gap-2">
          <Button
            variant={selectedPlatform === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform("all")}
          >
            전체
          </Button>
          <Button
            variant={selectedPlatform === "youtube" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform("youtube")}
          >
            <Youtube className="h-4 w-4 mr-1" />
            유튜브
          </Button>
          <Button
            variant={selectedPlatform === "shorts" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform("shorts")}
          >
            <Camera className="h-4 w-4 mr-1" />
            쇼츠/릴스
          </Button>
        </div>

        {/* Realtime Trends */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            🔥 실시간 급상승 키워드
          </h3>
          <div className="space-y-2">
            {trendData.realtime.map((trend) => (
              <div key={trend.keyword} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-lg">{trend.keyword}</p>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BarChart className="h-3 w-3" />
                        검색량: {trend.volume}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        성장률: {trend.growth}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOpportunityColor(trend.opportunity)}`}>
                      기회점수: {trend.opportunity}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      경쟁: {trend.competition}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  <span className="text-xs text-muted-foreground">연관 토픽:</span>
                  {trend.relatedTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Format Trends */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Camera className="h-4 w-4" />
            포맷별 트렌드
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {contentFormats.map((format) => (
              <div key={format.format} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">{format.format}</p>
                  <Badge className="bg-green-500 text-white text-xs">
                    {format.trend}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{format.bestFor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Opportunities */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            시즌별 기회
          </h3>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {trendData.seasonal.map((season) => (
                <div key={season.month} className="text-center">
                  <p className="font-medium text-sm mb-1">{season.month}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {season.keywords.slice(0, 2).map((kw) => (
                      <Badge key={kw} variant="outline" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{season.peak}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Niche Opportunities */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Hash className="h-4 w-4" />
            니시 기회
          </h3>
          <div className="space-y-2">
            {trendData.niches.map((niche) => (
              <div key={niche.category} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-sm">{niche.category}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      잠재력: {niche.potential}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      경쟁: {niche.competition}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {niche.examples.map((ex) => (
                    <span key={ex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <Hash className="h-4 w-4 mr-2" />
            트렌드 기반 아이디어 생성
          </Button>
          <Button variant="outline" className="flex-1">
            <Globe className="h-4 w-4 mr-2" />
            상세 리포트 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}