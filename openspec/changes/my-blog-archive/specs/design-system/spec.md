## ADDED Requirements

### Requirement: Color system
所有生成的 HTML 页面 SHALL 使用 Editorial Dark 色彩系统：背景 #0F0F0F、主文字 #E8E4DC、次文字 #6B6560、强调色 #C9A96E、边框 #1E1E1E、代码块背景 #161616。

#### Scenario: Color compliance
- **WHEN** 任意页面渲染
- **THEN** 不出现系统蓝色（如 #3B82F6）作为主色调，强调色仅使用 #C9A96E

### Requirement: Typography
所有页面 SHALL 使用 Playfair Display（标题，700-900 字重）和 Inter（正文，400 字重）字体组合，通过 Google Fonts 加载。

#### Scenario: Font loading
- **WHEN** 页面加载
- **THEN** 标题使用 Playfair Display serif，正文使用 Inter sans-serif

### Requirement: Asymmetric layout
归档首页 SHALL 采用非对称布局，文章卡片左右交替偏移，日期和分类信息浮于右侧。

#### Scenario: Layout asymmetry
- **WHEN** 归档首页渲染多篇文章
- **THEN** 奇数条目和偶数条目有不同的水平偏移，不呈现均匀网格

### Requirement: No card shadow style
所有页面 SHALL 禁止使用纯白背景+深色阴影的卡片风格，区域划分通过极细边框（1px，颜色 #1E1E1E）或微弱背景色差实现。

#### Scenario: Border over shadow
- **WHEN** 需要划分内容区域
- **THEN** 使用 border: 1px solid #1E1E1E 或背景色 #161616，不使用 box-shadow

### Requirement: CLAUDE.md design contract
项目根目录 CLAUDE.md SHALL 包含完整的设计规范，确保任何独立 Claude Code 会话生成的 blog 视觉风格一致。

#### Scenario: New session compliance
- **WHEN** 新的 Claude Code 会话在此 repo 内创建 blog
- **THEN** 读取 CLAUDE.md 后能生成符合 Editorial Dark 规范的 HTML
