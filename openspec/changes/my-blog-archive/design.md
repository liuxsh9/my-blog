## Context

空白的 my-blog 仓库，目标是建立一套"写 → 收录 → 展示"的完整流程。Claude Code 在子目录生成 blog，git push 后自动部署到 GitHub Pages。整个系统无需数据库，纯静态文件。

## Goals / Non-Goals

**Goals:**
- 零配置收录：新增 post 目录后 push 即自动出现在归档首页
- 视觉一致性：所有 blog 遵循 Editorial Dark 设计语言
- Claude Code 友好：CLAUDE.md 作为契约，任何会话都能写出规范的 blog
- 纯静态：无服务器依赖，GitHub Pages 直接托管

**Non-Goals:**
- 评论系统
- 搜索（分类筛选已足够）
- 多作者支持
- CMS 后台

## Decisions

### 构建工具：自定义 Node.js 脚本 vs 静态站点生成器（Hugo/Jekyll）

选择自定义 `scripts/build.js`。

理由：Hugo/Jekyll 引入大量约定和依赖，Claude Code 需要学习其模板语法。自定义脚本只需 `marked` + `gray-matter`，逻辑透明，CLAUDE.md 可以完整描述，任何 Claude Code 实例都能理解和修改。

### Markdown 解析：marked + gray-matter

- `gray-matter`：解析 frontmatter，成熟稳定
- `marked`：将 Markdown 转为 HTML，支持 GFM
- 两者合计 < 100KB，无复杂依赖树

### 部署分支：gh-pages vs main 的 /docs 目录

选择独立 `gh-pages` 分支，使用 `peaceiris/actions-gh-pages`。

理由：main 分支保持源码干净，生成的 HTML 不污染源码历史。

### 模板系统：HTML 字符串模板 vs 模板引擎

选择 HTML 字符串模板（build.js 内联）。

理由：模板引擎（Handlebars/EJS）增加依赖。对于两个固定模板（首页 + 文章页），字符串替换完全够用，且 Claude Code 修改时无需学习额外语法。

### 分类筛选：构建时 vs 运行时

选择运行时（纯 JS）。

理由：分类数量少，数据量小，无需构建时生成多个 HTML 文件。首页内嵌所有文章数据为 JSON，JS 动态过滤。

## Risks / Trade-offs

- [大量 posts 时首页 JSON 膨胀] → 短期内（< 500 篇）不是问题，届时可改为分页
- [Claude Code 不遵循 CLAUDE.md 格式] → build.js 对缺失 frontmatter 字段做容错处理，显示占位符而非报错
- [marked XSS 风险] → blog 内容均为 Claude Code 生成，非用户输入，风险可接受

## Migration Plan

1. 初始化：创建所有文件，push 到 main
2. GitHub 仓库设置：Settings → Pages → Source 选 `gh-pages` 分支
3. 验证：Actions 运行成功，访问 `https://liuxsh9.github.io/my-blog/`

## Open Questions

- 是否需要 RSS feed？（暂不实现，未来可加）
- 单篇 blog 是否支持 `.html` 格式（非 `.md`）？（暂只支持 `.md`，保持简单）
