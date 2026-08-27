(() => {
  "use strict";

  // GitHub Pages delegates grounded answer generation to the production
  // Vercel serverless function. Keep the API key/server credentials on Vercel.
  window.PORTFOLIO_RAG_ENDPOINT =
    window.PORTFOLIO_RAG_ENDPOINT || "https://yunjinyong730-github-io.vercel.app/api/rag";
})();
