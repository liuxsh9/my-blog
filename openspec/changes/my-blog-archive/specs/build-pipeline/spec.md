## ADDED Requirements

### Requirement: Post discovery
build.js SHALL 扫描 `posts/*/index.md`，自动发现所有文章。

#### Scenario: Scan posts directory
- **WHEN** 执行 `node scripts/build.js`
- **THEN** 脚本找到所有 `posts/*/index.md` 文件并解析

### Requirement: Markdown to HTML conversion
build.js SHALL 将每篇 `index.md` 转换为对应目录下的 `index.html`。

#### Scenario: MD conversion
- **WHEN** 构建脚本运行
- **THEN** `posts/2026-02-26-hello/index.md` 生成 `posts/2026-02-26-hello/index.html`

### Requirement: Index generation
build.js SHALL 生成根目录 `index.html`，包含所有文章的元数据 JSON 和归档 UI。

#### Scenario: Index output
- **WHEN** 构建完成
- **THEN** 根目录存在 `index.html`，内嵌文章列表数据

### Requirement: Build dependencies
构建脚本 SHALL 仅依赖 `marked` 和 `gray-matter` 两个 npm 包。

#### Scenario: Clean install
- **WHEN** 执行 `npm install`
- **THEN** 仅安装 marked 和 gray-matter 及其依赖
