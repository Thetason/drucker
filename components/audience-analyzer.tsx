"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Target, BarChart, Heart, Clock, Globe } from "lucide-react"

export function AudienceAnalyzer() {
  const [targetAge, setTargetAge] = useState("20-30")
  const [targetGender, setTargetGender] = useState("all")
  const [interests, setInterests] = useState<string[]>([])

  const ageGroups = [
    { id: "10-20", label: "10대", content: ["숏폼", "챌린지", "게임", "학습"] },
    { id: "20-30", label: "20-30대", content: ["자기계발", "브이로그", "리뷰", "투자"] },
    { id: "30-40", label: "30-40대", content: ["육아", "요리", "인테리어", "건강"] },
    { id: "40+", label: "40대+", content: ["건강", "여행", "취미", "교양"] }
  ]

  const contentStrategy = {
    "10-20": {
      format: "15-60초 숏폼 위주",
      time: "방과후 4-6시, 저녁 8-10시",
      tone: "캐주얼, 재미있는, 트렌디한",
      platform: "틱톡, 유튜브 쇼츠, 인스타 릴스"
    },
    "20-30": {
      format: "5-15분 중간 길이",
      time: "점심 12-1시, 저녁 7-9시",
      tone: "정보성, 실용적, 영감을 주는",
      platform: "유튜브, 인스타그램"
    },
    "30-40": {
      format: "10-20분 심도있는 콘텐츠",
      time: "오전 10-12시, 저녁 8-10시",
      tone: "신뢰감, 전문적, 친근한",
      platform: "유튜브, 네이버 블로그"
    },
    "40+": {
      format: "15-30분 교양 콘텐츠",
      time: "오전 9-11시, 저녁 7-9시",
      tone: "차분한, 전문적, 교육적",
      platform: "유튜브, 페이스북"
    }
  }

  const interestCategories = [
    "뷰티/패션", "음식/요리", "여행", "운동/건강",
    "교육/학습", "테크/IT", "금융/투자", "엔터테인먼트",
    "게임", "반려동물", "육아", "라이프스타일"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          타겟 오디언스 분석기
        </CardTitle>
        <CardDescription>
          효과적인 콘텐츠 전략을 위한 오디언스 분석
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Group Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">연령대 선택</label>
          <div className="grid grid-cols-2 gap-2">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setTargetAge(group.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  targetAge === group.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium">{group.label}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {group.content.slice(0, 2).map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">성별 타겟</label>
          <div className="flex gap-2">
            {["all", "female", "male"].map((gender) => (
              <Button
                key={gender}
                variant={targetGender === gender ? "default" : "outline"}
                size="sm"
                onClick={() => setTargetGender(gender)}
              >
                {gender === "all" ? "전체" : gender === "female" ? "여성" : "남성"}
              </Button>
            ))}
          </div>
        </div>

        {/* Interest Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">관심사 선택 (복수 선택)</label>
          <div className="flex flex-wrap gap-2">
            {interestCategories.map((interest) => (
              <Badge
                key={interest}
                variant={interests.includes(interest) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (interests.includes(interest)) {
                    setInterests(interests.filter(i => i !== interest))
                  } else {
                    setInterests([...interests, interest])
                  }
                }}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strategy Result */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            추천 콘텐츠 전략
          </h3>
          
          {targetAge && contentStrategy[targetAge as keyof typeof contentStrategy] && (
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <BarChart className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">콘텐츠 형식</p>
                  <p className="text-muted-foreground">
                    {contentStrategy[targetAge as keyof typeof contentStrategy].format}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <p className="font-medium">최적 업로드 시간</p>
                  <p className="text-muted-foreground">
                    {contentStrategy[targetAge as keyof typeof contentStrategy].time}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium">톤 & 매너</p>
                  <p className="text-muted-foreground">
                    {contentStrategy[targetAge as keyof typeof contentStrategy].tone}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 mt-0.5 text-purple-500" />
                <div>
                  <p className="font-medium">추천 플랫폼</p>
                  <p className="text-muted-foreground">
                    {contentStrategy[targetAge as keyof typeof contentStrategy].platform}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persona */}
        {interests.length > 0 && (
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-medium mb-2">🎯 타겟 페르소나</h3>
            <p className="text-sm text-muted-foreground">
              {targetAge}대 {targetGender === "all" ? "" : targetGender === "female" ? "여성" : "남성"}
              {interests.length > 0 && ` • ${interests.slice(0, 3).join(", ")}에 관심이 많은`} 시청자
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <p>• 주요 시청 시간: {contentStrategy[targetAge as keyof typeof contentStrategy]?.time}</p>
              <p>• 선호 콘텐츠: {ageGroups.find(g => g.id === targetAge)?.content.join(", ")}</p>
              <p>• 추천 해시태그: #{interests.slice(0, 3).join(" #")}</p>
            </div>
          </div>
        )}

        <Button className="w-full">
          오디언스 리포트 생성
        </Button>
      </CardContent>
    </Card>
  )
}