(() => {
  "use strict";

  // Self-hosted mode: set this to your HTTPS reverse-proxy URL after the
  // local Ollama server is reachable from the public internet, for example:
  // "https://ai.example.com/api/rag"
  //
  // Keep this empty until then. The portfolio will use its grounded local
  // retrieval fallback instead of calling a paid/serverless AI platform.
  window.PORTFOLIO_RAG_ENDPOINT = window.PORTFOLIO_RAG_ENDPOINT || "";
})();
