(() => {
  "use strict";

  const BRAND = "NEURI";

  function makeMiniAvatar() {
    const avatar = document.createElement("span");
    avatar.className = "neuri-mini";
    avatar.setAttribute("aria-hidden", "true");
    avatar.innerHTML = `
      <span class="neuri-mini-orbit"></span>
      <span class="neuri-mini-body">
        <i class="neuri-mini-eye left"></i>
        <i class="neuri-mini-eye right"></i>
        <i class="neuri-mini-mouth"></i>
      </span>
      <span class="neuri-mini-spark">✦</span>
    `;
    return avatar;
  }

  function enhanceGuideLine(line) {
    if (!line || line.dataset.neuriReady === "1") return;

    const legacyName = line.querySelector(":scope > b")?.textContent?.trim() || "";
    const legacyCopy = line.querySelector(":scope > span")?.textContent?.trim() || "";
    const copy = legacyCopy || line.textContent.replace(legacyName, "").trim();

    const copyBox = document.createElement("span");
    copyBox.className = "neuri-guide-copy";

    const name = document.createElement("b");
    name.textContent = BRAND;

    const message = document.createElement("span");
    message.textContent = copy;

    copyBox.append(name, message);
    line.replaceChildren(makeMiniAvatar(), copyBox);
    line.classList.add("neuri-guide-line");
    line.dataset.neuriReady = "1";
    line.setAttribute("aria-label", `${BRAND}: ${copy}`);
  }

  function renameBrand(root = document) {
    root.querySelectorAll(".rs-splinee-line").forEach(enhanceGuideLine);

    root.querySelectorAll(".mascot-caption").forEach((caption) => {
      if (/splinee/i.test(caption.textContent)) caption.textContent = "ask NEURI about YJ";
    });

    const stage = root.querySelector("#mascotStage");
    if (stage) stage.setAttribute("aria-label", "AI 가이드 NEURI에게 윤진용 개발자에 대해 질문하기");

    const speech = root.querySelector("#mascotSpeech");
    if (speech && !speech.dataset.neuriIntro) {
      speech.dataset.neuriIntro = "1";
      if (speech.textContent.trim() === "안녕! 궁금한 걸 물어봐.") {
        speech.textContent = "안녕, NEURI야. 윤진용의 AI 포트폴리오를 안내할게.";
      }
    }
  }

  function init() {
    renameBrand(document);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.(".rs-splinee-line")) enhanceGuideLine(node);
          renameBrand(node);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
