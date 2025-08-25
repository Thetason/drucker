import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()
    
    // Ollama API 호출
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: generatePrompt(prompt, type),
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Ollama API 호출 실패')
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      result: data.response
    })
  } catch (error) {
    console.error('AI API 에러:', error)
    
    // Ollama가 설치되지 않았거나 실행중이지 않을 때 대체 응답
    return NextResponse.json({
      success: false,
      result: getFallbackResponse(type),
      error: 'AI 서비스가 준비 중입니다. Ollama를 설치하고 실행해주세요.'
    })
  }
}

function generatePrompt(userInput: string, type: string): string {
  const prompts = {
    story: `당신은 픽사의 스토리텔링 전문가입니다. 다음 릴스 아이디어를 픽사 스토리 스파인 구조로 발전시켜주세요:
    
    아이디어: ${userInput}
    
    다음 형식으로 답변해주세요:
    1. 배경 (Once upon a time...): 
    2. 일상 (Every day...): 
    3. 전환점 (Until one day...): 
    4. 결과 (Because of that...): 
    5. 해결 (Until finally...):
    
    각 단계는 15-30초 릴스에 적합하게 간결하게 작성해주세요.`,
    
    idea: `당신은 창의적인 콘텐츠 기획자입니다. "Yes, and..." 방식으로 다음 아이디어를 발전시켜주세요:
    
    원래 아이디어: ${userInput}
    
    3가지 발전된 아이디어를 제시해주세요:
    1. [더 극적으로]: 
    2. [다른 관점에서]: 
    3. [트렌드와 결합]:`,
    
    emotion: `당신은 감정 설계 전문가입니다. 다음 콘텐츠의 감정 흐름을 개선해주세요:
    
    콘텐츠: ${userInput}
    
    15초 릴스 기준으로 감정 포인트를 제안해주세요:
    - 0-3초 (훅): 
    - 4-8초 (빌드업): 
    - 9-12초 (클라이맥스): 
    - 13-15초 (마무리/CTA):`,
    
    rules: `당신은 스토리텔링 컨설턴트입니다. 픽사의 22가지 룰을 기반으로 다음 콘텐츠를 평가하고 개선점을 제시해주세요:
    
    콘텐츠: ${userInput}
    
    평가:
    1. 강점 (잘된 점):
    2. 개선점:
    3. 구체적 개선 제안:`
  }
  
  return prompts[type] || prompts.idea
}

function getFallbackResponse(type: string): string {
  const fallbacks = {
    story: `💡 AI가 준비 중입니다. 수동 템플릿을 참고하세요:
    
    1. 배경: 많은 사람들이 [문제]를 겪고 있습니다
    2. 일상: 매일 [반복되는 상황]
    3. 전환점: 그런데 [새로운 발견/방법]
    4. 결과: 이제 [변화된 모습]
    5. 해결: 당신도 [행동 유도]`,
    
    idea: `✨ 아이디어 발전 팁:
    1. 타겟을 구체화하세요 (20대 → 대학생 → 취준생)
    2. 감정을 추가하세요 (정보 → 공감 → 감동)
    3. 트렌드와 결합하세요 (Y2K, 미니멀, 레트로)`,
    
    emotion: `📈 감정 설계 가이드:
    - 첫 3초: 강력한 비주얼/질문으로 시작
    - 중반: 긴장감 조성 또는 정보 전달
    - 클라이맥스: 놀라움/감동 포인트
    - 마무리: 명확한 CTA`,
    
    rules: `✅ 체크포인트:
    - 첫 3초에 훅이 있나요?
    - 타겟 오디언스가 명확한가요?
    - 감정 변화가 있나요?
    - CTA가 명확한가요?`
  }
  
  return fallbacks[type] || fallbacks.idea
}