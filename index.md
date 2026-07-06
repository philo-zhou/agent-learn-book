---
layout: home

hero:
  name: "Agent Learn Book"
  text: "拆开优秀 agent 仓库,读它的源码"
  tagline: 白盒路线 · 源码驱动 · 每本书锁定具体 commit
  image:
    src: /hero.svg
    alt: Agent Learn Book
  actions:
    - theme: brand
      text: 开始阅读 gstack-book
      link: /gstack-book/
    - theme: alt
      text: 开始阅读 bmad-book
      link: /bmad-book/
    - theme: alt
      text: 开始阅读 deerflow-book
      link: /deerflow-book/
    - theme: alt
      text: GitHub
      link: https://github.com/philo-zhou/agent-learn-book

features:
  - icon: 🧠
    title: gstack-book · Agent 逻辑
    details: 拆 skill collection 的决策空间——preamble / router / Iron Laws / plan-mode handshake / audit gate。基于 gstack v1.58.5.0 (commit 11de390b)。
  - icon: 🏗️
    title: bmad-book · 方法论 harness
    details: 拆一整套方法论如何打包成可安装到宿主 IDE 的形态——三层定制 / 确定性解析 / 四阶段流水线。基于 BMAD-METHOD (commit 58c1e38b)。
  - icon: 🦌
    title: deerflow-book · Runtime harness
    details: 拆 LangGraph-based runtime——对话循环 / 工具系统 / 中间件链 / 状态与线程 / MCP 集成。基于 deer-flow (commit 7a6c4a99)。
  - icon: 🔬
    title: 白盒路线
    details: 直接引用开源仓库的 `file:line`,不玩抽象。每本书 README 顶部锁定 commit,读者能 git checkout 到对应版本 grep 验证。
  - icon: 🎨
    title: Mermaid 架构图
    details: 每章至少一张。图从源码反推,不臆造。
  - icon: 🔍
    title: 全文搜索
    details: 站内本地全文搜索,快速定位知识点。
---
