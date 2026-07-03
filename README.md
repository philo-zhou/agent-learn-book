# agent-learn-book

> 一个学习 **AI agent 仓库** 的个人笔记本。每个"book" 是对一个具体开源 agent 仓库的**源码驱动学习笔记**，配可读的中文正文 + `file:line` 指针 + Mermaid 架构图。

在线阅读: **https://philo-zhou.github.io/agent-learn-book/**

## 为什么写这个仓库

市面上教 "用 AI agent" 的资料很多，但**拆开优秀 agent 仓库、读它的源码、理解它的设计取舍**的资料几乎没有。

这个仓库是我自己在学的时候写的笔记。每本书：

- 只针对一个**具体仓库**
- 走**白盒路线**：直接引用 `file:line`，不玩抽象
- 讲**为什么这样设计**，不讲怎么用（用法它自己 README 里有）
- 中文正文 + 英文技术术语 + Mermaid 架构图

## 目前的书单

| Book | 标本 | 主题 | 章数 |
|---|---|---|---|
| [gstack-book](./gstack-book/) | [garrytan/gstack](https://github.com/garrytan/gstack) | Agent 逻辑 —— LLM 在 skill collection 里如何决策 | 16 章 + 3 附录 |
| [bmad-book](./bmad-book/) | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 方法论 harness —— 用 skill/customize/deterministic parser 约束宿主 agent | 16 章 + 4 附录 |

## 两本书的对照

它们讲两种**不同类型的 agent harness**，读完能建立对"agent 工程"的两条认知：

| 维度 | gstack-book | bmad-book |
|---|---|---|
| 标本类型 | Skill collection + extension framework | 方法论 harness（安装到宿主 agent） |
| 谁跑 agent loop | 宿主 (Claude Code / Codex / Factory / ...) | 宿主 IDE（Claude Code / Cursor / Codex） |
| 拆解重点 | Preamble state feed / Router dispatch / Iron Laws / plan-mode handshake / audit gate | 安装器入口 / 三层定制合并 / 确定性 Python 解析核 / 四阶段流水线 |
| 你能学到 | 一个 skill 内部怎么设计 agent 决策空间 | 一整套方法论怎么打包成"可安装到任意宿主"的形态 |

**读顺序**：想理解**单个 skill 的决策逻辑** → gstack-book；想理解**整套方法论的分发与约束** → bmad-book。两个视角是互补的。

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

1. **中文正文，技术术语保留英文** —— SKILL.md / preamble / resolver / handoff 这类词不翻译
2. **代码指针必须可验证** —— 每段设计点带 `<file>:<line-range>`，读者能 `git checkout` 到对应版本 grep 到
3. **代码块 ≤ 10 行** —— 只摘最关键的、块上方注明来源；完整代码请去仓库读
4. **每章至少一张 Mermaid 图** —— 图必须能从源码反推，不臆造
5. **章末带上一章 / 下一章导航** —— 便于顺序阅读
6. **不做缺陷审查** —— 讲仓库为什么这样设计，不讲它哪里可以改进

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
