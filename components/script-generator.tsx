"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, Clock, Mic, Play, 
  Copy, Download, Wand2, Video,
  Camera, Edit3
} from "lucide-react"

export function ScriptGenerator() {
  const [scriptType, setScriptType] = useState<"youtube" | "shorts" | "live">("youtube")
  const [duration, setDuration] = useState("10")
  const [topic, setTopic] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")

  const scriptTemplates = {
    youtube: {
      structure: [
        { time: "0:00-0:15", part: "훅 (Hook)", content: "시청자 주의 끌기" },
        { time: "0:15-0:30", part: "인트로", content: "자기소개 & 오늘의 주제" },
        { time: "0:30-8:00", part: "메인", content: "핵심 콘텐츠 전달" },
        { time: "8:00-9:30", part: "요약", content: "핵심 포인트 정리" },
        { time: "9:30-10:00", part: "CTA", content: "구독/좋아요 요청" }
      ],
      tips: [
        "첫 15초가 가장 중요 - 30% 이탈률 결정",
        "스토리텔링 기법 활용",
        "시각적 변화 3-5초마다",
        "CTA는 자연스럽게"
      ]
    },
    shorts: {
      structure: [
        { time: "0-3초", part: "훅", content: "충격적 시작/질문" },
        { time: "3-50초", part: "본론", content: "핵심 메시지" },
        { time: "50-60초", part: "마무리", content: "CTA/다음 영상 예고" }
      ],
      tips: [
        "세로 형식 최적화",
        "빠른 템포 유지",
        "루프 가능한 구성",
        "텍스트 오버레이 활용"
      ]
    },
    live: {
      structure: [
        { time: "0-5분", part: "대기", content: "인사 & 채팅 확인" },
        { time: "5-10분", part: "소개", content: "오늘의 주제 안내" },
        { time: "10-40분", part: "메인", content: "콘텐츠 & 소통" },
        { time: "40-50분", part: "Q&A", content: "시청자 질문" },
        { time: "50-60분", part: "마무리", content: "다음 라이브 예고" }
      ],
      tips: [
        "실시간 소통 강조",
        "도네이션 감사",
        "시청자 이름 호명",
        "고정 스케줄 안내"
      ]
    }
  }

  const toneOptions = [
    { id: "casual", label: "캐주얼", desc: "친근하고 편안한" },
    { id: "professional", label: "전문적", desc: "신뢰감 있는" },
    { id: "energetic", label: "에너지틱", desc: "활기차고 열정적인" },
    { id: "educational", label: "교육적", desc: "차분하고 설명적인" }
  ]

  const generateScript = () => {
    if (!topic) {
      alert("주제를 입력해주세요!")
      return
    }

    // 실제로는 AI API 호출하여 생성
    const template = scriptTemplates[scriptType]
    let script = `🎬 **${topic}** 스크립트\n\n`
    
    template.structure.forEach(section => {
      script += `### [${section.time}] ${section.part}\n`
      script += `${section.content}\n\n`
      
      // 예시 대사 추가
      if (section.part === "훅" || section.part === "Hook") {
        script += `> "여러분, ${topic}에 대해 알고 계셨나요?"\n`
        script += `> "오늘은 특별히 ${topic}의 비밀을 공개합니다!"\n\n`
      }
    })
    
    script += `---\n💡 **팁:**\n`
    template.tips.forEach(tip => {
      script += `- ${tip}\n`
    })
    
    setGeneratedScript(script)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript)
    alert("스크립트가 클립보드에 복사되었습니다!")
  }

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic || 'script'}_${scriptType}.txt`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          AI 스크립트 생성기
        </CardTitle>
        <CardDescription>
          플랫폼별 최적화된 스크립트를 자동으로 생성해보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">플랫폼 선택</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setScriptType("youtube")}
              className={`p-3 rounded-lg border-2 transition-all ${
                scriptType === "youtube"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Video className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm font-medium">유튜브</p>
              <p className="text-xs text-muted-foreground">5-20분</p>
            </button>
            <button
              onClick={() => setScriptType("shorts")}
              className={`p-3 rounded-lg border-2 transition-all ${
                scriptType === "shorts"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Camera className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm font-medium">쇼츠/릴스</p>
              <p className="text-xs text-muted-foreground">15-60초</p>
            </button>
            <button
              onClick={() => setScriptType("live")}
              className={`p-3 rounded-lg border-2 transition-all ${
                scriptType === "live"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Mic className="h-5 w-5 mx-auto mb-1" />
              <p className="text-sm font-medium">라이브</p>
              <p className="text-xs text-muted-foreground">30-60분</p>
            </button>
          </div>
        </div>

        {/* Duration */}
        {scriptType === "youtube" && (
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              영상 길이
            </label>
            <div className="flex gap-2">
              {["5", "10", "15", "20"].map((min) => (
                <Button
                  key={min}
                  variant={duration === min ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(min)}
                >
                  {min}분
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Topic Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">콘텐츠 주제</label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 초보자를 위한 유튜브 시작하기, 집에서 카페 느낌 내는 커피 레시피..."
            className="min-h-[80px]"
          />
        </div>

        {/* Script Structure Preview */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            스크립트 구조
          </h3>
          <div className="space-y-2">
            {scriptTemplates[scriptType].structure.map((section, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="min-w-[80px] justify-center">
                  {section.time}
                </Badge>
                <span className="font-medium">{section.part}</span>
                <span className="text-muted-foreground text-xs">{section.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">대화 톤</label>
          <div className="grid grid-cols-2 gap-2">
            {toneOptions.map((tone) => (
              <div key={tone.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-sm">{tone.label}</p>
                <p className="text-xs text-muted-foreground">{tone.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={generateScript}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          AI 스크립트 생성
        </Button>

        {/* Generated Script */}
        {generatedScript && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">생성된 스크립트</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={downloadScript}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {generatedScript}
              </pre>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium mb-2">💡 프로 팁</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {scriptTemplates[scriptType].tips.map((tip, idx) => (
              <li key={idx}>• {tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}