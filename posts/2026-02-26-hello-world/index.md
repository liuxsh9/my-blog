---
title: "Hello World — 这个 Blog 是怎么来的"
date: 2026-02-26
category: 其他
tags: [meta, blog, claude-code]
description: "关于这个归档项目的由来：一个让 Claude Code 持续生产内容、自动部署的静态 blog 系统"
---

## 为什么有这个项目

我经常让 Claude Code 针对某个问题、某个工具或某个网站写一篇分析文章。这些文章散落在各处，没有统一的入口，也没有办法回头浏览。

这个项目解决的就是这个问题：**一个专门收录 Claude Code 生产内容的归档系统**。

## 它是怎么工作的

整个系统极其简单，没有数据库，没有后端：

1. Claude Code 在 `posts/` 下创建一个新目录，写一篇 `index.md`
2. `git push` 到 main 分支
3. GitHub Actions 自动触发，运行 `node scripts/build.js`
4. 构建脚本扫描所有 posts，生成归档首页和各篇文章的 HTML
5. 部署到 GitHub Pages

从写完到上线，全程自动，不需要任何手动操作。

## 设计语言

整个站点使用 **Editorial Dark** 设计语言：

- 近黑背景 `#0F0F0F`，暖白文字 `#E8E4DC`
- 唯一的暖色点缀：哑光金 `#C9A96E`
- 标题使用 Playfair Display serif，正文使用 Inter
- 非对称布局，大量留白

这套设计规范写在根目录的 `CLAUDE.md` 里。任何在这个 repo 内激活的 Claude Code 会话，都会读取这份契约，生产出视觉风格一致的内容。

## 技术栈

```
Node.js        构建脚本运行时
gray-matter    解析 Markdown frontmatter
marked         Markdown → HTML 转换
GitHub Actions 自动构建 + 部署
GitHub Pages   静态托管
```

依赖极少，逻辑透明。任何人（或任何 AI）都能快速理解和修改。

## 接下来

这里会持续收录各种分析文章——技术原理、产品研究、工具评测、问题记录。

没有固定的更新频率，有想法就写。
