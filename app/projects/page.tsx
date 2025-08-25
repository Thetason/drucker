"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { StageTracker } from "@/components/stage-tracker"
import { Checklist } from "@/components/checklist"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TrendingUp, Target, Clock, CheckSquare, ChevronLeft } from "lucide-react"
import { Project } from "@/types/database"
import Link from "next/link"

// Mock data for demo
const mockProjects: Project[] = [
  {
    id: "1",
    user_id: "user1",
    title: "뷰티 루틴 릴스",
    description: "아침 스킨케어 루틴 소개",
    status: "editing",
    platform: "instagram",
    created_at: "2025-01-01",
    updated_at: "2025-01-03",
    target_date: "2025-01-10",
    views: 15234,
    likes: 892,
    comments: 45,
    shares: 23
  },
  {
    id: "2",
    user_id: "user1",
    title: "카페 브이로그",
    description: "신상 카페 탐방기",
    status: "shooting",
    platform: "tiktok",
    created_at: "2025-01-02",
    updated_at: "2025-01-03",
    target_date: "2025-01-15"
  },
  {
    id: "3",
    user_id: "user1",
    title: "요리 레시피",
    description: "5분 완성 파스타",
    status: "analyzing",
    platform: "youtube",
    created_at: "2024-12-28",
    updated_at: "2025-01-02",
    views: 52341,
    likes: 3421,
    comments: 234,
    shares: 89
  }
]

const mockChecklist = [
  { id: "1", title: "콘셉트 기획서 작성", is_completed: true },
  { id: "2", title: "촬영 장비 준비", is_completed: true },
  { id: "3", title: "BGM 선정", is_completed: false },
  { id: "4", title: "썸네일 디자인", is_completed: false },
  { id: "5", title: "해시태그 리서치", is_completed: false }
]

export default function ProjectsPage() {
  const [selectedProject] = useState(mockProjects[0])
  const [checklist, setChecklist] = useState(mockChecklist)

  const stats = {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter(p => p.status !== 'completed').length,
    totalViews: mockProjects.reduce((sum, p) => sum + (p.views || 0), 0),
    avgEngagement: Math.round(
      mockProjects.reduce((sum, p) => sum + (p.likes || 0), 0) / 
      mockProjects.filter(p => p.likes).length
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  기획으로
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">프로젝트 관리</h1>
                <span className="text-sm text-muted-foreground">진행 중인 릴스 프로젝트를 관리하세요</span>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 프로젝트
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 프로젝트</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{stats.totalProjects}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>진행중</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.activeProjects}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>총 조회수</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>평균 좋아요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold">{stats.avgEngagement.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Project Detail */}
        {selectedProject && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>현재 작업중인 프로젝트</CardTitle>
              <CardDescription>{selectedProject.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StageTracker 
                currentStage={selectedProject.status as any}
                completedStages={['planning', 'shooting']}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Checklist 
                  items={checklist}
                  onUpdate={setChecklist}
                  editable={true}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">프로젝트 노트</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full h-32 p-3 text-sm border rounded-md resize-none"
                      placeholder="아이디어, 참고사항 등을 자유롭게 작성하세요..."
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">전체 프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                checklistProgress={60}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}