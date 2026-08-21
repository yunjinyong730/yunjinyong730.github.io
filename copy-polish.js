(() => {
  "use strict";

  const answerCopy = [
    {
      test: /ABOUT/i,
      kicker: "ABOUT · RESEARCH TO SYSTEMS",
      heading: "연구를 설계하고,<br><span>실제 환경에서 작동하는 시스템으로 구현합니다.</span>",
      lead: "Sensor Calibration · Anomaly Detection · Model Compression을 중심으로 연구하며, 모델 성능뿐 아니라 latency, memory, runtime resource 같은 실제 배포 제약을 함께 고려합니다. 논문 연구부터 TFLite/Raspberry Pi 기반 Edge deployment, iOS·Android 제품 구현까지 연결해 온 경험이 강점입니다.",
      after(doc) {
        const panels = [...doc.querySelectorAll(".answer-panel")];
        if (panels[1]?.querySelector("p")) panels[1].querySelector("p").textContent = "모델 성능과 함께 latency, memory, runtime resource 같은 실제 배포 제약을 평가합니다.";
        if (panels[2]?.querySelector("p")) panels[2].querySelector("p").textContent = "Swift/UIKit, Kotlin/Android, WebRTC를 활용해 사용자가 실제로 쓰는 제품과 실시간 협업 시스템을 구현했습니다.";
      },
    },
    {
      test: /RESUME/i,
      heading: "Research → Edge → Product,<br><span>한 흐름으로 이어진 경험.</span>",
      after(doc) {
        const p = doc.querySelector(".resume-identity-copy p");
        if (p) p.textContent = "Sensor Calibration · Model Compression · On-Device AI를 연구하며 논문, 모델 구현, 실제 장치 평가까지 수행했습니다. 동시에 모바일 앱과 산업용 협업 시스템을 개발·출시한 경험을 바탕으로 연구 결과를 실제 사용 환경과 연결합니다.";
      },
    },
    {
      test: /EXPERIENCE|CAREER/i,
      heading: "제품 개발에서 AI 연구로,<br><span>그리고 Edge deployment까지 이어졌습니다.</span>",
    },
    {
      test: /^RESEARCH ·/i,
      heading: "정확도만이 아니라<br><span>배포 조건까지 함께 연구합니다.</span>",
      lead: "핵심 연구축은 Sensor Calibration, Model Compression, On-Device AI, Anomaly Detection, Time-Series Analysis, Autonomous Perception입니다. accuracy만 비교하지 않고 latency, memory, runtime resource를 실제 배포 조건으로 함께 평가합니다.",
    },
    {
      test: /PUBLICATIONS/i,
      kicker: "PUBLICATIONS · SELECTED + CURRENT MANUSCRIPTS",
      heading: "Sensor Calibration을 중심으로,<br><span>On-Device AI와 LLM 응용까지 확장합니다.</span>",
      lead: "Selected publications와 현재 진행 중인 manuscript를 원문 PDF에 연결했습니다. 각 카드에서 연구 주제와 기여를 확인하고 PDF 원문을 바로 열어볼 수 있습니다.",
    },
    {
      test: /^SELECTED AI PROJECTS/i,
      heading: "모델을 만들고 끝내지 않고,<br><span>평가와 배포까지 이어지는 파이프라인으로 구현합니다.</span>",
      lead: "각 프로젝트는 문제 정의, 모델 설계, 평가 지표, Edge deployment를 함께 보여줍니다. 카드를 열면 GitHub 구현과 상세 결과를 바로 확인할 수 있습니다.",
    },
    {
      test: /PROJECT · REAL-TIME SENSOR AI/i,
      heading: "보정된 센서 신호를<br><span>실시간 모니터링까지 연결합니다.</span>",
    },
    {
      test: /PROJECT · CAMERA–LIDAR/i,
      heading: "Camera–LiDAR calibration drift에서<br><span>6DoF 복구값과 confidence를 추정합니다.</span>",
    },
    {
      test: /PROJECT · CAMERA CALIBRATION/i,
      heading: "Camera calibration drift를 감지하고,<br><span>영상 정합을 자동 복구합니다.</span>",
    },
    {
      test: /PROJECT · MODEL COMPRESSION/i,
      heading: "Teacher 모델의 지식을<br><span>더 작은 Edge 모델로 전달합니다.</span>",
    },
    {
      test: /APPLICATION DEVELOPMENT/i,
      heading: "제품 개발 경험에서도,<br><span>사용자가 실제로 쓰는 소프트웨어를 구현하고 출시했습니다.</span>",
      lead: "머니뭐니와 어디여는 App Store에 출시한 iOS 앱이며, RealWear 프로젝트에서는 산업 현장 원격 협업을 위한 Android/WebRTC 기능을 구현했습니다. 각 카드에서 역할과 공개 구현 자료를 함께 확인할 수 있습니다.",
    },
    {
      test: /FUNDED RESEARCH PROJECTS/i,
      heading: "연구 아이디어를<br><span>장기 과제로 확장해 수행합니다.</span>",
    },
    {
      test: /SKILLS · EDUCATION/i,
      heading: "모델 연구부터<br><span>Edge deployment와 Application까지.</span>",
    },
    {
      test: /AWARDS · CERTIFICATIONS/i,
      heading: "연구·개발 경험을 뒷받침하는<br><span>성과와 자격을 정리했습니다.</span>",
    },
    {
      test: /^CONTACT$/i,
      heading: "연구와 구현을 연결하는 일에 대해<br><span>함께 이야기하고 싶다면.</span>",
      lead: "공개 연락처와 GitHub를 아래에 정리했습니다.",
    },
    {
      test: /PORTFOLIO GUIDE/i,
      heading: "관심 있는 주제를 골라<br><span>연구와 구현의 흐름을 확인해보세요.</span>",
    },
  ];

  const tourCopy = [
    {
      test: /^01 ·/,
      kicker: "01 · 30-SECOND RECRUITER BRIEF",
      heading: "연구를 <span>실제 시스템으로 연결합니다.</span>",
      copy: "Sensor Calibration · Model Compression · On-Device AI를 연구하고, 모델 평가부터 Edge deployment와 Application 출시까지 구현 경험으로 연결해 왔습니다.",
      speech: "30초 동안 연구, 구현, 배포, 제품 경험 순서로 핵심만 보여줄게.",
    },
    {
      test: /^02 ·/,
      kicker: "02 · RESEARCH WITH CONSTRAINTS",
      heading: "정확도뿐 아니라 <span>배포 조건까지 함께 봅니다.</span>",
      copy: "센서 보정, drift adaptation, 이상 탐지, 시계열 분석을 연구하면서 accuracy와 함께 latency · memory · runtime resource를 실제 배포 제약으로 평가합니다.",
      speech: "연구 단계부터 latency, memory, runtime resource 같은 실제 제약을 같이 봐.",
    },
    {
      test: /^03 ·/,
      kicker: "03 · EDGE DEPLOYMENT",
      heading: "연구 결과를 <span>Edge 환경에서 검증합니다.</span>",
      copy: "Camera–LiDAR 6DoF calibration recovery, camera homography recovery, Knowledge Distillation을 TFLite · INT8 · Raspberry Pi 기반 배포와 benchmark까지 연결했습니다.",
      speech: "프로젝트마다 모델 성능뿐 아니라 TFLite, INT8, Raspberry Pi 같은 실제 배포 경로까지 연결돼 있어.",
    },
    {
      test: /^04 ·/,
      kicker: "04 · PRODUCT DELIVERY",
      heading: "제품은 <span>실제 사용자에게 출시했습니다.</span>",
      copy: "Swift/UIKit 기반 iOS 앱 2종을 App Store에 출시했고, Kotlin/Android · WebRTC · WebSocket 기반 산업용 원격 협업 시스템도 구현했습니다.",
      speech: "iOS 앱은 App Store에 출시했고, Android/WebRTC 기반 산업용 협업 시스템도 구현했어.",
    },
    {
      test: /^05 ·/,
      kicker: "05 · VERIFIABLE RESULTS",
      heading: "논문부터 구현·출시까지,<br><span>결과물로 확인할 수 있습니다.</span>",
      copy: "논문 PDF, GitHub 구현, App Store 출시, 연구과제와 수상 이력을 서로 연결했습니다. 각 항목에서 설명보다 실제 결과물과 근거를 먼저 확인할 수 있습니다.",
      speech: "마지막은 결과물이야. 연구가 논문, 코드, 배포와 출시로 어떻게 이어졌는지 직접 확인해봐.",
    },
  ];

  const exactText = new Map([
    ["먼저 윤진용이 어떤 엔지니어인지 큰 그림부터 보여줄게. 연구와 실제 시스템 사이의 연결을 중심으로 보면 돼.", "연구 주제만 보기보다, 그 연구를 어디까지 구현했는지 함께 보면 좋아. 문제 정의부터 배포·제품 경험까지 한 흐름으로 안내할게."],
    ["이력 전체를 빠르게 훑을 수 있게 핵심 수치와 경험을 먼저 묶었어. 관심 있는 항목은 바로 더 깊게 들어갈 수 있어.", "핵심 이력을 연구, 구현, 배포, 제품 경험 순서로 묶어뒀어. 관심 있는 지점부터 더 깊게 들어가면 돼."],
    ["경력을 시간순 목록으로만 보지 말고, Product 개발 경험이 AI 연구와 Edge deployment로 이어진 흐름으로 봐줘.", "제품 개발 경험이 AI 연구로 이어지고, 다시 Edge deployment로 확장된 흐름을 보면 좋아."],
    ["논문은 주제와 기여 포인트가 한눈에 보이도록 정리했어. Sensor Calibration부터 On-Device AI까지 연구 폭을 확인해봐.", "논문은 제목보다 어떤 문제를 정의했고 어떤 제약을 다뤘는지 함께 봐줘. 원문 PDF도 바로 확인할 수 있어."],
    ["여기서는 연구 아이디어가 실제 과제로 어떻게 이어졌는지 보여줄게. 수행 주제와 연결된 구현도 함께 보면 좋아.", "연구 아이디어가 실제 funded project로 어떻게 확장됐는지 보여줄게. 수행 주제와 연결된 구현도 함께 보면 좋아."],
    ["이 부분은 구현 중심이야. 문제 정의에서 모델, 지표, Edge 배포까지 실제로 동작하게 만든 과정을 따라가면 돼.", "여기서는 모델 자체보다 구현 과정을 봐줘. 입력, 평가 지표, 복구 성능, Edge deployment까지 연결돼 있어."],
    ["AI 연구만이 아니라 실제 사용자가 설치하고 쓰는 제품까지 만든 경험이야. 개발 역할과 출시 결과를 같이 확인해봐.", "제품 경험은 실제 사용자와 운영 조건을 고려해 구현한 기록이야. 개발 역할과 출시 결과를 함께 확인해봐."],
    ["기술 스택은 나열보다 어디에 사용했는지가 중요해. 연구, Edge, Product 경험과 연결해서 보여줄게.", "기술 스택은 나열보다 사용 맥락이 중요해. 연구, Edge, Product에서 어디에 썼는지 연결해서 보여줄게."],
    ["수상과 자격은 연구·개발 경험을 보완하는 신호로 정리했어. 핵심 성과만 빠르게 확인하면 돼.", "수상과 자격은 연구·개발 경험을 뒷받침하는 기록이야. 어떤 경험과 연결되는지 함께 보면 좋아."],
    ["더 이야기하고 싶다면 여기서 바로 연결할 수 있어. 공개 연락처와 GitHub만 간결하게 모아뒀어.", "연락이 필요하다면 여기서 바로 확인할 수 있어. 공개 이메일과 GitHub만 정리해뒀어."],
    ["연구의 핵심은 정확도만 높이는 게 아니라 실제 배포 조건까지 문제 정의에 넣는 거야. 그 관점으로 소개할게.", "핵심은 accuracy만 높이는 게 아니라 latency와 resource constraints까지 실제 배포 조건으로 함께 다루는 거야."],
    ["윤진용이 어떤 AI/ML Engineer인지 핵심부터 정리해볼게.", "연구가 실제 시스템으로 이어지는 흐름부터 핵심만 정리해볼게."],
    ["전체 이력을 한눈에 볼 수 있게 요약해서 안내할게.", "연구, 구현, 배포, 제품 경험 순서로 이력을 빠르게 정리해볼게."],
    ["연구와 제품 개발 경험이 어떻게 이어지는지 흐름으로 보여줄게.", "제품 개발에서 AI 연구와 Edge deployment로 이어진 흐름을 보여줄게."],
    ["핵심 연구축과 실제 배포 관점을 중심으로 설명할게.", "핵심 연구축과 실제 배포 제약을 함께 설명할게."],
    ["선정 논문과 각 연구의 핵심 기여를 보여줄게.", "Selected publications와 manuscript의 핵심 문제와 기여를 보여줄게."],
    ["대표 AI 프로젝트의 구현과 결과를 중심으로 안내할게.", "대표 프로젝트의 구현, 평가 지표, 배포 결과를 중심으로 안내할게."],
    ["출시한 앱과 실제 제품 개발 경험을 보여줄게.", "출시한 앱과 산업용 제품 개발 경험을 역할과 결과 중심으로 보여줄게."],
    ["수행한 연구과제와 연결된 연구 주제를 안내할게.", "수행한 연구과제와 각 과제가 다루는 문제를 연결해서 보여줄게."],
    ["기술 스택을 실제 사용 경험과 연결해서 보여줄게.", "기술 스택을 연구·Edge·Product의 실제 사용 맥락과 연결해서 보여줄게."],
    ["수상, 자격, 영어 역량을 핵심만 정리해볼게.", "연구·개발 경험을 뒷받침하는 수상, 자격, 영어 역량을 정리해볼게."],
    ["연락 가능한 채널을 바로 안내할게.", "공개 이메일과 GitHub를 바로 안내할게."],
    ["이 내용에서 중요한 포인트부터 짚어줄게. 세부 자료는 아래 카드와 링크에서 바로 이어서 확인할 수 있어.", "핵심 포인트부터 짚어줄게. 세부 구현과 원문 자료는 아래 카드와 링크에서 바로 확인할 수 있어."],
    ["질문에서 가장 관련 있는 경험과 결과를 골라서 정리하고 있어.", "질문과 가장 관련 있는 연구, 구현, 결과를 골라서 정리하고 있어."],

    ["안녕! 궁금한 걸 물어봐.", "안녕! 연구와 프로젝트를 같이 볼까?"],
    ["논문이나 프로젝트를 보여줄까?", "논문부터 볼까, 구현 프로젝트부터 볼까?"],
    ["출시한 앱도 바로 찾아줄 수 있어!", "출시 앱과 연구과제도 바로 안내할 수 있어."],
    ["AI 연구부터 제품 경험까지 안내할게.", "연구가 실제 시스템으로 이어진 흐름을 보여줄게."],
    ["무엇부터 볼까? 논문, 프로젝트, 앱?", "어디부터 볼까? Research, Projects, Career?"],
    ["나를 누르면 바로 포트폴리오를 안내할게!", "나를 누르면 전체 포트폴리오부터 안내할게."],
    ["궁금한 주제를 아래에서 골라도 좋아.", "아래 메뉴에서 관심 있는 주제를 골라도 좋아."],
    ["좋아! 윤진용의 포트폴리오를 같이 볼까?", "좋아. 연구부터 실제 구현까지 한 번에 정리해볼게."],
    ["바로 안내할게. 어떤 내용이 궁금해?", "바로 시작할게. 어떤 경험부터 볼까?"],

    ["30초 안에 핵심만 보여줄게. 연구만 한 사람이 아니라 실제 제품까지 연결해.", "30초 동안 연구, 구현, 배포, 제품 경험 순서로 핵심만 보여줄게."],
    ["논문 수치만 보지 않고, 실제 장치에서 돌아가는 조건까지 같이 평가해.", "연구 단계부터 latency, memory, runtime resource 같은 실제 제약을 같이 봐."],
    ["여기가 엔지니어링 포인트야. 연구 결과를 TFLite와 Raspberry Pi까지 내려보냈어.", "프로젝트마다 모델 성능뿐 아니라 TFLite, INT8, Raspberry Pi 같은 실제 배포 경로까지 연결돼 있어."],
    ["모델 데모에서 끝나지 않고, 실제 사용자가 설치하는 앱도 출시했어.", "iOS 앱은 App Store에 출시했고, Android/WebRTC 기반 산업용 협업 시스템도 구현했어."],
    ["마지막은 결과물이야. 논문, 구현, 출시 이력을 한곳에서 바로 확인할 수 있어.", "마지막은 결과물이야. 연구가 논문, 코드, 배포와 출시로 어떻게 이어졌는지 직접 확인해봐."],

    ["RealWear 원격 협업 시스템과 iOS 제품 개발을 통해 사용자-facing software와 실시간 통신 경험을 쌓았습니다. 이후 AI 연구를 실제 제품으로 연결하는 기반이 됐습니다.", "RealWear 원격 협업 시스템과 iOS 제품을 개발하며 사용자 대상 소프트웨어와 실시간 통신 시스템을 구현했습니다. 이 경험은 이후 AI 연구에서도 실제 사용 환경과 시스템 제약을 함께 고려하는 기반이 됐습니다."],
    ["인하대학교 지식기반데이터분석 연구실에서 센서 보정과 시계열 모델링 연구를 시작했고, KIIT 2024 우수논문상 금상 연구로 이어졌습니다.", "인하대학교 지식기반데이터분석 연구실에서 센서 보정과 시계열 모델링 연구를 시작했고, 해당 연구는 KIIT 2024 우수논문상 금상으로 이어졌습니다."],
    ["Knowledge Distillation, Camera drift recovery, Camera–LiDAR 6DoF calibration recovery를 실제 Edge export와 deployment-aware benchmark로 확장했습니다.", "Knowledge Distillation, Camera drift recovery, Camera–LiDAR 6DoF calibration recovery를 TFLite/INT8 export와 Raspberry Pi benchmark까지 확장했습니다."],
    ["JOK/KSC/KCC/SAC selected publications, funded research, GitHub 구현 결과를 통해 Research-to-System 흐름을 결과 중심으로 정리하고 있습니다.", "JOK/KSC/KCC/SAC 논문, funded research, GitHub 구현 결과를 통해 연구가 실제 결과물로 이어지는 흐름을 정리했습니다."],
    ["Research → Proof", "Research → Results"],
    ["OUTPUT / PROOF", "VERIFIABLE RESULTS"],
    ["제품 개발 경험에서 시작해서, AI 연구와 Edge deployment로 이어진 경력 흐름을 보여줄게.", "제품 개발에서 AI 연구로, 다시 Edge deployment로 확장된 경력 흐름을 보여줄게."],

    ["Recruiter? 30초 핵심 투어", "Recruiter? 30초 포트폴리오 브리프"],
    ["30-sec Recruiter Tour", "30-sec Recruiter Brief"],
    ["Job Match Analyzer", "JD Match"],
    ["Interactive Career Graph", "Career Flow"],
    ["Career Graph", "Career Flow"],
    ["Recruiter tools", "Recruiter view"],
    ["30-sec Recruiter Mode", "30-sec Recruiter Brief"],
    ["AUTOMATIC RECRUITER TOUR", "RESEARCH → BUILD → DEPLOY → PRODUCT"],
    ["LOCAL · PRIVATE · PORTFOLIO SIGNALS ONLY", "LOCAL · PRIVATE · PORTFOLIO-BASED"],
    ["PRODUCT → RESEARCH → EDGE → OUTPUT", "PRODUCT → RESEARCH → EDGE → RESULTS"],

    ["채용공고(JD)를 붙여넣어 보세요", "채용공고(JD)를 붙여 넣어보세요"],
    ["브라우저 안에서 공개 포트폴리오의 기술 근거와 키워드를 비교합니다. 외부 API로 전송하지 않습니다.", "입력한 JD와 공개 포트폴리오에 명시된 기술·경험을 브라우저에서 비교합니다. 입력 내용은 외부 API로 전송하지 않습니다."],
    ["HEURISTIC MATCH ≠ ATS SCORE · 공개 포트폴리오에 보이는 근거만 사용합니다.", "HEURISTIC MATCH ≠ ATS SCORE · 공개된 포트폴리오 근거만 비교합니다."],
    ["Portfolio fit signal", "Portfolio fit"],
    ["JD를 입력하면 AI/Research · Edge/Deploy · Perception · Product/Engineering 관점에서 일치 근거와 현재 포트폴리오에서 확인되지 않는 요구사항을 분리해서 보여줍니다.", "JD를 입력하면 AI/Research · Edge/Deploy · Perception · Product/Engineering 관점에서 직접 확인되는 요구사항과 현재 포트폴리오에서 근거를 찾지 못한 요구사항을 나눠 보여줍니다."],
    ["분석할 기술 요구사항을 충분히 찾지 못했습니다. JD의 기술 스택이나 업무 요건을 조금 더 포함해 주세요.", "기술 요구사항을 충분히 인식하지 못했습니다. 역할 설명과 기술 스택을 조금 더 포함해 주세요."],
    ["인식된 JD 기술 키워드 중 현재 공개 포트폴리오에서 직접 확인되는 비율입니다.", "인식된 기술 요구사항 중 현재 공개 포트폴리오에서 직접 확인 가능한 항목의 비율입니다."],
    ["No detected gaps", "현재 포트폴리오에서 확인되지 않은 항목 없음"],
    ["MATCHED PORTFOLIO SIGNALS", "DIRECTLY MATCHED IN PORTFOLIO"],
    ["NOT DIRECTLY SHOWN IN CURRENT PORTFOLIO", "NOT DIRECTLY SHOWN IN PORTFOLIO"],
    ["채용공고를 붙여 넣으면, 내 포트폴리오에서 직접 확인되는 기술만 골라서 비교해줄게.", "채용공고를 붙여 넣으면 공개 포트폴리오에서 직접 확인되는 기술과 경험만 골라서 비교해줄게."],

    ["Resume의 selected publications와 최신 manuscript를 실제 원문 PDF에 연결했습니다. 각 카드의 PDF 보기 버튼을 누르면 새 탭에서 Google Drive 원문이 열립니다.", "Selected publications와 현재 진행 중인 manuscript를 원문 PDF에 연결했습니다. 각 카드에서 연구 주제와 기여를 확인하고 PDF 원문을 바로 열어볼 수 있습니다."],
    ["PUBLICATIONS · 7 PDFs LINKED", "PUBLICATIONS · SELECTED + CURRENT MANUSCRIPTS"],
    ["Papers + PDF", "Papers + PDFs"],
    ["GitHub evidence:", "공개 근거:"],
  ]);

  function setText(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function setHTML(element, value) {
    if (element && element.innerHTML !== value) element.innerHTML = value;
  }

  function polishAnswer(doc) {
    const kickerEl = doc.querySelector(".answer-kicker");
    const kicker = kickerEl?.textContent?.trim() || "";
    const config = answerCopy.find((item) => item.test.test(kicker));
    if (!config) return;
    if (config.kicker) setText(kickerEl, config.kicker);
    if (config.heading) setHTML(doc.querySelector("h2"), config.heading);
    if (config.lead) setText(doc.querySelector(".answer-lead"), config.lead);
    config.after?.(doc);
  }

  function polishTour(card) {
    const kickerEl = card.querySelector(".rs-kicker");
    const kicker = kickerEl?.textContent?.trim() || "";
    const config = tourCopy.find((item) => item.test.test(kicker));
    if (!config) return;
    setText(kickerEl, config.kicker);
    setHTML(card.querySelector("h2"), config.heading);
    setText(card.querySelector(".rs-tour-copy"), config.copy);
    setText(card.querySelector(".rs-neon-line span"), config.speech);
  }

  function polishCareer(root) {
    const title = root.querySelector?.(".rs-section-title");
    if (title && /경력이 따로 떨어진 점이 아니라|제품 개발에서 연구로/.test(title.textContent)) {
      setHTML(title, "제품 개발에서 AI 연구로,<br><span style=\"color:#929aaa\">연구에서 Edge deployment로 이어졌습니다.</span>");
    }
    const intro = root.querySelector?.(".rs-career-intro");
    if (intro) setText(intro, "각 노드를 클릭하면 이전 경험이 다음 단계의 연구와 구현에 어떻게 연결됐는지 확인할 수 있습니다.");
  }

  function rewriteTextNode(node) {
    if (!(node instanceof Text)) return;
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style")) return;
    const raw = node.nodeValue || "";
    const trimmed = raw.trim();
    const replacement = exactText.get(trimmed);
    if (!replacement || replacement === trimmed) return;
    const leading = raw.match(/^\s*/)?.[0] || "";
    const trailing = raw.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${replacement}${trailing}`;
  }

  function rewriteText(root) {
    if (root instanceof Text) {
      rewriteTextNode(root);
      return;
    }
    if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) rewriteTextNode(node);
  }

  function polishStatic() {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = "윤진용 · AI/ML Engineer — Sensor Calibration, Edge AI, Autonomous Perception. 연구를 실제 환경에서 작동하는 시스템으로 구현하는 포트폴리오.";

    const landingInput = document.querySelector("#landingInput");
    if (landingInput) landingInput.placeholder = "윤진용의 연구와 프로젝트를 보여줘";
    const chatInput = document.querySelector("#chatInput");
    if (chatInput) chatInput.placeholder = "연구, 논문, 프로젝트, 출시 앱을 물어보세요";
  }

  function polish(root = document) {
    polishStatic();

    if (root instanceof Element && root.matches(".answer-document")) polishAnswer(root);
    root.querySelectorAll?.(".answer-document").forEach(polishAnswer);

    if (root instanceof Element && root.matches(".rs-tour-card")) polishTour(root);
    root.querySelectorAll?.(".rs-tour-card").forEach(polishTour);

    polishCareer(root instanceof Element || root instanceof Document ? root : document);
    rewriteText(root);
  }

  function init() {
    polish(document);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          rewriteTextNode(mutation.target);
          continue;
        }
        mutation.addedNodes.forEach((node) => polish(node));
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
