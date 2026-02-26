## ADDED Requirements

### Requirement: Automated deployment on push
每次 push 到 main 分支 SHALL 自动触发 GitHub Actions 构建并部署到 GitHub Pages。

#### Scenario: Push triggers deploy
- **WHEN** 代码 push 到 main 分支
- **THEN** GitHub Actions workflow 自动运行，构建并部署

### Requirement: Deploy to gh-pages branch
构建产物 SHALL 部署到独立的 `gh-pages` 分支，不污染 main 分支历史。

#### Scenario: Branch separation
- **WHEN** 部署完成
- **THEN** gh-pages 分支包含生成的 HTML 文件，main 分支只含源码

### Requirement: Build steps in CI
GitHub Actions workflow SHALL 执行：checkout → npm install → node scripts/build.js → deploy。

#### Scenario: Full CI pipeline
- **WHEN** workflow 触发
- **THEN** 依次完成依赖安装、构建、部署三个步骤，任一失败则终止
