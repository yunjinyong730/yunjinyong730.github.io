(() => {
  "use strict";

  const RESUME_URL = "https://drive.google.com/file/d/15InrWUK8xsacOwnMGnNIofElaiE5Yzg2/view?usp=sharing";

  function addResumeLink(root = document) {
    const docs = [];

    if (root instanceof Element && root.matches(".answer-document")) docs.push(root);
    if (root instanceof Element || root instanceof Document || root instanceof DocumentFragment) {
      docs.push(...root.querySelectorAll(".answer-document"));
    }

    for (const doc of docs) {
      if (!doc.querySelector(".resume-identity")) continue;
      const actions = doc.querySelector(".inline-actions");
      if (!actions || actions.querySelector("[data-resume-pdf]")) continue;

      const link = document.createElement("a");
      link.href = RESUME_URL;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.dataset.resumePdf = "";
      link.setAttribute("aria-label", "Open resume PDF");
      link.textContent = "Resume PDF ↗";
      actions.prepend(link);
    }
  }

  addResumeLink(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => addResumeLink(node));
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
