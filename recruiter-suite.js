(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const TOUR_DURATION = 30000;
  const STEP_DURATION = 6000;

  const tourSteps = [
    {
      kicker: "01 · 30-SECOND RECRUITER BRIEF",
      title: "Research에서 <span>실제 시스템까지.</span>",
      copy: "Sensor Calibration · Model Compression · On-Device AI를 연구하고, 논문·Edge 배포·Application 출시까지 연결한 AI/ML Engineer입니다.",
      metrics: [["5", "SELECTED PAPERS"], ["3", "FUNDED PROJECTS"], ["2", "APP STORE RELEASES"], ["4", "SELECTED AI PROJECTS"]],
      proofs: [["resume", "Resume"], ["experience", "Career"]],
      highlight: "resume",
      speech: "30초 안에 핵심만 보여줄게. 연구만 한 사람이 아니라 실제 제품까지 연결해.",
    },
    {
      kicker: "02 · RESEARCH DEPTH",
      title: "문제 정의부터 <span>deployment 조건을 넣습니다.</span>",
      copy: "센서 보정, drift adaptation, 이상 탐지, 시계열 분석을 연구하면서 정확도뿐 아니라 latency · memory · resource efficiency를 함께 평가합니다.",
      metrics: [["Sensor", "CALIBRATION"], ["Time-Series", "ANOMALY"], ["Edge", "ON-DEVICE"], ["2026", "JOK · KSC · KCC · SAC"]],
      proofs: [["research", "Research focus"], ["publications", "Papers"], ["grants", "Funded work"]],
      highlight: "research",
      speech: "논문 수치만 보지 않고, 실제 장치에서 돌아가는 조건까지 같이 평가해.",
    },
    {
      kicker: "03 · EDGE / AUTONOMOUS PROOF",
      title: "모델을 <span>Edge에서 동작하게 만듭니다.</span>",
      copy: "Camera–LiDAR 6DoF calibration recovery, camera homography recovery, Knowledge Distillation을 TFLite · INT8 · Raspberry Pi 같은 실제 배포 경로와 연결했습니다.",
      metrics: [["62.5%", "COMPLETE RECOVERY"], ["83.3%", "REPROJECTION IMPROVED"], ["44.1%", "MODEL LIGHTWEIGHTING"], ["TFLite", "EDGE EXPORT"]],
      proofs: [["projects", "AI Projects"], ["lidar", "Camera–LiDAR"], ["camera", "Camera drift"]],
      highlight: "projects",
      speech: "여기가 엔지니어링 포인트야. 연구 결과를 TFLite와 Raspberry Pi까지 내려보냈어.",
    },
    {
      kicker: "04 · PRODUCT DELIVERY",
      title: "사용자가 쓰는 <span>제품까지 출시했습니다.</span>",
      copy: "Swift/UIKit 기반 iOS 앱 2종을 App Store에 출시했고, Kotlin/Android · WebRTC · WebSocket 기반 산업용 원격 협업 시스템 개발 경험도 갖고 있습니다.",
      metrics: [["2", "RELEASED IOS APPS"], ["Swift", "UIKIT"], ["Kotlin", "ANDROID"], ["WebRTC", "REAL-TIME"]],
      proofs: [["applications", "Released apps"], ["contact", "Contact"]],
      highlight: "applications",
      speech: "모델 데모에서 끝나지 않고, 실제 사용자가 설치하는 앱도 출시했어.",
    },
    {
      kicker: "05 · EVIDENCE-FIRST CANDIDATE",
      title: "주장보다 <span>증거를 먼저 보여줍니다.</span>",
      copy: "논문 PDF, GitHub 구현, App Store 출시, 연구과제와 수상 이력을 한 포트폴리오 안에서 서로 연결했습니다. Evidence Mode를 켜면 각 주장에 어떤 근거가 연결되는지 바로 확인할 수 있습니다.",
      metrics: [["4.21/4.5", "GPA"], ["OPIc IH", "ENGLISH"], ["KIIT", "BEST PAPER GOLD"], ["GitHub/PDF", "EVIDENCE LINKS"]],
      proofs: [["publications", "Publication proof"], ["awards", "Awards"], ["contact", "Contact"]],
      highlight: "awards",
      speech: "마지막은 증거야. Evidence Mode를 켜면 포트폴리오의 주장과 근거가 바로 연결돼.",
    },
  ];

  const careerNodes = [
    {
      period: "2023.09–2024.02",
      label: "PRODUCT FOUNDATION",
      title: "Application Engineering",
      short: "iOS · Android · WebRTC",
      copy: "RealWear 원격 협업 시스템과 iOS 제품 개발을 통해 사용자-facing software와 실시간 통신 경험을 쌓았습니다. 이후 AI 연구를 실제 제품으로 연결하는 기반이 됐습니다.",
      tags: ["Swift/UIKit", "Kotlin/Android", "WebRTC", "WebSocket"],
      command: "applications",
    },
    {
      period: "2024.07–2025.02",
      label: "RESEARCH FOUNDATION",
      title: "Undergraduate Researcher",
      short: "Sensor · Time-Series",
      copy: "인하대학교 지식기반데이터분석 연구실에서 센서 보정과 시계열 모델링 연구를 시작했고, KIIT 2024 우수논문상 금상 연구로 이어졌습니다.",
      tags: ["Sensor Calibration", "Time-Series", "Research"],
      command: "experience",
    },
    {
      period: "2025.03–2027.02",
      label: "M.S. AI RESEARCH",
      title: "M.S. Researcher",
      short: "Calibration · Compression",
      copy: "석사과정에서 Sensor Calibration · Model Compression · On-Device AI를 연구하며 1저자 논문과 NRF/IITP 연구과제를 수행합니다.",
      tags: ["Deep Learning", "Model Compression", "NRF/IITP", "Publications"],
      command: "research",
    },
    {
      period: "2025.07–2026.06",
      label: "DEPLOYMENT",
      title: "Edge & Autonomous AI",
      short: "TFLite · Raspberry Pi",
      copy: "Knowledge Distillation, Camera drift recovery, Camera–LiDAR 6DoF calibration recovery를 실제 Edge export와 deployment-aware benchmark로 확장했습니다.",
      tags: ["TFLite", "INT8", "Raspberry Pi", "Camera–LiDAR"],
      command: "projects",
    },
    {
      period: "2026",
      label: "EVIDENCE / OUTPUT",
      title: "Research → Proof",
      short: "Papers · Grants · Systems",
      copy: "JOK/KSC/KCC/SAC selected publications, funded research, GitHub 구현 결과를 통해 Research-to-System 흐름을 증거 중심으로 정리하고 있습니다.",
      tags: ["JOK", "KSC", "KCC", "SAC", "GitHub"],
      command: "publications",
    },
  ];

  const supportedConcepts = [
    { label: "Python", cat: "Engineering", route: "skills", patterns: ["python"] },
    { label: "C/C++", cat: "Engineering", route: "skills", patterns: ["c++", "cpp", " c "] },
    { label: "SQL", cat: "Engineering", route: "skills", patterns: ["sql"] },
    { label: "TensorFlow", cat: "AI / Research", route: "research", patterns: ["tensorflow", "tf "] },
    { label: "PyTorch", cat: "AI / Research", route: "skills", patterns: ["pytorch", "torch"] },
    { label: "Deep Learning", cat: "AI / Research", route: "research", patterns: ["deep learning", "딥러닝"] },
    { label: "Sensor Calibration", cat: "Perception", route: "research", patterns: ["sensor calibration", "센서 보정", "calibration"] },
    { label: "Anomaly Detection", cat: "AI / Research", route: "realtime", patterns: ["anomaly detection", "이상 탐지"] },
    { label: "Time-Series", cat: "AI / Research", route: "research", patterns: ["time series", "time-series", "시계열"] },
    { label: "Model Compression", cat: "Edge / Deploy", route: "distill", patterns: ["model compression", "모델 경량", "compression"] },
    { label: "Knowledge Distillation", cat: "Edge / Deploy", route: "distill", patterns: ["knowledge distillation", "distillation", "지식 증류"] },
    { label: "TFLite", cat: "Edge / Deploy", route: "projects", patterns: ["tflite", "tensorflow lite"] },
    { label: "ONNX", cat: "Edge / Deploy", route: "skills", patterns: ["onnx"] },
    { label: "Raspberry Pi", cat: "Edge / Deploy", route: "distill", patterns: ["raspberry pi", "raspberry", "라즈베리"] },
    { label: "Edge AI", cat: "Edge / Deploy", route: "research", patterns: ["edge ai", "edge device", "on-device", "on device", "embedded ai"] },
    { label: "INT8", cat: "Edge / Deploy", route: "camera", patterns: ["int8", "quantization", "quantized", "양자화"] },
    { label: "Latency / Memory", cat: "Edge / Deploy", route: "research", patterns: ["latency", "memory", "resource efficiency", "리소스"] },
    { label: "Computer Vision", cat: "Perception", route: "projects", patterns: ["computer vision", "vision", "cv ", "영상"] },
    { label: "OpenCV", cat: "Perception", route: "projects", patterns: ["opencv"] },
    { label: "Camera", cat: "Perception", route: "camera", patterns: ["camera", "카메라"] },
    { label: "LiDAR", cat: "Perception", route: "lidar", patterns: ["lidar", "라이다"] },
    { label: "Sensor Fusion", cat: "Perception", route: "lidar", patterns: ["sensor fusion", "fusion", "센서 융합"] },
    { label: "Autonomous Perception", cat: "Perception", route: "projects", patterns: ["autonomous", "자율주행", "perception"] },
    { label: "Homography", cat: "Perception", route: "camera", patterns: ["homography", "호모그래피"] },
    { label: "Swift / iOS", cat: "Product", route: "applications", patterns: ["swift", "ios", "uikit"] },
    { label: "Kotlin / Android", cat: "Product", route: "applications", patterns: ["kotlin", "android"] },
    { label: "WebRTC", cat: "Product", route: "applications", patterns: ["webrtc"] },
    { label: "WebSocket", cat: "Product", route: "applications", patterns: ["websocket"] },
    { label: "Research / Publications", cat: "AI / Research", route: "publications", patterns: ["research", "publication", "paper", "논문", "연구"] },
  ];

  const uncoveredConcepts = [
    { label: "AWS", cat: "Engineering", patterns: ["aws", "amazon web services"] },
    { label: "GCP", cat: "Engineering", patterns: ["gcp", "google cloud"] },
    { label: "Azure", cat: "Engineering", patterns: ["azure"] },
    { label: "Docker", cat: "Engineering", patterns: ["docker", "container"] },
    { label: "Kubernetes", cat: "Engineering", patterns: ["kubernetes", "k8s"] },
    { label: "MLOps", cat: "Engineering", patterns: ["mlops", "model serving", "model monitoring"] },
    { label: "ROS", cat: "Perception", patterns: ["ros2", "ros "] },
    { label: "CUDA-specific optimization", cat: "Edge / Deploy", patterns: ["tensorrt", "cuda optimization", "cuda kernel"] },
    { label: "LLM / RAG", cat: "AI / Research", patterns: ["rag", "retrieval augmented", "llm", "large language model"] },
    { label: "FastAPI / Flask", cat: "Engineering", patterns: ["fastapi", "flask"] },
    { label: "Java", cat: "Engineering", patterns: ["java "] },
    { label: "Spark", cat: "Engineering", patterns: ["apache spark", "pyspark"] },
  ];

  let modal;
  let content;
  let modalTitle;
  let modalSubtitle;
  let lastFocus = null;
  let tourTimer = null;
  let tourStartedAt = 0;
  let tourIndex = -1;
  let speechTimer = null;
  let toastTimer = null;
  let evidenceEnabled = sessionStorage.getItem("yjEvidenceMode") === "1";

  function normalize(text) {
    return ` ${String(text || "").toLowerCase().replace(/[\n\r\t,.;:()\[\]{}\/\\]+/g, " ").replace(/\s+/g, " ").trim()} `;
  }

  function conceptMatches(text, concept) {
    return concept.patterns.some((pattern) => text.includes(pattern.toLowerCase()));
  }

  function speak(text, duration = 3200) {
    const bubble = $("#mascotSpeech");
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add("is-visible", "is-speaking");
    window.clearTimeout(speechTimer);
    speechTimer = window.setTimeout(() => bubble.classList.remove("is-speaking"), duration);
  }

  function dispatchCommand(command) {
    const target = $(`[data-command="${command}"]`);
    if (target) {
      target.click();
      return true;
    }
    return false;
  }

  function injectUI() {
    const hint = $(".guided-hint");
    if (hint && !$(".rs-entry")) {
      const entry = document.createElement("div");
      entry.className = "rs-entry";
      entry.setAttribute("aria-label", "Recruiter tools");
      entry.innerHTML = `
        <button class="rs-primary" type="button" data-rs-mode="tour">✦ Recruiter? 30초 핵심 투어</button>
        <button type="button" data-rs-mode="match">JD Match</button>
        <button type="button" data-rs-mode="career">Career Graph</button>
        <button type="button" data-rs-evidence-toggle>Evidence Mode</button>`;
      hint.insertAdjacentElement("afterend", entry);
    }

    if (!$(".rs-floating")) {
      const floating = document.createElement("div");
      floating.className = "rs-floating";
      floating.innerHTML = `
        <div class="rs-floating-menu" aria-label="Recruiter tools menu">
          <button type="button" data-rs-mode="tour">30-sec Recruiter Tour <span>01</span></button>
          <button type="button" data-rs-mode="match">Job Match Analyzer <span>02</span></button>
          <button type="button" data-rs-mode="career">Interactive Career Graph <span>03</span></button>
          <button type="button" data-rs-evidence-toggle>Evidence Mode <span>04</span></button>
        </div>
        <button class="rs-floating-toggle" type="button" aria-expanded="false">Recruiter tools</button>`;
      document.body.appendChild(floating);
    }

    if (!$("#recruiterSuiteModal")) {
      modal = document.createElement("div");
      modal.id = "recruiterSuiteModal";
      modal.className = "rs-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="rs-backdrop" data-rs-close></div>
        <section class="rs-dialog" role="dialog" aria-modal="true" aria-labelledby="rsDialogTitle">
          <header class="rs-dialog-head">
            <div class="rs-dialog-title"><i>✦</i><div><strong id="rsDialogTitle">Recruiter Suite</strong><small id="rsDialogSubtitle">EVIDENCE-FIRST PORTFOLIO</small></div></div>
            <button class="rs-close" type="button" data-rs-close aria-label="닫기">×</button>
          </header>
          <div class="rs-content"></div>
        </section>`;
      document.body.appendChild(modal);
    } else {
      modal = $("#recruiterSuiteModal");
    }
    content = $(".rs-content", modal);
    modalTitle = $("#rsDialogTitle", modal);
    modalSubtitle = $("#rsDialogSubtitle", modal);

    if (!$(".rs-evidence-toast")) {
      const toast = document.createElement("div");
      toast.className = "rs-evidence-toast";
      document.body.appendChild(toast);
    }

    updateEvidenceButtons();
  }

  function setDialog(title, subtitle) {
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
  }

  function openModal(mode) {
    stopTour();
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".rs-floating")?.classList.remove("is-open");
    $(".rs-floating-toggle")?.setAttribute("aria-expanded", "false");

    if (mode === "tour") startTour();
    if (mode === "match") renderMatcher();
    if (mode === "career") renderCareer();
    window.setTimeout(() => $(".rs-close", modal)?.focus(), 40);
  }

  function closeModal() {
    if (!modal) return;
    stopTour();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    $$(".rs-highlight").forEach((node) => node.classList.remove("rs-highlight"));
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
  }

  function highlightCommand(command) {
    $$(".rs-highlight").forEach((node) => node.classList.remove("rs-highlight"));
    const target = $(`#landing [data-command="${command}"]`) || $(`[data-command="${command}"]`);
    if (target) target.classList.add("rs-highlight");
  }

  function tourMarkup(step, index, finished = false) {
    const dots = tourSteps.map((_, i) => `<i class="${i === index ? "is-active" : ""}"></i>`).join("");
    const metrics = step.metrics.map(([value, label]) => `<div class="rs-tour-metric"><strong>${value}</strong><span>${label}</span></div>`).join("");
    const proofs = step.proofs.map(([command, label]) => `<button type="button" data-rs-proof="${command}">${label} ↗</button>`).join("");
    return `
      <div class="rs-tour">
        <div>
          <div class="rs-tour-top"><span class="rs-tour-status">STEP ${String(index + 1).padStart(2, "0")} / 05 · AUTO TOUR</span><span class="rs-tour-clock" id="rsTourClock">${finished ? "DONE" : "30s"}</span></div>
          <div class="rs-tour-progress"><i id="rsTourProgress"></i></div>
        </div>
        <article class="rs-tour-card">
          <span class="rs-kicker">${step.kicker}</span>
          <h2>${step.title}</h2>
          <p class="rs-tour-copy">${step.copy}</p>
          <div class="rs-tour-metrics">${metrics}</div>
          <div class="rs-proof-row">${proofs}</div>
          <div class="rs-neon-line"><b>neon</b><span>${step.speech}</span></div>
        </article>
        <div class="rs-tour-bottom">
          <div class="rs-tour-dots">${dots}</div>
          <div class="rs-action-row">
            <button type="button" data-rs-evidence-toggle>${evidenceEnabled ? "Evidence ON" : "Evidence Mode"}</button>
            ${finished ? `<button class="primary" type="button" data-rs-proof="contact">Contact ↗</button>` : `<button class="primary" type="button" data-rs-tour-next>Next →</button>`}
          </div>
        </div>
      </div>`;
  }

  function renderTourStep(index, finished = false) {
    tourIndex = index;
    const step = tourSteps[index];
    setDialog("30-sec Recruiter Mode", "AUTOMATIC EVIDENCE TOUR");
    content.innerHTML = tourMarkup(step, index, finished);
    highlightCommand(step.highlight);
    speak(step.speech, 4600);
    updateEvidenceButtons();
  }

  function startTour() {
    tourStartedAt = Date.now();
    renderTourStep(0, false);
    tourTimer = window.setInterval(() => {
      const elapsed = Date.now() - tourStartedAt;
      const nextIndex = Math.min(tourSteps.length - 1, Math.floor(elapsed / STEP_DURATION));
      if (nextIndex !== tourIndex) renderTourStep(nextIndex, false);
      const clock = $("#rsTourClock");
      const progress = $("#rsTourProgress");
      const remaining = Math.max(0, Math.ceil((TOUR_DURATION - elapsed) / 1000));
      if (clock) clock.textContent = `${remaining}s`;
      if (progress) progress.style.width = `${Math.min(100, (elapsed / TOUR_DURATION) * 100)}%`;
      if (elapsed >= TOUR_DURATION) {
        window.clearInterval(tourTimer);
        tourTimer = null;
        renderTourStep(tourSteps.length - 1, true);
        const finalProgress = $("#rsTourProgress");
        if (finalProgress) finalProgress.style.width = "100%";
      }
    }, 120);
  }

  function stopTour() {
    if (tourTimer) window.clearInterval(tourTimer);
    tourTimer = null;
    tourIndex = -1;
  }

  function nextTourStep() {
    const next = Math.min(tourSteps.length - 1, tourIndex + 1);
    tourStartedAt = Date.now() - next * STEP_DURATION;
    renderTourStep(next, next === tourSteps.length - 1 && next * STEP_DURATION >= TOUR_DURATION);
  }

  function renderMatcher() {
    setDialog("Job Match Analyzer", "LOCAL · PRIVATE · PORTFOLIO EVIDENCE ONLY");
    content.innerHTML = `
      <div class="rs-grid-two">
        <section class="rs-panel">
          <h3>채용공고(JD)를 붙여넣어 보세요</h3>
          <p>브라우저 안에서 공개 포트폴리오의 기술 근거와 키워드를 비교합니다. 외부 API로 전송하지 않습니다.</p>
          <textarea id="rsJdInput" class="rs-jd-textarea" placeholder="예: Edge AI Engineer — Python, TensorFlow/PyTorch, computer vision, model optimization, TFLite, Raspberry Pi, Docker, AWS..." aria-label="채용공고 입력"></textarea>
          <div class="rs-jd-controls">
            <button class="rs-button primary" type="button" data-rs-analyze>Analyze fit</button>
            <button class="rs-button" type="button" data-rs-sample>Edge AI sample JD</button>
          </div>
          <div class="rs-privacy">HEURISTIC MATCH ≠ ATS SCORE · 공개 포트폴리오에 보이는 근거만 사용합니다.</div>
        </section>
        <section class="rs-panel" id="rsJdResults">
          <h3>Portfolio fit signal</h3>
          <div class="rs-match-empty">JD를 입력하면 AI/Research · Edge/Deploy · Perception · Product/Engineering 관점에서 일치 근거와 현재 포트폴리오에서 확인되지 않는 요구사항을 분리해서 보여줍니다.</div>
        </section>
      </div>`;
    speak("채용공고를 붙여 넣으면, 내 포트폴리오에서 직접 증거가 있는 기술만 골라서 비교해줄게.");
  }

  function analyzeJD() {
    const input = $("#rsJdInput");
    const results = $("#rsJdResults");
    if (!input || !results) return;
    const text = normalize(input.value);
    const matched = supportedConcepts.filter((concept) => conceptMatches(text, concept));
    const gaps = uncoveredConcepts.filter((concept) => conceptMatches(text, concept));
    const totalSignals = matched.length + gaps.length;

    if (!text.trim() || totalSignals === 0) {
      results.innerHTML = `<h3>Portfolio fit signal</h3><div class="rs-match-empty">분석할 기술 요구사항을 충분히 찾지 못했습니다. JD의 기술 스택이나 업무 요건을 조금 더 포함해 주세요.</div>`;
      return;
    }

    const score = Math.round((matched.length / totalSignals) * 100);
    const categories = ["AI / Research", "Edge / Deploy", "Perception", "Product", "Engineering"];
    const categoryRows = categories.map((cat) => {
      const good = matched.filter((x) => x.cat === cat).length;
      const missing = gaps.filter((x) => x.cat === cat).length;
      const denom = good + missing;
      if (!denom) return "";
      const pct = Math.round((good / denom) * 100);
      return `<div class="rs-category"><b>${cat}</b><div class="rs-category-track"><i style="width:${pct}%"></i></div><em>${pct}%</em></div>`;
    }).join("");

    const matchedChips = matched.map((x) => `<span class="rs-chip">${x.label}</span>`).join("");
    const gapChips = gaps.length ? gaps.map((x) => `<span class="rs-chip gap">${x.label}</span>`).join("") : `<span class="rs-chip">No detected evidence gaps</span>`;
    const proofRoutes = [...new Map(matched.map((x) => [x.route, x])).values()].slice(0, 5);
    const proofButtons = proofRoutes.map((x) => `<button type="button" data-rs-proof="${x.route}">${x.label} proof ↗</button>`).join("");

    results.innerHTML = `
      <div class="rs-score-head">
        <div class="rs-score-orb" style="--score:${score}%"><strong>${score}</strong></div>
        <div class="rs-score-label"><strong>Portfolio fit signal</strong><span>인식된 JD 기술 키워드 중 현재 공개 포트폴리오에서 직접 근거가 연결되는 비율입니다.</span></div>
      </div>
      <div class="rs-category-list">${categoryRows || `<div class="rs-match-empty">카테고리별 신호가 충분하지 않습니다.</div>`}</div>
      <div class="rs-match-section"><span>MATCHED EVIDENCE</span><div class="rs-chip-list">${matchedChips}</div></div>
      <div class="rs-match-section"><span>NOT DIRECTLY EVIDENCED IN CURRENT PORTFOLIO</span><div class="rs-chip-list">${gapChips}</div></div>
      <div class="rs-proof-row">${proofButtons}</div>`;
    speak(`이 JD에서는 공개 포트폴리오 기준 ${matched.length}개의 기술 근거가 직접 연결돼.`, 3600);
  }

  function fillSampleJD() {
    const input = $("#rsJdInput");
    if (!input) return;
    input.value = "Edge AI / Computer Vision Engineer: Python, TensorFlow or PyTorch, sensor calibration, computer vision, OpenCV, camera/LiDAR sensor fusion, model compression, TFLite, INT8 quantization, Raspberry Pi or embedded deployment, latency and memory optimization. Docker and AWS experience preferred.";
    analyzeJD();
  }

  function renderCareer() {
    setDialog("Interactive Career Graph", "PRODUCT → RESEARCH → EDGE → EVIDENCE");
    const nodes = careerNodes.map((node, index) => `
      <button class="rs-career-node ${index === 2 ? "is-active" : ""}" type="button" data-rs-career="${index}">
        <span>${node.period}</span><strong>${node.title}</strong><small>${node.short}</small>
      </button>`).join("");
    content.innerHTML = `
      <span class="rs-kicker">CAREER GRAPH · CONNECTED EXPERIENCE</span>
      <h2 class="rs-section-title">경력이 따로 떨어진 점이 아니라,<br><span style="color:#929aaa">하나의 Research-to-System 흐름입니다.</span></h2>
      <p class="rs-career-intro">노드를 클릭하면 각 시기의 경험이 다음 단계와 어떻게 연결되는지 확인할 수 있습니다.</p>
      <div class="rs-career-graph"><i class="rs-flow-dot" aria-hidden="true"></i>${nodes}</div>
      <div id="rsCareerDetail" class="rs-career-detail"></div>`;
    renderCareerDetail(2);
    speak("제품 개발 경험에서 시작해서, AI 연구와 Edge deployment로 이어진 경력 흐름을 보여줄게.");
  }

  function renderCareerDetail(index) {
    const node = careerNodes[index];
    if (!node) return;
    $$(".rs-career-node").forEach((button, i) => button.classList.toggle("is-active", i === index));
    const detail = $("#rsCareerDetail");
    if (!detail) return;
    detail.innerHTML = `
      <span class="meta">${node.period} · ${node.label}</span>
      <h3>${node.title}</h3>
      <p>${node.copy}</p>
      <div class="rs-career-tags">${node.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <div class="rs-proof-row"><button type="button" data-rs-proof="${node.command}">Open related evidence ↗</button></div>`;
  }

  function determineEvidence(node) {
    if (node.matches(".project-card,.result-visual")) return "EVIDENCE · GITHUB";
    if (node.matches(".application-card")) {
      if ($('a[href*="apps.apple.com"]', node)) return "EVIDENCE · APP STORE + GITHUB";
      return "EVIDENCE · GITHUB";
    }
    if (node.matches(".publication-card")) return $(".paper-pdf-button", node) ? "EVIDENCE · PDF" : "EVIDENCE · PUBLICATION";
    if (node.matches(".grant-card")) return "EVIDENCE · FUNDED PROJECT";
    if (node.matches(".award-card")) return "EVIDENCE · RESUME";
    if (node.matches(".timeline-item")) return "EVIDENCE · RESUME";
    if (node.matches(".resume-stat")) return "EVIDENCE · PORTFOLIO";
    if (node.matches(".answer-panel")) return "EVIDENCE · RESUME";
    return "EVIDENCE";
  }

  function decorateEvidence(root = document) {
    const selector = ".project-card,.result-visual,.application-card,.publication-card,.grant-card,.award-card,.timeline-item,.resume-stat,.answer-panel";
    $$(selector, root).forEach((node) => {
      if (node.classList.contains("rs-evidence-decorated")) return;
      node.classList.add("rs-evidence-decorated", "rs-evidence-host");
      const badge = document.createElement("span");
      badge.className = "rs-evidence-badge";
      badge.textContent = determineEvidence(node);
      node.appendChild(badge);
    });
    $$('a[href*="github.com"],a[href*="apps.apple.com"],.paper-pdf-button', root).forEach((link) => link.classList.add("rs-proof-link"));
  }

  function updateEvidenceButtons() {
    $$('[data-rs-evidence-toggle]').forEach((button) => {
      button.classList.toggle("is-active", evidenceEnabled);
      if (button.matches(".rs-entry button")) button.textContent = evidenceEnabled ? "Evidence Mode · ON" : "Evidence Mode";
      if (button.closest(".rs-floating-menu")) button.innerHTML = `${evidenceEnabled ? "Evidence Mode · ON" : "Evidence Mode"} <span>04</span>`;
    });
  }

  function toast(message) {
    const node = $(".rs-evidence-toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("is-visible"), 2200);
  }

  function toggleEvidence(force) {
    evidenceEnabled = typeof force === "boolean" ? force : !evidenceEnabled;
    document.body.classList.toggle("evidence-mode", evidenceEnabled);
    sessionStorage.setItem("yjEvidenceMode", evidenceEnabled ? "1" : "0");
    decorateEvidence(document);
    updateEvidenceButtons();
    toast(evidenceEnabled ? "Evidence Mode ON · 각 주장에 연결된 근거를 표시합니다." : "Evidence Mode OFF");
    speak(evidenceEnabled ? "Evidence Mode를 켰어. 이제 어떤 내용이 GitHub, PDF, App Store와 연결되는지 바로 보여." : "Evidence Mode를 껐어.", 3000);
  }

  function handleDocumentClick(event) {
    const mode = event.target.closest("[data-rs-mode]");
    if (mode) {
      openModal(mode.dataset.rsMode);
      return;
    }

    const evidence = event.target.closest("[data-rs-evidence-toggle]");
    if (evidence) {
      toggleEvidence();
      return;
    }

    const close = event.target.closest("[data-rs-close]");
    if (close) {
      closeModal();
      return;
    }

    const floatingToggle = event.target.closest(".rs-floating-toggle");
    if (floatingToggle) {
      const floating = floatingToggle.closest(".rs-floating");
      const open = floating.classList.toggle("is-open");
      floatingToggle.setAttribute("aria-expanded", String(open));
      return;
    }

    const proof = event.target.closest("[data-rs-proof]");
    if (proof) {
      const command = proof.dataset.rsProof;
      closeModal();
      window.setTimeout(() => dispatchCommand(command), 90);
      return;
    }

    if (event.target.closest("[data-rs-tour-next]")) {
      nextTourStep();
      return;
    }

    if (event.target.closest("[data-rs-analyze]")) {
      analyzeJD();
      return;
    }

    if (event.target.closest("[data-rs-sample]")) {
      fillSampleJD();
      return;
    }

    const career = event.target.closest("[data-rs-career]");
    if (career) {
      renderCareerDetail(Number(career.dataset.rsCareer));
      return;
    }

    const floating = $(".rs-floating");
    if (floating?.classList.contains("is-open") && !event.target.closest(".rs-floating")) {
      floating.classList.remove("is-open");
      $(".rs-floating-toggle")?.setAttribute("aria-expanded", "false");
    }
  }

  function init() {
    injectUI();
    decorateEvidence(document);
    document.body.classList.toggle("evidence-mode", evidenceEnabled);
    updateEvidenceButtons();

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
    });

    const messageList = $("#messageList");
    if (messageList) {
      const observer = new MutationObserver(() => decorateEvidence(messageList));
      observer.observe(messageList, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
