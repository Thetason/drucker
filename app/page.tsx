"use client"

import { useState, useEffect } from "react"
import { ContentPlannerWithInsights } from "@/components/content-planner-with-insights"
import { ProductionScheduleV2 } from "@/components/production-schedule-v2"
import { CreatorPersona } from "@/components/creator-persona"
import { 
  Target, Lightbulb, 
  Calendar,
  User, CheckCircle2, AlertCircle
} from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"persona" | "plan" | "schedule">("persona")
  const [personaComplete, setPersonaComplete] = useState(false)

  // Check if persona is already set
  useEffect(() => {
    const savedPersona = localStorage.getItem('drucker-persona')
    if (savedPersona) {
      const persona = JSON.parse(savedPersona)
      if (persona.name && persona.whatICanDo?.length > 0) {
        setPersonaComplete(true)
        // If persona is complete, default to plan tab
        setActiveTab("plan")
      }
    }
  }, [])

  const tabs = [
    { 
      id: "persona",
      label: "크리에이터 페르소나",
      description: "나만의 정체성 설정",
      icon: <User className="h-4 w-4" />,
      color: "from-purple-500 to-pink-500",
      status: personaComplete ? "complete" : "recommended"
    },
    { 
      id: "plan", 
      label: "기획서 작성", 
      description: "콘텐츠 기획",
      icon: <Target className="h-4 w-4" />,
      color: "from-blue-500 to-purple-500"
    },
    { 
      id: "schedule",
      label: "제작 스케줄",
      description: "일정 관리",
      icon: <Calendar className="h-4 w-4" />,
      color: "from-green-500 to-teal-500"
    }
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-7 w-7 text-blue-500" />
                드러커
              </h1>
              <p className="text-sm text-muted-foreground">
                콘텐츠 기획 & 제작 관리
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* Persona Status Alert */}
        {!personaComplete && activeTab !== "persona" && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-purple-900">💡 페르소나 설정을 추천합니다</p>
              <p className="text-sm text-purple-700 mt-1">
                지속가능한 콘텐츠 제작을 위해 크리에이터 페르소나를 설정하면 더 나은 추천을 받을 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Main Navigation Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeTab === tab.id
                  ? "border-transparent shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} rounded-xl opacity-90`} />
              )}
              <div className={`relative ${activeTab === tab.id ? "text-white" : ""}`}>
                <div className="flex items-center justify-center mb-2">
                  {tab.status === "complete" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : tab.status === "recommended" ? (
                    <AlertCircle className="h-4 w-4 text-purple-500" />
                  ) : (
                    tab.icon
                  )}
                </div>
                <p className="font-medium text-sm">{tab.label}</p>
                <p className={`text-xs ${
                  activeTab === tab.id ? "text-white/80" : "text-muted-foreground"
                }`}>
                  {tab.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div>
          {activeTab === "persona" && (
            <div>
              <CreatorPersona 
                onPersonaComplete={() => {
                  setPersonaComplete(true)
                  setActiveTab("plan")
                }}
              />
              {personaComplete && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ 페르소나 설정이 완료되었습니다! 이제 기획서 작성과 제작 스케줄 관리를 시작할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "plan" && <ContentPlannerWithInsights />}
          {activeTab === "schedule" && <ProductionScheduleV2 />}
        </div>
      </main>
    </div>
  )
}