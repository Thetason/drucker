"use client"

import React, { useState } from "react"
import { 
  Sparkles, Zap, TrendingUp, Target, Rocket,
  Play, Pause, FastForward, Clock, 
  ThumbsUp, MessageCircle, Share2, Bell,
  ChevronRight, ArrowUpRight, Layers
} from "lucide-react"

export function ContentPlannerFramer() {
  const [activeSection, setActiveSection] = useState('package')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl" />
          <div className="relative">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Content Planner
            </h1>
            <p className="text-gray-400 text-lg">크리에이터를 위한 차세대 기획 도구</p>
          </div>
        </div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Package Card */}
          <div 
            className="relative group"
            onMouseMove={handleMouseMove}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 10 - 5}deg) rotateX(${-mousePosition.y * 10 + 5}deg)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">패키징 디자인</h3>
                    <p className="text-sm text-gray-400">제목과 썸네일</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="메인 제목..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="A/B 테스트 제목..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs">
                    CTR 예측: 8.5%
                  </div>
                  <div className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-xs">
                    트렌드 매칭: 92%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story Arc Card */}
          <div 
            className="relative group"
            onMouseMove={handleMouseMove}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 10 - 5}deg) rotateX(${-mousePosition.y * 10 + 5}deg)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">스토리 아크</h3>
                    <p className="text-sm text-gray-400">감정 곡선 설계</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              
              {/* Animated Graph */}
              <div className="h-32 relative mb-4">
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10 80 Q 50 20, 100 40 T 200 30 Q 250 10, 300 50"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    className="animate-pulse"
                  />
                  <circle cx="10" cy="80" r="4" fill="#3B82F6" className="animate-pulse" />
                  <circle cx="100" cy="40" r="4" fill="#06B6D4" className="animate-pulse" />
                  <circle cx="200" cy="30" r="4" fill="#3B82F6" className="animate-pulse" />
                  <circle cx="300" cy="50" r="4" fill="#06B6D4" className="animate-pulse" />
                </svg>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-red-400 font-medium">진단</div>
                  <div className="text-gray-500">0-30초</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-medium">교정</div>
                  <div className="text-gray-500">30-60초 (Shorts) / 60-90초 (Reels)</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-medium">성과</div>
                  <div className="text-gray-500">60초+ (Reels 확장) · YouTube 최대 12시간</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Retention Timeline */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-2xl" />
          <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              리텐션 타임라인
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              최대 러닝타임 · Shorts 60초 / Reels 90초(최대 3분) / YouTube 12시간
            </p>
            
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full top-6" />
              <div className="flex justify-between relative">
                {[
                  { time: '0초', label: '훅', icon: <Zap />, color: 'from-red-500 to-orange-500' },
                  { time: '15초', label: '전환점', icon: <TrendingUp />, color: 'from-yellow-500 to-amber-500' },
                  { time: '45초', label: '새 정보', icon: <Sparkles />, color: 'from-blue-500 to-cyan-500' },
                  { time: '45-60초 (Shorts) · 75-90초 (Reels)', label: '핵심 가치', icon: <Target />, color: 'from-purple-500 to-pink-500' },
                  { time: '끝', label: 'CTA', icon: <Rocket />, color: 'from-green-500 to-emerald-500' }
                ].map((marker, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${marker.color} rounded-full flex items-center justify-center shadow-lg shadow-white/10`}>
                      {React.cloneElement(marker.icon, { className: 'h-5 w-5' })}
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-sm font-medium">{marker.label}</div>
                      <div className="text-xs text-gray-400">{marker.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-5 gap-3 mt-8">
              {['훅 설정', '첫 전환', '새 정보', '핵심 가치', 'CTA'].map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={item}
                  className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-green-500 focus:outline-none transition-colors"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: '예상 CTR', value: '12.5%', change: '+3.2%', icon: <ThumbsUp /> },
            { label: '예상 시청 지속', value: '68%', change: '+15%', icon: <Clock /> },
            { label: '예상 전환율', value: '4.8%', change: '+1.2%', icon: <TrendingUp /> }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                {React.cloneElement(stat.icon, { className: 'h-4 w-4 text-gray-400' })}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Rocket className="h-5 w-5" />
            기획서 생성
          </button>
          <button className="px-8 py-4 bg-gray-900 border border-white/10 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            공유
          </button>
        </div>
      </div>
    </div>
  )
}
