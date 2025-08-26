# 드러커 (Drucker) - 콘텐츠 기획 & 제작 관리 앱

크리에이터를 위한 체계적인 콘텐츠 제작 관리 도구입니다.

## 주요 기능

- 🎭 **크리에이터 페르소나**: RPG 스타일의 페르소나 설정
- 📝 **콘텐츠 기획서**: MrBeast, Colin & Samir의 검증된 방법론
- 📅 **제작 스케줄**: 드래그 앤 드롭 일정 관리
- 🔐 **사용자 인증**: 안전한 로그인/회원가입
- 💾 **데이터베이스**: Vercel Postgres 연동

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Vercel Postgres
- **ORM**: Prisma
- **Authentication**: bcrypt
- **Deployment**: Vercel

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/Thetason/drucker.git
cd drucker
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Vercel Postgres (Vercel Dashboard > Storage에서 생성 후 복사)
POSTGRES_PRISMA_URL="your-pooled-database-url"
POSTGRES_URL_NON_POOLING="your-direct-database-url"

# Admin Secret (관리자 페이지용 - 원하는 값으로 설정)
ADMIN_SECRET="your-secret-admin-key"
```

### 4. Vercel Postgres 설정

1. [Vercel Dashboard](https://vercel.com)에서 프로젝트 선택
2. Storage 탭 클릭
3. "Create Database" > "Postgres" 선택
4. 생성된 데이터베이스의 환경 변수를 복사하여 `.env.local`에 붙여넣기

### 5. 데이터베이스 마이그레이션

```bash
npx prisma generate
npx prisma db push
```

### 6. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다.

## 배포

Vercel에 자동 배포됩니다:

1. GitHub에 푸시
2. Vercel이 자동으로 빌드 및 배포
3. 환경 변수는 Vercel Dashboard에서 설정

## 관리자 API

회원 목록 조회:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://your-app.vercel.app/api/admin/users
```

## 프로젝트 구조

```
drucker/
├── app/
│   ├── api/           # API 라우트
│   ├── auth/          # 인증 페이지
│   └── page.tsx       # 메인 페이지
├── components/        # React 컴포넌트
├── lib/              # 유틸리티
├── prisma/           # 데이터베이스 스키마
└── public/           # 정적 파일
```

## 라이선스

MIT License