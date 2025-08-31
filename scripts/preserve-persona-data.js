// vocal202065@gmail.com 계정의 페르소나 데이터를 영구 보존하는 스크립트

const PROTECTED_EMAIL = 'vocal202065@gmail.com';
const PERSONA_KEY = `drucker-persona-${PROTECTED_EMAIL}`;

// 보존되어야 할 페르소나 데이터
const PRESERVED_PERSONA_DATA = {
  name: "보컬 마스터",
  whatICanDo: [
    "감정을 담은 노래 부르기",
    "음역대 자유자재로 조절",
    "다양한 장르 소화",
    "보컬 테크닉 전수"
  ],
  whatILove: [
    "노래로 사람들과 소통하기",
    "감정 표현하기",
    "새로운 곡 도전하기",
    "무대 위에서의 순간"
  ],
  whoIHelp: "노래를 사랑하고 실력을 키우고 싶은 모든 사람들",
  howIHelp: "체계적인 보컬 트레이닝과 실전 팁으로 누구나 노래를 잘할 수 있도록 돕습니다",
  creatorType: "보컬 코치",
  whyDoingThis: "음악으로 세상을 더 아름답게 만들고 싶어서",
  contentTopic: [
    "보컬 트레이닝",
    "발성법",
    "호흡법",
    "감정 표현법",
    "무대 퍼포먼스"
  ],
  contentFormat: "shorts",
  expertise: ["음악", "교육", "엔터테인먼트"],
  primaryPlatform: ["YouTube", "Instagram", "TikTok"],
  postingFrequency: "주 3-4회",
  monetizationPlan: ["광고 수익", "온라인 강의", "1:1 레슨"],
  audienceSize: "10만-50만",
  growthStrategy: "consistent",
  targetInterest: [
    "노래방 즐기기",
    "K-POP",
    "보컬 트레이닝",
    "음악 감상"
  ],
  targetPainPoint: [
    "고음이 안 올라감",
    "음정이 불안정함",
    "목이 쉽게 아픔",
    "감정 표현이 어려움"
  ],
  personality: [
    "친근하고 따뜻한",
    "전문적이면서도 이해하기 쉬운",
    "열정적이고 긍정적인"
  ],
  updatedAt: new Date().toISOString()
};

// 데이터 보존 함수
function preservePersonaData() {
  try {
    // 현재 저장된 데이터 확인
    const currentData = localStorage.getItem(PERSONA_KEY);
    
    if (!currentData) {
      // 데이터가 없으면 보존된 데이터 복원
      console.log(`🔄 ${PROTECTED_EMAIL}의 페르소나 데이터 복원 중...`);
      localStorage.setItem(PERSONA_KEY, JSON.stringify(PRESERVED_PERSONA_DATA));
      console.log('✅ 페르소나 데이터가 복원되었습니다.');
      return true;
    }
    
    // 데이터 무결성 검증
    const parsedData = JSON.parse(currentData);
    
    // 중요 필드가 비어있으면 복원
    if (!parsedData.name || !parsedData.whatICanDo || parsedData.whatICanDo.length === 0) {
      console.log('⚠️ 페르소나 데이터가 손상되었습니다. 복원 중...');
      localStorage.setItem(PERSONA_KEY, JSON.stringify(PRESERVED_PERSONA_DATA));
      console.log('✅ 페르소나 데이터가 복원되었습니다.');
      return true;
    }
    
    console.log('✅ 페르소나 데이터가 정상입니다.');
    return true;
    
  } catch (error) {
    console.error('❌ 페르소나 데이터 보존 실패:', error);
    // 오류 발생 시에도 데이터 복원
    localStorage.setItem(PERSONA_KEY, JSON.stringify(PRESERVED_PERSONA_DATA));
    console.log('✅ 페르소나 데이터가 강제 복원되었습니다.');
    return false;
  }
}

// 데이터 백업 함수
function backupPersonaData() {
  const backupKey = `${PERSONA_KEY}-backup-${Date.now()}`;
  const currentData = localStorage.getItem(PERSONA_KEY);
  
  if (currentData) {
    localStorage.setItem(backupKey, currentData);
    console.log('📦 페르소나 데이터 백업 완료:', backupKey);
    
    // 오래된 백업 정리 (최대 5개 유지)
    cleanOldBackups();
  }
}

// 오래된 백업 정리
function cleanOldBackups() {
  const allKeys = Object.keys(localStorage);
  const backupKeys = allKeys.filter(key => key.startsWith(`${PERSONA_KEY}-backup-`));
  
  if (backupKeys.length > 5) {
    // 시간순 정렬
    backupKeys.sort((a, b) => {
      const timeA = parseInt(a.split('-backup-')[1]);
      const timeB = parseInt(b.split('-backup-')[1]);
      return timeB - timeA;
    });
    
    // 오래된 백업 삭제
    for (let i = 5; i < backupKeys.length; i++) {
      localStorage.removeItem(backupKeys[i]);
      console.log('🗑️ 오래된 백업 삭제:', backupKeys[i]);
    }
  }
}

// 자동 실행 (페이지 로드 시)
if (typeof window !== 'undefined') {
  // 즉시 실행
  preservePersonaData();
  
  // 5초마다 데이터 검증
  setInterval(preservePersonaData, 5000);
  
  // 30초마다 백업
  setInterval(backupPersonaData, 30000);
  
  // 페이지 언로드 시 백업
  window.addEventListener('beforeunload', () => {
    backupPersonaData();
  });
  
  console.log(`🛡️ ${PROTECTED_EMAIL} 페르소나 데이터 보호 시스템 활성화`);
}

// 수동 복원 함수 (콘솔에서 사용 가능)
if (typeof window !== 'undefined') {
  window.restorePersona = function() {
    localStorage.setItem(PERSONA_KEY, JSON.stringify(PRESERVED_PERSONA_DATA));
    console.log('✅ 페르소나 데이터가 수동으로 복원되었습니다.');
    window.location.reload();
  };
}

console.log('💡 데이터가 지워졌다면 콘솔에서 restorePersona()를 실행하세요.');

module.exports = { preservePersonaData, PRESERVED_PERSONA_DATA };