# 드러커 (Drucker) 프로젝트 개요

## 프로젝트 목적
YouTube와 Reels 크리에이터를 위한 종합 콘텐츠 기획 및 제작 관리 앱. MrBeast, Colin & Samir 등 검증된 크리에이터 방법론을 통합하여 체계적인 콘텐츠 제작을 지원합니다.

## 기술 스택
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Database**: Vercel Postgres (Neon Serverless)
- **ORM**: Prisma 6.14
- **Authentication**: bcryptjs, 쿠키 기반 세션
- **Build Tool**: Turbopack
- **Deployment**: Vercel

## 주요 기능
1. **크리에이터 페르소나**: RPG 스타일 페르소나 설정 (5가지 지표 점수 시스템)
2. **콘텐츠 기획서**: 패키징 우선 접근법, 픽사 스토리 구조
3. **제작 스케줄**: 드래그 앤 드롭 캘린더

## 프로젝트 구조
- `/app`: Next.js 앱 라우터 (pages, API routes)
- `/components`: React 컴포넌트
- `/lib`: 유틸리티 함수
- `/prisma`: 데이터베이스 스키마
- `/types`: TypeScript 타입 정의