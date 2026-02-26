# my-blog — Claude Code 行为契约

这是一个 blog 归档项目，部署在 GitHub Pages。本文件是所有 Claude Code 会话的行为规范，**必须严格遵守**。

---

## 创建新 Blog

### 1. 目录结构

在 `posts/` 下创建子目录，命名格式严格为：

```
posts/YYYY-MM-DD-slug/
└── index.md
```

- `YYYY-MM-DD`：发布日期
- `slug`：小写字母、数字、连字符，简洁描述主题（如 `react-hooks-deep-dive`）
- 如有图片等资源，放在 `posts/YYYY-MM-DD-slug/assets/` 下

### 2. Frontmatter 格式

每篇 `index.md` **必须**以如下 YAML frontmatter 开头：

```yaml
---
title: "文章标题"
date: YYYY-MM-DD
category: 技术分析
tags: [tag1, tag2]
description: "一句话描述，显示在归档首页，50字以内"
---
```

**必填字段**：`title`、`date`、`category`、`description`
**可选字段**：`tags`

### 3. 分类枚举

`category` 必须从以下选项中选择：

| 值 | 适用场景 |
|---|---|
| `技术分析` | 技术原理、架构分析、代码解读 |
| `产品研究` | 产品体验、功能分析、竞品对比 |
| `问题记录` | Bug 排查、解决方案、踩坑记录 |
| `工具评测` | 工具、库、服务的评测 |
| `其他` | 不属于以上分类 |

### 4. 示例

```yaml
---
title: "React Hooks 深度解析"
date: 2026-02-26
category: 技术分析
tags: [react, hooks, frontend]
description: "从源码角度理解 useState 和 useEffect 的实现原理"
---

## 正文从这里开始

...
```

### 5. 写完后

```bash
git add posts/YYYY-MM-DD-slug/
git commit -m "post: 文章标题"
git push
```

push 后 GitHub Actions 自动构建并部署，无需手动操作。

---

## 设计规范：Editorial Light

**所有生成的 HTML 内容必须严格遵守以下设计语言。**

### 色彩系统

```
背景色:        #FAF7F2  （暖奶油，非纯白）
次级背景:      #F0EBE3  （代码块、微弱区分）
主文字:        #1A1614  （深暖棕，非纯黑）
次文字/描述:   #8A7F78  （低对比度，突出层级）
强调色:        #B5813A  （深哑光金，唯一暖色点缀）
边框:          #E8E2D9  （极细暖灰）
代码文字:      #5C4A2A  （深棕，可读）
```

**禁止**使用系统蓝色（如 `#3B82F6`、Tailwind `blue-500`）作为主色调。
**禁止**使用纯白 `#FFFFFF` 背景。

### 字体排印

```
标题字体: 'Playfair Display', serif  （Google Fonts）
正文字体: 'Inter', sans-serif        （Google Fonts）

标题字重: 700–900（极强）
正文字重: 400
正文行高: 1.8
```

Google Fonts 引入方式：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

### 布局原则

- **非对称布局**：归档首页文章条目左右交替偏移，不做均匀网格
- **大量留白**：section 间距不低于 80px，内容区最大宽度 860px，居中
- **日期/分类**：浮于右侧，与标题形成视觉张力

### 区域划分

- **禁止**：纯白背景 + 深色 `box-shadow` 的卡片风格
- **使用**：`border: 1px solid #E8E2D9` 或背景色 `#F0EBE3` 来划分区域

### CSS 变量模板

在所有生成的 HTML 中，使用以下 CSS 变量：

```css
:root {
  --bg: #FAF7F2;
  --bg-subtle: #F0EBE3;
  --text-primary: #1A1614;
  --text-secondary: #8A7F78;
  --accent: #B5813A;
  --border: #E8E2D9;
}
```

### 代码块样式

```css
pre, code {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: #5C4A2A;  /* 深棕，浅色背景下可读 */
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  border-radius: 2px;
}
```

---

## 项目结构参考

```
my-blog/
├── CLAUDE.md              ← 本文件
├── package.json
├── scripts/
│   └── build.js           ← 构建脚本（勿随意修改）
├── posts/
│   └── YYYY-MM-DD-slug/
│       ├── index.md
│       └── assets/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── index.html             ← 自动生成，勿手动编辑
```

---

## 注意事项

- `index.html`（根目录）由 `scripts/build.js` 自动生成，**不要手动编辑**
- `posts/*/index.html` 同样自动生成
- 如需修改首页样式，修改 `scripts/build.js` 中的模板字符串
