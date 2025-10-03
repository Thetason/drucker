import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, RefreshCcw, AlertTriangle, Info } from "lucide-react"

const scheduledNotices = [
  {
    id: "launch-oct",
    title: "10월 2일 정식 런칭",
    type: "서비스 출시",
    window: "2025-10-02 10:00 ~ 12:00 KST",
    summary: "드러커 정식 서비스가 10월 2일에 오픈됩니다.",
    details: "출시 준비를 위한 최종 점검 동안 로그인과 기획서 저장이 일시적으로 제한됩니다. 진행 중인 작업은 점검 시작 전에 저장해 주세요.",
    status: "예정"
  },
  {
    id: "release-0129",
    title: "v0.9.2 패치 배포",
    type: "기능 업데이트",
    window: "2025-01-29 23:00 ~ 23:15 KST",
    summary: "콘텐츠 리텐션 가이드와 공지 섹션이 추가됩니다.",
    details: "배포 중에는 페이지 새로고침 시 최신 UI가 순차적으로 반영됩니다.",
    status: "완료"
  }
]

const infoNotices = [
  {
    id: "capacity-limit",
    title: "가입 가능 인원 안내",
    description: "현재 드러커는 베타 운영 중으로 전체 가입 인원을 30명으로 제한하고 있습니다. 초과 신청은 대기열에 자동 등록됩니다.",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    tone: "info"
  },
  {
    id: "support-window",
    title: "운영 및 문의 시간",
    description: "평일 10:00~18:00 (KST)에 운영 지원을 제공합니다. 급한 장애 신고는 관리자 메일 support@drucker.app 으로 연락해 주세요.",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    tone: "warning"
  }
]

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-blue-600">Announcements</p>
              <h1 className="mt-2 text-3xl font-bold">공지사항</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                서비스 점검, 기능 업데이트, 이용 제한 정보 등을 실시간으로 공유합니다.
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-600">
              <p className="font-medium">현재 가입자 수</p>
              <p>13 / 30 명 (베타 한정)</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 space-y-10">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">예정된 점검 및 업데이트</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {scheduledNotices.map((notice) => (
              <Card key={notice.id}>
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {notice.type}
                    </Badge>
                    <Badge variant={notice.status === "예정" ? "default" : "outline"}>
                      {notice.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{notice.window}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{notice.summary}</p>
                  <p>{notice.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">운영상 안내</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {infoNotices.map((info) => (
              <Card key={info.id} className={info.tone === "warning" ? "border-amber-200 bg-amber-50" : undefined}>
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                  {info.icon}
                  <div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {info.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
