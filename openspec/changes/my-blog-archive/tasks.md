## 1. Project Initialization

- [x] 1.1 创建 `package.json`，添加 `marked` 和 `gray-matter` 依赖
- [x] 1.2 创建 `.gitignore`，忽略 `node_modules/` 和 `dist/`
- [x] 1.3 初始化 git 仓库并关联远程 `https://github.com/liuxsh9/my-blog`

## 2. CLAUDE.md 契约文件

- [x] 2.1 创建根目录 `CLAUDE.md`，包含 blog 创建步骤、frontmatter 格式规范、分类枚举
- [x] 2.2 在 `CLAUDE.md` 中写入完整的 Editorial Dark 设计规范（色彩、字体、布局红线）

## 3. Build Script

- [x] 3.1 创建 `scripts/build.js`，实现扫描 `posts/*/index.md` 的逻辑
- [x] 3.2 实现 frontmatter 解析（gray-matter），对缺失字段做容错处理
- [x] 3.3 实现 Markdown → HTML 转换（marked）
- [x] 3.4 实现归档首页 `index.html` 生成，内嵌文章列表 JSON 数据
- [x] 3.5 实现单篇文章 `posts/*/index.html` 生成

## 4. HTML Templates

- [x] 4.1 在 `scripts/build.js` 中实现归档首页模板（Editorial Dark 设计，非对称布局，分类筛选 JS）
- [x] 4.2 在 `scripts/build.js` 中实现单篇文章模板（Editorial Dark 设计，Markdown 内容渲染）

## 5. GitHub Actions

- [x] 5.1 创建 `.github/workflows/deploy.yml`，配置 push to main 触发
- [x] 5.2 配置 workflow 步骤：checkout → setup-node → npm install → node scripts/build.js → peaceiris/actions-gh-pages 部署

## 6. Sample Post

- [x] 6.1 创建 `posts/2026-02-26-hello-world/index.md`，内容为项目介绍，包含完整 frontmatter
- [x] 6.2 本地运行 `node scripts/build.js` 验证构建成功，生成 `index.html` 和 `posts/2026-02-26-hello-world/index.html`

## 7. Deploy

- [ ] 7.1 git add、commit、push 到 main 分支
- [ ] 7.2 在 GitHub 仓库 Settings → Pages 中设置 Source 为 `gh-pages` 分支
- [ ] 7.3 验证 GitHub Actions 运行成功，访问 `https://liuxsh9.github.io/my-blog/` 确认部署
