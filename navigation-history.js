(() => {
  "use strict";

  const app = document.querySelector("#app");
  if (!app || !window.history?.replaceState) return;

  const VIEW_KEY = "portfolioView";
  const messageList = document.querySelector("#messageList");
  const landingInput = document.querySelector("#landingInput");
  const chatInput = document.querySelector("#chatInput");

  let applyingHistory = false;
  let clearOnLandingPop = false;

  function currentView() {
    return app.classList.contains("is-chatting") ? "chat" : "landing";
  }

  function setView(view, { clear = false, focus = false } = {}) {
    applyingHistory = true;

    if (view === "chat") {
      app.classList.remove("is-landing");
      app.classList.add("is-chatting");
    } else {
      app.classList.remove("is-chatting");
      app.classList.add("is-landing");

      if (clear) {
        if (messageList) messageList.innerHTML = "";
        if (landingInput) landingInput.value = "";
        if (chatInput) chatInput.value = "";
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    window.requestAnimationFrame(() => {
      applyingHistory = false;
      if (focus && view === "chat") chatInput?.focus({ preventScroll: true });
    });
  }

  // A page load always starts from the landing DOM. Mark that history entry so
  // entering chat can create one meaningful same-page Back destination.
  window.history.replaceState(
    { ...(window.history.state || {}), [VIEW_KEY]: currentView() },
    "",
    window.location.href
  );

  const classObserver = new MutationObserver(() => {
    if (applyingHistory) return;

    const view = currentView();
    const stateView = window.history.state?.[VIEW_KEY];

    if (view === "chat" && stateView !== "chat") {
      window.history.pushState(
        { ...(window.history.state || {}), [VIEW_KEY]: "chat" },
        "",
        window.location.href
      );
    }
  });

  classObserver.observe(app, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("popstate", (event) => {
    const view = event.state?.[VIEW_KEY] === "chat" ? "chat" : "landing";

    if (view === "chat") {
      setView("chat", { focus: true });
      return;
    }

    setView("landing", { clear: clearOnLandingPop });
    clearOnLandingPop = false;
  });

  // Existing home buttons call the legacy goHome() handler. When there is a
  // chat history entry, use real browser history instead so Back/Forward stay
  // coherent. Explicit home/new-chat actions still clear the conversation.
  document.addEventListener("click", (event) => {
    const homeTarget = event.target.closest?.('[data-action="home"]');
    if (!homeTarget) return;

    if (currentView() === "chat" && window.history.state?.[VIEW_KEY] === "chat") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      clearOnLandingPop = true;
      window.history.back();
    }
  }, true);
})();
