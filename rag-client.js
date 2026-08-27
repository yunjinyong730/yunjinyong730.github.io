(() => {
  "use strict";

  const DATA_URL = "./rag-context.json?v=20260827-rag1";
  const MAX_CONTEXTS = 6;
  const SUPERLATIVE = /제일|가장|대표|중요|추천|우선|먼저|강점|best|most important|strongest|recommend|top choice|which.*best/i;
  const COMPARATIVE = /비교|차이|왜|이유|어떤.*더|어느.*더|관련.*높|적합|compare|versus|\bvs\b|why|reason|more relevant|better fit/i;
  const SYNTHESIS = /정리|요약|골라|선택|평가|판단|연결|관점|면접|채용|summarize|choose|select|evaluate|judge|connect|recruiter/i;

  let pendingQuery = "";
  let dataPromise;
  let requestSequence = 0;

  function isEnglish() {
    return document.documentElement.lang === "en" || document.documentElement.dataset.language === "en";
  }

  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(DATA_URL, { cache: "force-cache" })
        .then((response) => {
          if (!response.ok) throw new Error(`rag context ${response.status}`);
          return response.json();
        })
        .then((payload) => Array.isArray(payload?.items) ? payload.items : []);
    }
    return dataPromise;
  }

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/camera[\s–—-]*lidar/g, "camera lidar")
      .replace(/on[\s–—-]*device/g, "on device")
      .replace(/[^0-9a-z가-힣+#.]+/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const expansions = [
    [/논문|paper|publication|manuscript|저자/, "논문 paper publication manuscript author"],
    [/경량|압축|distill|라즈베리|raspberry|lightweight|compression/, "경량화 model compression knowledge distillation raspberry pi edge ai lightweight"],
    [/센서|보정|calibration|drift|드리프트/, "sensor calibration drift 센서 보정 드리프트"],
    [/자율주행|lidar|라이다|fusion|퓨전|6dof|extrinsic/, "autonomous perception camera lidar sensor fusion 6dof extrinsic 자율주행 센서 퓨전"],
    [/edge|온디바이스|on device|embedded|배포|deployment|tflite|mcu/, "edge ai on device embedded deployment tflite mcu resource latency"],
    [/llm|agent|에이전트|nlp|텍스트|작문/, "llm agent korean nlp text writing assessment feedback 한국어 작문"],
    [/github|깃허브|코드|repository|repo/, "github repository implementation code 깃허브 구현"],
    [/수상|award|gold|best paper/, "award best paper gold 수상"],
    [/실시간|real time|anomaly|이상탐지/, "real time anomaly detection online monitoring 실시간 이상탐지"]
  ];

  function expand(value) {
    const base = normalize(value);
    let result = base;
    for (const [pattern, text] of expansions) {
      if (pattern.test(base)) result += ` ${text}`;
    }
    return result;
  }

  function tokens(value) {
    return new Set(expand(value).split(" ").filter((token) => token.length >= 2));
  }

  function sourceSearchText(source) {
    return [
      source?.title?.ko,
      source?.title?.en,
      source?.summary?.ko,
      source?.summary?.en,
      source?.sourceLabel,
      ...(source?.keywords || []),
      ...(source?.aliases || [])
    ].filter(Boolean).join(" ");
  }

  function intentFilter(query, sources) {
    const q = normalize(query);
    if (/논문|paper|publication|manuscript/.test(q)) {
      const filtered = sources.filter((source) => source.type === "publication");
      if (filtered.length) return filtered;
    }
    if (/프로젝트|project/.test(q)) {
      const filtered = sources.filter((source) => source.type === "project");
      if (filtered.length) return filtered;
    }
    if (/github|깃허브|repository|repo/.test(q)) {
      const filtered = sources.filter((source) => source.href?.includes("github.com") || source.sourceType === "GitHub");
      if (filtered.length) return filtered;
    }
    return sources;
  }

  function rankSources(query, allSources) {
    const sources = intentFilter(query, allSources);
    const queryTokens = tokens(query);
    const isSuperlative = SUPERLATIVE.test(query);

    return sources
      .map((source) => {
        const searchTokens = tokens(sourceSearchText(source));
        let overlap = 0;
        for (const token of queryTokens) {
          if (searchTokens.has(token)) overlap += token.length >= 5 ? 1.25 : 1;
        }

        const phraseHaystack = normalize(sourceSearchText(source));
        let phraseBonus = 0;
        for (const alias of source.aliases || []) {
          const phrase = normalize(alias);
          if (phrase && normalize(query).includes(phrase)) phraseBonus += 2.4;
        }

        const importance = Number(source.importance || 0);
        const score = overlap + phraseBonus + importance * (isSuperlative ? 4.2 : 0.55);
        return { source, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_CONTEXTS);
  }

  function isFallbackDocument(doc) {
    const kicker = doc?.querySelector(".answer-kicker")?.textContent?.trim() || "";
    return /PORTFOLIO GUIDE|AI SEARCH/i.test(kicker);
  }

  function shouldUseRag(query, doc) {
    if (!query?.trim()) return false;
    if (isFallbackDocument(doc)) return true;
    return SUPERLATIVE.test(query) || COMPARATIVE.test(query) || SYNTHESIS.test(query);
  }

  function resolveEndpoint() {
    const configured = String(window.PORTFOLIO_RAG_ENDPOINT || "").trim();
    if (configured) return configured;

    const meta = document.querySelector('meta[name="portfolio-rag-endpoint"]')?.content?.trim();
    if (meta) return meta;

    const host = window.location.hostname;
    if (host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1") {
      return `${window.location.origin}/api/rag`;
    }

    return "";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function localized(source, field) {
    const english = isEnglish();
    return source?.[field]?.[english ? "en" : "ko"] || source?.[field]?.en || source?.[field]?.ko || "";
  }

  function sourceLabel(source) {
    return `${source.sourceType || "Source"} · ${source.sourceLabel || localized(source, "title")}`;
  }

  function sourceChips(sources, usedIds) {
    const ids = new Set(usedIds?.length ? usedIds : sources.slice(0, 3).map((source) => source.id));
    const chosen = sources.filter((source) => ids.has(source.id));
    return chosen.map((source) => {
      const label = escapeHtml(sourceLabel(source));
      if (source.href) {
        return `<a class="rag-source-chip" href="${escapeHtml(source.href)}" target="_blank" rel="noreferrer">${label} ↗</a>`;
      }
      return `<span class="rag-source-chip">${label}</span>`;
    }).join("");
  }

  function answerMarkup(answer) {
    const safe = escapeHtml(answer);
    const blocks = safe.split(/\n{2,}/).filter(Boolean);
    return blocks.map((block) => {
      const lines = block.split("\n").filter(Boolean);
      if (lines.length > 1 && lines.every((line) => /^[-•*]\s*/.test(line))) {
        return `<ul>${lines.map((line) => `<li>${line.replace(/^[-•*]\s*/, "")}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.join("<br>")}</p>`;
    }).join("");
  }

  function renderShell(doc, query, ranked, statusText) {
    const english = isEnglish();
    const sources = ranked.map(({ source }) => source);
    doc.innerHTML = `
      <p class="answer-kicker">NEON · GROUNDED RAG</p>
      <h2>${english ? "Searching the portfolio first,<br><span>then reasoning only from those results.</span>" : "포트폴리오에서 근거를 먼저 찾고,<br><span>찾은 내용만으로 답변을 만들고 있습니다.</span>"}</h2>
      <p class="answer-lead">${english ? `Question: “${escapeHtml(query)}”` : `질문: “${escapeHtml(query)}”`}</p>
      <div class="rag-status"><span>${english ? "RETRIEVE → GROUND → ANSWER" : "검색 → 근거 제한 → 답변 생성"}</span><strong>${escapeHtml(statusText)}</strong></div>
      <div class="rag-loading" aria-live="polite"><i></i><span>${english ? "Preparing a grounded answer…" : "근거 기반 답변을 준비하고 있습니다…"}</span></div>
      <div class="rag-based-on"><b>Based on:</b>${sourceChips(sources, sources.slice(0, 3).map((source) => source.id))}</div>
    `;
  }

  function renderAnswer(doc, answer, ranked, usedIds, mode) {
    if (!doc?.isConnected) return;
    const english = isEnglish();
    const sources = ranked.map(({ source }) => source);
    const modeLabel = mode === "server"
      ? (english ? "SERVERLESS LLM · GROUNDED" : "SERVERLESS LLM · GROUNDED")
      : (english ? "LOCAL GROUNDED FALLBACK" : "LOCAL GROUNDED FALLBACK");

    doc.innerHTML = `
      <p class="answer-kicker">NEON · GROUNDED RAG</p>
      <h2>${english ? "Answer grounded in retrieved<br><span>portfolio evidence.</span>" : "검색된 포트폴리오 근거만 사용해<br><span>답변했습니다.</span>"}</h2>
      <div class="rag-status"><span>RAG · TOP ${Math.min(MAX_CONTEXTS, ranked.length)}</span><strong>${modeLabel}</strong></div>
      <div class="rag-answer-copy">${answerMarkup(answer)}</div>
      <div class="rag-based-on"><b>Based on:</b>${sourceChips(sources, usedIds)}</div>
    `;
  }

  function localGroundedFallback(query, ranked) {
    const english = isEnglish();
    const top = ranked[0]?.source;
    if (!top) {
      return english
        ? "I could not find enough grounded portfolio evidence for that question."
        : "이 질문에 답할 만큼 충분한 포트폴리오 근거를 찾지 못했습니다.";
    }

    const title = localized(top, "title");
    const summary = localized(top, "summary");
    const signals = Array.isArray(top.signals?.[english ? "en" : "ko"])
      ? top.signals[english ? "en" : "ko"].slice(0, 3)
      : [];

    if (SUPERLATIVE.test(query) || COMPARATIVE.test(query)) {
      if (english) {
        return `Based on the retrieved portfolio evidence, “${title}” is the strongest candidate. ${summary}\n\nWhy: ${signals.join(" · ")}`;
      }
      return `검색된 포트폴리오 근거를 기준으로 보면 “${title}”이 가장 강한 후보입니다. ${summary}\n\n판단 근거: ${signals.join(" · ")}`;
    }

    return `${title}\n\n${summary}`;
  }

  async function callServer(query, ranked) {
    const endpoint = resolveEndpoint();
    if (!endpoint) throw new Error("rag_endpoint_not_configured");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        language: isEnglish() ? "en" : "ko",
        contextIds: ranked.map(({ source }) => source.id)
      })
    });

    if (!response.ok) throw new Error(`rag_api_${response.status}`);
    const payload = await response.json();
    if (!payload?.answer) throw new Error("rag_empty_answer");
    return payload;
  }

  async function answerWithRag(doc, query) {
    if (!doc || doc.dataset.ragHandled === "true") return;
    doc.dataset.ragHandled = "true";
    doc.dataset.semanticEnhanced = "true";
    const requestId = ++requestSequence;

    try {
      const sources = await loadData();
      const ranked = rankSources(query, sources);
      if (!ranked.length) return;

      renderShell(doc, query, ranked, resolveEndpoint() ? "SERVERLESS RAG" : "GROUNDING READY");

      try {
        const result = await callServer(query, ranked);
        if (requestId !== requestSequence || !doc.isConnected) return;
        renderAnswer(doc, result.answer, ranked, result.usedSourceIds, "server");
      } catch (error) {
        console.warn("[rag-client] serverless answer unavailable; using grounded local fallback.", error);
        if (requestId !== requestSequence || !doc.isConnected) return;
        const fallback = localGroundedFallback(query, ranked);
        renderAnswer(doc, fallback, ranked, ranked.slice(0, 3).map(({ source }) => source.id), "local");
      }
    } catch (error) {
      console.warn("[rag-client] retrieval unavailable.", error);
    }
  }

  function handleNode(node) {
    if (!(node instanceof Element)) return;

    const userMessages = [];
    if (node.matches(".user-message")) userMessages.push(node);
    userMessages.push(...node.querySelectorAll(".user-message"));
    for (const message of userMessages) {
      const text = message.querySelector("p")?.textContent?.trim();
      if (text) pendingQuery = text;
    }

    const docs = [];
    if (node.matches(".answer-document")) docs.push(node);
    docs.push(...node.querySelectorAll(".answer-document"));
    for (const doc of docs) {
      const query = pendingQuery;
      if (shouldUseRag(query, doc)) {
        requestAnimationFrame(() => answerWithRag(doc, query));
      }
    }
  }

  function injectStyles() {
    if (document.querySelector("#rag-client-styles")) return;
    const style = document.createElement("style");
    style.id = "rag-client-styles";
    style.textContent = `
      .rag-status{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 14px;padding:10px 12px;border:1px solid rgba(145,154,166,.28);border-radius:12px;background:rgba(248,250,252,.76);font:500 10.5px/1.4 var(--mono,"DM Mono",monospace);letter-spacing:.055em;color:#66717e}
      .rag-status strong{color:#2f73ff;font-weight:600}
      .rag-loading{display:flex;align-items:center;gap:10px;padding:20px;border:1px solid rgba(145,154,166,.22);border-radius:16px;background:rgba(255,255,255,.78);font-size:13.5px;color:#59636f}
      .rag-loading i{width:9px;height:9px;border:2px solid rgba(47,115,255,.2);border-top-color:#2f73ff;border-radius:50%;animation:rag-spin .8s linear infinite}
      @keyframes rag-spin{to{transform:rotate(360deg)}}
      .rag-answer-copy{margin-top:12px;padding:20px 22px;border:1px solid rgba(145,154,166,.24);border-radius:18px;background:rgba(255,255,255,.88);box-shadow:0 12px 34px rgba(26,35,52,.04)}
      .rag-answer-copy p{margin:0 0 12px;font-size:15px;line-height:1.78;color:#313842}
      .rag-answer-copy p:last-child{margin-bottom:0}
      .rag-answer-copy ul{margin:4px 0 0;padding-left:20px;color:#313842}
      .rag-answer-copy li{margin:7px 0;font-size:14px;line-height:1.65}
      .rag-based-on{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:14px;padding-top:13px;border-top:1px solid rgba(145,154,166,.2)}
      .rag-based-on b{margin-right:2px;font:600 10.5px/1 var(--mono,"DM Mono",monospace);letter-spacing:.055em;color:#697480}
      .rag-source-chip{display:inline-flex;align-items:center;min-height:31px;padding:0 10px;border:1px solid rgba(47,115,255,.2);border-radius:999px;background:#f6f9ff;color:#336fd3;text-decoration:none;font:600 10.5px/1.2 var(--sans,"Inter",sans-serif)}
      a.rag-source-chip:hover{border-color:rgba(47,115,255,.46);background:#edf4ff}
      @media(max-width:720px){.rag-status{align-items:flex-start;flex-direction:column;gap:4px}.rag-answer-copy{padding:16px}.rag-answer-copy p{font-size:14px}.rag-source-chip{font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  injectStyles();
  loadData().catch(() => {});

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(handleNode);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
