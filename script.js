const app = document.querySelector("#app");
const landingComposer = document.querySelector("#landingComposer");
const landingInput = document.querySelector("#landingInput");
const chatComposer = document.querySelector("#chatComposer");
const chatInput = document.querySelector("#chatInput");
const messageList = document.querySelector("#messageList");
const mascotStage = document.querySelector("#mascotStage");
const aiBot = document.querySelector("#aiBot");
const pupils = [...document.querySelectorAll(".pupil")];

const repo = (name) => `https://github.com/yunjinyong730/${name}`;

const REPOS = {
  realtime: repo("Real_time_Sensor_Calibration_Anomaly_Detection"),
  lidar: repo("LiDAR_Sensor_Calibration_Aware_Failure_Monitoring"),
  camera: repo("Autonomous-driving-camera-calibration-drift-detection-recovery"),
  distill: repo("Custom_CNN_Waste_Classification_Knowledge_Distillation_Raspberry"),
  ukta: repo("UKTA_v2"),
};

const IMAGES = {
  realtime: "https://github.com/user-attachments/assets/73b538b8-a8a9-493e-866c-ce6fa69b4caa",
  realtimeCo: "https://github.com/user-attachments/assets/d39c3fc5-a519-446a-a21f-96c816a4f204",
  lidar: "https://github.com/user-attachments/assets/a607b93e-fd4c-4166-8318-8682405bc791",
  lidarOverlay: "https://github.com/user-attachments/assets/2c45f1b4-1c85-4519-9b09-50f6c3f3e63a",
  camera: "https://github.com/user-attachments/assets/3af94c0e-f511-416f-b227-7b668ab430cd",
  cameraAlt: "https://github.com/user-attachments/assets/6a8cc51f-e0e4-4093-9476-1eccc79912a1",
  distill: "https://github.com/user-attachments/assets/8431bec6-34d4-4bcc-936a-22c8b7cbeb50",
};

const commandQueries = {
  me: "윤진용은 어떤 AI/ML Engineer야?",
  research: "핵심 연구와 논문을 보여줘",
  projects: "대표 프로젝트를 보여줘",
  skills: "기술 스택과 학력을 알려줘",
  contact: "윤진용에게 연락하고 싶어",
};

const metric = (value, label) =>
  `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;

const tags = (...items) =>
  `<div class="tag-row">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;

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

const answers = {
  me: () => `
    <article class="answer-document">
      <p class="answer-kicker">ABOUT · RESEARCH TO REAL-WORLD AI</p>
      <h2>모델 연구에 그치지 않고,<br><span>실제로 동작하는 시스템까지.</span></h2>
      <p class="answer-lead">윤진용은 실세계 문제를 정의하고 데이터를 구축한 뒤, AI 모델을 설계하고 Edge device와 Application까지 연결하는 AI/ML Engineer입니다. 정확도뿐 아니라 latency, memory, resource efficiency와 실제 배포 조건을 함께 다룹니다.</p>
      <div class="answer-grid three">
        <section class="answer-panel"><span class="section-no">01 · RESEARCH</span><h3>AI Research</h3><p>Sensor Calibration, Model Compression, On-Device AI를 중심으로 배포 요구사항을 모델 설계에 포함합니다.</p></section>
        <section class="answer-panel"><span class="section-no">02 · EDGE</span><h3>Edge Deployment</h3><p>TensorFlow/TFLite, Raspberry Pi, Arduino 환경에서 실제 장치 검증까지 연결합니다.</p></section>
        <section class="answer-panel"><span class="section-no">03 · PRODUCT</span><h3>Application</h3><p>실시간 파이프라인과 Android/iOS 경험을 바탕으로 사용자가 쓰는 형태까지 구현합니다.</p></section>
      </div>
      <div class="process-flow"><span><b>01</b>Problem</span><span><b>02</b>Research</span><span><b>03</b>Build</span><span><b>04</b>Deploy</span><span><b>05</b>Product</span></div>
    </article>`,

  research: () => `
    <article class="answer-document">
      <p class="answer-kicker">RESEARCH · SENSOR CALIBRATION · ON-DEVICE AI</p>
      <h2>배포 조건을 문제 정의에 넣는<br><span>deployment-oriented research.</span></h2>
      <p class="answer-lead">SCALE과 S-CALIBER를 중심으로 accuracy, worst-case latency, memory, runtime headroom을 함께 평가하고, 장기 실내 센서 데이터와 실제 MCU 검증까지 연결합니다.</p>
      <div class="paper-list">
        <section class="paper-card">
          <div class="card-topline"><span>PAPER 01 · JOK 2026</span><span>1ST AUTHOR</span></div>
          <h3>SCALE</h3><p class="card-subtitle">Balanced Sensor Calibration for On-Device AI</p>
          <p class="card-copy">CSP와 Binary Hash Attention을 사용해 긴 시계열을 압축하면서 계산 부담을 줄이고 실제 MCU 배포 병목을 함께 평가합니다.</p>
          <div class="metric-grid">${metric("14.03","PM10 RMSE")}${metric("5.67","PM2.5 RMSE")}${metric("1.72ms","MAX LATENCY")}${metric("7.1%","MAX CPU UTIL.")}</div>
        </section>
        <section class="paper-card">
          <div class="card-topline"><span>PAPER 02 · IoT JOURNAL 2026</span><span>1ST AUTHOR</span></div>
          <h3>S-CALIBER</h3><p class="card-subtitle">Microscopic Requirement-Aware Sensor Calibration</p>
          <p class="card-copy">배포 가능성을 7개 요구사항으로 분해해 요구사항 → 모델 구조 → 데이터셋 → MCU 검증이 하나의 스토리로 이어지도록 설계했습니다.</p>
          <div class="metric-grid">${metric("7/7","REQUIREMENTS")}${metric("15 wk.","INDOOR DATA")}${metric("1.72ms","MAX LATENCY")}${metric("7.1%","MAX CPU")}</div>
        </section>
        <section class="paper-card">
          <div class="card-topline"><span>DATASET · EDGE RESEARCH</span><span>6 MONTHS</span></div>
          <h3>Indoor Sensor Calibration</h3><p class="card-subtitle">Dataset, Scenarios & Edge Model</p>
          <p class="card-copy">5개 위치에서 6개월 동안 데이터를 수집하고 limited reference, unseen location, drift, event shift 시나리오를 평가합니다.</p>
          <div class="metric-grid">${metric("6 mo.","DATASET")}${metric("5","LOCATIONS")}${metric("6.1M","PAIRED OBS.")}${metric("42.6KB","MODEL MEMORY")}</div>
        </section>
      </div>
    </article>`,

  projects: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECTS · BUILD · DEPLOY</p>
      <h2>채팅 안에서 결과를 보고,<br><span>한 번에 실제 GitHub로.</span></h2>
      <p class="answer-lead">각 프로젝트 카드에 실제 README 결과 이미지를 넣었습니다. 이미지나 카드의 어느 곳을 클릭해도 해당 GitHub repository 상세 페이지가 새 탭으로 열립니다.</p>
      <div class="project-list">
        ${projectCard({
          href: REPOS.realtime, no: "PROJECT 01 · REAL-TIME SENSOR AI", meta: "5 CHANNELS · 30s",
          title: "Multi-sensor Real-time Calibration & Anomaly Detection",
          subtitle: "Calibration → Robust Z anomaly detection → online monitoring",
          copy: "PM1·Humidity·Temperature·CO·CO₂를 30초 단위로 정렬하고 180-step window 기반 calibration 후 Level/Jump 이상을 감지하는 실시간 파이프라인입니다.",
          image: IMAGES.realtime, alt: "실시간 센서 보정 결과 그래프",
          metrics: metric("5","SENSOR CHANNELS")+metric("30s","RESAMPLING")+metric("180","WINDOW")+metric("Online","MONITORING"),
          tagsHtml: tags("TensorFlow","Time Series","Sensor Calibration","Anomaly Detection")
        })}
        ${projectCard({
          href: REPOS.lidar, no: "PROJECT 02 · AUTONOMOUS PERCEPTION", meta: "6DoF + CONFIDENCE",
          title: "Camera–LiDAR Calibration Drift Recovery",
          subtitle: "RGB · Depth · Edge · Residual fusion",
          copy: "Extrinsic drift 상태에서 RGB, sparse depth, edge, residual을 융합해 6DoF 보정값과 confidence를 함께 추정하는 MSF-CalibNet 프로젝트입니다.",
          image: IMAGES.lidar, alt: "Camera LiDAR calibration recovery report",
          metrics: metric("62.5%","COMPLETE RECOVERY")+metric("83.3%","ERROR IMPROVED")+metric("6DoF","SE(3)")+metric("TFLite","EDGE EXPORT"),
          tagsHtml: tags("TensorFlow","KITTI","SE(3)","OpenCV","TFLite"),
          chart: `<div class="mini-chart"><div><span style="--v:.625"></span><b>Complete recovery</b><em>62.5%</em></div><div><span style="--v:.833"></span><b>Reprojection improved</b><em>83.3%</em></div></div>`
        })}
        ${projectCard({
          href: REPOS.camera, no: "PROJECT 03 · CAMERA CALIBRATION", meta: "HOMOGRAPHY · INT8",
          title: "Camera Calibration Drift Detection & Recovery",
          subtitle: "Detect drift → 8D Homography → ECC refinement",
          copy: "카메라 calibration drift를 자동 탐지하고 8D Homography를 추정한 뒤 ECC refinement로 영상 정합을 복구하고 TFLite INT8 배포 경로까지 구성했습니다.",
          image: IMAGES.camera, alt: "Camera calibration drift recovery report",
          metrics: metric("24.3→2.1","PIXEL MAE")+metric(".78→.96","SSIM")+metric("8D","HOMOGRAPHY")+metric("INT8","TFLITE"),
          tagsHtml: tags("TensorFlow","OpenCV","Homography","ECC","TFLite"),
          chart: `<div class="compare-chart"><div><b>Pixel MAE</b><span class="before" style="--v:1"></span><em>24.3</em><span class="after" style="--v:.086"></span><em>2.1</em></div><div><b>SSIM</b><span class="before" style="--v:.78"></span><em>.78</em><span class="after" style="--v:.96"></span><em>.96</em></div></div>`
        })}
        ${projectCard({
          href: REPOS.distill, no: "PROJECT 04 · MODEL COMPRESSION", meta: "RASPBERRY PI",
          title: "Knowledge Distillation Vision Model & Edge Deployment",
          subtitle: "Teacher CNN → Student CNN → Raspberry Pi benchmark",
          copy: "쓰레기 분류 CNN에 Knowledge Distillation을 적용해 student model을 경량화하고 Raspberry Pi 실제 장치 추론을 목표로 benchmark 파이프라인을 구성했습니다.",
          image: IMAGES.distill, alt: "쓰레기 분류 CNN confusion matrix",
          metrics: metric("3.31M→1.85M","PARAMETERS")+metric("44.1%","LIGHTWEIGHTING")+metric("RPi","EDGE TARGET")+metric("CNN","VISION"),
          tagsHtml: tags("TensorFlow","CNN","Knowledge Distillation","Raspberry Pi"),
          chart: `<div class="compression-chart"><div><b>Teacher</b><span style="--v:1"></span><em>3.31M</em></div><div><b>Student</b><span style="--v:.559"></span><em>1.85M</em></div></div>`
        })}
      </div>
    </article>`,

  realtime: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT 01 · REAL-TIME SENSOR AI</p>
      <h2>센서 보정에서<br><span>운영 모니터링까지.</span></h2>
      <p class="answer-lead">5개 센서 채널을 30초 단위로 resampling하고 180-step window로 보정한 뒤 Robust Z-Score 기반 Level/Jump 이상 탐지를 수행합니다.</p>
      ${visualCard({href:REPOS.realtime,image:IMAGES.realtime,kicker:"RESULT · SENSOR CALIBRATION",title:"Real-time calibration result",caption:"실제 GitHub README 결과 그래프입니다. 클릭하면 전체 구현으로 이동합니다."})}
      <div class="detail-actions"><a href="${REPOS.realtime}" target="_blank" rel="noreferrer">GitHub 상세 구현 보기 ↗</a></div>
    </article>`,

  lidar: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT 02 · CAMERA–LIDAR</p>
      <h2>Calibration drift를<br><span>6DoF correction으로 복구.</span></h2>
      <p class="answer-lead">RGB·Depth·Edge·Residual feature를 융합하고 SE(3) correction과 confidence를 출력합니다. Toy KITTI 24 frames 기준 complete recovery 62.5%, reprojection error 개선 83.3%를 확인한 파이프라인입니다.</p>
      <div class="visual-grid">
        ${visualCard({href:REPOS.lidar,image:IMAGES.lidar,kicker:"RECOVERY REPORT",title:"Model + edge refinement",caption:"정상 / drift / recovered projection 결과"})}
        ${visualCard({href:REPOS.lidar,image:IMAGES.lidarOverlay,kicker:"TRI-COLOR OVERLAY",title:"Projection alignment",caption:"Green · Red · Cyan overlay로 복구 상태를 비교"})}
      </div>
      <div class="mini-chart"><div><span style="--v:.625"></span><b>Complete recovery</b><em>62.5%</em></div><div><span style="--v:.833"></span><b>Reprojection improved</b><em>83.3%</em></div></div>
      <div class="detail-actions"><a href="${REPOS.lidar}" target="_blank" rel="noreferrer">Camera–LiDAR GitHub 상세 보기 ↗</a></div>
    </article>`,

  camera: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT 03 · CAMERA CALIBRATION</p>
      <h2>이미지의 calibration drift를<br><span>detect → estimate → refine.</span></h2>
      <p class="answer-lead">HomoMamba-CalibNet-Lite로 8D Homography를 추정하고 ECC refinement를 결합합니다. 포트폴리오의 수치는 toy validation 결과이며 Edge 배포를 위한 TFLite INT8 경로도 포함합니다.</p>
      <div class="visual-grid">
        ${visualCard({href:REPOS.camera,image:IMAGES.camera,kicker:"RECOVERY REPORT",title:"Camera recovery result",caption:"Drifted image와 recovered output 비교"})}
        ${visualCard({href:REPOS.camera,image:IMAGES.cameraAlt,kicker:"OUTPUT",title:"Alignment recovery",caption:"복구 파이프라인의 실제 README 시각화"})}
      </div>
      <div class="compare-chart"><div><b>Pixel MAE</b><span class="before" style="--v:1"></span><em>24.3</em><span class="after" style="--v:.086"></span><em>2.1</em></div><div><b>SSIM</b><span class="before" style="--v:.78"></span><em>.78</em><span class="after" style="--v:.96"></span><em>.96</em></div></div>
      <div class="detail-actions"><a href="${REPOS.camera}" target="_blank" rel="noreferrer">Camera calibration GitHub 상세 보기 ↗</a></div>
    </article>`,

  distill: () => `
    <article class="answer-document">
      <p class="answer-kicker">PROJECT 04 · MODEL COMPRESSION</p>
      <h2>큰 모델의 지식을<br><span>더 작은 Edge 모델로.</span></h2>
      <p class="answer-lead">Teacher–Student CNN에 Knowledge Distillation을 적용해 parameter를 3.31M에서 1.85M으로 줄이고 Raspberry Pi 실제 장치 추론을 목표로 구성했습니다.</p>
      ${visualCard({href:REPOS.distill,image:IMAGES.distill,kicker:"MODEL EVALUATION",title:"Waste classification confusion matrix",caption:"분류 성능과 클래스별 혼동을 확인한 실제 결과"})}
      <div class="compression-chart"><div><b>Teacher</b><span style="--v:1"></span><em>3.31M</em></div><div><b>Student</b><span style="--v:.559"></span><em>1.85M</em></div></div>
      <div class="detail-actions"><a href="${REPOS.distill}" target="_blank" rel="noreferrer">Knowledge Distillation GitHub 상세 보기 ↗</a></div>
    </article>`,

  skills: () => `
    <article class="answer-document">
      <p class="answer-kicker">SKILLS · EDUCATION</p>
      <h2>연구부터 Edge와<br><span>Application까지 연결하는 stack.</span></h2>
      <div class="answer-grid two">
        <section class="answer-panel"><span class="section-no">PROGRAMMING</span><h3>Python · C · C++ · SQL</h3><p>시계열, 딥러닝 실험, 데이터 파이프라인과 임베디드 연동.</p></section>
        <section class="answer-panel"><span class="section-no">AI / DL</span><h3>PyTorch · TensorFlow · CUDA</h3><p>Model design, evaluation, compression, deployment-oriented experiments.</p></section>
        <section class="answer-panel"><span class="section-no">EDGE</span><h3>TFLite · ONNX · Linux</h3><p>Raspberry Pi와 MCU를 포함한 실제 장치 추론 및 경량화.</p></section>
        <section class="answer-panel"><span class="section-no">APPLICATION</span><h3>Swift · UIKit · Kotlin · Android</h3><p>AI 결과를 실제 사용자 Application까지 연결.</p></section>
      </div>
      <div class="education-card"><span>M.S. Artificial Intelligence · Inha University · 2025.03–2027.02</span><strong>GPA 4.21 / 4.5</strong></div>
      <div class="education-card"><span>B.S. Computer Science · Inha University · 2019.03–2025.02</span><strong>GPA 4.35 / 4.5</strong></div>
    </article>`,

  contact: () => `
    <article class="answer-document">
      <p class="answer-kicker">CONTACT</p>
      <h2>Research to Real-World AI.<br><span>같이 이야기해요.</span></h2>
      <p class="answer-lead">AI/ML Research, Edge AI, Sensor Calibration, Autonomous Perception과 실제 제품 적용에 관심이 있습니다.</p>
      <div class="contact-grid">
        <a href="mailto:yunjinyong7302000@gmail.com"><span>EMAIL</span><strong>yunjinyong7302000@gmail.com</strong><i>↗</i></a>
        <a href="https://github.com/yunjinyong730" target="_blank" rel="noreferrer"><span>GITHUB</span><strong>github.com/yunjinyong730</strong><i>↗</i></a>
      </div>
    </article>`,

  unknown: (query) => `
    <article class="answer-document compact-answer">
      <p class="answer-kicker">PORTFOLIO GUIDE</p>
      <h2>“${escapeHtml(query)}”에 가장 가까운 내용을 찾았어요.</h2>
      <p class="answer-lead">아래 추천 질문 중 하나를 눌러보세요. 프로젝트 이름을 입력하면 해당 프로젝트의 실제 결과 이미지와 GitHub 링크까지 보여드립니다.</p>
      <div class="suggestion-grid">
        <button type="button" data-command="projects">대표 프로젝트 보여줘</button>
        <button type="button" data-query="Camera–LiDAR 프로젝트 보여줘">Camera–LiDAR</button>
        <button type="button" data-query="카메라 드리프트 프로젝트 보여줘">Camera drift</button>
        <button type="button" data-query="Raspberry Pi 프로젝트 보여줘">Raspberry Pi</button>
      </div>
    </article>`
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function resolveIntent(query) {
  const q = query.toLowerCase().replace(/\s+/g, " ");
  if (/lidar|라이다|camera.?lidar|6dof|se\(3\)/i.test(q)) return "lidar";
  if (/카메라.*(드리프트|캘리브레이션|보정)|camera.*(drift|calibration)|homography|homo/i.test(q)) return "camera";
  if (/raspberry|라즈베리|distill|경량|쓰레기|student|teacher/i.test(q)) return "distill";
  if (/실시간.*센서|이상.*탐|anomaly|real.?time.*sensor|robust z/i.test(q)) return "realtime";
  if (/project|프로젝트|구현|만든|build/i.test(q)) return "projects";
  if (/scale|s-caliber|논문|연구|research|paper|sensor calibration/i.test(q)) return "research";
  if (/skill|기술|스택|학력|교육|education|tensorflow|pytorch/i.test(q)) return "skills";
  if (/contact|연락|메일|email|github|깃허브/i.test(q)) return "contact";
  if (/누구|소개|어떤|about|윤진용|jinyong/i.test(q)) return "me";
  return "unknown";
}

function showChat() {
  app.classList.remove("is-landing");
  app.classList.add("is-chatting");
  requestAnimationFrame(() => chatInput?.focus());
}

function goHome() {
  app.classList.add("is-landing");
  app.classList.remove("is-chatting");
  messageList.innerHTML = "";
  landingInput.value = "";
  chatInput.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addUserMessage(query) {
  const row = document.createElement("div");
  row.className = "user-message";
  row.innerHTML = `<span>YOU</span><p>${escapeHtml(query)}</p>`;
  messageList.appendChild(row);
}

function addAssistantMessage(intent, query) {
  const row = document.createElement("div");
  row.className = "assistant-message";
  const answer = intent === "unknown" ? answers.unknown(query) : answers[intent]();
  row.innerHTML = `<div class="assistant-mark">✦</div><div class="assistant-content">${answer}</div>`;
  messageList.appendChild(row);
}

function ask(query) {
  const clean = String(query || "").trim();
  if (!clean) return;
  showChat();
  addUserMessage(clean);
  const intent = resolveIntent(clean);
  window.setTimeout(() => {
    addAssistantMessage(intent, clean);
    messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
  }, 180);
}

landingComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  ask(landingInput.value || landingInput.placeholder);
});

chatComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = chatInput.value;
  chatInput.value = "";
  ask(query);
});

document.addEventListener("click", (event) => {
  const homeButton = event.target.closest("[data-action='home']");
  if (homeButton) { goHome(); return; }

  const command = event.target.closest("[data-command]")?.dataset.command;
  if (command && commandQueries[command]) {
    ask(commandQueries[command]);
    return;
  }

  const query = event.target.closest("[data-query]")?.dataset.query;
  if (query) ask(query);
});

mascotStage?.addEventListener("click", () => ask("윤진용 개발자에 대해 알려줘"));

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
    pupils.forEach((pupil) => { pupil.style.transform = "translate(0, 0)"; });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && app.classList.contains("is-chatting")) goHome();
});
