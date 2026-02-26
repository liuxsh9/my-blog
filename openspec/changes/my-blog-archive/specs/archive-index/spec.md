## ADDED Requirements

### Requirement: Archive index auto-generation
归档首页 `index.html` SHALL 由构建脚本自动生成，不得手动编辑。

#### Scenario: New post added
- **WHEN** 新增 post 目录并 push
- **THEN** 归档首页自动包含该文章条目

### Requirement: Chronological ordering
文章列表 SHALL 按 date 字段倒序排列（最新在前）。

#### Scenario: Multiple posts
- **WHEN** 存在多篇不同日期的 blog
- **THEN** 日期最新的文章显示在列表最顶部

### Requirement: Category filtering
归档首页 SHALL 提供分类筛选功能，无需页面刷新。

#### Scenario: Filter by category
- **WHEN** 用户点击某个分类标签
- **THEN** 列表仅显示该分类的文章，其他文章隐藏

#### Scenario: Show all
- **WHEN** 用户点击 "全部" 或已选分类
- **THEN** 所有文章重新显示

### Requirement: Post entry display
每篇文章条目 SHALL 显示：标题、日期、分类、描述。

#### Scenario: Post entry rendering
- **WHEN** 归档首页加载
- **THEN** 每个条目展示 title、date（格式 YYYY-MM-DD）、category 标签、description 文字
