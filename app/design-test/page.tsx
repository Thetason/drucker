"use client"

import { useState } from "react"
import { ContentPlannerNotion } from "@/components/content-planner-notion"
import { ContentPlannerFramer } from "@/components/content-planner-framer"
import { ContentPlannerFramerV2 } from "@/components/content-planner-framer-v2"

export default function DesignTestPage() {
  const [selectedStyle, setSelectedStyle] = useState<'notion' | 'framer' | 'framer-v2'>('framer-v2')

  return (
    <div className={selectedStyle.includes('framer') ? 'bg-black min-h-screen' : 'bg-gray-50 min-h-screen'}>
      {/* Style Selector */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/10 backdrop-blur-xl p-1 rounded-lg">
        <button
          onClick={() => setSelectedStyle('notion')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            selectedStyle === 'notion' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          Notion Style
        </button>
        <button
          onClick={() => setSelectedStyle('framer')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            selectedStyle === 'framer' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          Framer V1
        </button>
        <button
          onClick={() => setSelectedStyle('framer-v2')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            selectedStyle === 'framer-v2' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          Framer V2
        </button>
      </div>

      {/* Content */}
      <div className="py-12">
        {selectedStyle === 'notion' && <ContentPlannerNotion />}
        {selectedStyle === 'framer' && <ContentPlannerFramer />}
        {selectedStyle === 'framer-v2' && <ContentPlannerFramerV2 />}
      </div>
    </div>
  )
}