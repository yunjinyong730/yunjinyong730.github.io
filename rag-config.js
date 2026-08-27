(() => {
  "use strict";

  // GitHub Pages cannot execute serverless functions itself.
  // Once the Vercel deployment is linked, set this to the deployed /api/rag URL.
  // When the whole site is opened on *.vercel.app, rag-client.js automatically uses same-origin /api/rag.
  window.PORTFOLIO_RAG_ENDPOINT = window.PORTFOLIO_RAG_ENDPOINT || "";
})();
