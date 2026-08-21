(() => {
  "use strict";

  const BRAND = "NEON";
  const EXPANSION = "Neural Engine Orchestration Node";

  const guideMarkup = (message) => `
    <div class="rs-neon-avatar" aria-hidden="true">
      <i class="rs-neon-orbit orbit-a"></i>
      <i class="rs-neon-orbit orbit-b"></i>
      <span class="rs-neon-body">
        <i class="rs-neon-eye eye-l"></i>
        <i class="rs-neon-eye eye-r"></i>
        <i class="rs-neon-mouth"></i>
        <i class="rs-neon-core"></i>
      </span>
    </div>
    <div class="rs-neon-copy">
      <div class="rs-neon-name">
        <strong>${BRAND}</strong>
        <i aria-hidden="true"></i>
        <small>${EXPANSION}</small>
      </div>
      <p>${message}</p>
    </div>`;

  function renameMainMascot() {
    const caption = document.querySelector(".mascot-caption");
    if (caption) {
      caption.textContent = "ask NEON about YJ";
      caption.classList.add("neon-caption");
    }

    const stage = document.querySelector("#mascotStage");
    if (stage) {
      stage.setAttribute("aria-label", "AI 가이드 NEON에게 윤진용 개발자에 대해 질문하기");
      stage.dataset.aiGuide = BRAND;
    }

    const bubble = document.querySelector("#mascotSpeech");
    if (bubble && /안녕|궁금한 걸 물어봐/.test(bubble.textContent || "")) {
      bubble.textContent = "안녕! 나는 NEON이야. 궁금한 걸 물어봐.";
    }
  }

  function upgradeRecruiterGuide(root = document) {
    root.querySelectorAll(".rs-splinee-line:not(.rs-neon-guide)").forEach((line) => {
      const message = line.querySelector("span")?.textContent?.trim()
        || line.textContent.replace(/Splinee/gi, "").trim()
        || "포트폴리오의 핵심을 증거와 함께 안내할게.";

      line.classList.add("rs-neon-guide");
      line.setAttribute("aria-label", `${BRAND} AI guide`);
      line.innerHTML = guideMarkup(message);
    });

    root.querySelectorAll(".rs-dialog-title strong").forEach((title) => {
      if (/Recruiter Mode/i.test(title.textContent || "")) title.dataset.neonGuide = "true";
    });
  }

  function upgradeAll() {
    renameMainMascot();
    upgradeRecruiterGuide(document);
  }

  const observer = new MutationObserver((mutations) => {
    let shouldUpgrade = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length) {
        shouldUpgrade = true;
        break;
      }
    }
    if (shouldUpgrade) upgradeAll();
  });

  function init() {
    upgradeAll();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
