import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Calendar, CheckCircle2, Sparkles, Layers, ClipboardCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    id: 1,
    title: "페르소나 설정",
    description: "로그인 후 대시보드 상단의 페르소나 섹션을 완성하면 나만의 콘텐츠 방향성을 추천받을 수 있습니다.",
    icon: <Target className="h-6 w-6 text-blue-500" />
  },
  {
    id: 2,
    title: "콘텐츠 기획",
    description: "기획 탭에서 제목·스토리·리텐션 구조를 입력하고 기획서를 저장하세요. 저장 시 제작 스케줄과 자동 연동됩니다.",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />
  },
  {
    id: 3,
    title: "제작 스케줄 관리",
    description: "스케줄 탭에서 기획서를 끌어다 일정에 배치하고 촬영/편집/출고 단계를 체크리스트로 관리합니다.",
    icon: <Calendar className="h-6 w-6 text-emerald-500" />
  }
]

const featureGuides = [
  {
    title: "리텐션 가이드",
    summary: "숏폼/릴스별 핵심 구간과 추천 액션을 제공하여 시청 유지율을 높입니다.",
    action: "공지사항 → 기능 업데이트 로그에서 추가 팁 확인"
  },
  {
    title: "템플릿 라이브러리",
    summary: "검증된 기획 템플릿을 복사해 바로 수정할 수 있습니다.",
    action: "라이브러리 탭에서 ‘추천 템플릿’ 필터 적용"
  },
  {
    title: "팀 협업",
    summary: "기획서 공유 링크를 통해 팀원이 바로 피드백을 남길 수 있습니다.",
    action: "기획서 상단 공유 버튼 → 권한 설정"
  }
]

const faq = [
  {
    question: "데이터는 어디에 저장되나요?",
    answer: "현재 버전은 인증된 사용자별 로컬 저장소와 연결된 DB를 병행 사용합니다. 기획서 저장 시 즉시 DB에 백업됩니다."
  },
  {
    question: "가입 인원 제한을 초과하면 어떻게 되나요?",
    answer: "30명 제한을 초과하면 대기자 목록에 등록되고, 슬롯이 열릴 때 이메일로 순차 안내됩니다."
  },
  {
    question: "지원 채널은 어디인가요?",
    answer: "운영팀은 평일 10:00~18:00(KST) vocal202065@gmail.com 메일로 문의를 받습니다. 장애 긴급 신고는 공지사항의 운영 안내를 참고하세요."
  }
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-purple-600">Product Guide</p>
            <h1 className="mt-2 text-3xl font-bold">드러커 사용안내</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              처음 시작하는 분들도 바로 활용할 수 있도록 핵심 흐름과 기능 설명을 정리했습니다. 아래 단계대로 따라 해보세요.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/">
                <Button size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  메인으로 돌아가기
                </Button>
              </Link>
              <Link href="/library">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  템플릿 살펴보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 space-y-10">
        <section className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.id}>
              <CardHeader className="flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {step.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{step.id}. {step.title}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">주요 기능 활용 팁</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featureGuides.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{feature.summary}</p>
                  <p className="font-medium text-foreground">{feature.action}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item) => (
              <Card key={item.question}>
                <CardHeader>
                  <CardTitle className="text-base">{item.question}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.answer}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
