(() => {
  "use strict";

  const routeQueries = {
    lidar: "Camera–LiDAR 6DoF calibration 프로젝트 보여줘",
    camera: "Camera calibration drift detection recovery 프로젝트 보여줘",
    distill: "Knowledge Distillation Raspberry Pi 프로젝트 보여줘",
    realtime: "실시간 센서 보정 anomaly detection 프로젝트 보여줘",
  };

  document.addEventListener("click", (event) => {
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
})();