import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Star, TrendingUp, Users } from "lucide-react"

const summaryMetrics = [
  {
    id: "satisfaction",
    label: "평균 만족도",
    value: "4.7 / 5",
    description: "최근 30일 응답 기준",
    trend: "+0.4"
  },
  {
    id: "retention",
    label: "재방문율",
    value: "82%",
    description: "주간 활성 사용자 유지율",
    trend: "+6%"
  },
  {
    id: "nps",
    label: "추천 지수 (NPS)",
    value: "37",
    description: "프로모터 - 디트랙터",
    trend: "+9"
  }
]

const highlightFeedback = [
  {
    id: "creator-01",
    creator: "하나 (디지털 마케터)",
    quote: "리텐션 가이드가 업데이트된 이후 숏폼 완성 시간이 절반으로 줄었어요. 일정 관리와 바로 연결되는 점이 가장 큰 장점입니다.",
    tags: ["리텐션", "스케줄", "효율"],
    score: 5
  },
  {
    id: "creator-02",
    creator: "지훈 (1인 크리에이터)",
    quote: "30명 제한 베타라 그런지 피드백 반영 속도가 엄청 빠르네요. 템플릿을 직접 커스텀해 저장할 수 있었으면 좋겠어요.",
    tags: ["커스텀", "템플릿"],
    score: 4
  }
]

const improvementQueue = [
  {
    id: "roadmap-1",
    title: "템플릿 커스텀 저장 기능",
    status: "개발 중",
    eta: "2025-03",
    summary: "기획서를 개인 템플릿으로 저장하고 팀과 공유할 수 있도록 워크플로우를 준비 중입니다."
  },
  {
    id: "roadmap-2",
    title: "모바일 대응 강화",
    status: "검토 중",
    eta: "2025-04",
    summary: "iOS/Android 브라우저에서 스케줄 drag & drop 성능을 높이기 위한 대응안을 테스트하고 있습니다."
  },
  {
    id: "roadmap-3",
    title: "에이전시용 협업 좌석",
    status: "아이데이션",
    eta: "TBD",
    summary: "피드백 기반으로 좌석제 요금제와 승인 워크플로우 요구사항을 정리 중입니다."
  }
]

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600">Voice of Creator</p>
              <h1 className="mt-2 text-3xl font-bold">유저 피드백 센터</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                실제 크리에이터 13명의 의견을 토대로 제품을 함께 다듬고 있습니다. 수집된 피드백과 반영 현황을 한눈에 확인해 보세요.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    메인으로 돌아가기
                  </Button>
                </Link>
                <Link href="/notices">
                  <Button size="sm" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    최신 공지 보기
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="border-rose-100 bg-rose-50 text-rose-700">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  베타 사용자 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>가입자</span>
                  <span className="font-semibold text-rose-800">13 / 30</span>
                </div>
                <div>
                  <Progress value={43} className="h-2 bg-rose-100" />
                  <p className="mt-2 text-xs">30명 제한 베타 – 피드백 우선 반영</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 space-y-10">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">핵심 지표</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {summaryMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle className="text-base">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  <p>{metric.description}</p>
                </CardContent>
                <CardFooter className="text-xs text-emerald-600">지난달 대비 {metric.trend}</CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-semibold">사용자 하이라이트</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {highlightFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{feedback.creator}</Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: feedback.score }).map((_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-lg">실사용 후기</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="text-base text-foreground">“{feedback.quote}”</p>
                  <div className="flex flex-wrap gap-2">
                    {feedback.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">개선 요청 진행 상황</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {improvementQueue.map((item) => (
              <Card key={item.id}>
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.status}</Badge>
                    <Badge variant="outline">{item.eta}</Badge>
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.summary}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">피드백 남기기</h2>
          </div>
          <Card>
            <CardContent className="space-y-4 py-6">
              <p className="text-sm text-muted-foreground">
                베타 기간 동안 접수된 의견은 관리자 메일 vocal202065@gmail.com 으로도 전송됩니다. 아래 폼은 곧 직접 제출 기능으로 전환될 예정입니다.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="creator-name">
                    이름 또는 활동명
                  </label>
                  <Input id="creator-name" placeholder="예: 하나 / @creator_hana" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="platform">
                    주요 플랫폼
                  </label>
                  <Input id="platform" placeholder="예: YouTube, Reels" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="feedback-details">
                  피드백 또는 개선 아이디어
                </label>
                <Textarea id="feedback-details" placeholder="피드백 입력 기능은 베타 준비 중입니다." rows={4} disabled />
              </div>
              <Button disabled className="w-full md:w-auto">
                곧 제출 기능 오픈 예정
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
