// 자동 데이터 복구 스크립트
// 이 스크립트를 브라우저 콘솔에서 실행하면 자동으로 데이터를 복원합니다

(function autoRecover() {
  console.log("🔧 드러커 데이터 자동 복구 시작...");
  
  // 1. 현재 저장된 데이터 확인
  const personaKeys = Object.keys(localStorage).filter(key => key.includes('drucker-persona'));
  const plans = localStorage.getItem('drucker-plans');
  const tasks = localStorage.getItem('drucker-tasks');
  
  let hasData = false;
  
  // 2. 페르소나 데이터 확인 및 복구
  if (personaKeys.length > 0) {
    console.log("✅ 페르소나 데이터 발견!");
    personaKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        console.log(`- ${key}: ${JSON.parse(data).name || '이름 없음'}`);
        hasData = true;
      }
    });
  }
  
  // 3. 기획서 데이터 확인
  if (plans) {
    const plansData = JSON.parse(plans);
    console.log(`✅ 기획서 ${plansData.length}개 발견!`);
    plansData.forEach(plan => {
      console.log(`- ${plan.title}`);
    });
    hasData = true;
  }
  
  // 4. 작업 데이터 확인
  if (tasks) {
    const tasksData = JSON.parse(tasks);
    console.log(`✅ 작업 ${tasksData.length}개 발견!`);
    hasData = true;
  }
  
  // 5. 데이터가 없는 경우 샘플 데이터 생성
  if (!hasData) {
    console.log("⚠️ 저장된 데이터가 없습니다. 샘플 데이터를 생성합니다...");
    
    // 샘플 페르소나 생성
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
    
    // 샘플 기획서 생성
    const samplePlans = [
      {
        id: Date.now().toString(),
        title: "🍜 서울 숨은 맛집 TOP 10 - 현지인만 아는 곳",
        platform: "youtube",
        duration: "15분",
        targetAudience: "20-30대 맛집 매니아",
        hook: "99%가 모르는 서울 토박이 맛집 대공개!",
        mainContent: [
          "충격적인 맛집 리스트 티징",
          "각 맛집별 시그니처 메뉴와 꿀팁",
          "직접 먹어본 솔직 후기"
        ],
        cta: "구독과 좋아요! 댓글로 여러분의 숨은 맛집도 알려주세요",
        keywords: ["서울맛집", "숨은맛집", "맛집추천", "로컬맛집"],
        goal: "조회수 10만회, 구독자 1000명 증가",
        target: "맛집 탐방을 좋아하는 2030",
        updatedAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        title: "✈️ 혼자 떠나는 제주도 3박 4일 완벽 가이드",
        platform: "youtube",
        duration: "20분",
        targetAudience: "혼자 여행을 계획하는 사람들",
        hook: "혼자여도 외롭지 않은 제주 여행의 모든 것!",
        mainContent: [
          "혼자 여행의 장점과 준비물",
          "일정별 추천 코스와 숙소",
          "혼자 가기 좋은 숨은 스팟"
        ],
        cta: "더 많은 여행 팁을 원하시면 구독 꾸욱!",
        keywords: ["제주여행", "혼자여행", "국내여행", "제주도여행코스"],
        goal: "구독자 전환율 10%, 시청 지속률 70%",
        target: "혼자 여행에 관심있는 2030",
        updatedAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 2).toString(),
        title: "📚 하루 10분 독서로 인생이 바뀐 이야기",
        platform: "youtube",
        duration: "10분",
        targetAudience: "자기계발에 관심있는 직장인",
        hook: "딱 10분! 제 인생을 바꾼 독서 습관 공개",
        mainContent: [
          "독서 전후 변화 비교",
          "10분 독서법 구체적 방법",
          "추천 도서 리스트"
        ],
        cta: "여러분도 함께 독서 챌린지 해요! 구독하고 함께해요",
        keywords: ["독서법", "자기계발", "독서습관", "책추천"],
        goal: "댓글 참여율 20%, 저장 수 1000개",
        target: "자기계발 관심있는 2040",
        updatedAt: new Date().toISOString()
      }
    ];
    
    // 현재 로그인한 사용자 확인
    const authData = localStorage.getItem('drucker-auth');
    const userEmail = authData ? JSON.parse(authData).email : 'default@example.com';
    
    // 데이터 저장
    localStorage.setItem(`drucker-persona-${userEmail}`, JSON.stringify(samplePersona));
    localStorage.setItem('drucker-persona', JSON.stringify(samplePersona)); // 백업
    localStorage.setItem('drucker-plans', JSON.stringify(samplePlans));
    
    console.log("✨ 샘플 데이터 생성 완료!");
    console.log("- 페르소나: 김크리에이터");
    console.log("- 기획서 3개 생성");
  }
  
  // 6. 복구 완료 메시지
  console.log("\n🎉 데이터 복구 완료!");
  console.log("페이지를 새로고침하면 복구된 데이터를 확인할 수 있습니다.");
  console.log("새로고침: location.reload()");
  
  // 자동 새로고침 옵션
  const shouldReload = confirm("데이터 복구가 완료되었습니다.\n지금 페이지를 새로고침하시겠습니까?");
  if (shouldReload) {
    location.reload();
  }
})();