const app = document.querySelector("#app");
const landingComposer = document.querySelector("#landingComposer");
const landingInput = document.querySelector("#landingInput");
const chatComposer = document.querySelector("#chatComposer");
const chatInput = document.querySelector("#chatInput");
const messageList = document.querySelector("#messageList");
const mascotStage = document.querySelector("#mascotStage");
const aiBot = document.querySelector("#aiBot");
const pupils = [...document.querySelectorAll(".pupil")];

const PRIMARY_GITHUB = "https://github.com/jinyongyun";
const AI_GITHUB = "https://github.com/yunjinyong730";
const repoAI = (name) => `${AI_GITHUB}/${name}`;
const repoProduct = (name) => `${PRIMARY_GITHUB}/${name}`;

const REPOS = {
  realtime: repoAI("Real_time_Sensor_Calibration_Anomaly_Detection"),
  lidar: repoAI("LiDAR_Sensor_Calibration_Aware_Failure_Monitoring"),
  camera: repoAI("Autonomous-driving-camera-calibration-drift-detection-recovery"),
  distill: repoAI("Custom_CNN_Waste_Classification_Knowledge_Distillation_Raspberry"),
  ukta: repoAI("UKTA_v2"),
  money: repoProduct("WHAT_IS_MONEY_IOS"),
  eodiyeo: repoProduct("Eodiyeo"),
  realwear: repoProduct("RealWearApp_Backend"),
  profile: repoProduct("jinyongyun"),
};

const APPSTORE = {
  money: "https://apps.apple.com/kr/app/머니뭐니/id1671266174",
  eodiyeo: "https://apps.apple.com/kr/app/어디여/id6475540191",
};

const IMAGES = {
  realtime: "https://github.com/user-attachments/assets/73b538b8-a8a9-493e-866c-ce6fa69b4caa",
  realtimeCo: "https://github.com/user-attachments/assets/d39c3fc5-a519-446a-a21f-96c816a4f204",
  lidar: "https://github.com/user-attachments/assets/a607b93e-fd4c-4166-8318-8682405bc791",
  lidarOverlay: "https://github.com/user-attachments/assets/2c45f1b4-1c85-4519-9b09-50f6c3f3e63a",
  camera: "https://github.com/user-attachments/assets/3af94c0e-f511-416f-b227-7b668ab430cd",
  cameraAlt: "https://github.com/user-attachments/assets/6a8cc51f-e0e4-4093-9476-1eccc79912a1",
  distill: "https://github.com/user-attachments/assets/8431bec6-34d4-4bcc-936a-22c8b7cbeb50",
  money: "https://github.com/jinyongyun/jinyongyun/assets/102133961/70f1051b-6063-4864-bc47-6d7255ada512",
  eodiyeo: "https://github.com/jinyongyun/jinyongyun/assets/102133961/20d0eeeb-fc93-43f6-b97a-e8ab3a0a1299",
};

const commandQueries = {
  me: "윤진용은 어떤 AI/ML Engineer야?",
  resume: "Resume를 한눈에 요약해줘",
  experience: "연구경력과 제품 개발 경험을 알려줘",
  research: "핵심 연구 분야를 보여줘",
  publications: "Selected publications를 보여줘",
  projects: "대표 AI 프로젝트를 보여줘",
  applications: "출시 앱과 Application 개발 경험을 보여줘",
  grants: "수행한 연구과제를 알려줘",
  skills: "기술 스택과 학력을 알려줘",
  awards: "수상, 자격, 영어 역량을 알려줘",
  contact: "윤진용에게 연락하고 싶어",
};

const placeholderQueries = [
  "윤진용 개발자에 대해 알려줘",
  "Selected publications를 보여줘",
  "출시한 앱을 보여줘",
  "Camera–LiDAR 프로젝트 설명해줘",
  "연구과제를 알려줘",
];

const metric = (value, label) =>
  `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;

const tags = (...items) =>
  `<div class="tag-row">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;

const actionButtons = (...items) =>
  `<div class="inline-actions">${items
    .map((item) => item.href
      ? `<a href="${item.href}" target="_blank" rel="noreferrer">${item.label} ↗</a>`
      : `<button type="button" data-command="${item.command}">${item.label}</button>`)
    .join("")}</div>`;

const visualCard = ({ href, image, kicker, title, caption, alt = "" }) => `
  <a class="result-visual" href="${href}" target="_blank" rel="noreferrer" aria-label="${title} GitHub 저장소 열기">
    <div class="result-image-wrap">
      <img src="${image}" alt="${alt || title}" loading="lazy" />
      <span class="result-open">GitHub ↗</span>
    </div>
    <div class="result-visual-copy">
      <span>${kicker}</span>
      <strong>${title}</strong>
      <p>${caption}</p>
    </div>
  </a>`;

const projectCard = ({
  href, no, meta, title, subtitle, copy, image, alt, metrics = "", tagsHtml = "", chart = ""
}) => `
  <a class="project-card project-link-card" href="${href}" target="_blank" rel="noreferrer">
    <div class="card-topline"><span>${no}</span><span>${meta}</span></div>
    ${image ? `<div class="project-media"><img src="${image}" alt="${alt || title}" loading="lazy" /><span>VIEW REPOSITORY ↗</span></div>` : ""}
    <div class="project-card-body">
      <h3>${title}</h3>
      <p class="card-subtitle">${subtitle}</p>
      <p class="card-copy">${copy}</p>
      ${metrics ? `<div class="metric-grid">${metrics}</div>` : ""}
      ${chart}
      <div class="card-bottom">${tagsHtml}<strong class="card-link">GitHub 상세 보기 ↗</strong></div>
    </div>
  </a>`;

const applicationCard = ({
  title, meta, role, copy, image, github, appStore, tagsHtml, system = false
}) => `
  <article class="application-card">
    <div class="application-media">
      ${system ? `
        <div class="system-visual" aria-label="RealWear remote collaboration architecture">
          <div class="system-flow">
            <span>Field<br>Worker</span><i>→</i><span>WebRTC<br>Kurento</span><i>→</i><span>Remote<br>Expert</span>
          </div>
        </div>` : `<img src="${image}" alt="${title} 앱 화면" loading="lazy" />`}
    </div>
    <div class="application-body">
      <div class="application-meta">${meta}</div>
      <h3>${title}</h3>
      <p><strong>${role}</strong></p>
      <p>${copy}</p>
      ${tagsHtml}
      <div class="application-actions">
        <a class="primary" href="${github}" target="_blank" rel="noreferrer">GitHub ↗</a>
        ${appStore ? `<a href="${appStore}" target="_blank" rel="noreferrer">App Store ↗</a>` : ""}
      </div>
    </div>
  </article>`;

const publicationCard = ({ venue, rank, title, note }) => `
  <article class="publication-card">
    <span class="publication-rank">${rank}</span>
    <div class="publication-meta">${venue}</div>
    <h3>${title}</h3>
    <p>${note}</p>
  </article>`;

const grantCard = ({ title, meta, copy, source, href }) => `
  <article class="grant-card">
    <div class="grant-meta">${meta}</div>
    <h3>${title}</h3>
    <p>${copy}</p>
    <span class="grant-source">${source}</span>
    ${href ? `<div class="application-actions"><a href="${href}" target="_blank" rel="noreferrer">Related GitHub ↗</a></div>` : ""}
  </article>`;

const awardCard = ({ meta, title, copy }) => `
  <article class="award-card">
    <div class="award-meta">${meta}</div>
    <strong>${title}</strong>
    <p>${copy}</p>
  </article>`;

const answers = {
  me: () => `
    <article class="answer-document">
      <p class="answer-kicker">ABOUT · AI RESEARCH ENGINEER</p>
      <h2>연구를 설계하고,<br><span>실제 시스템으로 끝까지 연결합니다.</span></h2>
      <p class="answer-lead">윤진용은 Sensor Calibration · Anomaly Detection · Model Compression을 중심으로 모델 설계·검증부터 TFLite/Raspberry Pi 기반 Edge 배포까지 경험한 AI/ML Engineer입니다. 연구실에서의 논문 연구와 모바일 Application 출시 경험을 함께 갖고 있어 Research와 Engineering을 연결하는 데 강점이 있습니다.</p>
      <div class="resume-overview">
        <div class="resume-stat">${metric("5","SELECTED PUBLICATIONS")}</div>
        <div class="resume-stat">${metric("3","FUNDED RESEARCH PROJECTS")}</div>
        <div class="resume-stat">${metric("2","APP STORE RELEASES")}</div>
        <div class="resume-stat">${metric("4","SELECTED AI PROJECTS")}</div>
      </div>
      <div class="answer-grid three">
        <section class="answer-panel"><span class="section-no">01 · RESEARCH</span><h3>Sensor & Edge AI</h3><p>Sensor Calibration, Model Compression, On-Device AI, Anomaly Detection, Time-Series Analysis.</p></section>
        <section class="answer-panel"><span class="section-no">02 · DEPLOY</span><h3>Deployment-aware AI</h3><p>정확도뿐 아니라 latency, memory, resource efficiency와 실제 장치 동작 조건을 함께 평가합니다.</p></section>
        <section class="answer-panel"><span class="section-no">03 · PRODUCT</span><h3>Application Engineering</h3><p>Swift/UIKit, Kotlin/Android, WebRTC 경험을 바탕으로 실제 사용자가 쓰는 제품까지 구현했습니다.</p></section>
      </div>
      <div class="process-flow"><span><b>01</b>Problem</span><span><b>02</b>Research</span><span><b>03</b>Build</span><span><b>04</b>Deploy</span><span><b>05</b>Product</span></div>
      ${actionButtons(
        { label: "Resume 요약", command: "resume" },
        { label: "연구경력", command: "experience" },
        { label: "논문", command: "publications" },
        { label: "출시 앱", command: "applications" }
      )}
    </article>`,

  resume: () => `
    <article class="answer-document">
      <p class="answer-kicker">RESUME · AT A GLANCE</p>
      <h2>AI Research에서 Edge Deployment,<br><span>Application 출시까지.</span></h2>
      <div class="resume-identity">
        <div class="resume-identity-copy">
          <span class="eyeline">YUN JINYONG · AI/ML ENGINEER</span>
          <h3>Sensor Calibration · Edge AI · Autonomous Perception</h3>
          <p>모델을 연구하는 데서 끝내지 않고 실제 환경에서 동작하는 AI 시스템까지 구현합니다. 연구실에서 Sensor Calibration · Model Compression · On-Device AI를 연구하고, 모바일 앱과 산업용 협업 시스템 개발을 통해 제품 구현 경험도 쌓았습니다.</p>
        </div>
        <div class="resume-identity-side">
          <span>Current <b>M.S. AI Researcher</b></span>
          <span>University <b>Inha Univ.</b></span>
          <span>GPA <b>4.21 / 4.5</b></span>
          <span>English <b>OPIc IH</b></span>
        </div>
      </div>
      <div class="resume-overview">
        <div class="resume-stat">${metric("2024.07→","RESEARCH EXPERIENCE")}</div>
        <div class="resume-stat">${metric("5","SELECTED PAPERS")}</div>
        <div class="resume-stat">${metric("3","FUNDED PROJECTS")}</div>
        <div class="resume-stat">${metric("2","RELEASED IOS APPS")}</div>
      </div>
      ${actionButtons(
        { label: "Experience", command: "experience" },
        { label: "Publications", command: "publications" },
        { label: "AI Projects", command: "projects" },
        { label: "Product Apps", command: "applications" },
        { label: "Awards", command: "awards" }
      )}
    </article>`,

  experience: () => `
    <article class="answer-document">
      <p class="answer-kicker">EXPERIENCE · RESEARCH + PRODUCT</p>
      <h2>연구실과 제품 개발을<br><span>한 흐름으로 이어온 경험.</span></h2>
      <div class="timeline">
        <article class="timeline-item">
          <div class="timeline-meta">2025.03–2027.02 · INHA UNIVERSITY</div>
          <h3>지식기반데이터분석 연구실 · 석사과정 연구원</h3>
          <p class="timeline-role">Sensor Calibration · Model Compression · On-Device AI</p>
          <p>딥러닝 기반 센서 보정 및 실시간 이상 탐지 시스템을 개발하고, 1저자 논문 및 NRF/IITP 연구과제를 수행합니다.</p>
        </article>
        <article class="timeline-item">
          <div class="timeline-meta">2024.07–2025.02 · INHA UNIVERSITY</div>
          <h3>지식기반데이터분석 연구실 · 학부연구생</h3>
          <p class="timeline-role">AI Research Foundation</p>
          <p>센서 보정·시계열 모델링 연구를 시작했고, KIIT 2024 우수논문상 금상 연구로 이어졌습니다.</p>
        </article>
        <article class="timeline-item">
          <div class="timeline-meta">2023.09–2023.12 · INDUSTRIAL IOT</div>
          <h3>RealWear · Remote Collaboration Application</h3>
          <p class="timeline-role">Kotlin · Android · WebRTC · WebSocket</p>
          <p>산업 현장 작업자와 원격 전문가 간 N:M 영상·음성 통신을 위한 Android UI와 실시간 통화 기능을 개발했습니다.</p>
        </article>
        <article class="timeline-item">
          <div class="timeline-meta">2023.12–2024.02 · SOLO IOS</div>
          <h3>어디여 · Location-Based Reminder App</h3>
          <p class="timeline-role">Swift · UIKit · MapKit · CoreLocation</p>
          <p>위치 검색과 Geofencing 기반 알림을 End-to-End로 설계·개발해 App Store에 출시했습니다.</p>
        </article>
        <article class="timeline-item">
          <div class="timeline-meta">2022.10–2023.02 · 8-PERSON TEAM</div>
          <h3>머니뭐니 · Goal-Based Asset Management App</h3>
          <p class="timeline-role">PM & iOS Lead · Swift · UIKit</p>
          <p>서비스 기획과 iOS 개발을 리드해 목표 기반 자산관리 앱을 App Store에 출시했습니다.</p>
        </article>
      </div>
      ${actionButtons(
        { label: "출시 앱 보기", command: "applications" },
        { label: "연구 논문 보기", command: "publications" },
        { label: "연구과제 보기", command: "grants" }
      )}
    </article>`,

  research: () => `
    <article class="answer-document">
      <p class="answer-kicker">RESEARCH · SENSOR CALIBRATION · EDGE AI</p>
      <h2>배포 조건을 문제 정의에 넣는<br><span>deployment-oriented research.</span></h2>
      <p class="answer-lead">핵심 연구축은 Sensor Calibration, Model Compression, On-Device AI, Anomaly Detection, Time-Series Analysis, Autonomous Perception입니다. 모델 정확도만 비교하지 않고 latency, memory, runtime resource까지 실제 배포 조건으로 함께 평가합니다.</p>
      <div class="answer-grid three">
        <section class="answer-panel"><span class="section-no">FOCUS 01</span><h3>Sensor Calibration</h3><p>Reference 기반 센서 보정, drift adaptation, 장기 시계열 데이터와 실시간 이상 탐지.</p></section>
        <section class="answer-panel"><span class="section-no">FOCUS 02</span><h3>On-Device AI</h3><p>TFLite, Raspberry Pi, 경량 모델과 resource-aware deployment.</p></section>
        <section class="answer-panel"><span class="section-no">FOCUS 03</span><h3>Autonomous Perception</h3><p>Camera–LiDAR extrinsic drift, camera homography recovery, perception reliability.</p></section>
      </div>
      ${actionButtons(
        { label: "Selected Publications", command: "publications" },
        { label: "AI Projects", command: "projects" },
        { label: "Research Grants", command: "grants" }
      )}
    </article>`,

  publications: () => `
    <article class="answer-document">
      <p class="answer-kicker">SELECTED PUBLICATIONS</p>
      <h2>센서 보정에서 On-Device Agent,<br><span>Korean Writing Assessment까지.</span></h2>
      <p class="answer-lead">Resume에 정리된 selected publications 기준입니다. 저자 순서와 학회/저널 표기를 그대로 반영했습니다.</p>
      <div class="publication-list">
        ${publicationCard({
          venue: "JOURNAL OF KIISE · JOK 2026",
          rank: "1ST",
          title: "A Sensor Calibration Model for Balancing Accuracy, Latency, and Resource Efficiency",
          note: "정확도·지연시간·리소스 효율의 균형을 고려한 경량 Sensor Calibration 모델 연구."
        })}
        ${publicationCard({
          venue: "KSC 2026",
          rank: "2ND",
          title: "IoT 센서의 드리프트 적응형 실시간 보정을 위한 경량 신경망 모듈 프레임워크",
          note: "IoT 센서 드리프트에 적응하는 실시간 경량 보정 프레임워크."
        })}
        ${publicationCard({
          venue: "KCC 2026",
          rank: "2ND",
          title: "적응형 툴 스키마를 활용한 모바일 온디바이스 에이전트 최적화",
          note: "모바일 환경에서 온디바이스 에이전트의 도구 사용 효율을 최적화한 연구."
        })}
        ${publicationCard({
          venue: "ACM/SIGAPP SAC 2026",
          rank: "3RD",
          title: "From Evaluation to Feedback: A Feature-Based and LLM-Constrained Tool for Korean Writing Assessment",
          note: "한국어 작문 평가와 LLM 기반 피드백 생성을 연결한 분석 도구."
        })}
        ${publicationCard({
          venue: "KIIT 2024 · BEST PAPER GOLD",
          rank: "1ST",
          title: "미세먼지 보간 모델을 위한 지역배치 정규화 기법",
          note: "지역별 분포 차이를 고려한 미세먼지 보간 모델 정규화 기법."
        })}
      </div>
      ${actionButtons(
        { label: "Research focus", command: "research" },
        { label: "Research grants", command: "grants" }
      )}
    </article>`,

  projects: () => `
    <article class="answer-document">
      <p class="answer-kicker">SELECTED AI PROJECTS · BUILD · DEPLOY</p>
      <h2>연구 아이디어를<br><span>실제 동작하는 파이프라인으로.</span></h2>
      <p class="answer-lead">Resume의 Selected Projects와 AI GitHub 저장소를 연결했습니다. 카드 전체를 클릭하면 상세 GitHub repository로 이동합니다.</p>
      <div class="project-list">
        ${projectCard({
          href: REPOS.lidar, no: "PROJECT 01 · AUTONOMOUS PERCEPTION", meta: "2025.11–2026.06",
          title: "Camera–LiDAR 6DoF Calibration Drift Recovery",
          subtitle: "RGB · Depth · Edge · Residual fusion → 6DoF + Confidence",
          copy: "Extrinsic drift 상태에서 RGB·Depth·Edge·Residual 특징을 융합해 6DoF 보정값과 Confidence를 추정하는 MSF-CalibNet 프로젝트입니다.",
          image: IMAGES.lidar, alt: "Camera LiDAR calibration recovery report",
          metrics: metric("62.5%","COMPLETE RECOVERY")+metric("83.3%","ERROR IMPROVED")+metric("6DoF","SE(3)")+metric("TFLite","EDGE EXPORT"),
          tagsHtml: tags("TensorFlow","Camera-LiDAR Fusion","KITTI","SE(3)","OpenCV","TFLite"),
          chart: `<div class="mini-chart"><div><span style="--v:.625"></span><b>Complete recovery</b><em>62.5%</em></div><div><span style="--v:.833"></span><b>Reprojection improved</b><em>83.3%</em></div></div>`
        })}
        ${projectCard({
          href: REPOS.camera, no: "PROJECT 02 · CAMERA CALIBRATION", meta: "2025.03–2026.06",
          title: "Camera Calibration Drift Detection & Recovery",
          subtitle: "Detect drift → 8D Homography → ECC refinement → INT8",
          copy: "Calibration Drift를 자동 탐지하고 8D Homography를 추정해 영상 정합을 복구하는 End-to-End 모델로, TFLite INT8 Edge 배포 구조까지 구현했습니다.",
          image: IMAGES.camera, alt: "Camera calibration drift recovery report",
          metrics: metric("24.3→2.1","PIXEL MAE")+metric(".78→.96","SSIM")+metric("8D","HOMOGRAPHY")+metric("INT8","TFLITE"),
          tagsHtml: tags("TensorFlow","OpenCV","Homography","HomoMamba","ECC","TFLite"),
          chart: `<div class="compare-chart"><div><b>Pixel MAE</b><span class="before" style="--v:1"></span><em>24.3</em><span class="after" style="--v:.086"></span><em>2.1</em></div><div><b>SSIM</b><span class="before" style="--v:.78"></span><em>.78</em><span class="after" style="--v:.96"></span><em>.96</em></div></div>`
        })}
        ${projectCard({
          href: REPOS.realtime, no: "PROJECT 03 · REAL-TIME SENSOR AI", meta: "2025.09–2025.10",
          title: "Multi-sensor Real-time Calibration & Robust Anomaly Detection",
          subtitle: "5 sensors · 30s resampling · 180-step window · online monitoring",
          copy: "PM1·습도·온도·CO·CO₂ 5종 센서의 Reference 기반 Calibration과 Robust Z-Score Level/Jump 이상 탐지를 결합한 실시간 파이프라인입니다.",
          image: IMAGES.realtime, alt: "실시간 센서 보정 결과 그래프",
          metrics: metric("5","SENSOR CHANNELS")+metric("30s","RESAMPLING")+metric("180","WINDOW")+metric("Online","MONITORING"),
          tagsHtml: tags("TensorFlow","Time Series","Sensor Calibration","Anomaly Detection")
        })}
        ${projectCard({
          href: REPOS.distill, no: "PROJECT 04 · MODEL COMPRESSION", meta: "2025.07–2025.09",
          title: "Knowledge Distillation Vision Model & Raspberry Pi Edge Deployment",
          subtitle: "Teacher CNN → Student CNN → Raspberry Pi benchmark",
          copy: "6-Class 이미지 분류 Teacher–Student CNN에 Knowledge Distillation을 적용하고 Raspberry Pi 환경 실제 추론 Benchmark 파이프라인을 구성했습니다.",
          image: IMAGES.distill, alt: "쓰레기 분류 CNN confusion matrix",
          metrics: metric("3.31M→1.85M","PARAMETERS")+metric("44.1%","LIGHTWEIGHTING")+metric("RPi","EDGE TARGET")+metric("CNN","VISION"),
          tagsHtml: tags("TensorFlow","CNN","Knowledge Distillation","Raspberry Pi"),
          chart: `<div class="compression-chart"><div><b>Teacher</b><span style="--v:1"></span><em>3.31M</em></div><div><b>Student</b><span style="--v:.559"></span><em>1.85M</em></div></div>`
        })}
      </div>
      ${actionButtons(
        { label: "Camera–LiDAR 상세", command: "lidar" },
        { label: "Camera drift 상세", command: "camera" },
        { label: "출시 앱", command: "applications" }
      )}
    </article>`,

  realtime: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT · REAL-TIME SENSOR AI</p>
      <h2>센서 보정에서<br><span>Online Monitoring까지.</span></h2>
      <p class="answer-lead">PM1·습도·온도·CO·CO₂ 5종 센서를 30초 단위로 resampling하고 180-step window 기반 보정 후 Robust Z-Score로 Level/Jump 이상을 감지합니다.</p>
      <div class="visual-grid">
        ${visualCard({href:REPOS.realtime,image:IMAGES.realtime,kicker:"RESULT · SENSOR CALIBRATION",title:"Real-time calibration result",caption:"실제 README에 공개된 센서 보정 결과 그래프."})}
        ${visualCard({href:REPOS.realtime,image:IMAGES.realtimeCo,kicker:"RESULT · CO CHANNEL",title:"Robust anomaly monitoring",caption:"보정된 센서 신호와 이상 탐지 결과 시각화."})}
      </div>
      ${actionButtons({ label: "GitHub 상세 구현", href: REPOS.realtime })}
    </article>`,

  lidar: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT · CAMERA–LIDAR</p>
      <h2>센서 정렬이 무너졌을 때,<br><span>6DoF 보정값을 직접 예측합니다.</span></h2>
      <p class="answer-lead">RGB, sparse depth, edge, residual feature를 융합해 roll·pitch·yaw·tx·ty·tz와 confidence를 예측하고 recovery 상태를 reprojection error로 평가합니다.</p>
      <div class="visual-grid">
        ${visualCard({href:REPOS.lidar,image:IMAGES.lidar,kicker:"RECOVERY REPORT",title:"Model + edge refinement",caption:"정상 / drift / recovered projection 결과."})}
        ${visualCard({href:REPOS.lidar,image:IMAGES.lidarOverlay,kicker:"TRI-COLOR OVERLAY",title:"Projection alignment",caption:"Green · Red · Cyan overlay로 복구 상태를 비교."})}
      </div>
      <div class="mini-chart"><div><span style="--v:.625"></span><b>Complete recovery</b><em>62.5%</em></div><div><span style="--v:.833"></span><b>Reprojection improved</b><em>83.3%</em></div></div>
      ${actionButtons({ label: "Camera–LiDAR GitHub", href: REPOS.lidar })}
    </article>`,

  camera: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT · CAMERA CALIBRATION</p>
      <h2>카메라 drift를 감지하고,<br><span>영상 정합을 자동 복구합니다.</span></h2>
      <p class="answer-lead">8D Homography를 예측하고 ECC refinement를 결합해 calibration drift를 복구하며, TFLite INT8 기반 Edge 배포 경로까지 구성했습니다.</p>
      <div class="visual-grid">
        ${visualCard({href:REPOS.camera,image:IMAGES.camera,kicker:"RECOVERY REPORT",title:"Camera recovery result",caption:"Drifted image와 recovered output 비교."})}
        ${visualCard({href:REPOS.camera,image:IMAGES.cameraAlt,kicker:"OUTPUT",title:"Alignment recovery",caption:"실제 README recovery visualization."})}
      </div>
      <div class="compare-chart"><div><b>Pixel MAE</b><span class="before" style="--v:1"></span><em>24.3</em><span class="after" style="--v:.086"></span><em>2.1</em></div><div><b>SSIM</b><span class="before" style="--v:.78"></span><em>.78</em><span class="after" style="--v:.96"></span><em>.96</em></div></div>
      ${actionButtons({ label: "Camera calibration GitHub", href: REPOS.camera })}
    </article>`,

  distill: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT · MODEL COMPRESSION</p>
      <h2>큰 모델의 지식을<br><span>더 작은 Edge 모델로.</span></h2>
      <p class="answer-lead">Teacher–Student CNN에 Knowledge Distillation을 적용해 parameter를 3.31M에서 1.85M으로 약 44.1% 줄이고 Raspberry Pi 실제 장치 추론을 목표로 benchmark 파이프라인을 구성했습니다.</p>
      ${visualCard({href:REPOS.distill,image:IMAGES.distill,kicker:"MODEL EVALUATION",title:"Waste classification confusion matrix",caption:"분류 성능과 클래스별 혼동을 확인한 실제 결과."})}
      <div class="compression-chart"><div><b>Teacher</b><span style="--v:1"></span><em>3.31M</em></div><div><b>Student</b><span style="--v:.559"></span><em>1.85M</em></div></div>
      ${actionButtons({ label: "Knowledge Distillation GitHub", href: REPOS.distill })}
    </article>`,

  applications: () => `
    <article class="answer-document">
      <p class="answer-kicker">APPLICATION DEVELOPMENT · RELEASED PRODUCTS</p>
      <h2>AI 이전에도,<br><span>사용자가 쓰는 제품을 직접 만들었습니다.</span></h2>
      <p class="answer-lead">GitHub의 실제 앱 저장소와 Resume의 역할·기간을 연결했습니다. 머니뭐니와 어디여는 App Store 출시 경험이며, RealWear 프로젝트는 산업 현장 원격 협업용 Android/WebRTC 경험입니다.</p>
      <div class="application-grid">
        ${applicationCard({
          title: "머니뭐니",
          meta: "2022.10–2023.02 · RELEASED IOS APP",
          role: "PM & iOS Lead · 8-person team",
          copy: "목표 금액과 지출을 시각적으로 연결한 Goal-Based Asset Management App. 서비스 기획과 iOS 개발을 리드해 App Store에 출시했습니다.",
          image: IMAGES.money,
          github: REPOS.money,
          appStore: APPSTORE.money,
          tagsHtml: tags("Swift","UIKit","PM","iOS Lead")
        })}
        ${applicationCard({
          title: "어디여",
          meta: "2023.12–2024.02 · SOLO IOS",
          role: "Solo iOS Developer",
          copy: "위치 검색, Map marker, Geofencing 기반 local notification을 결합한 Location-Based Reminder App을 End-to-End로 개발해 출시했습니다.",
          image: IMAGES.eodiyeo,
          github: REPOS.eodiyeo,
          appStore: APPSTORE.eodiyeo,
          tagsHtml: tags("Swift","UIKit","MapKit","CoreLocation","UserNotifications")
        })}
        ${applicationCard({
          title: "RealWear Remote Collaboration",
          meta: "2023.09–2023.12 · INDUSTRIAL IOT",
          role: "Android Client Development",
          copy: "산업 현장 작업자와 원격 전문가 간 실시간 협업을 위해 N:M 영상·음성 통신 UI와 통화 기능을 구현했습니다. 공개 GitHub에는 Kurento 기반 backend 실행 구성이 확인됩니다.",
          github: REPOS.realwear,
          tagsHtml: tags("Kotlin","Android","WebRTC","WebSocket","Kurento"),
          system: true
        })}
      </div>
      <div class="evidence-note"><strong>GitHub evidence:</strong> jinyongyun 프로필에는 머니뭐니·어디여 출시 앱이 정리되어 있고, 각 저장소 README에서 App Store 링크와 구현 내용을 확인할 수 있습니다.</div>
      ${actionButtons(
        { label: "Product GitHub", href: PRIMARY_GITHUB },
        { label: "AI/Research Projects", command: "projects" }
      )}
    </article>`,

  grants: () => `
    <article class="answer-document">
      <p class="answer-kicker">FUNDED RESEARCH PROJECTS</p>
      <h2>논문 단위 연구를 넘어,<br><span>장기 연구과제로 확장합니다.</span></h2>
      <div class="grant-list">
        ${grantCard({
          title: "초경량 딥러닝을 사용한 저비용/고효율 센서 보정 시스템",
          meta: "2025.09–2026.08 · 단독과제",
          copy: "장기간 다종센서 데이터를 수집하고 초소형 임베디드 환경에서 동작 가능한 경량 Sensor Calibration 모델을 개발합니다.",
          source: "NRF"
        })}
        ${grantCard({
          title: "인간처럼 회상이 가능한 인공 신경망 지속학습 플랫폼 개발",
          meta: "2025.01–2026.12",
          copy: "치매 환자의 회상을 유도하도록 대화하고 기억을 이미지로 생성하는 chatbot 설계 및 개발에 참여합니다.",
          source: "IITP"
        })}
        ${grantCard({
          title: "사용자 중심의 한국어 텍스트 분석 도구(U-KTA) 개발",
          meta: "2023.06–2026.05",
          copy: "학생 작문글을 국어학적 근거로 자동 평가하고 LLM 피드백을 제공하는 framework 개발 연구입니다.",
          source: "NRF",
          href: REPOS.ukta
        })}
      </div>
      ${actionButtons(
        { label: "Selected publications", command: "publications" },
        { label: "Research projects", command: "projects" }
      )}
    </article>`,

  skills: () => `
    <article class="answer-document">
      <p class="answer-kicker">SKILLS · EDUCATION</p>
      <h2>연구용 모델부터<br><span>Edge와 Application까지.</span></h2>
      <div class="answer-grid two">
        <section class="answer-panel"><span class="section-no">PROGRAMMING</span><h3>Python · C · C++ · SQL</h3><p>AI 연구, 데이터 처리, 시스템 구현을 위한 핵심 언어.</p></section>
        <section class="answer-panel"><span class="section-no">AI / DEEP LEARNING</span><h3>PyTorch · TensorFlow · CUDA</h3><p>시계열, 비전, 센서 보정 모델의 학습·평가.</p></section>
        <section class="answer-panel"><span class="section-no">EDGE / DEPLOYMENT</span><h3>TFLite · ONNX · Linux</h3><p>경량화, Raspberry Pi, 임베디드·Edge 추론 파이프라인.</p></section>
        <section class="answer-panel"><span class="section-no">APPLICATION</span><h3>Swift · UIKit · Kotlin · Android</h3><p>MapKit, CoreLocation, WebRTC, WebSocket을 포함한 실제 제품 개발 경험.</p></section>
      </div>
      <div class="education-card"><span><b>M.S. AI, Computer Engineering</b><br>Inha University · 2025.03–2027.02</span><strong>GPA 4.21 / 4.5</strong></div>
      <div class="education-card"><span><b>B.S. Computer Science</b><br>Inha University · 2019.03–2025.02</span><strong>GPA 4.21 / 4.5</strong></div>
      ${actionButtons({ label: "Awards & Credentials", command: "awards" })}
    </article>`,

  awards: () => `
    <article class="answer-document">
      <p class="answer-kicker">AWARDS · CERTIFICATIONS · LANGUAGE</p>
      <h2>연구 성과와<br><span>실무 역량을 함께 증명합니다.</span></h2>
      <div class="award-grid">
        ${awardCard({meta:"2024.11.22 · KIIT",title:"우수논문상 금상",copy:"한국정보기술학회 추계종합학술대회."})}
        ${awardCard({meta:"2025.11.02 · INHA UNIVERSITY",title:"공과대학장상 우수상",copy:"탄소중립 INNOVATION ACADEMY."})}
        ${awardCard({meta:"CERTIFICATION",title:"SQLD",copy:"SQL 개발자 자격."})}
        ${awardCard({meta:"2026.07 · ENGLISH",title:"OPIc IH",copy:"English speaking proficiency."})}
      </div>
      ${actionButtons({ label: "Resume overview", command: "resume" })}
    </article>`,

  contact: () => `
    <article class="answer-document">
      <p class="answer-kicker">CONTACT</p>
      <h2>Research와 Engineering을<br><span>함께 이야기하고 싶다면.</span></h2>
      <p class="answer-lead">공개 포트폴리오에는 이메일과 GitHub만 연결합니다.</p>
      <div class="contact-grid">
        <a href="mailto:yunjinyong7302000@gmail.com"><span>EMAIL</span><strong>yunjinyong7302000@gmail.com</strong><i>↗</i></a>
        <a href="${PRIMARY_GITHUB}" target="_blank" rel="noreferrer"><span>PRODUCT GITHUB</span><strong>github.com/jinyongyun</strong><i>↗</i></a>
        <a href="${AI_GITHUB}" target="_blank" rel="noreferrer"><span>AI / RESEARCH GITHUB</span><strong>github.com/yunjinyong730</strong><i>↗</i></a>
      </div>
    </article>`,

  fallback: () => `
    <article class="answer-document">
      <p class="answer-kicker">PORTFOLIO GUIDE</p>
      <h2>이 주제들로<br><span>윤진용의 경험을 탐색할 수 있어요.</span></h2>
      <div class="suggestion-grid">
        <button type="button" data-command="resume">Resume 한눈에 보기</button>
        <button type="button" data-command="publications">Selected publications</button>
        <button type="button" data-command="projects">AI 프로젝트</button>
        <button type="button" data-command="applications">출시 앱 / Product</button>
        <button type="button" data-command="grants">연구과제</button>
        <button type="button" data-command="awards">수상 / 자격</button>
      </div>
    </article>`,
};

function classifyQuery(raw) {
  const q = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return "me";

  if (/camera.?lidar|lidar|라이다|6dof|extrinsic/.test(q)) return "lidar";
  if (/camera.*drift|카메라.*드리프트|homography|homomamba|ecc/.test(q)) return "camera";
  if (/raspberry|distill|knowledge|경량.*vision|teacher|student/.test(q)) return "distill";
  if (/실시간.*센서|anomaly|이상.*탐지|robust z|멀티센서/.test(q)) return "realtime";

  if (/머니뭐니|어디여|realwear|app store|앱스토어|출시.*앱|application|product|ios|android/.test(q)) return "applications";
  if (/논문|publication|paper|jok|ksc|kcc|sac/.test(q)) return "publications";
  if (/연구.?과제|grant|nrf|iitp|funded/.test(q)) return "grants";
  if (/경력|experience|career|연구실|학부연구생|석사과정/.test(q)) return "experience";
  if (/수상|award|자격|credential|opic|sqld|영어/.test(q)) return "awards";
  if (/resume|이력서|한눈에|요약/.test(q)) return "resume";
  if (/skill|기술|학력|education|전공|gpa/.test(q)) return "skills";
  if (/contact|연락|email|메일|깃허브|github/.test(q)) return "contact";
  if (/project|프로젝트/.test(q)) return "projects";
  if (/research|연구|sensor calibration|edge ai|on-device/.test(q)) return "research";
  if (/윤진용|jinyong|소개|누구|어떤.*엔지니어|about/.test(q)) return "me";

  return "fallback";
}

function openChat() {
  app?.classList.remove("is-landing");
  app?.classList.add("is-chatting");
  window.requestAnimationFrame(() => chatInput?.focus({ preventScroll: true }));
}

function goHome() {
  app?.classList.remove("is-chatting");
  app?.classList.add("is-landing");
  if (messageList) messageList.innerHTML = "";
  if (landingInput) landingInput.value = "";
  if (chatInput) chatInput.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addUserMessage(text) {
  if (!messageList) return;
  const wrapper = document.createElement("div");
  wrapper.className = "user-message";
  const label = document.createElement("span");
  label.textContent = "YOU";
  const bubble = document.createElement("p");
  bubble.textContent = text;
  wrapper.append(label, bubble);
  messageList.appendChild(wrapper);
}

function prepareInteractiveContent(container) {
  const targets = container.querySelectorAll(
    ".project-card, .result-visual, .answer-panel, .timeline-item, .publication-card, .grant-card, .application-card, .award-card, .resume-stat, .account-card, .education-card"
  );
  targets.forEach((node, index) => {
    node.classList.add("pop-target");
    node.style.setProperty("--pop-delay", `${Math.min(index * 75, 600)}ms`);
  });

  container.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      const parent = image.parentElement;
      image.style.display = "none";
      if (parent && !parent.querySelector(".image-fallback-label")) {
        const fallback = document.createElement("span");
        fallback.className = "image-fallback-label";
        fallback.textContent = "GitHub preview";
        parent.appendChild(fallback);
      }
    }, { once: true });
  });
}

function addAssistantMessage(route) {
  if (!messageList) return;
  const wrapper = document.createElement("div");
  wrapper.className = "assistant-message";
  wrapper.innerHTML = `
    <div class="assistant-mark" aria-hidden="true">✦</div>
    <div class="assistant-content">${(answers[route] || answers.fallback)()}</div>
  `;
  messageList.appendChild(wrapper);
  prepareInteractiveContent(wrapper);
  window.requestAnimationFrame(() => {
    wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function submitQuery(query) {
  const text = query.trim();
  if (!text) return;
  openChat();
  addUserMessage(text);
  const route = classifyQuery(text);
  window.setTimeout(() => addAssistantMessage(route), 180);
  if (landingInput) landingInput.value = "";
  if (chatInput) chatInput.value = "";
}

landingComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuery(landingInput?.value || landingInput?.placeholder || commandQueries.me);
});

chatComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuery(chatInput?.value || "");
});

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget?.dataset.action === "home") {
    goHome();
    return;
  }

  const commandTarget = event.target.closest("[data-command]");
  if (commandTarget) {
    const command = commandTarget.dataset.command;
    submitQuery(commandQueries[command] || command);
    return;
  }

  const queryTarget = event.target.closest("[data-query]");
  if (queryTarget) {
    submitQuery(queryTarget.dataset.query || "");
  }
});

mascotStage?.addEventListener("click", () => submitQuery(commandQueries.me));

if (mascotStage && aiBot) {
  mascotStage.addEventListener("pointermove", (event) => {
    const rect = mascotStage.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    aiBot.style.setProperty("--look-x", `${nx * 7}px`);
    aiBot.style.setProperty("--look-y", `${ny * 5}px`);
    aiBot.style.setProperty("--tilt-x", `${ny * -4}deg`);
    aiBot.style.setProperty("--tilt-y", `${nx * 7}deg`);
    pupils.forEach((pupil) => {
      pupil.style.transform = `translate(${nx * 4}px, ${ny * 3}px)`;
    });
  });

  mascotStage.addEventListener("pointerleave", () => {
    aiBot.style.setProperty("--look-x", "0px");
    aiBot.style.setProperty("--look-y", "0px");
    aiBot.style.setProperty("--tilt-x", "0deg");
    aiBot.style.setProperty("--tilt-y", "0deg");
    pupils.forEach((pupil) => {
      pupil.style.transform = "translate(0, 0)";
    });
  });
}

let placeholderIndex = 0;
window.setInterval(() => {
  if (!landingInput || document.activeElement === landingInput || landingInput.value) return;
  placeholderIndex = (placeholderIndex + 1) % placeholderQueries.length;
  landingInput.placeholder = placeholderQueries[placeholderIndex];
}, 3600);
