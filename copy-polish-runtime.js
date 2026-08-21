(() => {
  "use strict";

  const replacements = new Map([
    ["경력이 따로 떨어진 점이 아니라,", "제품 개발에서 AI 연구로,"],
    ["하나의 Research-to-System 흐름입니다.", "연구에서 Edge deployment로 이어졌습니다."],
    ["노드를 클릭하면 각 시기의 경험이 다음 단계와 어떻게 연결되는지 확인할 수 있습니다.", "각 노드를 클릭하면 이전 경험이 다음 단계의 연구와 구현에 어떻게 연결됐는지 확인할 수 있습니다."],
    ["✦ Recruiter? 30초 핵심 투어", "✦ Recruiter? 30초 포트폴리오 브리프"],
  ]);

  const placeholderReplacements = new Map([
    ["윤진용 개발자에 대해 알려줘", "윤진용의 연구와 프로젝트를 보여줘"],
    ["Selected publications를 보여줘", "Selected publications와 PDF를 보여줘"],
    ["출시한 앱을 보여줘", "출시한 앱과 개발 역할을 보여줘"],
    ["Camera–LiDAR 프로젝트 설명해줘", "Camera–LiDAR 프로젝트의 구현과 결과를 보여줘"],
    ["연구과제를 알려줘", "수행한 연구과제와 역할을 보여줘"],
  ]);

  function rewriteText(node) {
    if (!(node instanceof Text) || node.parentElement?.closest("script,style")) return;
    const raw = node.nodeValue || "";
    const trimmed = raw.trim();
    const next = replacements.get(trimmed);
    if (!next || next === trimmed) return;
    const leading = raw.match(/^\s*/)?.[0] || "";
    const trailing = raw.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${next}${trailing}`;
  }

  function scan(root = document) {
    if (root instanceof Text) {
      rewriteText(root);
      return;
    }
    if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) rewriteText(node);
  }

  function polishPlaceholder(target) {
    if (!(target instanceof HTMLInputElement) || target.id !== "landingInput") return;
    const next = placeholderReplacements.get(target.placeholder);
    if (next) target.placeholder = next;
  }

  function init() {
    scan(document);
    polishPlaceholder(document.querySelector("#landingInput"));
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") rewriteText(mutation.target);
        if (mutation.type === "attributes") polishPlaceholder(mutation.target);
        mutation.addedNodes?.forEach(scan);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder"],
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
