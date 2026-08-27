# Self-hosted Local LLM RAG

This portfolio can answer grounded questions with a local Ollama model running on your own PC. No Vercel AI Gateway or paid LLM API is required.

## Architecture

```text
GitHub Pages
  https://yunjinyong730.github.io
          |
          | HTTPS POST /api/rag
          v
Your public hostname (Caddy :443)
          |
          | reverse proxy only
          v
127.0.0.1:3000  Node local RAG server
          |
          | private loopback
          v
127.0.0.1:11434 Ollama / qwen3:1.7b
```

If the local server is offline, the portfolio automatically falls back to the browser-side grounded retrieval answer. The site itself keeps working.

## 1. Install Node.js, Ollama, and Caddy

Requirements:

- Node.js 22+
- Ollama: https://ollama.com/
- Caddy: https://caddyserver.com/

Do **not** expose Ollama port `11434` directly to the internet.

## 2. Pull the lightweight model

```bash
ollama pull qwen3:1.7b
```

The default server configuration uses `qwen3:1.7b`. Override `OLLAMA_MODEL` in `.env` if you want a different local model later.

Quick Ollama check:

```bash
ollama run qwen3:1.7b "한국어로 한 문장만 답해줘: 준비됐어?"
```

## 3. Configure the local RAG server

From the repository root:

```bash
cp .env.example .env
npm run rag:serve
```

The server binds to `127.0.0.1:3000` by default, so it is not directly reachable from the public internet.

Open another terminal and run:

```bash
npm run rag:check
```

A healthy setup prints both `Health OK` and `RAG generation OK`.

You can also inspect:

```bash
curl http://127.0.0.1:3000/health
```

Expected shape:

```json
{
  "ok": true,
  "service": "portfolio-local-rag",
  "backend": "ollama",
  "model": "qwen3:1.7b",
  "ollama": "ready"
}
```

## 4. Public HTTPS without a serverless platform

You need a hostname such as `ai.example.com` whose DNS A/AAAA record points to your home public IP.

If your ISP uses CGNAT and does not give you a reachable public IP, direct self-hosting from home will not work. Ask the ISP for a public IP or use a network where inbound 80/443 is possible.

Copy the example Caddy configuration:

```bash
cp Caddyfile.example Caddyfile
```

Replace `ai.example.com` with your real hostname, then run Caddy.

```bash
caddy run --config Caddyfile
```

On your router, forward only:

- TCP 80 -> the machine running Caddy
- TCP 443 -> the machine running Caddy

Do **not** forward:

- `11434` (Ollama)
- `3000` (Node RAG server)

Caddy terminates HTTPS and proxies only to `127.0.0.1:3000`.

## 5. Connect GitHub Pages to the self-hosted API

After this URL works publicly:

```text
https://YOUR-AI-HOST/api/rag
```

edit `rag-config.js`:

```js
window.PORTFOLIO_RAG_ENDPOINT =
  window.PORTFOLIO_RAG_ENDPOINT || "https://YOUR-AI-HOST/api/rag";
```

Then bump the `rag-config.js` version query in `index.html` so browsers do not keep an older cached endpoint.

The Node server already allows browser requests from:

```text
https://yunjinyong730.github.io
```

If the portfolio domain changes, update `RAG_ALLOWED_ORIGINS` in `.env`.

## 6. What a successful live answer looks like

A real Ollama-generated answer shows:

```text
LOCAL LLM · GROUNDED
```

and the API returns:

```json
{
  "grounded": true,
  "backend": "ollama",
  "model": "qwen3:1.7b",
  "usedSourceIds": ["..."],
  "answer": "..."
}
```

If the machine, Ollama, DNS, or HTTPS endpoint is unavailable, the browser shows:

```text
LOCAL GROUNDED FALLBACK
```

That fallback does not call an LLM.

## Built-in protections

`server/local-rag-server.mjs` includes:

- strict browser Origin allow-list
- server-side source ID validation against `rag-context.json`
- maximum query/body/context sizes
- per-IP in-memory rate limiting
- maximum concurrent generations
- Ollama request timeout
- no external API key or credit card
- Ollama kept on loopback by default

Default limits are in `.env.example` and can be adjusted there.

## Recommended production checklist

1. Keep the host OS and Ollama updated.
2. Keep `RAG_HOST=127.0.0.1`.
3. Expose only 80/443 through Caddy.
4. Keep `RAG_RATE_LIMIT` small for a portfolio site.
5. Start with `RAG_MAX_CONCURRENT=1` or `2` on a laptop/mini PC.
6. Verify `npm run rag:check` after model or server changes.
7. Confirm the public site displays `LOCAL LLM · GROUNDED`, not the fallback label.
