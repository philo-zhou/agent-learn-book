# agent-learn-book

> 一个学习 **AI agent 仓库** 的个人笔记本。每本"book" 是对一个具体开源 agent 仓库的**源码驱动学习笔记**，配可读的中文正文 + `file:line` 指针 + Mermaid 架构图。

在线阅读: **https://philo-zhou.github.io/agent-learn-book/**

## 为什么写这个仓库

市面上教 "用 AI agent" 的资料很多，但**拆开优秀 agent 仓库、读它的源码、理解它的设计取舍**的资料几乎没有。

这个仓库是我自己在学的时候写的笔记。每本书：

- 只针对一个**具体仓库**
- 走**白盒路线**：直接引用 `file:line`，不玩抽象
- 讲**为什么这样设计**，不讲怎么用（用法它自己 README 里有）
- 中文正文 + 英文技术术语 + Mermaid 架构图
- **锁定源码 commit** —— 每本书 README 顶部标注参考的具体 commit，避免上游更新后指针漂移

## 目前的书单

| Book | 标本 | 参考 commit | 主题 | 章数 |
|---|---|---|---|---|
| [gstack-book](./gstack-book/) | [garrytan/gstack](https://github.com/garrytan/gstack) | [`11de390b`](https://github.com/garrytan/gstack/commit/11de390be1be6849eb9a15f91ff4922dd16c589a) (v1.58.5.0, 2026-06-25) | Agent 逻辑 —— LLM 在 skill collection 里如何决策 | 16 章 + 3 附录 |
| [bmad-book](./bmad-book/) | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | [`58c1e38b`](https://github.com/bmad-code-org/BMAD-METHOD/commit/58c1e38be9900c3f07f0373fa2b921f948b91863) (2026-06-27) | 方法论 harness —— 用 skill/customize/deterministic parser 约束宿主 agent | 16 章 + 4 附录 |
| [deerflow-book](./deerflow-book/) | [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | [`7a6c4a99`](https://github.com/bytedance/deer-flow/commit/7a6c4a994a86583d2a3c056ee9d0f157d4f030c2) (2026-06-26) | Runtime harness —— LangGraph-based 对话循环 / 中间件链 / 多智能体编排 | 24 章 + 5 附录 |

## 三本书的对照

三本书讲**三种类型的 agent 工程栈**，读完能建立三条互补认知：

| 维度 | gstack-book | bmad-book | deerflow-book |
|---|---|---|---|
| 标本类型 | Skill collection + extension framework | 方法论 harness（安装到宿主 IDE） | **Runtime harness（自跑对话循环）** |
| 谁跑 agent loop | 宿主 (Claude Code / Codex / Factory / ...) | 宿主 IDE（Claude Code / Cursor / Codex） | **DeerFlow 自己的 LangGraph 图** |
| 拆解重点 | Preamble state feed / Router dispatch / Iron Laws / plan-mode handshake / audit gate | 安装器入口 / 三层定制合并 / 确定性 Python 解析核 / 四阶段流水线 | 对话循环 / 工具系统 / 中间件链 / 状态与线程 / MCP 集成 |
| 你能学到 | 单个 skill 内部怎么设计 agent 决策空间 | 一整套方法论怎么打包成"可安装到任意宿主"的形态 | 一个 runtime harness 内部怎么把 LLM、工具、中间件、图串起来 |

**读顺序建议**：

- 想理解 **单个 skill 的决策逻辑** → gstack-book
- 想理解 **整套方法论的分发与约束** → bmad-book
- 想理解 **runtime 内部一条消息怎么跑完** → deerflow-book

三本一起读，对"agent 工程栈"的三种主流形态就都看清了。

## 阅读方式

**在线**（推荐）：https://philo-zhou.github.io/agent-learn-book/

站点用 [VitePress](https://vitepress.dev) 构建，支持左侧导航、全文搜索、明暗主题、Mermaid 图表在线渲染。

**本地**：

```bash
git clone https://github.com/philo-zhou/agent-learn-book.git
cd agent-learn-book
# 直接读 markdown，或跑 VitePress dev server
npm install
npm run docs:dev
```

## 每本书遵守的写作规范

所有 book 共享一套约定，为的是让读者切换 book 时不用重新学"这本书的规矩"：

1. **中文正文，技术术语保留英文** —— SKILL.md / preamble / resolver / handoff / LangGraph 这类词不翻译
2. **锁定 commit** —— README 顶部标注参考仓库的具体 commit hash + 日期，避免上游演进后指针失效
3. **代码指针必须可验证** —— 每段设计点带 `<file>:<line-range>`，读者能 `git checkout <commit>` 后 grep 到
4. **代码块 ≤ 10 行** —— 只摘最关键的、块上方注明来源；完整代码请去仓库读
5. **每章至少一张 Mermaid 图** —— 图必须能从源码反推，不臆造
6. **章末带上一章 / 下一章导航** —— 便于顺序阅读
7. **不做缺陷审查** —— 讲仓库为什么这样设计，不讲它哪里可以改进

## 上游更新后怎么办

三个仓库都在活跃演进。当你读到某处发现"指针对不上"了，可以：

```bash
# 以 gstack 为例
git clone https://github.com/garrytan/gstack.git
cd gstack
git diff 11de390b HEAD -- <文件路径>   # 看这一段代码从书稿基线到 HEAD 的所有改动
git blame HEAD -- <文件路径>            # 看具体某行被谁 / 什么时候改的
```

三本书的 commit 定标分别在各自 README 顶部的「源码基线」块。

## 计划中的下一本

（占位 — 有想法欢迎 Issue 里讨论）

- Claude Code 官方 [`agent-sdk`](https://github.com/anthropics/claude-agent-sdk) 内部
- [OpenHands](https://github.com/All-Hands-AI/OpenHands) —— 一个走 sandboxed runtime 路线的 agent harness
- [Continue.dev](https://github.com/continuedev/continue) —— IDE-embedded assistant 的架构

## 声明

- 本仓库对所有引用的开源项目**只做架构分析、不做缺陷审查**
- 所有代码引用来自各项目的公开 MIT / Apache-2.0 源码
- 本仓库内容 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 反馈

- Issue: https://github.com/philo-zhou/agent-learn-book/issues
- 想加 book / 建议改进 / 指出笔记错误都欢迎
