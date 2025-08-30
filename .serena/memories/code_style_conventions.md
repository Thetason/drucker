# 드러커 프로젝트 코드 스타일 및 규칙

## TypeScript 규칙
- **Strict Mode**: 비활성화 (eslint.config.mjs에서 완화됨)
- **타입 정의**: 명시적 타입 선호, any 타입 허용
- **인터페이스**: type보다 interface 선호

## React/Next.js 패턴
- **컴포넌트**: 함수형 컴포넌트 사용 (화살표 함수)
- **훅 사용**: useState, useEffect 등 React Hooks 활용
- **파일명**: kebab-case (예: creator-persona.tsx)
- **컴포넌트명**: PascalCase (예: CreatorPersona)

## 스타일링
- **Tailwind CSS**: 인라인 클래스 사용
- **색상 체계**: 
  - Primary: blue-600
  - Success: green-600
  - Warning: yellow-600
  - Error: red-600

## 상태 관리
- **로컬 상태**: useState 사용
- **전역 상태**: localStorage 활용
- **서버 상태**: Prisma + API Routes

## 디렉토리 구조
- 기능별 그룹핑
- 컴포넌트는 /components에 집중
- API 라우트는 /app/api에 위치

## 주석 및 문서화
- 한국어 주석 사용
- 복잡한 로직에만 주석 추가
- README와 CHANGELOG 적극 활용