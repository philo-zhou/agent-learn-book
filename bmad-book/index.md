# bmad-book —— BMAD-METHOD 方法论 harness 深度剖析

> **一句话定义：BMAD-METHOD 是一种"方法论 harness"——它不运行 agent 循环，而是把声明式的 skill / agent / customization 层安装进宿主 agent（Claude Code / Cursor / Codex），并通过确定性解析核与四阶段工作流约束宿主 LLM 的行为。**

一份循序渐进的中文教程，基于 [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) 仓库的**真实源码**，每章带 `文件:行号` 的源码摘录与设计决策分析。

## 核心对照：运行时 harness vs 方法论 harness

| | Claude Code（运行时 harness） | BMAD-METHOD（方法论 harness） |
|---|---|---|
| 谁跑 agent loop | 自己跑 | **不跑**——宿主 agent 跑 |
| 行为定义在哪 | 编译进二进制 | 仓库里的 `SKILL.md` + `customize.toml`（纯文本、可 lint） |
| 约束 LLM 的手段 | 工具 / 权限 / hooks | 声明式技能 + 确定性 Python 脚本 + 三层定制合并 |
| 可分发性 | npm 二进制 | npm 包 + 模块注册表 + 渠道（stable / next / pinned） |

## 主线：BMAD-METHOD 四阶段流水线

```mermaid
flowchart LR
    INSTALL[安装器入口<br/>心跳起搏] --> MODULE[模块系统<br/>基因加载]
    MODULE --> CUSTOM[三层定制合并<br/>默认 · 模块 · 用户]
    CUSTOM --> DEPLOY[部署到宿主<br/>Claude Code / Cursor / Codex]

    DEPLOY --> P1[阶段 1<br/>意图捕获<br/>Spec 契约]
    P1 --> P2[阶段 2<br/>方案设计<br/>Plan 与 Party Mode]
    P2 --> P3[阶段 3<br/>开发循环<br/>dev-auto / quick-dev]
    P3 --> P4[阶段 4<br/>质量与审查<br/>Review 三件套]
    P4 --> DONE[交付]
```

## 4 部分 + 附录概览

| 部分 | 章节数 | 一句话主题 |
|---|---|---|
| [第一部分 · 基础篇](第一部分-基础篇/01-范式转移与心智模型.md) | 4 章 | 范式转移、安装器入口、模块系统、安装引擎——建立心智模型 |
| [第二部分 · 核心系统篇](第二部分-核心系统篇/05-渠道与版本解析.md) | 5 章 | 渠道 / 技能系统 / 三层定制合并 / Python 确定性解析核 / IDE 集成 |
| [第三部分 · 高级模式篇](第三部分-高级模式篇/10-模块管理-官方外部自定义.md) | 3 章 | 官方 / 外部 / 自定义模块管理、Party Mode 多智能体编排、Spec 契约 |
| [第四部分 · 工程实践篇](第四部分-工程实践篇/13-四阶段交付流水线.md) | 4 章 | 四阶段流水线、开发循环、Review 三件套、构建你自己的方法论 harness |
| [附录](附录/A-源码导航地图.md) | 4 篇 | 源码导航地图、技能完整清单、模块注册表与渠道速查、术语表 |

## 阅读约定

- 中文正文，代码 / 术语保留英文。
- 每段源码摘录标 `文件:行号` 并配设计动机注释。
- 每章 ≥ 1 张 Mermaid 图。
- 六段式结构：定位 / 心智模型 / 源码走读 / 设计决策 / Claude Code 对照 / 小结。
- 基于 BMAD-METHOD `main` 分支源码，不做缺陷审查。

完整写作规范见 [_style-guide.md](_style-guide.md)。

## 开始阅读

前往 [00 · 前言与范式总论](./00-前言与范式总论.md)。
