#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');

const VALID_CATEGORIES = ['技术分析', '产品研究', '问题记录', '工具评测', '其他'];

// ─── Scan posts ───────────────────────────────────────────────────────────────

function scanPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs.readdirSync(POSTS_DIR)
    .filter(name => {
      const mdPath = path.join(POSTS_DIR, name, 'index.md');
      return fs.statSync(path.join(POSTS_DIR, name)).isDirectory() && fs.existsSync(mdPath);
    })
    .map(name => {
      const mdPath = path.join(POSTS_DIR, name, 'index.md');
      const raw = fs.readFileSync(mdPath, 'utf-8');
      const { data, content } = matter(raw);

      const category = VALID_CATEGORIES.includes(data.category) ? data.category : '其他';

      return {
        slug: name,
        title: data.title || 'Untitled',
        date: data.date ? String(data.date).slice(0, 10) : '0000-00-00',
        category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        description: data.description || '',
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ─── Templates ────────────────────────────────────────────────────────────────

function indexTemplate(posts) {
  const postsJson = JSON.stringify(posts.map(p => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    description: p.description,
  })));

  const categories = [...new Set(posts.map(p => p.category))];
  const categoryButtons = categories
    .map(c => `<button class="filter-btn" data-cat="${c}">${c}</button>`)
    .join('\n        ');

  const postItems = posts.map((p, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const year = p.date.slice(0, 4);
    const monthDay = p.date.slice(5);
    return `
    <article class="post-item post-item--${side}" data-category="${p.category}">
      <a href="posts/${p.slug}/" class="post-link">
        <div class="post-main">
          <h2 class="post-title">${p.title}</h2>
          <p class="post-desc">${p.description}</p>
        </div>
        <div class="post-meta">
          <span class="post-year">${year}</span>
          <span class="post-date">${monthDay}</span>
          <span class="post-category">${p.category}</span>
        </div>
      </a>
    </article>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Archive</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0F0F0F;
      --bg-subtle: #161616;
      --text-primary: #E8E4DC;
      --text-secondary: #6B6560;
      --accent: #C9A96E;
      --border: #1E1E1E;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      line-height: 1.8;
      min-height: 100vh;
    }

    /* ── Header ── */
    header {
      max-width: 860px;
      margin: 0 auto;
      padding: 96px 32px 64px;
      border-bottom: 1px solid var(--border);
    }

    .site-title {
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: clamp(2.4rem, 6vw, 4rem);
      letter-spacing: -0.02em;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .site-subtitle {
      margin-top: 12px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* ── Filters ── */
    .filters {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 32px 0;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: none;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-family: 'Inter', sans-serif;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      padding: 6px 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover,
    .filter-btn.active {
      border-color: var(--accent);
      color: var(--accent);
    }

    .filter-btn--all {
      color: var(--text-primary);
      border-color: var(--text-secondary);
    }

    .filter-btn--all.active {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* ── Post list ── */
    .post-list {
      max-width: 860px;
      margin: 0 auto;
      padding: 64px 32px 120px;
    }

    .post-item {
      border-top: 1px solid var(--border);
      padding: 48px 0;
    }

    .post-item--left  { padding-right: 120px; }
    .post-item--right { padding-left: 120px; }

    .post-link {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 32px;
      text-decoration: none;
      color: inherit;
    }

    .post-link:hover .post-title { color: var(--accent); }

    .post-main { flex: 1; }

    .post-title {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      line-height: 1.25;
      color: var(--text-primary);
      transition: color 0.2s;
    }

    .post-desc {
      margin-top: 12px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.7;
    }

    .post-meta {
      flex-shrink: 0;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      padding-top: 4px;
    }

    .post-year {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--border);
      line-height: 1;
    }

    .post-date {
      font-size: 0.78rem;
      color: var(--text-secondary);
      letter-spacing: 0.06em;
    }

    .post-category {
      font-size: 0.72rem;
      color: var(--accent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid var(--accent);
      padding: 2px 8px;
      margin-top: 8px;
    }

    .post-item.hidden { display: none; }

    /* ── Empty state ── */
    .empty {
      padding: 80px 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .post-item--left,
      .post-item--right { padding-left: 0; padding-right: 0; }
      .post-link { flex-direction: column; }
      .post-meta { text-align: left; align-items: flex-start; }
    }
  </style>
</head>
<body>

  <header>
    <h1 class="site-title">Blog Archive</h1>
    <p class="site-subtitle">A collection of thoughts &amp; analysis</p>
  </header>

  <nav class="filters" aria-label="分类筛选">
    <button class="filter-btn filter-btn--all active" data-cat="all">全部</button>
    ${categoryButtons}
  </nav>

  <main class="post-list" id="post-list">
    ${postItems || '<p class="empty">暂无文章</p>'}
  </main>

  <script>
    const posts = ${postsJson};
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.post-item');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        items.forEach(item => {
          item.classList.toggle('hidden', cat !== 'all' && item.dataset.category !== cat);
        });
      });
    });
  </script>

</body>
</html>`;
}

function postTemplate({ title, date, category, content, slug }) {
  const html = marked(content);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0F0F0F;
      --bg-subtle: #161616;
      --text-primary: #E8E4DC;
      --text-secondary: #6B6560;
      --accent: #C9A96E;
      --border: #1E1E1E;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      font-size: 17px;
      line-height: 1.8;
    }

    /* ── Nav ── */
    nav {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 32px 0;
    }

    .back-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.82rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: color 0.2s;
    }

    .back-link:hover { color: var(--accent); }

    /* ── Article header ── */
    .article-header {
      max-width: 860px;
      margin: 0 auto;
      padding: 64px 32px 48px;
      border-bottom: 1px solid var(--border);
    }

    .article-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .article-date {
      color: var(--text-secondary);
      font-size: 0.82rem;
      letter-spacing: 0.06em;
    }

    .article-category {
      font-size: 0.72rem;
      color: var(--accent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid var(--accent);
      padding: 2px 8px;
    }

    .article-title {
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: clamp(2rem, 5vw, 3.2rem);
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }

    /* ── Article body ── */
    .article-body {
      max-width: 680px;
      margin: 0 auto;
      padding: 64px 32px 120px;
    }

    .article-body h1,
    .article-body h2,
    .article-body h3 {
      font-family: 'Playfair Display', serif;
      color: var(--text-primary);
      margin: 2.4em 0 0.8em;
      line-height: 1.25;
    }

    .article-body h2 { font-size: 1.5rem; font-weight: 700; }
    .article-body h3 { font-size: 1.15rem; font-weight: 700; }

    .article-body p { margin: 1.2em 0; color: var(--text-primary); }

    .article-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }

    .article-body ul,
    .article-body ol {
      margin: 1.2em 0;
      padding-left: 1.6em;
      color: var(--text-primary);
    }

    .article-body li { margin: 0.4em 0; }

    .article-body blockquote {
      border-left: 2px solid var(--accent);
      padding-left: 20px;
      margin: 1.6em 0;
      color: var(--text-secondary);
      font-style: italic;
    }

    .article-body pre {
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      padding: 20px 24px;
      overflow-x: auto;
      margin: 1.6em 0;
      border-radius: 2px;
    }

    .article-body code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.88em;
      color: #A8B5A2;
    }

    .article-body pre code {
      background: none;
      padding: 0;
    }

    .article-body :not(pre) > code {
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      padding: 2px 6px;
      border-radius: 2px;
    }

    .article-body hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 3em 0;
    }

    .article-body img {
      max-width: 100%;
      border: 1px solid var(--border);
    }
  </style>
</head>
<body>

  <nav>
    <a href="../../" class="back-link">← Archive</a>
  </nav>

  <header class="article-header">
    <div class="article-meta">
      <span class="article-date">${date}</span>
      <span class="article-category">${category}</span>
    </div>
    <h1 class="article-title">${title}</h1>
  </header>

  <article class="article-body">
    ${html}
  </article>

</body>
</html>`;
}

// ─── Build ────────────────────────────────────────────────────────────────────

function build() {
  const posts = scanPosts();
  console.log(`Found ${posts.length} post(s)`);

  // Generate each post's index.html
  for (const post of posts) {
    const outPath = path.join(POSTS_DIR, post.slug, 'index.html');
    fs.writeFileSync(outPath, postTemplate(post), 'utf-8');
    console.log(`  ✓ posts/${post.slug}/index.html`);
  }

  // Generate root index.html
  const indexPath = path.join(ROOT, 'index.html');
  fs.writeFileSync(indexPath, indexTemplate(posts), 'utf-8');
  console.log(`  ✓ index.html`);

  console.log('Build complete.');
}

build();
