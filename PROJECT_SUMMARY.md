# 드러커 (Drucker) - 콘텐츠 기획 & 제작 관리 앱

## 프로젝트 개요
YouTube와 Reels 크리에이터를 위한 콘텐츠 기획 및 제작 관리 앱입니다. 검증된 크리에이터 방법론을 통합하여 체계적인 콘텐츠 제작을 지원합니다.

## 핵심 기능

### 1. 크리에이터 페르소나 (최상위 섹션)
- 4단계 페르소나 설정 마법사
- RPG 스타일 스테이터스 창
- 고도화된 점수 시스템 (5가지 지표):
  - Authenticity (진정성)
  - Market Fit (시장 적합성)
  - Strategy (전략)
  - Growth Potential (성장 잠재력)
  - Sustainability (지속가능성)
- 시너지 효과 계산 시스템

### 2. 콘텐츠 기획서
- 패키징 우선 접근법 (Colin & Samir)
- 픽사 스토리 구조 통합
- 리텐션 마커 설계 (MrBeast)
- 플랫폼별 최적화 (YouTube/Shorts/Reels)

### 3. 제작 스케줄
- 드래그 앤 드롭 캘린더
- 제작 단계별 관리
- 자동 알림 시스템

## 기술 스택
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Build**: Turbopack
- **Data**: LocalStorage (외부 API 없음)
- **Deployment**: Vercel
- **Repository**: https://github.com/Thetason/drucker

## 주요 파일 구조
```
/Users/seoyeongbin/drucker/
├── app/
│   ├── page.tsx                 # 메인 앱 (3개 탭)
│   └── api/ai/route.ts          # AI API 라우트
├── components/
│   ├── creator-persona.tsx      # 페르소나 설정 컴포넌트
│   ├── content-planner.tsx      # 기획서 작성 컴포넌트
│   └── production-schedule-v2.tsx # 제작 스케줄 컴포넌트
└── eslint.config.mjs            # ESLint 설정

```

## 페르소나 점수 계산 로직

### Authenticity Score (진정성)
```typescript
const authenticityScore = () => {
  const loveCount = persona.whatILove?.length || 0
  const skillCount = persona.whatICanDo?.length || 0
  const hasOverlap = loveCount > 0 && skillCount > 0
  const overlapBonus = hasOverlap ? 30 : 0
  
  return Math.min(100, 
    (loveCount * 15) + 
    (skillCount * 10) + 
    overlapBonus
  )
}
```

### Market Fit Score (시장 적합성)
- 타겟 오디언스 구체성
- 트렌드 키워드 포함
- 플랫폼 최적화

### Strategy Score (전략)
- 명확한 목표 설정
- 차별화 포인트
- 수익화 모델

### Growth Potential (성장 잠재력)
- 확장 가능성
- 협업 기회
- 콘텐츠 다양성

### Sustainability (지속가능성)
- 제작 효율성
- 번아웃 방지 메커니즘
- 장기 비전

## 시너지 효과
- 3개 이상 지표가 70점 이상: +10 보너스
- 모든 지표가 60점 이상: +5 보너스
- 특정 조합 시너지: 추가 보너스

## 배포 정보
- **GitHub Repository**: thetason/drucker
- **Vercel URL**: 자동 배포 진행 중
- **Branch**: master

## 최근 수정 사항 (2024-01-26)

### TypeScript 에러 수정
1. **app/api/ai/route.ts**
   - `prompts` 객체에 `Record<string, string>` 타입 추가
   - `fallbacks` 객체에 `Record<string, string>` 타입 추가
   - 인덱스 시그니처 에러 해결

2. **components/content-planner.tsx**
   - `showInspiration` state 변수 추가
   - `savedPlans` state 변수 추가
   - 누락된 필드 추가 (title, targetAudience, hook 등)

3. **eslint.config.mjs**
   - TypeScript strict 규칙 완화
   - 배포를 위한 설정 최적화

## 사용자 피드백 기반 개선 사항
1. "페르소나 정하기를 해야 지속적인 콘텐츠 제작이 가능" → 페르소나를 최상위 섹션으로 이동
2. "진짜 유효한 점수 기록 방식?" → 고도화된 5가지 지표 시스템 구현
3. "RPG 게임 캐릭터 스테이터스 창처럼" → RPG 스타일 UI 구현
4. "페르소나 설정 전까지 락 걸어두는 건 취소" → 락 제거, 추천 알림으로 변경

## 콘텐츠 제작 인사이트
1. 시청자는 크리에이터가 아닌 자신에게 관심 있음
2. 감정이 정보보다 강력함
3. 특정 타겟이 모든 사람보다 효과적
4. 스토리가 통계보다 설득력 있음
5. 간단함이 복잡함을 이김
6. 시각적 요소가 텍스트보다 강력함
7. 일관성이 완벽함보다 중요함
8. 진정성이 연기를 이김
9. 커뮤니티가 조회수보다 가치 있음

## 향후 계획
- [ ] AI 콘텐츠 아이디어 생성 기능 강화
- [ ] 분석 대시보드 추가
- [ ] 팀 협업 기능
- [ ] 모바일 앱 개발