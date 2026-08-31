(() => {
  "use strict";

  // Explicit portfolio navigation (sidebar/menu/quick buttons) should preserve
  // the deterministic route chosen by script.js. RAG is reserved for typed
  // reasoning/comparison questions and fallback queries.
  let nextQueryOrigin = "typed";
  let latestQueryOrigin = "typed";

  document.addEventListener("click", (event) => {
    const command = event.target.closest?.("[data-command]");
    if (command) nextQueryOrigin = "command";
  }, true);

  document.addEventListener("submit", (event) => {
    if (event.target.matches?.("#landingComposer, #chatComposer")) {
      nextQueryOrigin = "typed";
    }
  }, true);

  function processNode(node) {
    if (!(node instanceof Element)) return;

    const messages = [];
    if (node.matches(".user-message")) messages.push(node);
    messages.push(...node.querySelectorAll(".user-message"));

    for (const message of messages) {
      latestQueryOrigin = nextQueryOrigin;
      nextQueryOrigin = "typed";
      message.dataset.queryOrigin = latestQueryOrigin;
    }

    const docs = [];
    if (node.matches(".answer-document")) docs.push(node);
    docs.push(...node.querySelectorAll(".answer-document"));

    if (latestQueryOrigin !== "command") return;

    for (const doc of docs) {
      doc.dataset.ragHandled = "true";
      doc.dataset.ragBypass = "explicit-command";
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(processNode);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
