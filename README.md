# yunjinyong730.github.io

Yun Jinyong's AI/ML portfolio site.

## Local LLM RAG

The portfolio supports a fully self-hosted grounded RAG backend using Ollama on a local PC/mini PC. The public GitHub Pages site keeps working even when the local LLM server is offline by falling back to browser-side grounded retrieval.

Setup and security guide: [LOCAL_AI_SETUP.md](./LOCAL_AI_SETUP.md)

Quick start after installing Ollama and Node.js 22+:

```bash
ollama pull qwen3:1.7b
cp .env.example .env
npm run rag:serve
```

In another terminal:

```bash
npm run rag:check
```
