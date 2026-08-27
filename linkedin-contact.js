(() => {
  "use strict";

  const LINKEDIN_URL = "https://www.linkedin.com/in/%EC%A7%84%EC%9A%A9-%EC%9C%A4-0556062a3/";
  const LINKEDIN_DISPLAY = "linkedin.com/in/진용-윤-0556062a3";

  function addLinkedInCard(root = document) {
    const grids = [];

    if (root instanceof Element && root.matches(".contact-grid")) {
      grids.push(root);
    }

    if (root instanceof Element || root instanceof Document || root instanceof DocumentFragment) {
      grids.push(...root.querySelectorAll(".contact-grid"));
    }

    for (const grid of grids) {
      if (grid.querySelector("[data-contact-linkedin]")) continue;

      const link = document.createElement("a");
      link.href = LINKEDIN_URL;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.dataset.contactLinkedin = "";
      link.setAttribute("aria-label", "LinkedIn profile");
      link.innerHTML = `<span>LINKEDIN</span><strong>${LINKEDIN_DISPLAY}</strong><i>↗</i>`;
      grid.appendChild(link);
    }
  }

  addLinkedInCard(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => addLinkedInCard(node));
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
