# 변경 기록 (Changelog)

## 2025-08-26 (오후)

### 🔐 인증 시스템 구현
- **회원가입/로그인 기능 추가**
  - `/auth` 페이지 생성
  - 이메일/비밀번호 기반 인증
  - bcrypt를 사용한 안전한 비밀번호 암호화

### 💾 데이터베이스 연동
- **Neon Serverless Postgres 연결**
  - Vercel Storage를 통한 Neon 데이터베이스 생성
  - Sydney, Australia 리전 선택 (한국에서 가장 가까운 위치)
  - Prisma ORM 설정 및 스키마 정의
  
- **데이터베이스 모델 생성**
  ```prisma
  - User: 사용자 정보
  - Persona: 크리에이터 페르소나
  - ContentPlan: 콘텐츠 기획서
  - Task: 제작 태스크
  ```

### 🛡️ 미들웨어 구현
- **인증 보호 라우트 설정**
  - 쿠키 기반 세션 관리
  - 로그인하지 않은 사용자는 `/auth`로 리다이렉트
  - 각 사용자별 독립적인 데이터 저장

### 🐛 버그 수정
- **TypeScript 빌드 오류 해결**
  - 콜백 함수 타입 명시 추가
  - 미사용 import 제거
  
- **Vercel 배포 오류 해결**
  - `prisma generate`를 빌드 스크립트에 추가
  - `postinstall` 스크립트 추가
  
- **페르소나 통계 버그 수정**
  - 빈 프로필에서도 점수가 표시되던 문제 해결
  - 페르소나 없을 때 모든 수치 0% 반환하도록 수정

### 🔧 환경 변수 설정
```env
POSTGRES_PRISMA_URL       # Pooled 연결용
POSTGRES_URL_NON_POOLING  # Direct 연결용  
ADMIN_SECRET              # 관리자 API 접근 키
```

### 📦 의존성 추가
- `@prisma/client`: ^6.14.0
- `prisma`: ^6.14.0
- `@vercel/postgres`: ^0.10.0
- `bcryptjs`: ^3.0.2
- `@types/bcryptjs`: ^2.4.6

### 🚀 배포
- Vercel 자동 배포 설정
- 환경 변수 자동 연동
- GitHub 푸시 시 자동 재배포

### 🎨 페르소나 다중 선택 기능 추가
- **복수 선택 가능한 필드들**
  - 전문 분야: 여러 분야 동시 선택 (예: 개발 + 디자인 + 교육)
  - 주력 플랫폼: 멀티 플랫폼 지원 (예: YouTube + Instagram + TikTok)
  - 수익화 계획: 다양한 수익 모델 선택 (예: 광고 + 온라인 강의 + 멘토링)

- **UI/UX 개선사항**
  - 선택된 항목에 파란색/초록색 점 표시
  - "복수 선택 가능" 안내 문구 추가
  - 선택 개수 및 선택된 항목 목록 표시
  - "아직 없음" 선택 시 다른 옵션 자동 비활성화

- **통계 계산 로직 업데이트**
  - 멀티플랫폼 보너스 점수 추가 (플랫폼당 +5점, 최대 10점)
  - 수익 모델 다양성 점수 추가 (모델당 +10점, 최대 20점)
  - 다중 전문성 보너스 추가 (전문 분야당 +15점, 최대 30점)
  - 여러 전문 분야의 콘텐츠 제안 통합

### 🐛 버그 수정 (추가)
- **TypeScript 컴파일 오류 해결**
  - `expertise`, `primaryPlatform`, `monetizationPlan` 필드를 배열 타입으로 변경
  - 배열 인덱싱 에러 수정
  - 타입 비교 오류 해결
  
- **빈 페르소나 점수 버그 수정 (완료)**
  - 페르소나 없을 때 모든 수치 0% 반환
  - 기본 반환값 제거

### 📊 데이터 모델 변경
```typescript
// Before
expertise: string
primaryPlatform: string  
monetizationPlan: string

// After
expertise: string[]        // 복수 선택 가능
primaryPlatform: string[]  // 복수 선택 가능
monetizationPlan: string[] // 복수 선택 가능
```

## 다음 계획
- [ ] 비밀번호 찾기 기능
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 사용자 프로필 편집
- [ ] 팀 협업 기능
- [ ] 페르소나 데이터 DB 저장 기능