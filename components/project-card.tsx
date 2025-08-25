"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Eye, Heart, MessageCircle, Share2 } from "lucide-react"
import { Project } from "@/types/database"

interface ProjectCardProps {
  project: Project
  checklistProgress?: number
}

const statusLabels = {
  planning: '기획',
  shooting: '촬영',
  editing: '편집',
  uploading: '업로드',
  analyzing: '분석',
  completed: '완료'
}

const platformLabels = {
  instagram: '인스타그램',
  tiktok: '틱톡',
  youtube: '유튜브',
  other: '기타'
}

const statusColors = {
  planning: 'bg-blue-500',
  shooting: 'bg-purple-500',
  editing: 'bg-yellow-500',
  uploading: 'bg-green-500',
  analyzing: 'bg-orange-500',
  completed: 'bg-gray-500'
}

export function ProjectCard({ project, checklistProgress = 0 }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </div>
          <Badge variant="outline">{platformLabels[project.platform]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={statusColors[project.status]}>
            {statusLabels[project.status]}
          </Badge>
          {project.target_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(project.target_date).toLocaleDateString('ko-KR')}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>진행률</span>
            <span>{checklistProgress}%</span>
          </div>
          <Progress value={checklistProgress} />
        </div>

        {(project.views || project.likes) && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            {project.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {project.views.toLocaleString()}
              </div>
            )}
            {project.likes && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {project.likes.toLocaleString()}
              </div>
            )}
            {project.comments && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {project.comments.toLocaleString()}
              </div>
            )}
            {project.shares && (
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                {project.shares.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}