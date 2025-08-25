"use client"

import { useState } from "react"
import { PixarStorySpine } from "@/components/pixar-story-spine"
import { PixarRules } from "@/components/pixar-rules"
import { EmotionTimeline } from "@/components/emotion-timeline"
import { IdeaGenerator } from "@/components/idea-generator"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function PlanningPage() {
  const [activeTab, setActiveTab] = useState<"idea" | "story" | "emotion" | "rules">("idea")

  const tabs = [
    { id: "idea", label: "💡 아이디어", description: "Plussing으로 발전시키기" },
    { id: "story", label: "📝 스토리", description: "픽사 스토리 스파인" },
    { id: "emotion", label: "📈 감정곡선", description: "감정 타임라인 설계" },
    { id: "rules", label: "✅ 체크리스트", description: "22가지 법칙" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  돌아가기
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  픽사 스타일 기획
                </h1>
                <p className="text-sm text-muted-foreground">
                  픽사의 스토리텔링 방법론으로 매력적인 콘텐츠를 만들어보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg border transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? "text-blue-100" : "text-muted-foreground"
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "idea" && <IdeaGenerator />}
            {activeTab === "story" && <PixarStorySpine />}
            {activeTab === "emotion" && <EmotionTimeline />}
            {activeTab === "rules" && <PixarRules />}
          </div>

          {/* Side Panel - Tips */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                픽사의 비밀
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <p className="font-medium mb-1">🎬 "Story is King"</p>
                  <p className="text-xs text-muted-foreground">
                    아무리 화려한 비주얼도 스토리가 없으면 의미가 없어요
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="font-medium mb-1">💡 "Fail Fast, Fail Often"</p>
                  <p className="text-xs text-muted-foreground">
                    빠르게 실패하고 개선하는 것이 완벽을 추구하는 것보다 낫습니다
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="font-medium mb-1">🤝 "Trust the Process"</p>
                  <p className="text-xs text-muted-foreground">
                    창의적인 과정을 믿고 체계적으로 접근하세요
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold mb-3">릴스 성공 공식</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">첫 3초 이탈률</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">감정 변화 필요</span>
                  <span className="font-medium">3-4회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이상적인 길이</span>
                  <span className="font-medium">15-30초</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTA 효과</span>
                  <span className="font-medium">+40%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-2">준비되셨나요?</h3>
              <p className="text-sm mb-4 text-blue-100">
                기획이 완료되면 프로젝트를 생성하고 제작을 시작하세요!
              </p>
              <Link href="/">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  프로젝트 생성하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}