# Automated Blog Pipeline

This pipeline turns the existing GitHub Pages repository into an automated, quality-gated blog without changing the portfolio root page.

## Flow

1. Use a manual/queued topic, or research a new high-intent topic with OpenAI web search.
2. Generate a Korean long-form article from current sources.
3. Run a second independent web-search fact-check and quality review.
4. Reject the run when the quality score is below `minimumQualityScore`.
5. Render `/blog/posts/<slug>.html`, update `/blog/index.html`, `sitemap.xml`, `feed.xml`, and commit from GitHub Actions.

## One-time setup

In GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

Create `OPENAI_API_KEY` with your OpenAI API key. Do not put the key in `.env`, source code, Actions YAML, issues, or commits.

Then run **Actions → Automated Blog Publisher → Run workflow** once. You can provide a topic or leave it blank to let the opportunity selector choose one.

The workflow is scheduled for 07:30 Asia/Seoul every day. Edit `.github/workflows/auto-blog.yml` to change the cadence.

## Configuration

- `automation/blog-config.json`: niche, audience, model, quality threshold and publication settings.
- `automation/topic-queue.json`: optional manual backlog. Strings are accepted; structured topic objects are also accepted.
- `automation/monetization.json`: affiliate and AdSense settings. Empty values render nothing.

Example affiliate entry:

```json
{
  "label": "Example Tool",
  "url": "https://example.com/your-affiliate-url",
  "match": ["example tool", "example"]
}
```

Only use affiliate URLs that comply with the merchant program and applicable disclosure rules.

For AdSense, fill `client` and `slot` only after your site/account is approved. The generator does not fabricate IDs.

## Cost and safety controls

The default model is `gpt-5.4-mini`, one post is generated per run, and each post uses separate research/write and QA calls. Low-quality content fails the workflow instead of publishing. YMYL categories are excluded in the topic-selection prompt.

This is an MVP. Before relying on it as a business, add Search Console/GA4 ingestion, conversion tracking, refresh rules for aging posts, and a revenue-per-page feedback loop.
