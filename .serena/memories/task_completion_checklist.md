# 태스크 완료 체크리스트

## 코드 수정 후 반드시 실행
1. **린트 체크**
   ```bash
   npm run lint
   ```

2. **타입 체크**
   - ESLint가 TypeScript 체크 포함
   - 빌드 시 자동 체크됨

3. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```

4. **개발 서버 테스트**
   ```bash
   npm run dev
   ```
   - http://localhost:3000에서 기능 확인

## 데이터베이스 변경 시
1. Prisma 스키마 수정 후:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 배포 전 체크
1. 환경 변수 확인 (.env.local)
2. CHANGELOG.md 업데이트
3. Git 커밋 메시지 명확하게 작성

## 품질 기준
- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 최소화
- [ ] 콘솔 에러 없음
- [ ] 기능 정상 작동
- [ ] 반응형 UI 확인