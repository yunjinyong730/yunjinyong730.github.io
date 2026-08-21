(() => {
  "use strict";

  const routeQueries = {
    lidar: "Camera–LiDAR 6DoF calibration 프로젝트 보여줘",
    camera: "Camera calibration drift detection recovery 프로젝트 보여줘",
    distill: "Knowledge Distillation Raspberry Pi 프로젝트 보여줘",
    realtime: "실시간 센서 보정 anomaly detection 프로젝트 보여줘",
  };

  const evidenceIsEnabled = () =>
    sessionStorage.getItem("yjEvidenceMode") === "1" && document.body.classList.contains("evidence-mode");

  function clearEvidenceArtifacts(root = document) {
    root.querySelectorAll(".rs-evidence-badge").forEach((badge) => badge.remove());
    root.querySelectorAll(".rs-evidence-decorated,.rs-evidence-host").forEach((node) => {
      node.classList.remove("rs-evidence-decorated", "rs-evidence-host");
    });
    root.querySelectorAll(".rs-proof-link").forEach((link) => link.classList.remove("rs-proof-link"));
  }

  function syncEvidenceArtifacts(root = document) {
    if (evidenceIsEnabled()) return;
    document.body.classList.remove("evidence-mode");
    clearEvidenceArtifacts(root);
  }

  function initEvidenceCleanup() {
    window.setTimeout(() => syncEvidenceArtifacts(document), 0);

    const bodyObserver = new MutationObserver(() => syncEvidenceArtifacts(document));
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const messageList = document.querySelector("#messageList");
    if (messageList) {
      const messageObserver = new MutationObserver(() => syncEvidenceArtifacts(messageList));
      messageObserver.observe(messageList, { childList: true, subtree: true });
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-rs-evidence-toggle]")) {
      window.setTimeout(() => syncEvidenceArtifacts(document), 0);
    }

    const proof = event.target.closest("[data-rs-proof]");
    if (!proof) return;
    const route = proof.dataset.rsProof;
    const query = routeQueries[route];
    if (!query) return;
    if (document.querySelector(`[data-command="${route}"]`)) return;

    window.setTimeout(() => {
      const form = document.querySelector("#landingComposer");
      const input = document.querySelector("#landingInput");
      if (!form || !input) return;
      input.value = query;
      if (typeof form.requestSubmit === "function") form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }, 140);
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEvidenceCleanup, { once: true });
  } else {
    initEvidenceCleanup();
  }
})();
