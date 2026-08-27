const DATA_URL = "./portfolio-data.json?v=20260827-ai2";
const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";
const MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
const TOP_K = 3;
const CANDIDATE_K = 8;

let pendingQuery = "";
let dataPromise;
let extractorPromise;
const embeddingCache = new Map();

function injectSemanticStyles() {
  if (document.querySelector("#semantic-search-styles")) return;
  const style = document.createElement("style");
  style.id = "semantic-search-styles";
  style.textContent = `
    .semantic-search-status{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 12px;padding:10px 12px;border:1px solid rgba(145,154,166,.28);border-radius:12px;background:rgba(248,250,252,.72);font:500 10.5px/1.4 var(--mono,"DM Mono",monospace);letter-spacing:.06em;color:#65707d}
    .semantic-search-status strong{font-weight:600;color:#2f73ff}
    .semantic-results{display:grid;gap:12px;margin-top:12px}
    .semantic-result{position:relative;padding:18px 20px;border:1px solid rgba(145,154,166,.28);border-radius:18px;background:rgba(255,255,255,.82);box-shadow:0 12px 32px rgba(25,35,52,.045)}
    .semantic-result-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}
    .semantic-result-top span{font:500 10.5px/1.2 var(--mono,"DM Mono",monospace);letter-spacing:.08em;color:#76808c}
    .semantic-result h3{margin:0;font-size:17px;line-height:1.35;color:#191d24}
    .semantic-result p{margin:8px 0 0;font-size:14px;line-height:1.72;color:#59636f}
    .semantic-result .tag-row{margin-top:12px}
    .semantic-result-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .semantic-result-actions button,.semantic-result-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:0 12px;border:1px solid rgba(122,134,150,.34);border-radius:999px;background:#fff;color:#20252d;text-decoration:none;font:600 11px/1 var(--sans,"Inter",sans-serif);cursor:pointer}
    .semantic-result-actions button:hover,.semantic-result-actions a:hover{border-color:rgba(47,115,255,.5);color:#2f73ff}
    .semantic-search-note{margin-top:12px;font-size:12px;line-height:1.6;color:#737d89}
    @media(max-width:720px){
      .semantic-result{padding:16px}
      .semantic-result h3{font-size:15.5px}
      .semantic-result p{font-size:13.5px}
      .semantic-search-status{align-items:flex-start;flex-direction:column;gap:4px}
    }
  `;
  document.head.appendChild(style);
}

function loadData() {
  if (!dataPromise) {
    dataPromise = fetch(DATA_URL, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`portfolio data ${response.status}`);
        return response.json();
      })
      .then((payload) => Array.isArray(payload?.items) ? payload.items : []);
  }
  return dataPromise;
}

function normalize(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/camera[\s–—-]*lidar/g, "camera lidar")
    .replace(/on[\s–—-]*device/g, "on device")
    .replace(/[^0-9a-z가-힣+#.]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const conceptExpansions = [
  {
    test: /경량|lightweight|model compression|압축|distill|student|teacher|작은 모델|라즈베리|raspberry/,
    add: "경량화 모델 압축 지식 증류 knowledge distillation lightweight model compression raspberry pi edge tflite teacher student"
  },
  {
    test: /센서|sensor|보정|calibration|drift|드리프트/,
    add: "sensor calibration drift 센서 보정 드리프트 reference calibration anomaly time series"
  },
  {
    test: /자율주행|autonomous|lidar|라이다|fusion|퓨전|6dof|extrinsic/,
    add: "autonomous perception camera lidar sensor fusion 6dof extrinsic calibration 자율주행 센서 퓨전 라이다"
  },
  {
    test: /edge|온디바이스|on device|embedded|임베디드|배포|deployment|tflite|onnx/,
    add: "edge ai on device embedded deployment tflite onnx raspberry pi latency memory resource 배포 임베디드 온디바이스"
  },
  {
    test: /ios|swift|uikit|앱|app store|모바일|mobile/,
    add: "ios swift uikit app store mobile product application 출시 앱 모바일 제품"
  },
  {
    test: /android|kotlin|webrtc|websocket|realwear|원격 협업/,
    add: "android kotlin webrtc websocket realwear industrial remote collaboration 원격 협업 실시간 통화"
  },
  {
    test: /논문|paper|publication|저자|author|학회/,
    add: "publication paper journal conference 논문 연구 저자 manuscript"
  },
  {
    test: /과제|grant|nrf|iitp|funded|연구비/,
    add: "research grant funded project nrf iitp 연구 과제 연구비"
  },
  {
    test: /llm|agent|에이전트|nlp|텍스트|작문/,
    add: "llm agent on device agent korean nlp text analysis writing assessment feedback 한국어 텍스트 작문"
  },
  {
    test: /연락|contact|email|메일|linkedin|링크드인|github|깃허브/,
    add: "contact email linkedin github 연락처 메일 링크드인 깃허브"
  },
  {
    test: /resume|cv|이력서|경력|career|학력|education/,
    add: "resume cv career experience education 이력서 경력 학력 연구경력"
  }
];

function expandConcepts(text) {
  const normalized = normalize(text);
  let expanded = normalized;
  for (const concept of conceptExpansions) {
    if (concept.test.test(normalized)) expanded += ` ${concept.add}`;
  }
  return expanded;
}

function hashToken(token, size) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % size;
}

function tokenFeatures(text) {
  const normalized = expandConcepts(text);
  const words = normalized.split(" ").filter(Boolean);
  const features = [];
  for (const word of words) {
    features.push([`w:${word}`, 1.6]);
    if (word.length >= 3) {
      for (let index = 0; index < word.length - 1; index += 1) {
        features.push([`b:${word.slice(index, index + 2)}`, 0.55]);
      }
    }
    if (/^[a-z0-9+#.]+$/i.test(word) && word.length > 4) {
      const stem = word.replace(/(ing|ed|es|s)$/i, "");
      if (stem !== word) features.push([`s:${stem}`, 0.75]);
    }
  }
  for (let index = 0; index < words.length - 1; index += 1) {
    features.push([`p:${words[index]}_${words[index + 1]}`, 0.9]);
  }
  return features;
}

function vectorize(text, size = 384) {
  const vector = new Float32Array(size);
  for (const [feature, weight] of tokenFeatures(text)) {
    vector[hashToken(feature, size)] += weight;
  }
  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  for (let index = 0; index < vector.length; index += 1) vector[index] /= norm;
  return vector;
}

function dot(left, right) {
  const length = Math.min(left.length, right.length);
  let total = 0;
  for (let index = 0; index < length; index += 1) total += left[index] * right[index];
  return total;
}

function entrySearchText(entry) {
  return [
    entry?.title?.ko,
    entry?.title?.en,
    entry?.summary?.ko,
    entry?.summary?.en,
    ...(entry?.keywords || []),
    ...(entry?.aliases || []),
    entry?.type,
    entry?.route
  ].filter(Boolean).join(" · ");
}

function lexicalBonus(query, entry) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  let bonus = 0;
  const phrases = [...(entry.keywords || []), ...(entry.aliases || [])];
  for (const phrase of phrases) {
    const normalizedPhrase = normalize(phrase);
    if (!normalizedPhrase) continue;
    if (normalizedQuery.includes(normalizedPhrase)) bonus += 0.13;
    else if (normalizedPhrase.includes(normalizedQuery) && normalizedQuery.length >= 4) bonus += 0.07;
  }
  return Math.min(bonus, 0.32);
}

function localRank(query, items) {
  const queryVector = vectorize(query);
  return items
    .map((entry) => {
      const score = dot(queryVector, vectorize(entrySearchText(entry))) + lexicalBonus(query, entry);
      return { entry, score, localScore: score };
    })
    .sort((a, b) => b.score - a.score);
}

async function createExtractor() {
  const { pipeline } = await import(TRANSFORMERS_URL);
  const baseOptions = { dtype: "int8" };
  if (navigator.gpu) {
    try {
      return await pipeline("feature-extraction", MODEL_ID, {
        ...baseOptions,
        device: "webgpu"
      });
    } catch (error) {
      console.warn("[semantic-search] WebGPU unavailable, using WASM.", error);
    }
  }
  return pipeline("feature-extraction", MODEL_ID, baseOptions);
}

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = createExtractor().catch((error) => {
      extractorPromise = null;
      throw error;
    });
  }
  return extractorPromise;
}

async function embedEntries(extractor, entries) {
  const missing = entries.filter(({ entry }) => !embeddingCache.has(entry.id));
  if (missing.length) {
    const output = await extractor(
      missing.map(({ entry }) => entrySearchText(entry)),
      { pooling: "mean", normalize: true }
    );
    const rows = output.tolist();
    missing.forEach(({ entry }, index) => embeddingCache.set(entry.id, rows[index]));
  }
}

async function semanticRerank(query, ranked) {
  const candidates = ranked.slice(0, CANDIDATE_K);
  const extractor = await getExtractor();
  await embedEntries(extractor, candidates);
  const queryOutput = await extractor(query, { pooling: "mean", normalize: true });
  const queryEmbedding = queryOutput.tolist()[0];

  return candidates
    .map((candidate) => {
      const semantic = dot(queryEmbedding, embeddingCache.get(candidate.entry.id) || []);
      const normalizedSemantic = Math.max(0, Math.min(1, (semantic + 1) / 2));
      return {
        ...candidate,
        semanticScore: normalizedSemantic,
        score: normalizedSemantic * 0.76 + Math.max(0, candidate.localScore) * 0.24
      };
    })
    .sort((a, b) => b.score - a.score);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEnglish() {
  return document.documentElement.lang === "en" || document.documentElement.dataset.language === "en";
}

function labelForType(type, english) {
  const labels = {
    profile: ["PROFILE", "PROFILE"],
    resume: ["RESUME", "RESUME"],
    experience: ["EXPERIENCE", "EXPERIENCE"],
    research: ["RESEARCH", "RESEARCH"],
    publication: ["PUBLICATION", "PUBLICATION"],
    project: ["PROJECT", "PROJECT"],
    product: ["PRODUCT", "PRODUCT"],
    grant: ["RESEARCH GRANT", "RESEARCH GRANT"],
    skills: ["SKILLS", "SKILLS"],
    awards: ["AWARDS", "AWARDS"],
    contact: ["CONTACT", "CONTACT"]
  };
  return (labels[type] || ["PORTFOLIO", "PORTFOLIO"])[english ? 1 : 0];
}

function renderResults(doc, query, ranked, mode) {
  if (!doc?.isConnected) return;
  const english = isEnglish();
  const top = ranked.slice(0, TOP_K);
  const status = mode === "semantic"
    ? (english ? "SEMANTIC EMBEDDING READY" : "SEMANTIC EMBEDDING READY")
    : (english ? "FAST LOCAL RETRIEVAL" : "FAST LOCAL RETRIEVAL");

  const cards = top.map(({ entry }, index) => {
    const title = entry.title?.[english ? "en" : "ko"] || entry.title?.en || entry.id;
    const summary = entry.summary?.[english ? "en" : "ko"] || entry.summary?.en || "";
    const tags = (entry.keywords || []).slice(0, 5)
      .map((keyword) => `<span>${escapeHtml(keyword)}</span>`)
      .join("");
    const actionLabel = english ? "Open related section" : "관련 내용 열기";
    const externalLabel = english ? "Open source" : "원문 열기";
    const specificPrompts = {
      realtime: "멀티센서 실시간 Calibration 및 이상 탐지 프로젝트 보여줘",
      lidar: "Camera–LiDAR 6DoF Calibration Drift 프로젝트 보여줘",
      camera: "Camera Calibration Drift 자동 감지 복구 프로젝트 보여줘",
      distill: "Knowledge Distillation Raspberry Pi 경량화 프로젝트 보여줘"
    };
    const routeAction = entry.route
      ? (specificPrompts[entry.route]
        ? `<button type="button" data-query="${escapeHtml(specificPrompts[entry.route])}">${actionLabel}</button>`
        : `<button type="button" data-command="${escapeHtml(entry.route)}">${actionLabel}</button>`)
      : "";
    const hrefAction = entry.href
      ? `<a href="${escapeHtml(entry.href)}" target="_blank" rel="noreferrer">${externalLabel} ↗</a>`
      : "";

    return `
      <article class="semantic-result pop-target" style="--pop-delay:${Math.min(index * 80, 240)}ms">
        <div class="semantic-result-top">
          <span>${String(index + 1).padStart(2, "0")} · ${labelForType(entry.type, english)}</span>
          <span>${mode === "semantic" ? "AI MATCH" : "TOP MATCH"}</span>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(summary)}</p>
        <div class="tag-row">${tags}</div>
        <div class="semantic-result-actions">${routeAction}${hrefAction}</div>
      </article>`;
  }).join("");

  doc.innerHTML = `
    <p class="answer-kicker">NEON · AI SEARCH</p>
    <h2>${english
      ? "I searched the portfolio by meaning,<br><span>not just exact keywords.</span>"
      : "키워드가 정확히 같지 않아도,<br><span>의미가 가까운 경험을 찾았습니다.</span>"}</h2>
    <p class="answer-lead">${english
      ? `Top matches for “${escapeHtml(query)}” are retrieved from the structured portfolio index.`
      : `“${escapeHtml(query)}” 질문과 관련된 항목을 구조화된 포트폴리오 데이터에서 Top ${TOP_K}로 찾았습니다.`}</p>
    <div class="semantic-search-status">
      <span>LIGHTWEIGHT PORTFOLIO RETRIEVAL · TOP ${TOP_K}</span>
      <strong>${status}</strong>
    </div>
    <div class="semantic-results">${cards}</div>
    <p class="semantic-search-note">${english
      ? "The fast result appears immediately. When the browser embedding model is available, the same results are re-ranked semantically without blocking the page."
      : "빠른 로컬 검색 결과를 먼저 보여주고, 브라우저 임베딩 모델이 준비되면 페이지를 멈추지 않고 의미 기반으로 한 번 더 재정렬합니다."}</p>
  `;
}

async function enhanceFallback(doc, query) {
  if (!doc || doc.dataset.semanticEnhanced === "true" || !query?.trim()) return;
  doc.dataset.semanticEnhanced = "true";

  try {
    const items = await loadData();
    if (!items.length) return;
    const local = localRank(query, items);
    renderResults(doc, query, local, "local");

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const constrainedNetwork = Boolean(connection?.saveData) || /(^|-)2g$/i.test(connection?.effectiveType || "");
    if (!constrainedNetwork) {
      semanticRerank(query, local)
        .then((semantic) => renderResults(doc, query, semantic, "semantic"))
        .catch((error) => {
          console.warn("[semantic-search] embedding refinement skipped.", error);
        });
    }
  } catch (error) {
    console.warn("[semantic-search] portfolio retrieval unavailable.", error);
  }
}

function isFallbackDocument(doc) {
  const kicker = doc?.querySelector(".answer-kicker")?.textContent?.trim() || "";
  return /PORTFOLIO GUIDE/i.test(kicker);
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
    if (isFallbackDocument(doc)) {
      const query = pendingQuery;
      requestAnimationFrame(() => enhanceFallback(doc, query));
    }
  }
}

injectSemanticStyles();
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
