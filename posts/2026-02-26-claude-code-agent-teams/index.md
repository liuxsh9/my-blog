---
title: "Claude Code Agent Teams：多智能体协作开发实践"
date: 2026-02-26
category: 工具评测
tags: [claude, ai, agent, claude-code]
description: "Claude Code 实验性功能 Agent Teams 详解：多个 Claude 实例并行协作，共享任务列表，互相通信"
---

> 原文：[Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams)

## 什么是 Agent Teams

Agent Teams 是 Claude Code 的实验性功能，允许协调多个 Claude Code 实例作为一个团队协同工作。一个 session 担任 **team lead**，负责协调工作、分配任务、汇总结果；其余 **teammates** 各自独立运行，拥有自己的 context window，并可以直接互相通信。

> **注意**：Agent Teams 默认关闭，需要在 `settings.json` 或环境变量中启用 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`。

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## 与 Subagents 的区别

这是理解 Agent Teams 的关键。两者都能并行化工作，但通信模型不同：

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | 独立 context，结果返回给调用方 | 独立 context，完全自治 |
| **通信** | 只向主 agent 汇报结果 | Teammates 可直接互相发消息 |
| **协调** | 主 agent 管理所有工作 | 共享任务列表，自我协调 |
| **适合场景** | 只关心结果的专注任务 | 需要讨论和协作的复杂工作 |
| **Token 消耗** | 较低：结果汇总后返回 | 较高：每个 teammate 是独立实例 |

![Subagents vs Agent Teams 架构对比](https://mintcdn.com/claude-code/nsvRFSDNfpSU5nT7/images/subagents-vs-agent-teams-light.png?w=1100&fit=max&auto=format&n=nsvRFSDNfpSU5nT7&q=85&s=923986caa23c0ef2c27d7e45f4dce6d1)

简单说：**Subagents 只汇报，Teammates 会讨论**。

## 最适合的场景

Agent Teams 在以下场景中价值最大：

- **研究与评审**：多个 teammate 同时调查问题的不同方面，互相挑战对方的发现
- **新模块/功能开发**：每个 teammate 负责独立的一块，互不干扰
- **竞争假设调试**：多个 teammate 并行测试不同理论，更快收敛到答案
- **跨层协调**：前端、后端、测试分别由不同 teammate 负责

反之，对于顺序任务、同文件编辑、依赖关系复杂的工作，单 session 或 subagents 更合适。

## 启动第一个 Agent Team

启用功能后，用自然语言告诉 Claude 创建团队即可：

```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles: one
teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude 会自动创建团队、生成共享任务列表、为每个角色 spawn teammate，完成后尝试清理团队资源。

Lead 的终端会列出所有 teammate 及其当前工作。按 **Shift+Down** 可以循环切换到各个 teammate 并直接发消息。

## 控制团队

### 显示模式

两种模式：

- **In-process**：所有 teammate 在主终端内运行，Shift+Down 切换，任何终端都支持
- **Split panes**：每个 teammate 独占一个分屏，需要 tmux 或 iTerm2

默认 `"auto"`：已在 tmux 中则用分屏，否则用 in-process。可在 `settings.json` 覆盖：

```json
{
  "teammateMode": "in-process"
}
```

或单次会话传参：

```bash
claude --teammate-mode in-process
```

### 指定 Teammate 数量和模型

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### 要求计划审批

对于复杂或高风险任务，可以要求 teammate 先规划再执行：

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

Teammate 完成规划后向 lead 发送审批请求，lead 审核后决定批准或拒绝（附反馈）。

### 任务分配机制

共享任务列表有三种状态：pending、in progress、completed，支持任务依赖。

- **Lead 指派**：明确告诉 lead 把哪个任务分给哪个 teammate
- **自主认领**：teammate 完成当前任务后，自动认领下一个未分配的可用任务

任务认领使用文件锁防止竞争条件。

### 关闭 Teammate

```
Ask the researcher teammate to shut down
```

Lead 发送关闭请求，teammate 可以批准（优雅退出）或拒绝（附说明）。

### 清理团队

```
Clean up the team
```

**注意**：必须由 lead 执行清理，不要让 teammate 执行，否则可能导致资源状态不一致。

### 用 Hooks 强制质量门控

- `TeammateIdle`：teammate 即将空闲时触发，exit code 2 可发送反馈让其继续工作
- `TaskCompleted`：任务即将标记完成时触发，exit code 2 可阻止完成并发送反馈

## 架构细节

| 组件 | 职责 |
|---|---|
| Team lead | 创建团队、spawn teammates、协调工作的主 session |
| Teammates | 各自执行分配任务的独立 Claude Code 实例 |
| Task list | 所有 agent 共享的工作项列表 |
| Mailbox | Agent 间的消息通信系统 |

团队配置和任务存储在本地：

- 团队配置：`~/.claude/teams/{team-name}/config.json`
- 任务列表：`~/.claude/tasks/{team-name}/`

**权限**：Teammates 继承 lead 的权限设置。如果 lead 用 `--dangerously-skip-permissions` 启动，所有 teammate 也会如此。

**Context 传递**：Teammate spawn 时加载项目的 CLAUDE.md、MCP servers 和 skills，但**不继承 lead 的对话历史**。任务相关的上下文需要在 spawn prompt 中明确提供。

## 实战案例

### 并行代码评审

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

三个 reviewer 从同一 PR 出发，各自应用不同的审查视角，lead 最后汇总所有发现。

### 竞争假设调试

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

这个模式的关键在于**对抗结构**：每个 teammate 不仅调查自己的理论，还要主动挑战其他人的理论。能在这种"科学辩论"中存活下来的理论，才更可能是真正的根因。

## 最佳实践

**给 teammate 足够的上下文**：由于不继承 lead 的对话历史，spawn prompt 中要包含任务相关的所有细节。

**合理控制团队规模**：建议从 3-5 个 teammate 开始。每个 teammate 5-6 个任务是比较合适的负载。Token 消耗随 teammate 数量线性增长。

**任务粒度要合适**：
- 太小：协调开销超过收益
- 太大：长时间无 check-in，浪费风险高
- 刚好：能产出明确交付物的自包含单元（一个函数、一个测试文件、一份评审）

**避免文件冲突**：两个 teammate 编辑同一文件会导致覆盖，拆分工作时确保每个 teammate 负责不同的文件集。

**主动监控和引导**：不要让团队长时间无人看管，及时检查进度、重定向不奏效的方向。

## 当前限制

Agent Teams 仍是实验性功能，已知限制：

- **不支持 session 恢复**：`/resume` 和 `/rewind` 不会恢复 in-process teammates
- **任务状态可能滞后**：teammate 有时未能标记任务完成，导致依赖任务被阻塞
- **关闭可能较慢**：teammate 会等当前请求或工具调用完成后才关闭
- **每个 session 只能管理一个团队**
- **不支持嵌套团队**：teammate 不能 spawn 自己的团队
- **Lead 固定**：创建团队的 session 就是 lead，不能转让
- **Split panes 需要 tmux 或 iTerm2**：不支持 VS Code 集成终端、Windows Terminal、Ghostty

## 总结

Agent Teams 的核心价值在于**让 AI 实例之间能够真正对话和协作**，而不只是各自汇报结果。这在需要多视角探索、竞争假设验证、跨层并行开发的场景下，能显著提升效率和结果质量。

代价是更高的 token 消耗和协调开销。对于日常的顺序任务，单 session 仍然是更经济的选择。
