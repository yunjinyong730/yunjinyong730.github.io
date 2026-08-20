(() => {
  const papers = [
    {
      venue: "JOURNAL OF KIISE · JOK 2026",
      rank: "1ST",
      title: "A Sensor Calibration Model for Balancing Accuracy, Latency, and Resource Efficiency",
      note: "SCALE: CSP와 Binary Hash Attention을 결합해 정확도, 지연 시간, 자원 효율성을 함께 최적화한 MCU 지향 Sensor Calibration 연구.",
      pdf: "https://drive.google.com/file/d/1SLx3cZ5tyBl1CQem7_2jZI_GfcN5BjYr/view?usp=sharing",
      badge: "PAPER PDF"
    },
    {
      venue: "AAAI 2027 · SUBMISSION",
      rank: "1ST",
      title: "Reference efficient Indoor Sensor Calibration Across Locations, Event and Time",
      note: "Six-month, five-location indoor calibration dataset and LC-UTMixer for limited-reference, location-transfer, drift, and event-conditioned calibration.",
      pdf: "https://drive.google.com/file/d/18Wc-sryKaMafaM75d-SsZhRkRSy5_QG9/view?usp=sharing",
      badge: "CURRENT MANUSCRIPT"
    },
    {
      venue: "CIKM 2026 · MANUSCRIPT",
      rank: "1ST",
      title: "Transformer with hardware efficient attention for lightweight, edge sensor calibration",
      note: "THALES: an ultra-compressed transformer with Sequence Lens Projector and Efficient Bitwise Attention for MCU-oriented sensor calibration.",
      pdf: "https://drive.google.com/file/d/1U2-qmnhXIKugcq4vJsxxTvd22tQ10tab/view?usp=sharing",
      badge: "CURRENT MANUSCRIPT"
    },
    {
      venue: "KSC · DRIFT-ADAPTIVE CALIBRATION",
      rank: "2ND",
      title: "IoT 센서의 드리프트 적응형 실시간 보정을 위한 경량 신경망 모듈 프레임워크",
      note: "기존 센서 보정 모델을 재학습하지 않고 약 350-parameter DAM 모듈을 추가해 drift 적응력을 높이는 경량 프레임워크.",
      pdf: "https://drive.google.com/file/d/1sQhejOljkl4lq8HpsIpvwfB-kwCCCv1m/view?usp=sharing",
      badge: "PAPER PDF"
    },
    {
      venue: "KCC 2026 · ON-DEVICE AGENT",
      rank: "2ND",
      title: "적응형 툴 스키마를 활용한 모바일 온디바이스 AI 에이전트 최적화",
      note: "제한된 컨텍스트 예산에서 LFU-R 기반 중요도와 error-driven promotion으로 Tool Schema 정보량을 동적으로 할당하는 연구.",
      pdf: "https://drive.google.com/file/d/1xA4nYUm7ltxhQiYzyBCuZqaWGL3lH_gJ/view?usp=sharing",
      badge: "PAPER PDF"
    },
    {
      venue: "ACM/SIGAPP SAC 2026",
      rank: "3RD",
      title: "From Evaluation to Feedback: A Feature-Based and LLM-Constrained Tool for Korean Writing Assessment",
      note: "FEAK: rubric-linked linguistic features를 근거로 선택해 LLM 기반 한국어 작문 피드백을 생성하는 분석·피드백 파이프라인.",
      pdf: "https://drive.google.com/file/d/1GoP4RSC_gPCjZVsqkOHe5ZgnfzJoEFAr/view?usp=sharing",
      badge: "PAPER PDF"
    },
    {
      venue: "KIIT 2024 · BEST PAPER GOLD",
      rank: "1ST",
      title: "미세먼지 보간 모델을 위한 Local BatchNormalization",
      note: "측정소별 공간 분포 차이를 반영하기 위해 Global BN과 Local BN을 비교하고 지역별 정규화의 보간 성능 개선을 검증한 연구.",
      pdf: "https://drive.google.com/file/d/1lJ_xAjxDf8mQTjzNBBTR_3LW3JeEafR3/view?usp=sharing",
      badge: "PAPER PDF"
    }
  ];

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const card = (paper) => `
    <article class="publication-card publication-card-linked">
      <div class="publication-top">
        <div class="publication-id">
          <div class="publication-meta">${escapeHtml(paper.venue)}</div>
          <span class="paper-badge">${escapeHtml(paper.badge)}</span>
        </div>
        <span class="publication-rank">${escapeHtml(paper.rank)}</span>
      </div>
      <h3>${escapeHtml(paper.title)}</h3>
      <p>${escapeHtml(paper.note)}</p>
      <div class="paper-actions">
        <a class="paper-pdf-button" href="${paper.pdf}" target="_blank" rel="noreferrer">PDF 보기 ↗</a>
      </div>
    </article>`;

  const patchPublications = () => {
    document.querySelectorAll(".publication-list").forEach((list) => {
      if (list.dataset.pdfLinked === "true") return;
      list.dataset.pdfLinked = "true";
      list.innerHTML = papers.map(card).join("");

      const documentRoot = list.closest(".answer-document");
      if (documentRoot) {
        const lead = documentRoot.querySelector(".answer-lead");
        if (lead) {
          lead.textContent = "Resume의 selected publications와 최신 manuscript를 실제 원문 PDF에 연결했습니다. 각 카드의 PDF 보기 버튼을 누르면 새 탭에서 Google Drive 원문이 열립니다.";
        }

        const kicker = documentRoot.querySelector(".answer-kicker");
        if (kicker) kicker.textContent = "PUBLICATIONS · 7 PDFs LINKED";
      }
    });
  };

  const addQuickPrompt = () => {
    const quick = document.querySelector(".quick-prompts");
    if (!quick || quick.querySelector('[data-paper-prompt="true"]')) return;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.command = "publications";
    button.dataset.paperPrompt = "true";
    button.textContent = "Papers + PDF";
    quick.prepend(button);
  };

  const style = document.createElement("style");
  style.textContent = `
    .publication-list{gap:14px!important}
    .publication-card-linked{
      position:relative!important;
      display:flex!important;
      flex-direction:column!important;
      min-height:0!important;
      padding:20px!important;
      overflow:hidden;
      background:rgba(255,255,255,.94)!important;
    }
    .publication-card-linked::after{display:none!important}
    .publication-top{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:16px;
      margin-bottom:12px;
    }
    .publication-id{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:8px;
      min-width:0;
      padding-top:1px;
    }
    .publication-card-linked .publication-meta{margin:0;line-height:1.35}
    .publication-card-linked .publication-rank{
      position:static!important;
      inset:auto!important;
      flex:0 0 auto;
      min-width:48px;
      margin:0;
      padding:7px 9px;
    }
    .paper-badge{
      display:inline-flex;
      align-items:center;
      min-height:23px;
      border:1px solid rgba(67,135,247,.28);
      background:var(--blue-soft,#edf4ff);
      color:var(--blue,#4387f7);
      border-radius:999px;
      padding:0 9px;
      font:500 6px/1 var(--mono,"DM Mono",monospace);
      letter-spacing:.08em;
      white-space:nowrap;
    }
    .publication-card-linked h3{
      margin:0 0 8px!important;
      max-width:1100px;
      font-size:clamp(16px,1.55vw,23px)!important;
      line-height:1.22!important;
      letter-spacing:-.035em!important;
    }
    .publication-card-linked p{
      margin:0!important;
      max-width:1180px;
      color:#666b72!important;
      font-size:10px!important;
      line-height:1.68!important;
    }
    .paper-actions{
      display:flex;
      align-items:center;
      gap:8px;
      margin-top:15px;
    }
    .paper-pdf-button{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:36px;
      text-decoration:none;
      border:1px solid #b7c7dc;
      background:#fff;
      color:var(--blue,#4387f7);
      border-radius:10px;
      padding:0 12px;
      font:500 8px/1 var(--mono,"DM Mono",monospace);
      transition:transform .18s ease,background .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease;
    }
    .paper-pdf-button:hover{
      transform:translateY(-2px);
      background:var(--blue,#4387f7);
      border-color:var(--blue,#4387f7);
      color:#fff;
      box-shadow:0 9px 22px rgba(67,135,247,.18);
    }
    @media(max-width:700px){
      .publication-card-linked{padding:16px!important}
      .publication-top{gap:10px;margin-bottom:10px}
      .publication-id{gap:6px}
      .publication-card-linked .publication-rank{min-width:44px;padding:7px 7px}
      .publication-card-linked h3{font-size:17px!important;line-height:1.28!important}
      .publication-card-linked p{font-size:9px!important}
      .paper-actions{margin-top:13px}
      .paper-pdf-button{width:100%;min-height:39px}
    }
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => {
    patchPublications();
    addQuickPrompt();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  patchPublications();
  addQuickPrompt();
})();
