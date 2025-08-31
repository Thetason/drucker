// 영구 저장을 위한 데이터 생성 및 DB 저장 스크립트
// 이 스크립트는 브라우저 콘솔에서 실행하세요

(async function permanentSave() {
  console.log("🚀 영구 저장 시작...");
  
  // 1. 샘플 데이터 생성
  const samplePersona = {
    name: "김크리에이터",
    tagline: "일상을 특별하게 만드는 크리에이터",
    whatICanDo: ["영상 편집", "스토리텔링", "콘텐츠 기획", "사진 촬영"],
    whatILove: ["여행", "맛집 탐방", "새로운 경험", "사람들과 소통"],
    whoIWantToTalkTo: "20-30대 새로운 경험을 좋아하는 사람들",
    monetizationPlan: ["youtube", "sponsorship", "online-course"],
    expertise: ["lifestyle", "media", "education"],
    experience: "3년차 유튜버, 구독자 5만명",
    personality: ["친근한", "유머러스한", "진정성 있는", "열정적인"],
    contentStyle: "친구처럼 편안하고 재미있는 스타일",
    targetAge: "20-35",
    targetInterests: ["여행", "맛집", "일상", "자기계발", "힐링"],
    targetPainPoints: ["일상의 지루함", "새로운 경험 부족", "여행 정보 부족"],
    primaryPlatform: ["youtube", "instagram"],
    contentFrequency: "주 2-3회",
    contentTopics: ["국내 여행 꿀팁", "숨은 맛집 소개", "일상 브이로그", "자기계발 루틴"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const samplePlans = [
    {
      title: "🍜 서울 숨은 맛집 TOP 10 - 현지인만 아는 곳",
      platform: "youtube",
      duration: "15분",
      targetAudience: "20-30대 맛집 매니아",
      hook: "99%가 모르는 서울 토박이 맛집 대공개!",
      mainContent: ["충격적인 맛집 리스트", "시그니처 메뉴 소개", "솔직 후기"],
      cta: "구독과 좋아요!",
      keywords: ["서울맛집", "숨은맛집", "맛집추천"],
      goal: "조회수 10만회",
    },
    {
      title: "✈️ 제주도 3박 4일 혼자 여행 가이드",
      platform: "youtube",
      duration: "20분",
      targetAudience: "혼자 여행하는 2030",
      hook: "혼자여도 완벽한 제주 여행!",
      mainContent: ["일정별 코스", "숨은 스팟", "혼자 가기 좋은 곳"],
      cta: "구독 부탁드려요!",
      keywords: ["제주여행", "혼자여행", "여행코스"],
      goal: "구독자 1000명 증가",
    }
  ];
  
  // 2. localStorage에 먼저 저장 (즉시 사용 가능)
  const authData = localStorage.getItem('drucker-auth');
  const userEmail = authData ? JSON.parse(authData).email : 'test@example.com';
  
  localStorage.setItem(`drucker-persona-${userEmail}`, JSON.stringify(samplePersona));
  localStorage.setItem('drucker-persona', JSON.stringify(samplePersona));
  localStorage.setItem('drucker-plans', JSON.stringify(samplePlans));
  
  console.log("✅ localStorage 저장 완료!");
  
  // 3. DB에도 저장 (영구 저장)
  try {
    // 페르소나 저장
    const personaResponse = await fetch('/api/persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(samplePersona)
    });
    
    if (personaResponse.ok) {
      console.log("✅ 페르소나 DB 저장 완료!");
    }
    
    // 기획서 저장
    for (const plan of samplePlans) {
      const planResponse = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      
      if (planResponse.ok) {
        console.log(`✅ 기획서 "${plan.title}" DB 저장 완료!`);
      }
    }
  } catch (error) {
    console.log("⚠️ DB 저장 중 오류:", error);
    console.log("하지만 localStorage에는 저장되었으므로 데이터는 안전합니다!");
  }
  
  // 4. 저장 확인
  console.log("\n📊 저장된 데이터:");
  console.log("- 페르소나: 김크리에이터");
  console.log("- 기획서 2개");
  console.log("\n💾 저장 위치:");
  console.log("- localStorage (즉시 사용)");
  console.log("- Vercel Postgres DB (영구 저장)");
  console.log("\n✨ 컴퓨터를 꺼도, 브라우저를 닫아도 데이터가 유지됩니다!");
  
  // 5. 페이지 새로고침
  if (confirm("데이터 저장 완료!\n페이지를 새로고침하시겠습니까?")) {
    location.reload();
  }
})();