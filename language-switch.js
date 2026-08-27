(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang") === "en" ? "en" : "ko";
  const isEnglish = language === "en";

  const style = document.createElement("style");
  style.textContent = `
    .language-switch{display:inline-flex;align-items:center;gap:2px;padding:2px;border:1px solid rgba(171,177,185,.72);border-radius:999px;background:rgba(255,255,255,.72);backdrop-filter:blur(12px);flex:0 0 auto}
    .site-header nav .language-switch a{display:grid;place-items:center;min-width:34px;height:26px;padding:0 9px;border-radius:999px;text-decoration:none!important;font:500 8px/1 var(--mono,"DM Mono",monospace);letter-spacing:.08em;color:#777d85;transition:background .18s ease,color .18s ease,transform .18s ease}
    .site-header nav .language-switch a:hover{color:#17191d;transform:translateY(-1px)}
    .site-header nav .language-switch a.is-active{background:#17191d;color:#fff!important}
    html[lang="en"] body{word-break:normal}
    @media(max-width:720px){
      .site-header nav{display:flex!important;gap:8px!important;align-items:center}
      .site-header nav>a:not(.language-switch-link){display:none!important}
      .language-switch{margin-left:0}
    }
  `;
  document.head.appendChild(style);

  function languageHref(next) {
    const url = new URL(window.location.href);
    if (next === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function injectSwitch() {
    const nav = document.querySelector(".site-header nav");
    if (!nav || nav.querySelector(".language-switch")) return;
    const group = document.createElement("span");
    group.className = "language-switch";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Language");
    group.innerHTML = `
      <a class="language-switch-link ${language === "ko" ? "is-active" : ""}" href="${languageHref("ko")}" lang="ko" hreflang="ko" ${language === "ko" ? 'aria-current="page"' : ""}>KO</a>
      <a class="language-switch-link ${language === "en" ? "is-active" : ""}" href="${languageHref("en")}" lang="en" hreflang="en" ${language === "en" ? 'aria-current="page"' : ""}>EN</a>`;
    nav.appendChild(group);
  }

  injectSwitch();
  if (!isEnglish) return;

  document.documentElement.lang = "en";
  document.documentElement.dataset.language = "en";

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = "Yun Jinyong · AI/ML Engineer — Sensor Calibration, Edge AI, Autonomous Perception. A portfolio connecting research to systems that work in real-world environments.";
  }

  const exact = new Map([
    ["연구를 설계하고,", "I design research,"],
    ["실제 환경에서 작동하는 시스템으로 구현합니다.", "and turn it into systems that work in real-world environments."],
    ["안녕! 연구가 구현과 배포로 이어지는 흐름을 안내할게.", "Hi! I’ll guide you through how the research connects to implementation and deployment."],
    ["윤진용의 연구와 프로젝트를 보여줘", "Show me Yun Jinyong’s research and projects"],
    ["논문, 프로젝트, 출시 앱, 연구과제를 물어보세요", "Ask about papers, projects, released apps, or funded research"],
    ["어떤 엔지니어야?", "What kind of engineer?"],
    ["연구·논문", "Research · Papers"],
    ["AI 프로젝트", "AI Projects"],
    ["연구·제품 경험", "Research · Product"],
    ["한눈에 보기", "At a glance"],
    ["윤진용", "Yun Jinyong"],
    ["Sensor Calibration · Model Compression · On-Device AI를 연구하며, 모델 검증부터 Edge deployment와 Application 구현까지 연결합니다.", "I work on Sensor Calibration, Model Compression, and On-Device AI, connecting model validation to Edge deployment and application engineering."],
    ["← 처음 화면", "← Home"],
    ["궁금한 주제를 골라줘. 연구가 구현과 결과로 이어진 흐름부터 안내할게.", "Choose a topic. I’ll start with how the research leads to implementation and measurable outcomes."],
    ["연구, 논문, 프로젝트, 출시 앱을 물어보세요", "Ask about research, papers, projects, or released apps"],
    ["윤진용은 어떤 AI/ML Engineer야?", "What kind of AI/ML Engineer is Yun Jinyong?"],
    ["Resume를 한눈에 요약해줘", "Summarize the resume at a glance"],
    ["연구경력과 제품 개발 경험을 알려줘", "Show me the research and product-development experience"],
    ["핵심 연구 분야를 보여줘", "Show me the core research areas"],
    ["Selected publications를 보여줘", "Show me the selected publications"],
    ["대표 AI 프로젝트를 보여줘", "Show me the selected AI projects"],
    ["출시 앱과 Application 개발 경험을 보여줘", "Show me the released apps and application-development experience"],
    ["수행한 연구과제를 알려줘", "Show me the funded research projects"],
    ["기술 스택과 학력을 알려줘", "Show me the technical stack and education"],
    ["수상, 자격, 영어 역량을 알려줘", "Show me awards, certifications, and English proficiency"],
    ["윤진용에게 연락하고 싶어", "I’d like to contact Yun Jinyong"],
    ["윤진용 개발자에 대해 알려줘", "Tell me about Yun Jinyong"],
    ["Selected publications와 PDF를 보여줘", "Show me selected publications and PDFs"],
    ["출시한 앱을 보여줘", "Show me the released apps"],
    ["출시한 앱과 개발 역할을 보여줘", "Show me the released apps and development roles"],
    ["Camera–LiDAR 프로젝트 설명해줘", "Explain the Camera–LiDAR project"],
    ["Camera–LiDAR 프로젝트의 구현과 결과를 보여줘", "Show me the implementation and results of the Camera–LiDAR project"],
    ["연구과제를 알려줘", "Show me the research projects"],
    ["수행한 연구과제와 역할을 보여줘", "Show me the funded projects and roles"],
    ["GitHub 저장소 열기", "Open GitHub repository"],
    ["GitHub 상세 보기 ↗", "View details on GitHub ↗"],
    ["앱 화면", "app screen"],
    ["출시 앱 보기", "View released apps"],
    ["연구 논문 보기", "View publications"],
    ["연구과제 보기", "View funded research"],
    ["Camera–LiDAR 상세", "Camera–LiDAR details"],
    ["Camera drift 상세", "Camera drift details"],
    ["출시 앱", "Released apps"],
    ["GitHub 상세 구현", "GitHub implementation"],
    ["PDF 보기 ↗", "View PDF ↗"],
    ["Resume 한눈에 보기", "Resume at a glance"],
    ["출시 앱 / Product", "Released Apps / Product"],
    ["연구과제", "Research Grants"],
    ["수상 / 자격", "Awards / Credentials"],
    ["Sensor Calibration · Anomaly Detection · Model Compression을 중심으로 연구하며, 모델 성능뿐 아니라 latency, memory, runtime resource 같은 실제 배포 제약을 함께 고려합니다. 논문 연구부터 TFLite/Raspberry Pi 기반 Edge deployment, iOS·Android 제품 구현까지 연결해 온 경험이 강점입니다.", "My research focuses on Sensor Calibration, Anomaly Detection, and Model Compression. I evaluate not only model performance but also real deployment constraints such as latency, memory, and runtime resources. My strength is connecting paper research to TFLite/Raspberry Pi Edge deployment and iOS/Android product engineering."],
    ["정확도뿐 아니라 latency, memory, resource efficiency와 실제 장치 동작 조건을 함께 평가합니다.", "I evaluate latency, memory, resource efficiency, and real device operating conditions alongside accuracy."],
    ["모델 성능과 함께 latency, memory, runtime resource 같은 실제 배포 제약을 평가합니다.", "I evaluate real deployment constraints such as latency, memory, and runtime resources together with model performance."],
    ["Swift/UIKit, Kotlin/Android, WebRTC 경험을 바탕으로 실제 사용자가 쓰는 제품까지 구현했습니다.", "Using Swift/UIKit, Kotlin/Android, and WebRTC, I have built products used by real users."],
    ["Swift/UIKit, Kotlin/Android, WebRTC를 활용해 사용자가 실제로 쓰는 제품과 실시간 협업 시스템을 구현했습니다.", "Using Swift/UIKit, Kotlin/Android, and WebRTC, I built user-facing products and real-time collaboration systems."],
    ["Research → Edge → Product,", "Research → Edge → Product,"],
    ["한 흐름으로 이어진 경험.", "one connected engineering path."],
    ["Sensor Calibration · Model Compression · On-Device AI를 연구하며 논문, 모델 구현, 실제 장치 평가까지 수행했습니다. 동시에 모바일 앱과 산업용 협업 시스템을 개발·출시한 경험을 바탕으로 연구 결과를 실제 사용 환경과 연결합니다.", "I research Sensor Calibration, Model Compression, and On-Device AI, covering papers, model implementation, and real-device evaluation. In parallel, my experience building and releasing mobile apps and industrial collaboration systems helps me connect research outcomes to real usage environments."],
    ["제품 개발에서 AI 연구로,", "From product development to AI research,"],
    ["그리고 Edge deployment까지 이어졌습니다.", "and onward to Edge deployment."],
    ["정확도만이 아니라", "Not only accuracy—"],
    ["배포 조건까지 함께 연구합니다.", "I study deployment constraints as part of the problem."],
    ["핵심 연구축은 Sensor Calibration, Model Compression, On-Device AI, Anomaly Detection, Time-Series Analysis, Autonomous Perception입니다. accuracy만 비교하지 않고 latency, memory, runtime resource를 실제 배포 조건으로 함께 평가합니다.", "My core research areas are Sensor Calibration, Model Compression, On-Device AI, Anomaly Detection, Time-Series Analysis, and Autonomous Perception. Instead of comparing accuracy alone, I evaluate latency, memory, and runtime resources as real deployment constraints."],
    ["Reference 기반 센서 보정, drift adaptation, 장기 시계열 데이터와 실시간 이상 탐지.", "Reference-based sensor calibration, drift adaptation, long-horizon time-series data, and real-time anomaly detection."],
    ["TFLite, Raspberry Pi, 경량 모델과 resource-aware deployment.", "TFLite, Raspberry Pi, lightweight models, and resource-aware deployment."],
    ["Camera–LiDAR extrinsic drift, camera homography recovery, perception reliability.", "Camera–LiDAR extrinsic drift, camera homography recovery, and perception reliability."],
    ["지식기반데이터분석 연구실 · 석사과정 연구원", "Knowledge-Based Data Analytics Lab · M.S. Researcher"],
    ["딥러닝 기반 센서 보정 및 실시간 이상 탐지 시스템을 개발하고, 1저자 논문 및 NRF/IITP 연구과제를 수행합니다.", "I develop deep-learning sensor calibration and real-time anomaly-detection systems, while leading first-author papers and NRF/IITP funded research."],
    ["지식기반데이터분석 연구실 · 학부연구생", "Knowledge-Based Data Analytics Lab · Undergraduate Researcher"],
    ["센서 보정·시계열 모델링 연구를 시작했고, KIIT 2024 우수논문상 금상 연구로 이어졌습니다.", "I began research in sensor calibration and time-series modeling, which led to the KIIT 2024 Best Paper Gold Award."],
    ["산업 현장 작업자와 원격 전문가 간 N:M 영상·음성 통신을 위한 Android UI와 실시간 통화 기능을 개발했습니다.", "I developed Android UI and real-time calling features for N:M video/audio communication between field workers and remote experts."],
    ["어디여 · Location-Based Reminder App", "Eodiyeo · Location-Based Reminder App"],
    ["위치 검색과 Geofencing 기반 알림을 End-to-End로 설계·개발해 App Store에 출시했습니다.", "I designed and developed location search and geofencing-based notifications end to end, then released the app on the App Store."],
    ["머니뭐니 · Goal-Based Asset Management App", "Money Mwo-ni · Goal-Based Asset Management App"],
    ["서비스 기획과 iOS 개발을 리드해 목표 기반 자산관리 앱을 App Store에 출시했습니다.", "I led product planning and iOS development for a goal-based asset-management app released on the App Store."],
    ["Sensor Calibration을 중심으로,", "Centered on Sensor Calibration,"],
    ["On-Device AI와 LLM 응용까지 확장합니다.", "expanding into On-Device AI and LLM applications."],
    ["Selected publications와 현재 진행 중인 manuscript를 원문 PDF에 연결했습니다. 각 카드에서 연구 주제와 기여를 확인하고 PDF 원문을 바로 열어볼 수 있습니다.", "Selected publications and current manuscripts are linked to their original PDFs. Each card summarizes the research topic and contribution and opens the source PDF directly."],
    ["Resume의 selected publications와 최신 manuscript를 실제 원문 PDF에 연결했습니다. 각 카드의 PDF 보기 버튼을 누르면 새 탭에서 Google Drive 원문이 열립니다.", "Selected publications from the resume and the latest manuscripts are linked to their original PDFs. Use the View PDF button on each card to open the Google Drive source in a new tab."],
    ["IoT 센서의 드리프트 적응형 실시간 보정을 위한 경량 신경망 모듈 프레임워크", "Lightweight Neural Module Framework for Drift-Adaptive Real-Time Calibration of IoT Sensors"],
    ["적응형 툴 스키마를 활용한 모바일 온디바이스 에이전트 최적화", "Optimization of Mobile On-Device AI Agents Using Adaptive Tool Schemas"],
    ["적응형 툴 스키마를 활용한 모바일 온디바이스 AI 에이전트 최적화", "Optimization of Mobile On-Device AI Agents Using Adaptive Tool Schemas"],
    ["미세먼지 보간 모델을 위한 지역배치 정규화 기법", "Regional Batch Normalization for Fine-Dust Interpolation Models"],
    ["미세먼지 보간 모델을 위한 Local BatchNormalization", "Local Batch Normalization for Fine-Dust Interpolation Models"],
    ["정확도·지연시간·리소스 효율의 균형을 고려한 경량 Sensor Calibration 모델 연구.", "A lightweight Sensor Calibration model balancing accuracy, latency, and resource efficiency."],
    ["IoT 센서 드리프트에 적응하는 실시간 경량 보정 프레임워크.", "A lightweight real-time calibration framework that adapts to IoT sensor drift."],
    ["모바일 환경에서 온디바이스 에이전트의 도구 사용 효율을 최적화한 연구.", "Research optimizing tool-use efficiency for on-device agents in mobile environments."],
    ["한국어 작문 평가와 LLM 기반 피드백 생성을 연결한 분석 도구.", "An analysis tool connecting Korean writing assessment with LLM-based feedback generation."],
    ["지역별 분포 차이를 고려한 미세먼지 보간 모델 정규화 기법.", "A normalization method for fine-dust interpolation models that accounts for regional distribution differences."],
    ["SCALE: CSP와 Binary Hash Attention을 결합해 정확도, 지연 시간, 자원 효율성을 함께 최적화한 MCU 지향 Sensor Calibration 연구.", "SCALE combines CSP and Binary Hash Attention to jointly optimize accuracy, latency, and resource efficiency for MCU-oriented Sensor Calibration."],
    ["기존 센서 보정 모델을 재학습하지 않고 약 350-parameter DAM 모듈을 추가해 drift 적응력을 높이는 경량 프레임워크.", "A lightweight framework that adds an approximately 350-parameter DAM module to improve drift adaptation without retraining the existing sensor-calibration model."],
    ["제한된 컨텍스트 예산에서 LFU-R 기반 중요도와 error-driven promotion으로 Tool Schema 정보량을 동적으로 할당하는 연구.", "Research that dynamically allocates Tool Schema information under a limited context budget using LFU-R-based importance and error-driven promotion."],
    ["FEAK: rubric-linked linguistic features를 근거로 선택해 LLM 기반 한국어 작문 피드백을 생성하는 분석·피드백 파이프라인.", "FEAK is an analysis-and-feedback pipeline that selects rubric-linked linguistic evidence to generate LLM-based feedback for Korean writing."],
    ["측정소별 공간 분포 차이를 반영하기 위해 Global BN과 Local BN을 비교하고 지역별 정규화의 보간 성능 개선을 검증한 연구.", "Research comparing Global BN and Local BN to account for spatial distribution differences across monitoring stations and verify interpolation gains from local normalization."],
    ["모델을 만들고 끝내지 않고,", "I don’t stop at building the model—"],
    ["평가와 배포까지 이어지는 파이프라인으로 구현합니다.", "I build a pipeline through evaluation and deployment."],
    ["각 프로젝트는 문제 정의, 모델 설계, 평가 지표, Edge deployment를 함께 보여줍니다. 카드를 열면 GitHub 구현과 상세 결과를 바로 확인할 수 있습니다.", "Each project shows the problem definition, model design, evaluation metrics, and Edge deployment together. Open a card to view the GitHub implementation and detailed results."],
    ["Extrinsic drift 상태에서 RGB·Depth·Edge·Residual 특징을 융합해 6DoF 보정값과 Confidence를 추정하는 MSF-CalibNet 프로젝트입니다.", "MSF-CalibNet fuses RGB, Depth, Edge, and Residual features under extrinsic drift to estimate a 6DoF correction and confidence."],
    ["Calibration Drift를 자동 탐지하고 8D Homography를 추정해 영상 정합을 복구하는 End-to-End 모델로, TFLite INT8 Edge 배포 구조까지 구현했습니다.", "An end-to-end model that automatically detects calibration drift, estimates an 8D Homography to recover image alignment, and includes a TFLite INT8 Edge deployment path."],
    ["PM1·습도·온도·CO·CO₂ 5종 센서의 Reference 기반 Calibration과 Robust Z-Score Level/Jump 이상 탐지를 결합한 실시간 파이프라인입니다.", "A real-time pipeline combining reference-based calibration for five sensors—PM1, humidity, temperature, CO, and CO₂—with Robust Z-Score Level/Jump anomaly detection."],
    ["실시간 센서 보정 결과 그래프", "Real-time sensor calibration result"],
    ["6-Class 이미지 분류 Teacher–Student CNN에 Knowledge Distillation을 적용하고 Raspberry Pi 환경 실제 추론 Benchmark 파이프라인을 구성했습니다.", "Knowledge Distillation is applied to a six-class Teacher–Student CNN, with a real-device inference benchmark pipeline for Raspberry Pi."],
    ["쓰레기 분류 CNN confusion matrix", "Waste-classification CNN confusion matrix"],
    ["보정된 센서 신호를", "I connect calibrated sensor signals"],
    ["실시간 모니터링까지 연결합니다.", "to real-time monitoring."],
    ["PM1·습도·온도·CO·CO₂ 5종 센서를 30초 단위로 resampling하고 180-step window 기반 보정 후 Robust Z-Score로 Level/Jump 이상을 감지합니다.", "Five sensors—PM1, humidity, temperature, CO, and CO₂—are resampled every 30 seconds, calibrated over a 180-step window, and monitored for Level/Jump anomalies with Robust Z-Score."],
    ["실제 README에 공개된 센서 보정 결과 그래프.", "Sensor-calibration results published in the project README."],
    ["보정된 센서 신호와 이상 탐지 결과 시각화.", "Visualization of calibrated sensor signals and anomaly-detection results."],
    ["Camera–LiDAR calibration drift에서", "Under Camera–LiDAR calibration drift,"],
    ["6DoF 복구값과 confidence를 추정합니다.", "I estimate a 6DoF recovery and confidence."],
    ["RGB, sparse depth, edge, residual feature를 융합해 roll·pitch·yaw·tx·ty·tz와 confidence를 예측하고 recovery 상태를 reprojection error로 평가합니다.", "RGB, sparse depth, edge, and residual features are fused to predict roll, pitch, yaw, tx, ty, tz, and confidence, while recovery is evaluated using reprojection error."],
    ["정상 / drift / recovered projection 결과.", "Normal / drifted / recovered projection results."],
    ["Green · Red · Cyan overlay로 복구 상태를 비교.", "Recovery states compared with Green · Red · Cyan overlays."],
    ["Camera calibration drift를 감지하고,", "I detect camera calibration drift"],
    ["영상 정합을 자동 복구합니다.", "and automatically recover image alignment."],
    ["8D Homography를 예측하고 ECC refinement를 결합해 calibration drift를 복구하며, TFLite INT8 기반 Edge 배포 경로까지 구성했습니다.", "The system predicts an 8D Homography and combines ECC refinement to recover calibration drift, with a TFLite INT8 Edge deployment path."],
    ["Drifted image와 recovered output 비교.", "Comparison of the drifted image and recovered output."],
    ["실제 README recovery visualization.", "Recovery visualization from the project README."],
    ["Teacher 모델의 지식을", "I transfer the Teacher model’s knowledge"],
    ["더 작은 Edge 모델로 전달합니다.", "to a smaller Edge model."],
    ["Teacher–Student CNN에 Knowledge Distillation을 적용해 parameter를 3.31M에서 1.85M으로 약 44.1% 줄이고 Raspberry Pi 실제 장치 추론을 목표로 benchmark 파이프라인을 구성했습니다.", "Applying Knowledge Distillation to a Teacher–Student CNN reduces parameters from 3.31M to 1.85M—about 44.1%—and adds a benchmark pipeline targeting real Raspberry Pi inference."],
    ["분류 성능과 클래스별 혼동을 확인한 실제 결과.", "Actual results showing classification performance and class-level confusion."],
    ["제품 개발 경험에서도,", "In product development as well,"],
    ["사용자가 실제로 쓰는 소프트웨어를 구현하고 출시했습니다.", "I built and released software used by real users."],
    ["머니뭐니와 어디여는 App Store에 출시한 iOS 앱이며, RealWear 프로젝트에서는 산업 현장 원격 협업을 위한 Android/WebRTC 기능을 구현했습니다. 각 카드에서 역할과 공개 구현 자료를 함께 확인할 수 있습니다.", "Money Mwo-ni and Eodiyeo are iOS apps released on the App Store. In the RealWear project, I implemented Android/WebRTC features for remote collaboration in industrial environments. Each card includes my role and public implementation evidence."],
    ["머니뭐니", "Money Mwo-ni"],
    ["목표 금액과 지출을 시각적으로 연결한 Goal-Based Asset Management App. 서비스 기획과 iOS 개발을 리드해 App Store에 출시했습니다.", "A Goal-Based Asset Management App that visually connects target amounts with spending. I led product planning and iOS development through App Store release."],
    ["어디여", "Eodiyeo"],
    ["위치 검색, Map marker, Geofencing 기반 local notification을 결합한 Location-Based Reminder App을 End-to-End로 개발해 출시했습니다.", "I developed and released a Location-Based Reminder App end to end, combining location search, map markers, geofencing, and local notifications."],
    ["산업 현장 작업자와 원격 전문가 간 실시간 협업을 위해 N:M 영상·음성 통신 UI와 통화 기능을 구현했습니다. 공개 GitHub에는 Kurento 기반 backend 실행 구성이 확인됩니다.", "I implemented N:M video/audio communication UI and calling features for real-time collaboration between field workers and remote experts. The public GitHub repository includes the Kurento-based backend setup."],
    ["GitHub evidence: jinyongyun 프로필에는 머니뭐니·어디여 출시 앱이 정리되어 있고, 각 저장소 README에서 App Store 링크와 구현 내용을 확인할 수 있습니다.", "GitHub evidence: the jinyongyun profile lists the released Money Mwo-ni and Eodiyeo apps, and each repository README links to the App Store and implementation details."],
    ["연구 아이디어를", "I expand research ideas"],
    ["장기 과제로 확장해 수행합니다.", "into longer-term funded projects."],
    ["논문 단위 연구를 넘어,", "Beyond paper-scale research,"],
    ["장기 연구과제로 확장합니다.", "I expand the work into longer-term projects."],
    ["초경량 딥러닝을 사용한 저비용/고효율 센서 보정 시스템", "Low-Cost, High-Efficiency Sensor Calibration System Using Ultra-Lightweight Deep Learning"],
    ["장기간 다종센서 데이터를 수집하고 초소형 임베디드 환경에서 동작 가능한 경량 Sensor Calibration 모델을 개발합니다.", "This project collects long-term multi-sensor data and develops lightweight Sensor Calibration models that can run in highly constrained embedded environments."],
    ["인간처럼 회상이 가능한 인공 신경망 지속학습 플랫폼 개발", "Continual-Learning Neural Platform with Human-Like Recall"],
    ["치매 환자의 회상을 유도하도록 대화하고 기억을 이미지로 생성하는 chatbot 설계 및 개발에 참여합니다.", "I contribute to a chatbot that prompts memory recall for dementia patients and generates remembered scenes as images."],
    ["사용자 중심의 한국어 텍스트 분석 도구(U-KTA) 개발", "Development of a User-Centered Korean Text Analysis Tool (U-KTA)"],
    ["학생 작문글을 국어학적 근거로 자동 평가하고 LLM 피드백을 제공하는 framework 개발 연구입니다.", "Research on a framework that automatically evaluates student writing using Korean-linguistic evidence and provides LLM-based feedback."],
    ["단독과제", "Independent Project"],
    ["모델 연구부터", "From model research"],
    ["Edge deployment와 Application까지.", "to Edge deployment and applications."],
    ["AI 연구, 데이터 처리, 시스템 구현을 위한 핵심 언어.", "Core languages for AI research, data processing, and system implementation."],
    ["시계열, 비전, 센서 보정 모델의 학습·평가.", "Training and evaluation for time-series, vision, and sensor-calibration models."],
    ["경량화, Raspberry Pi, 임베디드·Edge 추론 파이프라인.", "Lightweight models, Raspberry Pi, and embedded/Edge inference pipelines."],
    ["MapKit, CoreLocation, WebRTC, WebSocket을 포함한 실제 제품 개발 경험.", "Production development experience including MapKit, CoreLocation, WebRTC, and WebSocket."],
    ["연구·개발 경험을 뒷받침하는", "Evidence supporting my research and engineering"],
    ["성과와 자격을 정리했습니다.", "through awards and credentials."],
    ["연구 성과와", "Research achievements"],
    ["실무 역량을 함께 증명합니다.", "and practical engineering capability."],
    ["우수논문상 금상", "Best Paper Gold Award"],
    ["한국정보기술학회 추계종합학술대회.", "Korean Institute of Information Technology Fall Conference."],
    ["공과대학장상 우수상", "College of Engineering Dean’s Award — Excellence"],
    ["탄소중립 INNOVATION ACADEMY.", "Carbon Neutrality Innovation Academy."],
    ["SQL 개발자 자격.", "SQL Developer certification."],
    ["연구와 구현을 연결하는 일에 대해", "If you’d like to talk about connecting research"],
    ["함께 이야기하고 싶다면.", "with real-world engineering."],
    ["공개 연락처와 GitHub를 아래에 정리했습니다.", "Public contact information and GitHub links are listed below."],
    ["Research와 Engineering을", "If you’d like to discuss Research and Engineering"],
    ["공개 포트폴리오에는 이메일과 GitHub만 연결합니다.", "This public portfolio lists only email and GitHub contact channels."],
    ["이 주제들로", "Explore these topics"],
    ["윤진용의 경험을 탐색할 수 있어요.", "to navigate Yun Jinyong’s experience."],
    ["연구 주제만 보기보다, 그 연구를 어디까지 구현했는지 함께 보면 좋아. 문제 정의부터 배포·제품 경험까지 한 흐름으로 안내할게.", "Rather than looking only at research topics, it’s useful to see how far each idea was implemented. I’ll guide you from problem definition through deployment and product experience."],
    ["핵심 이력을 연구, 구현, 배포, 제품 경험 순서로 묶어뒀어. 관심 있는 지점부터 더 깊게 들어가면 돼.", "I grouped the key experience into research, implementation, deployment, and product work. Start wherever you’re most interested."],
    ["제품 개발 경험이 AI 연구로 이어지고, 다시 Edge deployment로 확장된 흐름을 보면 좋아.", "The key story is how product-development experience led into AI research and then expanded into Edge deployment."],
    ["논문은 제목보다 어떤 문제를 정의했고 어떤 제약을 다뤘는지 함께 봐줘. 원문 PDF도 바로 확인할 수 있어.", "For the papers, look beyond the titles to the problems and constraints each work addresses. The original PDFs are linked directly."],
    ["연구 아이디어가 실제 funded project로 어떻게 확장됐는지 보여줄게. 수행 주제와 연결된 구현도 함께 보면 좋아.", "I’ll show how research ideas expanded into funded projects, together with related implementations."],
    ["여기서는 모델 자체보다 구현 과정을 봐줘. 입력, 평가 지표, 복구 성능, Edge deployment까지 연결돼 있어.", "Here, focus on the implementation path: inputs, evaluation metrics, recovery performance, and Edge deployment are all connected."],
    ["제품 경험은 실제 사용자와 운영 조건을 고려해 구현한 기록이야. 개발 역할과 출시 결과를 함께 확인해봐.", "The product work reflects real users and operating constraints. Check the development role and release outcome together."],
    ["기술 스택은 나열보다 사용 맥락이 중요해. 연구, Edge, Product에서 어디에 썼는지 연결해서 보여줄게.", "The technical stack matters most in context. I’ll show where each technology was used across Research, Edge, and Product work."],
    ["수상과 자격은 연구·개발 경험을 뒷받침하는 기록이야. 어떤 경험과 연결되는지 함께 보면 좋아.", "Awards and credentials support the research and engineering record. It’s useful to see what experience each one connects to."],
    ["연락이 필요하다면 여기서 바로 확인할 수 있어. 공개 이메일과 GitHub만 정리해뒀어.", "If you’d like to get in touch, the public email and GitHub links are listed here."],
    ["핵심은 accuracy만 높이는 게 아니라 latency와 resource constraints까지 실제 배포 조건으로 함께 다루는 거야.", "The key is not just improving accuracy, but treating latency and resource constraints as part of the real deployment problem."],
    ["연구가 실제 시스템으로 이어지는 흐름부터 핵심만 정리해볼게.", "I’ll start with the core story of how the research leads to real systems."],
    ["연구, 구현, 배포, 제품 경험 순서로 이력을 빠르게 정리해볼게.", "I’ll quickly summarize the experience in the order of research, implementation, deployment, and product work."],
    ["제품 개발에서 AI 연구와 Edge deployment로 이어진 흐름을 보여줄게.", "I’ll show the path from product development to AI research and Edge deployment."],
    ["핵심 연구축과 실제 배포 제약을 함께 설명할게.", "I’ll explain the core research areas together with real deployment constraints."],
    ["Selected publications와 manuscript의 핵심 문제와 기여를 보여줄게.", "I’ll highlight the key problems and contributions in the selected publications and manuscripts."],
    ["대표 프로젝트의 구현, 평가 지표, 배포 결과를 중심으로 안내할게.", "I’ll focus on implementation, evaluation metrics, and deployment outcomes across the selected projects."],
    ["출시한 앱과 산업용 제품 개발 경험을 역할과 결과 중심으로 보여줄게.", "I’ll show the released apps and industrial product-development experience, focusing on roles and outcomes."],
    ["수행한 연구과제와 각 과제가 다루는 문제를 연결해서 보여줄게.", "I’ll connect each funded research project with the problem it addresses."],
    ["기술 스택을 연구·Edge·Product의 실제 사용 맥락과 연결해서 보여줄게.", "I’ll connect the technical stack to how it was actually used across Research, Edge, and Product work."],
    ["연구·개발 경험을 뒷받침하는 수상, 자격, 영어 역량을 정리해볼게.", "I’ll summarize the awards, credentials, and English proficiency that support the research and engineering experience."],
    ["공개 이메일과 GitHub를 바로 안내할게.", "I’ll show the public email and GitHub links."],
    ["핵심 포인트부터 짚어줄게. 세부 구현과 원문 자료는 아래 카드와 링크에서 바로 확인할 수 있어.", "I’ll start with the key points. Detailed implementations and source materials are linked in the cards below."],
    ["질문과 가장 관련 있는 연구, 구현, 결과를 골라서 정리하고 있어.", "I’m selecting the research, implementation details, and results most relevant to your question."],
    ["안녕! 연구와 프로젝트를 같이 볼까?", "Hi! Want to explore the research and projects together?"],
    ["논문부터 볼까, 구현 프로젝트부터 볼까?", "Would you like to start with papers or implementation projects?"],
    ["출시 앱과 연구과제도 바로 안내할 수 있어.", "I can also take you directly to released apps and funded research."],
    ["연구가 실제 시스템으로 이어진 흐름을 보여줄게.", "I’ll show how the research connects to real systems."],
    ["어디부터 볼까? Research, Projects, Career?", "Where should we start—Research, Projects, or Career?"],
    ["나를 누르면 전체 포트폴리오부터 안내할게.", "Click me and I’ll guide you through the full portfolio."],
    ["아래 메뉴에서 관심 있는 주제를 골라도 좋아.", "You can also choose a topic from the menu below."],
    ["좋아. 연구부터 실제 구현까지 한 번에 정리해볼게.", "Great. I’ll summarize the path from research to real implementation."],
    ["바로 시작할게. 어떤 경험부터 볼까?", "Let’s start. Which experience would you like to see first?"],
    ["✦ Recruiter? 30초 포트폴리오 브리프", "✦ Recruiter? 30-sec portfolio brief"],
    ["✦ Recruiter? 30초 핵심 투어", "✦ Recruiter? 30-sec portfolio brief"],
    ["연구를", "I connect research"],
    ["실제 시스템으로 연결합니다.", "to real systems."],
    ["Sensor Calibration · Model Compression · On-Device AI를 연구하고, 모델 평가부터 Edge deployment와 Application 출시까지 구현 경험으로 연결해 왔습니다.", "I research Sensor Calibration, Model Compression, and On-Device AI, connecting model evaluation to Edge deployment and application releases."],
    ["30초 동안 연구, 구현, 배포, 제품 경험 순서로 핵심만 보여줄게.", "In 30 seconds, I’ll show the essentials in the order of research, implementation, deployment, and product experience."],
    ["정확도뿐 아니라", "Beyond accuracy,"],
    ["배포 조건까지 함께 봅니다.", "I evaluate deployment constraints too."],
    ["센서 보정, drift adaptation, 이상 탐지, 시계열 분석을 연구하면서 accuracy와 함께 latency · memory · runtime resource를 실제 배포 제약으로 평가합니다.", "While researching sensor calibration, drift adaptation, anomaly detection, and time-series analysis, I evaluate latency, memory, and runtime resources as real deployment constraints alongside accuracy."],
    ["연구 단계부터 latency, memory, runtime resource 같은 실제 제약을 같이 봐.", "From the research stage, I consider real constraints such as latency, memory, and runtime resources."],
    ["연구 결과를", "I validate research outcomes"],
    ["Edge 환경에서 검증합니다.", "in Edge environments."],
    ["Camera–LiDAR 6DoF calibration recovery, camera homography recovery, Knowledge Distillation을 TFLite · INT8 · Raspberry Pi 기반 배포와 benchmark까지 연결했습니다.", "I connected Camera–LiDAR 6DoF calibration recovery, camera homography recovery, and Knowledge Distillation to TFLite, INT8, and Raspberry Pi deployment and benchmarking."],
    ["프로젝트마다 모델 성능뿐 아니라 TFLite, INT8, Raspberry Pi 같은 실제 배포 경로까지 연결돼 있어.", "Each project connects model performance to real deployment paths such as TFLite, INT8, and Raspberry Pi."],
    ["제품은", "I released products"],
    ["실제 사용자에게 출시했습니다.", "to real users."],
    ["Swift/UIKit 기반 iOS 앱 2종을 App Store에 출시했고, Kotlin/Android · WebRTC · WebSocket 기반 산업용 원격 협업 시스템도 구현했습니다.", "I released two Swift/UIKit iOS apps on the App Store and built an industrial remote-collaboration system using Kotlin/Android, WebRTC, and WebSocket."],
    ["iOS 앱은 App Store에 출시했고, Android/WebRTC 기반 산업용 협업 시스템도 구현했어.", "The iOS apps were released on the App Store, and I also built an Android/WebRTC industrial collaboration system."],
    ["논문부터 구현·출시까지,", "From papers to implementation and releases,"],
    ["결과물로 확인할 수 있습니다.", "the outputs are directly verifiable."],
    ["논문 PDF, GitHub 구현, App Store 출시, 연구과제와 수상 이력을 서로 연결했습니다. 각 항목에서 설명보다 실제 결과물과 근거를 먼저 확인할 수 있습니다.", "Paper PDFs, GitHub implementations, App Store releases, funded research, and awards are linked together. Each section prioritizes concrete outputs and evidence over claims."],
    ["마지막은 결과물이야. 연구가 논문, 코드, 배포와 출시로 어떻게 이어졌는지 직접 확인해봐.", "The final focus is evidence. You can directly verify how the research leads to papers, code, deployment, and releases."],
    ["채용공고(JD)를 붙여넣어 보세요", "Paste a job description (JD)"],
    ["브라우저 안에서 공개 포트폴리오의 기술 근거와 키워드를 비교합니다. 외부 API로 전송하지 않습니다.", "This compares the job description with technical evidence and keywords in the public portfolio, entirely in your browser. Nothing is sent to an external API."],
    ["채용공고 입력", "Job description input"],
    ["HEURISTIC MATCH ≠ ATS SCORE · 공개 포트폴리오에 보이는 근거만 사용합니다.", "HEURISTIC MATCH ≠ ATS SCORE · Uses only evidence visible in the public portfolio."],
    ["JD를 입력하면 AI/Research · Edge/Deploy · Perception · Product/Engineering 관점에서 일치 근거와 현재 포트폴리오에서 확인되지 않는 요구사항을 분리해서 보여줍니다.", "Enter a JD to separate matched evidence from requirements not currently shown in the portfolio across AI/Research, Edge/Deploy, Perception, and Product/Engineering."],
    ["채용공고를 붙여 넣으면, 내 포트폴리오에서 직접 확인되는 기술만 골라서 비교해줄게.", "Paste a job description and I’ll compare it only against skills directly evidenced in the portfolio."],
    ["분석할 기술 요구사항을 충분히 찾지 못했습니다. JD의 기술 스택이나 업무 요건을 조금 더 포함해 주세요.", "I couldn’t identify enough technical requirements to analyze. Please include more of the JD’s technical stack or role requirements."],
    ["인식된 JD 기술 키워드 중 현재 공개 포트폴리오에서 직접 확인되는 비율입니다.", "Share of recognized JD technical keywords directly evidenced in the current public portfolio."],
    ["카테고리별 신호가 충분하지 않습니다.", "There are not enough signals for a category breakdown."],
    ["경력이 따로 떨어진 점이 아니라,", "These experiences are not isolated points—"],
    ["연구에서 Edge deployment로 이어졌습니다.", "the path continues from research to Edge deployment."],
    ["하나의 Research-to-System 흐름입니다.", "they form one Research-to-System path."],
    ["각 노드를 클릭하면 이전 경험이 다음 단계의 연구와 구현에 어떻게 연결됐는지 확인할 수 있습니다.", "Click each node to see how earlier experience connects to the next stage of research and implementation."],
    ["제품 개발 경험에서 시작해서, AI 연구와 Edge deployment로 이어진 경력 흐름을 보여줄게.", "I’ll show the career path from product development to AI research and Edge deployment."],
    ["RealWear 원격 협업 시스템과 iOS 제품을 개발하며 사용자 대상 소프트웨어와 실시간 통신 시스템을 구현했습니다. 이 경험은 이후 AI 연구에서도 실제 사용 환경과 시스템 제약을 함께 고려하는 기반이 됐습니다.", "By developing the RealWear remote-collaboration system and iOS products, I built user-facing software and real-time communication systems. This became the foundation for considering real usage environments and system constraints in later AI research."],
    ["인하대학교 지식기반데이터분석 연구실에서 센서 보정과 시계열 모델링 연구를 시작했고, KIIT 2024 우수논문상 금상 연구로 이어졌습니다.", "At Inha University’s Knowledge-Based Data Analytics Lab, I began research in sensor calibration and time-series modeling, which led to the KIIT 2024 Best Paper Gold Award."],
    ["석사과정에서 Sensor Calibration · Model Compression · On-Device AI를 연구하며 1저자 논문과 NRF/IITP 연구과제를 수행합니다.", "As an M.S. researcher, I work on Sensor Calibration, Model Compression, and On-Device AI while leading first-author papers and NRF/IITP funded projects."],
    ["Knowledge Distillation, Camera drift recovery, Camera–LiDAR 6DoF calibration recovery를 실제 Edge export와 deployment-aware benchmark로 확장했습니다.", "I extended Knowledge Distillation, Camera drift recovery, and Camera–LiDAR 6DoF calibration recovery into real Edge exports and deployment-aware benchmarks."],
    ["JOK/KSC/KCC/SAC selected publications, funded research, GitHub 구현 결과를 통해 Research-to-System 흐름을 결과 중심으로 정리하고 있습니다.", "Selected JOK/KSC/KCC/SAC publications, funded research, and GitHub implementations provide outcome-based evidence of the Research-to-System path."],
    ["첫 화면으로 이동", "Go to home"],
    ["외부 링크", "External links"],
    ["포트폴리오 가이드 neon에게 윤진용의 연구와 프로젝트 안내받기", "Ask neon, the portfolio guide, to introduce Yun Jinyong’s research and projects"],
    ["포트폴리오 안내 질문", "Portfolio question"],
    ["질문 보내기", "Send question"],
    ["포트폴리오 빠른 질문", "Portfolio quick questions"],
    ["윤진용 포트폴리오 탐색", "Explore Yun Jinyong’s portfolio"],
    ["포트폴리오 질문 메뉴", "Portfolio question menu"],
    ["neon에게 윤진용 소개 듣기", "Ask neon to introduce Yun Jinyong"],
    ["추천 질문", "Suggested questions"],
    ["윤진용 포트폴리오 질문", "Yun Jinyong portfolio question"],
    ["닫기", "Close"]
  ]);

  const phrases = [
    [/연구경력/g, "Research Experience"],
    [/논문/g, "Papers"],
    [/프로젝트/g, "Projects"],
    [/출시 앱/g, "Released Apps"],
    [/연구과제/g, "Research Grants"],
    [/수상/g, "Awards"],
    [/자격/g, "Credentials"],
    [/학력/g, "Education"],
    [/기술 스택/g, "Technical Stack"]
  ];

  function translateValue(value) {
    const raw = String(value ?? "");
    const leading = raw.match(/^\s*/)?.[0] || "";
    const trailing = raw.match(/\s*$/)?.[0] || "";
    const trimmed = raw.trim();
    if (!trimmed) return raw;
    const direct = exact.get(trimmed);
    if (direct) return `${leading}${direct}${trailing}`;
    if (!/[가-힣]/.test(trimmed)) return raw;
    let next = trimmed;
    for (const [pattern, replacement] of phrases) next = next.replace(pattern, replacement);
    return next === trimmed ? raw : `${leading}${next}${trailing}`;
  }

  function translateTextNode(node) {
    if (!(node instanceof Text) || node.parentElement?.closest("script,style")) return;
    const next = translateValue(node.nodeValue || "");
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  const attributeNames = ["placeholder", "aria-label", "title", "alt"];
  function translateElementAttributes(element) {
    if (!(element instanceof Element)) return;
    for (const name of attributeNames) {
      if (!element.hasAttribute(name)) continue;
      const current = element.getAttribute(name) || "";
      const next = translateValue(current);
      if (next !== current) element.setAttribute(name, next);
    }
  }

  function scan(root = document) {
    if (root instanceof Text) {
      translateTextNode(root);
      return;
    }
    if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;
    if (root instanceof Element) translateElementAttributes(root);
    root.querySelectorAll?.("[placeholder],[aria-label],[title],[alt]").forEach(translateElementAttributes);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
  }

  scan(document);

  const enforceEnglishAttributes = () => {
    const landingInput = document.querySelector("#landingInput");
    if (landingInput) landingInput.placeholder = translateValue(landingInput.placeholder);
    const chatInput = document.querySelector("#chatInput");
    if (chatInput && chatInput.placeholder !== "Ask about research, papers, projects, or released apps") chatInput.placeholder = "Ask about research, papers, projects, or released apps";
  };
  enforceEnglishAttributes();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") translateTextNode(mutation.target);
      if (mutation.type === "attributes") translateElementAttributes(mutation.target);
      mutation.addedNodes?.forEach(scan);
    }
    enforceEnglishAttributes();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: attributeNames
  });
})();
