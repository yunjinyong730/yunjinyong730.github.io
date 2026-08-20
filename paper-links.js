(() => {
  const papers = [
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
      badge: "PDF"
    },
    {
      venue: "KCC 2026 · ON-DEVICE AGENT",
      rank: "2ND",
      title: "적응형 툴 스키마를 활용한 모바일 온디바이스 AI 에이전트 최적화",
      note: "제한된 컨텍스트 예산에서 LFU-R 기반 중요도와 error-driven promotion으로 Tool Schema 정보량을 동적으로 할당하는 연구.",
      pdf: "https://drive.google.com/file/d/1xA4nYUm7ltxhQiYzyBCuZqaWGL3lH_gJ/view?usp=sharing",
      badge: "PDF"
    },
    {
      venue: "ACM/SIGAPP SAC 2026",
      rank: "3RD",
      title: "From Evaluation to Feedback: A Feature-Based and LLM-Constrained Tool for Korean Writing Assessment",
      note: "FEAK: rubric-linked linguistic features를 근거로 선택해 LLM 기반 한국어 작문 피드백을 생성하는 분석·피드백 파이프라인.",
      pdf: "https://drive.google.com/file/d/1GoP4RSC_gPCjZVsqkOHe5ZgnfzJoEFAr/view?usp=sharing",
      badge: "PDF"
    },
    {
      venue: "KIIT 2024 · BEST PAPER GOLD",
      rank: "1ST",
      title: "미세먼지 보간 모델을 위한 Local BatchNormalization",
      note: "측정소별 공간 분포 차이를 반영하기 위해 Global BN과 Local BN을 비교하고 지역별 정규화의 보간 성능 개선을 검증한 연구.",
      pdf: "https://drive.google.com/file/d/1lJ_xAjxDf8mQTjzNBBTR_3LW3JeEafR3/view?usp=sharing",
      badge: "PDF"
    }
  ];

  const resumeOnly = {
    venue: "JOURNAL OF KIISE · JOK 2026",
    rank: "1ST",
    title: "A Sensor Calibration Model for Balancing Accuracy, Latency, and Resource Efficiency",
    note: "Resume에 기재된 selected publication. 현재 전달된 Drive 링크 묶음에는 이 논문의 PDF가 포함되어 있지 않아 서지 카드만 유지합니다."
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const card = (paper) => `
    <article class="publication-card publication-card-linked">
      <div class="publication-card-head">
        <span class="publication-rank">${escapeHtml(paper.rank)}</span>
        ${paper.badge ? `<span class="paper-badge">${escapeHtml(paper.badge)}</span>` : ""}
      </div>
      <div class="publication-meta">${escapeHtml(paper.venue)}</div>
      <h3>${escapeHtml(paper.title)}</h3>
      <p>${escapeHtml(paper.note)}</p>
      ${paper.pdf ? `
        <div class="paper-actions">
          <a class="paper-pdf-button" href="${paper.pdf}" target="_blank" rel="noreferrer">PDF 보기 ↗</a>
        </div>` : `
        <div class="paper-actions">
          <span class="paper-pdf-missing">PDF 링크 미등록</span>
        </div>`}
    </article>`;

  const patchPublications = () => {
    document.querySelectorAll(".publication-list").forEach((list) => {
      if (list.dataset.pdfLinked === "true") return;
      list.dataset.pdfLinked = "true";
      list.innerHTML = [card(resumeOnly), ...papers.map(card)].join("");

      const documentRoot = list.closest(".answer-document");
      if (documentRoot) {
        const lead = documentRoot.querySelector(".answer-lead");
        if (lead) {
          lead.textContent = "Resume의 selected publications에 최신 manuscript를 더하고, 전달받은 Google Drive 원문 PDF 6개를 직접 연결했습니다. PDF 버튼을 누르면 새 탭에서 실제 논문이 열립니다.";
        }

        const kicker = documentRoot.querySelector(".answer-kicker");
        if (kicker) kicker.textContent = "PUBLICATIONS · 6 PDFs LINKED";
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
    .publication-card-linked{position:relative;overflow:hidden}
    .publication-card-linked::after{content:"";position:absolute;inset:auto -20% -55% 25%;height:150px;background:radial-gradient(circle,rgba(67,135,247,.12),transparent 68%);pointer-events:none}
    .publication-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .paper-badge{border:1px solid rgba(67,135,247,.25);background:var(--blue-soft,#edf4ff);color:var(--blue,#4387f7);border-radius:999px;padding:5px 8px;font:500 6px/1 var(--mono,"DM Mono",monospace);letter-spacing:.08em}
    .paper-actions{display:flex;gap:8px;align-items:center;margin-top:16px;position:relative;z-index:2}
    .paper-pdf-button{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #b7c7dc;background:#fff;color:var(--blue,#4387f7);border-radius:9px;padding:9px 12px;font:500 8px/1 var(--mono,"DM Mono",monospace);transition:.18s ease}
    .paper-pdf-button:hover{transform:translateY(-2px);background:var(--blue,#4387f7);border-color:var(--blue,#4387f7);color:#fff;box-shadow:0 9px 22px rgba(67,135,247,.18)}
    .paper-pdf-missing{display:inline-flex;border:1px dashed #d4d8dd;border-radius:9px;padding:9px 12px;color:#999fa6;font:400 7px/1 var(--mono,"DM Mono",monospace)}
    @media(max-width:700px){.paper-actions{margin-top:13px}.paper-pdf-button,.paper-pdf-missing{width:100%;padding:11px 12px}}
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
