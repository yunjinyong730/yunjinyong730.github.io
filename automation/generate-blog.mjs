import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'automation', 'blog-config.json');
const QUEUE_PATH = path.join(ROOT, 'automation', 'topic-queue.json');
const MONETIZATION_PATH = path.join(ROOT, 'automation', 'monetization.json');
const POSTS_PATH = path.join(ROOT, 'blog', 'posts.json');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');

const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
const queue = JSON.parse(await readFile(QUEUE_PATH, 'utf8'));
const monetization = JSON.parse(await readFile(MONETIZATION_PATH, 'utf8'));
const posts = existsSync(POSTS_PATH) ? JSON.parse(await readFile(POSTS_PATH, 'utf8')) : [];
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('OPENAI_API_KEY is required. Add it as a GitHub Actions repository secret.');

const today = new Date().toISOString().slice(0, 10);
const manualTopic = (process.env.BLOG_TOPIC || '').trim();
const siteBase = config.site.baseUrl.replace(/\/$/, '');

const esc = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xml = esc;
const slugify = (value) => String(value || '')
  .toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const safeUrl = (value) => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.toString() : ''; } catch { return ''; } };

function sanitizeGeneratedHtml(value = '') {
  const allowed = new Set(['h2','h3','p','ul','ol','li','table','thead','tbody','tr','th','td','pre','code','blockquote','strong','em','a','br','hr']);
  return String(value).replace(/<\/?([a-zA-Z0-9:-]+)([^>]*)>/g, (full, rawName, rawAttrs) => {
    const name = rawName.toLowerCase();
    if (!allowed.has(name)) return '';
    if (full.startsWith('</')) return `</${name}>`;
    if (name === 'br' || name === 'hr') return `<${name}>`;
    if (name !== 'a') return `<${name}>`;
    const match = rawAttrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = safeUrl(match?.[1] || match?.[2] || match?.[3] || '');
    return href ? `<a href="${esc(href)}" rel="noopener noreferrer">` : '<a>';
  });
}

async function openaiJson({ name, schema, instructions, input, webSearch = true }) {
  const body = {
    model: config.openai.model,
    store: false,
    instructions,
    input,
    max_output_tokens: config.openai.maxOutputTokens,
    text: { format: { type: 'json_schema', name, strict: true, schema } },
    include: webSearch ? ['web_search_call.action.sources'] : undefined,
    tools: webSearch ? [{ type: 'web_search_preview', search_context_size: config.openai.searchContextSize }] : []
  };
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`OpenAI API ${response.status}: ${JSON.stringify(payload)}`);
  const text = payload.output?.flatMap(item => item.type === 'message' ? (item.content || []) : [])
    .find(item => item.type === 'output_text')?.text;
  if (!text) throw new Error(`No structured text returned: ${JSON.stringify(payload)}`);
  return { data: JSON.parse(text), raw: payload };
}

const topicSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    topic: { type: 'string' }, primaryKeyword: { type: 'string' }, searchIntent: { type: 'string' },
    monetizationAngle: { type: 'string' }, whyNow: { type: 'string' }, opportunityScore: { type: 'integer', minimum: 0, maximum: 100 }
  },
  required: ['topic','primaryKeyword','searchIntent','monetizationAngle','whyNow','opportunityScore']
};

const articleSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    title: { type: 'string' }, slug: { type: 'string' }, description: { type: 'string' }, category: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 8 },
    contentHtml: { type: 'string' },
    faq: { type: 'array', minItems: 2, maxItems: 6, items: { type: 'object', additionalProperties: false, properties: { question: { type: 'string' }, answer: { type: 'string' } }, required: ['question','answer'] } },
    sources: { type: 'array', minItems: 3, maxItems: 12, items: { type: 'object', additionalProperties: false, properties: { title: { type: 'string' }, url: { type: 'string' } }, required: ['title','url'] } },
    affiliateOpportunities: { type: 'array', items: { type: 'string' }, maxItems: 5 }
  },
  required: ['title','slug','description','category','tags','contentHtml','faq','sources','affiliateOpportunities']
};

const qaSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    score: { type: 'integer', minimum: 0, maximum: 100 }, approved: { type: 'boolean' },
    revisedHtml: { type: 'string' }, warnings: { type: 'array', items: { type: 'string' }, maxItems: 12 },
    verificationSummary: { type: 'string' }
  },
  required: ['score','approved','revisedHtml','warnings','verificationSummary']
};

async function chooseTopic() {
  if (manualTopic) return { topic: manualTopic, primaryKeyword: manualTopic, searchIntent: 'mixed', monetizationAngle: 'manual topic', whyNow: 'manual run', opportunityScore: 100 };
  if (queue.length) {
    const q = queue.shift();
    if (typeof q === 'string') return { topic: q, primaryKeyword: q, searchIntent: 'mixed', monetizationAngle: 'queued', whyNow: 'queued', opportunityScore: 100 };
    return q;
  }
  const recent = posts.slice(0, config.content.recentTitleWindow).map(p => p.title);
  const { data } = await openaiJson({
    name: 'blog_topic', schema: topicSchema, webSearch: true,
    instructions: `You are a content opportunity analyst for a sustainable Korean technology publication. Choose one useful, non-spammy topic with real search intent and a plausible ethical monetization path. Avoid YMYL, hype, copied listicles, and topics that cannot add original decision value. Prefer comparisons, implementation guides, cost/architecture tradeoffs, or workflow automation.`,
    input: `Date: ${today}\nNiche: ${config.content.niche}\nAudience: ${config.content.audience}\nDisallowed: ${config.content.disallowedTopics.join('; ')}\nRecently published titles to avoid: ${JSON.stringify(recent)}\nUse current web search evidence. Return the single best opportunity.`
  });
  return data;
}

async function writeArticle(topic) {
  const { data } = await openaiJson({
    name: 'blog_article', schema: articleSchema, webSearch: true,
    instructions: `You are the research writer for a Korean AI engineering publication. Research current primary/official sources first. Write in natural Korean for practitioners. The article must provide decision value beyond summarizing search results: concrete steps, tradeoffs, limitations, cost/operational considerations, and examples where appropriate. Never invent benchmarks, prices, dates, quotes, product capabilities, or personal experience. Clearly distinguish facts from recommendations. Use semantic HTML only inside contentHtml: h2/h3/p/ul/ol/table/pre/code/blockquote/strong/em/a. Do not include h1, html, head, body, scripts, styles, ad code, affiliate links, or unverifiable claims. Link factual claims to credible sources where useful.`,
    input: `Today: ${today}\nTopic: ${JSON.stringify(topic)}\nSite niche: ${config.content.niche}\nAudience: ${config.content.audience}\nTarget length: roughly 1800-2800 Korean words when the subject supports it.\nCreate an ASCII lowercase hyphenated slug. Include 3-12 high-quality sources, prioritizing official documentation, original research, standards, and first-party product documentation.`
  });
  return data;
}

async function qualityCheck(topic, article) {
  const { data } = await openaiJson({
    name: 'quality_review', schema: qaSchema, webSearch: true,
    instructions: `Act as a strict independent editor and fact checker. Verify time-sensitive factual claims with web search. Penalize unsupported claims, fake precision, thin content, SEO filler, unsafe/YMYL advice, misleading monetization, and claims not supported by reputable sources. revisedHtml must always contain the full publishable article body, corrected as needed, using only semantic HTML. approved may be true only when the article is genuinely useful and factually defensible.`,
    input: `Today: ${today}\nMinimum passing score: ${config.content.minimumQualityScore}\nTopic: ${JSON.stringify(topic)}\nDraft title: ${article.title}\nDraft sources: ${JSON.stringify(article.sources)}\nDraft HTML:\n${article.contentHtml}`
  });
  return data;
}

function activeAffiliateLinks(article) {
  const text = `${article.title} ${article.contentHtml}`.toLowerCase();
  return (monetization.affiliateLinks || []).filter(link => safeUrl(link.url) && (link.match || []).some(k => text.includes(String(k).toLowerCase())));
}

function renderAd() {
  const { client, slot } = monetization.adsense || {};
  if (!client || !slot) return '';
  return `<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(client)}" data-ad-slot="${esc(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`;
}

function renderArticle(topic, article, qa, slug) {
  const url = `${siteBase}/blog/posts/${slug}.html`;
  const sources = article.sources.map(s => ({ title: s.title, url: safeUrl(s.url) })).filter(s => s.url);
  const affiliate = activeAffiliateLinks(article);
  const affiliateHtml = affiliate.length ? `<aside class="notice"><strong>관련 도구</strong><ul>${affiliate.map(a => `<li><a rel="sponsored nofollow" href="${esc(a.url)}">${esc(a.label || a.url)}</a></li>`).join('')}</ul><small>${esc(monetization.affiliateDisclosure)}</small></aside>` : '';
  const faqJson = article.faq.map(x => ({ '@type':'Question', name:x.question, acceptedAnswer:{ '@type':'Answer', text:x.answer } }));
  const schema = { '@context':'https://schema.org', '@type':'Article', headline:article.title, description:article.description, datePublished:today, dateModified:today, author:{'@type':'Person',name:config.site.author}, mainEntityOfPage:url };
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(article.title)} | ${esc(config.site.name)}</title><meta name="description" content="${esc(article.description)}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(article.title)}"><meta property="og:description" content="${esc(article.description)}"><meta property="og:url" content="${esc(url)}"><link rel="stylesheet" href="../styles.css"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqJson}).replace(/</g,'\\u003c')}</script></head><body><header><a class="brand" href="../">${esc(config.site.name)}</a><nav><a href="../../">Portfolio</a><a href="../../feed.xml">RSS</a></nav></header><main><article><p class="meta">${today} · ${esc(article.category)} · 품질검증 ${qa.score}/100</p><h1>${esc(article.title)}</h1><p class="lede">${esc(article.description)}</p>${renderAd()}${sanitizeGeneratedHtml(qa.revisedHtml)}${affiliateHtml}<h2>자주 묻는 질문</h2>${article.faq.map(x => `<h3>${esc(x.question)}</h3><p>${esc(x.answer)}</p>`).join('')}<h2>출처</h2><ol class="sources">${sources.map(s => `<li><a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('')}</ol><p class="notice">이 글은 자동화된 리서치·작성 파이프라인으로 생성된 뒤 별도 사실검증 단계를 통과했습니다. 중요한 의사결정에는 원문 출처를 함께 확인하세요.</p></article></main><footer>© ${esc(config.site.author)} · <a href="../">모든 글</a></footer>${monetization.adsense?.client ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(monetization.adsense.client)}" crossorigin="anonymous"></script><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>` : ''}</body></html>`;
}

function renderIndex(allPosts) {
  const cards = allPosts.slice(0, config.publishing.maxPostsOnIndex).map(p => `<a class="card" href="./posts/${esc(p.slug)}.html"><div class="meta">${esc(p.date)} · ${esc(p.category)}</div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p>${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</a>`).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(config.site.name)}</title><meta name="description" content="${esc(config.site.description)}"><link rel="canonical" href="${siteBase}/blog/"><link rel="stylesheet" href="./styles.css"></head><body><header><a class="brand" href="./">${esc(config.site.name)}</a><nav><a href="../">Portfolio</a><a href="../feed.xml">RSS</a></nav></header><main><h1>AI Engineering Notes</h1><p class="lede">${esc(config.site.description)}</p>${cards || '<p>아직 게시된 글이 없습니다.</p>'}</main><footer>© ${esc(config.site.author)}</footer></body></html>`;
}

function renderSitemap(allPosts) {
  const urls = [`${siteBase}/`, `${siteBase}/blog/`, ...allPosts.map(p => `${siteBase}/blog/posts/${p.slug}.html`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${xml(u)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

function renderFeed(allPosts) {
  const items = allPosts.slice(0, 20).map(p => `<item><title>${xml(p.title)}</title><link>${xml(`${siteBase}/blog/posts/${p.slug}.html`)}</link><guid>${xml(`${siteBase}/blog/posts/${p.slug}.html`)}</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate><description>${xml(p.description)}</description></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(config.site.name)}</title><link>${xml(`${siteBase}/blog/`)}</link><description>${xml(config.site.description)}</description><language>ko-kr</language>${items}</channel></rss>\n`;
}

await mkdir(POSTS_DIR, { recursive: true });
const topic = await chooseTopic();
if (posts.some(p => p.title === topic.topic || p.primaryKeyword === topic.primaryKeyword)) throw new Error(`Duplicate topic detected: ${topic.topic}`);
console.log(`Selected topic: ${topic.topic} (${topic.opportunityScore}/100)`);
const article = await writeArticle(topic);
const qa = await qualityCheck(topic, article);
console.log(`QA score: ${qa.score}; approved=${qa.approved}; warnings=${qa.warnings.join(' | ') || 'none'}`);
if (!qa.approved || qa.score < config.content.minimumQualityScore) throw new Error(`Quality gate failed: ${qa.score}/${config.content.minimumQualityScore}`);

let slug = slugify(article.slug) || slugify(article.title) || `post-${today}`;
if (posts.some(p => p.slug === slug)) slug = `${slug}-${today}`;
const metadata = { slug, title: article.title, description: article.description, date: today, category: article.category, tags: article.tags, primaryKeyword: topic.primaryKeyword, opportunityScore: topic.opportunityScore, qualityScore: qa.score };
const nextPosts = [metadata, ...posts];
await writeFile(path.join(POSTS_DIR, `${slug}.html`), renderArticle(topic, article, qa, slug));
await writeFile(POSTS_PATH, `${JSON.stringify(nextPosts, null, 2)}\n`);
await writeFile(path.join(ROOT, 'blog', 'index.html'), renderIndex(nextPosts));
await writeFile(path.join(ROOT, 'sitemap.xml'), renderSitemap(nextPosts));
await writeFile(path.join(ROOT, 'feed.xml'), renderFeed(nextPosts));
await writeFile(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Published: ${siteBase}/blog/posts/${slug}.html`);
