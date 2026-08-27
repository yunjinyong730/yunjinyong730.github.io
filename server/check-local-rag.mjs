const baseUrl = String(process.env.LOCAL_RAG_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

async function expectJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 300)}`);
  }
  return { response, payload };
}

const health = await expectJson(`${baseUrl}/health`);
if (!health.response.ok || health.payload?.ok !== true) {
  console.error("Local RAG health check failed:", health.response.status, health.payload);
  process.exit(1);
}
console.log("Health OK:", {
  backend: health.payload.backend,
  model: health.payload.model,
  ollama: health.payload.ollama
});

const sample = await expectJson(`${baseUrl}/api/rag`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: "https://yunjinyong730.github.io" },
  body: JSON.stringify({
    query: "윤진용이 쓴 논문 중 가장 대표적인 논문은 무엇이고 왜 그렇게 볼 수 있어?",
    language: "ko",
    contextIds: [
      "paper-jok-2026-scale",
      "paper-aaai-2027-reference-efficient",
      "paper-cikm-2026-thales"
    ]
  })
});

if (!sample.response.ok) {
  console.error("RAG sample failed:", sample.response.status, sample.payload);
  process.exit(1);
}

if (sample.payload?.grounded !== true || sample.payload?.backend !== "ollama") {
  console.error("Unexpected RAG response:", sample.payload);
  process.exit(1);
}

if (!String(sample.payload?.answer || "").trim() || !Array.isArray(sample.payload?.usedSourceIds) || !sample.payload.usedSourceIds.length) {
  console.error("Incomplete RAG response:", sample.payload);
  process.exit(1);
}

console.log("RAG generation OK:", {
  backend: sample.payload.backend,
  model: sample.payload.model,
  usedSourceIds: sample.payload.usedSourceIds,
  answerChars: sample.payload.answer.length
});
console.log("\nSample answer:\n", sample.payload.answer);
