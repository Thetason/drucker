# 드러커 프로젝트 개발 명령어

## 개발 서버
```bash
npm run dev          # Turbopack을 사용한 개발 서버 시작
```

## 빌드 및 배포
```bash
npm run build        # Prisma 생성 + Next.js 빌드 (Turbopack 사용)
npm run start        # 프로덕션 서버 시작
```

## 코드 품질
```bash
npm run lint         # ESLint 실행 (TypeScript 체크 포함)
```

## 데이터베이스
```bash
npx prisma generate  # Prisma 클라이언트 생성
npx prisma db push   # 스키마를 데이터베이스에 반영
npx prisma studio    # 데이터베이스 GUI 관리 도구
```

## 패키지 관리
```bash
npm install          # 의존성 설치 (자동으로 prisma generate 실행)
```

## Git 명령어
```bash
git status          # 변경사항 확인
git add .           # 모든 변경사항 스테이징
git commit -m "메시지"  # 커밋
git push            # 원격 저장소에 푸시 (Vercel 자동 배포 트리거)
```

## 시스템 명령어 (macOS)
```bash
ls -la              # 파일 목록 보기
find . -name "*.ts" # TypeScript 파일 검색
grep -r "pattern"   # 패턴 검색
```