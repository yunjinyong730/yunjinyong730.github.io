(() => {
  "use strict";

  const BRAND = "NEURA";
  const ROLE = "AI PORTFOLIO AGENT";
  let talkingTimer = null;

  function makeMiniAvatar() {
    const avatar = document.createElement("span");
    avatar.className = "neura-mini";
    avatar.setAttribute("aria-hidden", "true");
    avatar.innerHTML = `
      <span class="neura-mini-orbit orbit-a"><i></i></span>
      <span class="neura-mini-orbit orbit-b"><i></i></span>
      <span class="neura-mini-body">
        <i class="neura-mini-eye left"></i>
        <i class="neura-mini-eye right"></i>
        <i class="neura-mini-mouth"></i>
        <span class="neura-mini-core"><i></i><b></b></span>
      </span>
      <span class="neura-mini-spark">✦</span>
    `;
    return avatar;
  }

  function triggerTalking(line) {
    window.clearTimeout(talkingTimer);
    line.classList.remove("is-talking");
    window.requestAnimationFrame(() => line.classList.add("is-talking"));
    talkingTimer = window.setTimeout(() => line.classList.remove("is-talking"), 4300);
  }

  function enhanceGuideLine(line) {
    if (!line) return;

    const legacyName = line.querySelector(":scope > b")?.textContent?.trim() || "";
    const legacyCopy = line.querySelector(":scope > span")?.textContent?.trim() || "";
    const previousMessage = line.querySelector(".neura-guide-message")?.textContent?.trim() || "";
    const copy = legacyCopy || previousMessage || line.textContent.replace(legacyName, "").trim();

    if (line.dataset.neuraReady === "1") {
      const message = line.querySelector(".neura-guide-message");
      if (message && copy && message.textContent !== copy) message.textContent = copy;
      triggerTalking(line);
      return;
    }

    const copyBox = document.createElement("span");
    copyBox.className = "neura-guide-copy";

    const identity = document.createElement("span");
    identity.className = "neura-guide-identity";

    const name = document.createElement("b");
    name.textContent = BRAND;

    const role = document.createElement("em");
    role.textContent = ROLE;

    identity.append(name, role);

    const message = document.createElement("span");
    message.className = "neura-guide-message";
    message.textContent = copy;

    copyBox.append(identity, message);
    line.replaceChildren(makeMiniAvatar(), copyBox);
    line.classList.add("neura-guide-line");
    line.dataset.neuraReady = "1";
    line.setAttribute("aria-label", `${BRAND}, ${ROLE}: ${copy}`);
    triggerTalking(line);
  }

  function renameBrand(root = document) {
    root.querySelectorAll?.(".rs-splinee-line").forEach(enhanceGuideLine);

    root.querySelectorAll?.(".mascot-caption").forEach((caption) => {
      if (/splinee|neuri|neura/i.test(caption.textContent)) caption.textContent = "ask NEURA about YJ";
    });

    const stage = root.querySelector?.("#mascotStage") || document.querySelector("#mascotStage");
    if (stage) stage.setAttribute("aria-label", "AI 포트폴리오 에이전트 NEURA에게 윤진용 개발자에 대해 질문하기");

    const speech = root.querySelector?.("#mascotSpeech") || document.querySelector("#mascotSpeech");
    if (speech && !speech.dataset.neuraIntro) {
      speech.dataset.neuraIntro = "1";
      if (/안녕! 궁금한 걸 물어봐|NEURI|Splinee/i.test(speech.textContent)) {
        speech.textContent = "안녕, NEURA야. 윤진용의 AI 포트폴리오를 직접 안내할게.";
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
