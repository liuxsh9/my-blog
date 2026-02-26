## ADDED Requirements

### Requirement: Post directory naming convention
每篇 blog SHALL 存放在 `posts/YYYY-MM-DD-slug/` 目录下，slug 为小写字母、数字和连字符。

#### Scenario: Valid post directory
- **WHEN** Claude Code 创建新 blog
- **THEN** 目录名格式为 `posts/2026-02-26-my-post-title/`

### Requirement: Frontmatter metadata
每篇 blog 的 `index.md` MUST 包含以下 frontmatter 字段：`title`、`date`、`category`、`description`。`tags` 为可选字段。

#### Scenario: Complete frontmatter
- **WHEN** Claude Code 创建 index.md
- **THEN** 文件顶部包含 YAML frontmatter，含 title、date、category、description 四个必填字段

#### Scenario: Missing required field
- **WHEN** frontmatter 缺少必填字段
- **THEN** build.js 使用占位符（如 "Untitled"、"未分类"）而非报错中断构建

### Requirement: Category enumeration
category 字段 SHALL 从以下枚举中选择：技术分析、产品研究、问题记录、工具评测、其他。

#### Scenario: Valid category
- **WHEN** frontmatter 中 category 为 "技术分析"
- **THEN** 归档首页正确显示该分类标签

#### Scenario: Invalid category
- **WHEN** frontmatter 中 category 不在枚举列表中
- **THEN** build.js 将其归入 "其他" 分类
