"use client"

import React, { useState, useEffect } from "react"
import { 
  Sparkles, Zap, TrendingUp, Target, Rocket, Film,
  Play, Pause, FastForward, Clock, Eye, Heart,
  ThumbsUp, MessageCircle, Share2, Bell, Save,
  ChevronRight, ArrowUpRight, Layers, BarChart3,
  MousePointer, Image, Type, Hash, Users, Globe,
  Mic, Camera, Edit3, CheckCircle2, AlertTriangle
} from "lucide-react"

export function ContentPlannerFramerV2() {
  const [activeSection, setActiveSection] = useState('package')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    altTitle: '',
    hook: '',
    target: '',
    duration: '10',
    platform: 'youtube',
    thumbnail: {
      emotion: '',
      contrast: '',
      action: ''
    },
    story: {
      diagnosis: '',
      solution: '',
      result: ''
    },
    retention: {
      sec0: '',
      sec15: '',
      sec45: '',
      sec90: ''
    },
    cta: '',
    dmKeyword: ''
  })

  // Calculate completion
  useEffect(() => {
    const fields = [
      formData.title,
      formData.hook,
      formData.target,
      formData.story.diagnosis,
      formData.story.solution,
      formData.retention.sec15,
      formData.cta
    ]
    const completed = fields.filter(f => f.length > 0).length
    setProgress((completed / fields.length) * 100)
  }, [formData])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }

  const platforms = [
    { id: 'youtube', name: 'YouTube', color: 'from-red-500 to-red-600', icon: <Play /> },
    { id: 'shorts', name: 'Shorts', color: 'from-pink-500 to-rose-600', icon: <Film /> },
    { id: 'reels', name: 'Reels', color: 'from-purple-500 to-indigo-600', icon: <Camera /> }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-60">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Advanced Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Content Studio
                  </h1>
                  <p className="text-gray-400 mt-1">AI-Powered Content Planning</p>
                </div>
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={351.86}
                  strokeDashoffset={351.86 - (351.86 * progress) / 100}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                  <div className="text-xs text-gray-400">완성도</div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="flex gap-3 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setFormData({...formData, platform: platform.id})}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  formData.platform === platform.id
                    ? `bg-gradient-to-r ${platform.color} shadow-lg shadow-white/10`
                    : 'bg-gray-900 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {platform.icon}
                  {platform.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Package & Hook */}
          <div className="col-span-5 space-y-6">
            {/* Title & Thumbnail Card */}
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredCard('package')}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={handleMouseMove}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl blur-2xl transition-opacity duration-300"
                style={{
                  opacity: hoveredCard === 'package' ? 0.8 : 0.4
                }}
              />
              <div 
                className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300"
                style={{
                  transform: hoveredCard === 'package' 
                    ? `perspective(1000px) rotateY(${(mousePosition.x - 0.5) * 5}deg) rotateX(${-(mousePosition.y - 0.5) * 5}deg)`
                    : 'none'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Type className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">패키징 디자인</h3>
                      <p className="text-xs text-gray-400">Title & Thumbnail</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">AI 추천</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">메인 제목</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="99%가 모르는..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                    />
                    {formData.title && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs">
                          CTR 예측: {8 + formData.title.length * 0.1}%
                        </div>
                        <div className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs">
                          {formData.title.length}/100
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">A/B 테스트 제목</label>
                    <input
                      type="text"
                      value={formData.altTitle}
                      onChange={(e) => setFormData({...formData, altTitle: e.target.value})}
                      placeholder="이것만 알면..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Thumbnail Keywords */}
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">썸네일 키워드</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={formData.thumbnail.emotion}
                        onChange={(e) => setFormData({
                          ...formData, 
                          thumbnail: {...formData.thumbnail, emotion: e.target.value}
                        })}
                        placeholder="😱 감정"
                        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.thumbnail.contrast}
                        onChange={(e) => setFormData({
                          ...formData, 
                          thumbnail: {...formData.thumbnail, contrast: e.target.value}
                        })}
                        placeholder="🔄 대조"
                        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.thumbnail.action}
                        onChange={(e) => setFormData({
                          ...formData, 
                          thumbnail: {...formData.thumbnail, action: e.target.value}
                        })}
                        placeholder="🎬 행동"
                        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hook & Target Card */}
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredCard('hook')}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={handleMouseMove}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-2xl blur-2xl transition-opacity duration-300"
                style={{
                  opacity: hoveredCard === 'hook' ? 0.8 : 0.4
                }}
              />
              <div 
                className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300"
                style={{
                  transform: hoveredCard === 'hook' 
                    ? `perspective(1000px) rotateY(${(mousePosition.x - 0.5) * 5}deg) rotateX(${-(mousePosition.y - 0.5) * 5}deg)`
                    : 'none'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">훅 & 타겟</h3>
                    <p className="text-xs text-gray-400">First Impact</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">0-3초 훅</label>
                    <textarea
                      value={formData.hook}
                      onChange={(e) => setFormData({...formData, hook: e.target.value})}
                      placeholder="이거 하나면 끝..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg h-20 resize-none focus:border-blue-500 focus:outline-none transition-all"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">30% 이탈 방지 포인트</span>
                      </div>
                      <span className="text-xs text-blue-400">{formData.hook.length}/50</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">타겟 오디언스</label>
                    <input
                      type="text"
                      value={formData.target}
                      onChange={(e) => setFormData({...formData, target: e.target.value})}
                      placeholder="유튜브를 시작하는 20대"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Story Arc */}
          <div className="col-span-4">
            <div 
              className="relative group h-full"
              onMouseEnter={() => setHoveredCard('story')}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={handleMouseMove}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-2xl blur-2xl transition-opacity duration-300"
                style={{
                  opacity: hoveredCard === 'story' ? 0.8 : 0.4
                }}
              />
              <div 
                className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full transition-all duration-300"
                style={{
                  transform: hoveredCard === 'story' 
                    ? `perspective(1000px) rotateY(${(mousePosition.x - 0.5) * 5}deg) rotateX(${-(mousePosition.y - 0.5) * 5}deg)`
                    : 'none'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">스토리 아크</h3>
                    <p className="text-xs text-gray-400">Emotional Journey</p>
                  </div>
                </div>

                {/* Interactive Graph */}
                <div className="h-40 mb-6 relative">
                  <svg className="w-full h-full">
                    <defs>
                      <linearGradient id="storyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="33%" stopColor="#eab308" />
                        <stop offset="66%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 120 Q 80 20, 150 60 T 300 40 Q 380 10, 460 80"
                      stroke="url(#storyGradient)"
                      strokeWidth="3"
                      fill="none"
                      className="animate-pulse"
                    />
                    {/* Interactive Points */}
                    <circle cx="10" cy="120" r="6" fill="#ef4444" className="animate-pulse">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="60" r="6" fill="#eab308" className="animate-pulse">
                      <animate attributeName="r" values="6;8;6" dur="2s" begin="0.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="300" cy="40" r="6" fill="#22c55e" className="animate-pulse">
                      <animate attributeName="r" values="6;8;6" dur="2s" begin="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="460" cy="80" r="6" fill="#3b82f6" className="animate-pulse">
                      <animate attributeName="r" values="6;8;6" dur="2s" begin="1.5s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="flex justify-between w-full px-2">
                      <span className="text-xs text-red-400">훅</span>
                      <span className="text-xs text-yellow-400">진단</span>
                      <span className="text-xs text-green-400">교정</span>
                      <span className="text-xs text-blue-400">성과</span>
                    </div>
                  </div>
                </div>

                {/* Story Inputs */}
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-xs font-medium text-red-400">진단 (문제 공감)</span>
                    </div>
                    <input
                      value={formData.story.diagnosis}
                      onChange={(e) => setFormData({
                        ...formData,
                        story: {...formData.story, diagnosis: e.target.value}
                      })}
                      placeholder="매번 실패하는 이유는..."
                      className="w-full px-3 py-2 bg-black/30 border border-white/5 rounded text-sm focus:outline-none focus:border-red-500/50"
                    />
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs font-medium text-yellow-400">교정 (해결 방법)</span>
                    </div>
                    <input
                      value={formData.story.solution}
                      onChange={(e) => setFormData({
                        ...formData,
                        story: {...formData.story, solution: e.target.value}
                      })}
                      placeholder="이 3단계만 따라하면..."
                      className="w-full px-3 py-2 bg-black/30 border border-white/5 rounded text-sm focus:outline-none focus:border-yellow-500/50"
                    />
                  </div>

                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs font-medium text-green-400">성과 (결과 증명)</span>
                    </div>
                    <input
                      value={formData.story.result}
                      onChange={(e) => setFormData({
                        ...formData,
                        story: {...formData.story, result: e.target.value}
                      })}
                      placeholder="실제로 100명이 성공..."
                      className="w-full px-3 py-2 bg-black/30 border border-white/5 rounded text-sm focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Retention & Analytics */}
          <div className="col-span-3 space-y-6">
            {/* Retention Timeline */}
            <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">리텐션</h3>
                  <p className="text-xs text-gray-400">Key Moments</p>
                  <p className="text-xs text-gray-500 mt-1">
                    최대 러닝타임 · Shorts 60초 / Reels 90초(최대 3분) / YouTube 12시간
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { time: '0초', key: 'sec0', color: 'red', label: '훅' },
                  { time: '15초', key: 'sec15', color: 'orange', label: '전환' },
                  { time: '45초', key: 'sec45', color: 'yellow', label: '긴장' },
                  { time: '45-60초 (Shorts) · 75-90초 (Reels)', key: 'sec90', color: 'green', label: '가치' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div className={`w-12 text-xs font-medium text-${item.color}-400`}>
                      {item.time}
                    </div>
                    <input
                      value={formData.retention[item.key as keyof typeof formData.retention]}
                      onChange={(e) => setFormData({
                        ...formData,
                        retention: {...formData.retention, [item.key]: e.target.value}
                      })}
                      placeholder={item.label}
                      className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded text-sm focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Analytics */}
            <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">예상 지표</h3>
                  <p className="text-xs text-gray-400">AI Prediction</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">CTR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">12.8%</span>
                    <span className="text-xs text-green-400">+3.2%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">시청지속</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">68%</span>
                    <span className="text-xs text-green-400">+15%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-sm">좋아요율</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">5.2%</span>
                    <span className="text-xs text-green-400">+1.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">CTA</h3>
                  <p className="text-xs text-gray-400">Call to Action</p>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  value={formData.cta}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                  placeholder="📌 무료 체크리스트는 댓글에 'START'"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg h-16 resize-none text-sm focus:outline-none focus:border-green-500/50"
                />
                <div className="flex gap-2">
                  {['START', 'LEARN', 'GET'].map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setFormData({...formData, dmKeyword: keyword})}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        formData.dmKeyword === keyword
                          ? 'bg-green-500 text-black'
                          : 'bg-black/30 border border-white/10 hover:border-green-500/50'
                      }`}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-8 p-6 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-sm">자동 저장됨</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">썸네일 키워드 추가 권장</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl font-medium hover:bg-gray-700 transition-all flex items-center gap-2">
                <Save className="h-4 w-4" />
                저장
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25">
                <Rocket className="h-5 w-5" />
                기획서 생성
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
