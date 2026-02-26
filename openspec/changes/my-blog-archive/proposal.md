## Why

需要一个 blog 归档系统，将 Claude Code 生成的 HTML/Markdown blog 统一收录、展示和浏览。目前这些 blog 散落在各处，缺乏统一的入口和展示界面。

## What Changes

- 新建 `posts/` 目录结构规范，每篇 blog 独立子目录
- 新建 `scripts/build.js` 构建脚本，扫描 posts 自动生成归档首页
- 新建 `templates/` HTML 模板（归档首页 + 单篇文章页）
- 新建 `.github/workflows/deploy.yml`，push 后自动构建并部署到 GitHub Pages
- 新建 `CLAUDE.md` 作为 Claude Code 行为契约，规范 blog 写作格式和设计风格
- 新建 `package.json`，依赖 `marked` + `gray-matter`

## Capabilities

### New Capabilities

- `blog-post-format`: 单篇 blog 的目录结构、frontmatter 元数据格式规范
- `archive-index`: 归档首页，自动收录所有 posts，支持分类筛选
- `build-pipeline`: Node.js 构建脚本，将 .md 转换为 .html，生成归档首页
- `github-pages-deploy`: GitHub Actions 工作流，push 触发自动构建部署
- `design-system`: Editorial Dark 设计语言规范，确保所有 blog 视觉一致性

### Modified Capabilities

（无现有 specs）

## Impact

- 新增 npm 依赖：`marked`、`gray-matter`
- 需要在 GitHub repo 设置中启用 GitHub Pages（gh-pages 分支）
- 所有未来在此 repo 内激活的 Claude Code 实例需遵循 `CLAUDE.md` 规范
