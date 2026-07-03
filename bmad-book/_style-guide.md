# bmad-book 写作规范(所有章节子代理共享)

本规范是 `bmad-book` 全书的统一写作约定。每位写章子代理在动笔前必须读完本文件,并严格遵守。

## 0. 全书脊梁(必须内化的核心论点)

BMAD-METHOD **不是一个运行时 agent loop**(它不像 Claude Code 自带 `while(true)` 对话循环)。它是一种 **"方法论 harness"**:

- **没有自己的运行时**:它不跑 LLM、不接管对话循环;宿主 agent(Claude Code / Cursor / Codex / Windsurf……)才是运行时。
- **安装进宿主**:它通过 installer 把一套**声明式的 skill / agent / customization 层**落地到宿主的项目目录与 IDE 配置中,从而"重塑"宿主 agent 的行为。
- **用确定性逻辑约束 LLM**:把不该让 LLM 自由发挥的逻辑(配置合并、名册解析、记忆追加、架构 lint)下沉为**确定性 Python 脚本**,LLM 在技能激活时被要求调用它们并服从其输出。
- **用四阶段工作流组织行为**:analysis → plan → solutioning → implementation 的技能图(phase / preceded-by / followed-by / required)构成方法论主干。

每一章都应服务于此脊梁——要么是它的一个组件,要么是它的一次实例化。每章末尾的"与 Claude Code harness 的对照"小节,要落到这一点上。

## 1. 语言

- 正文中文;代码、标识符、文件名、命令、配置键保留英文。
- 标题用中文,文件名按已定命名(见各章输出路径)。
- 语气:架构释义,精确、克制,不卖弄。面向"想理解 BMAD 为何这样设计"的工程师/架构师。

## 2. 源码呈现(最关键)

- **必须先 Read 再引用**:子代理在写章前必须用 Read 工具读取本章映射的源码文件,**行号以实际读取为准,绝不臆造**。
- **带注释的关键摘录**:每段代码块前用一行说明 `文件路径:行号`(如 `tools/installer/core/installer.js:37`),代码块后配 1-3 句"设计动机/权衡"注释。
- **不整文件粘贴**:只摘关键片段(通常 5-25 行)。完整文件靠仓库相对路径链接(如 `→ 完整实现见 tools/installer/core/installer.js`)。
- **摘录要"会说话"**:选最能体现设计决策的片段,而非任意片段。注释要回答"为什么这样写",而不是复述代码做了什么。

代码块格式示例:

> `tools/installer/modules/channel-resolver.js:118`
>
> ```js
> if (channel === 'next') {
>   return { channel: 'next', ref: null, version: 'main', resolvedFallback: false };
> }
> ```
>
> next 渠道直接返回 `ref: null`(即 `git clone` 不带 `--branch`,拉 main HEAD)。这里把"渠道=一种解析策略"具象成纯数据返回值,克隆逻辑留给调用方——resolver 因此可单测、无副作用。

## 3. Mermaid 图

- 每章 **≥1 张** Mermaid 图,类型按内容选:数据流(`flowchart`)、状态机(`stateDiagram-v2`)、分层(`flowchart TB`)、调用链(`flowchart LR`)、序列(`sequenceDiagram`)。
- 图要对应本章讲解的真实机制,不要装饰性插图。
- 节点文字用英文标识符 + 简短中文标签皆可,保持可读。

## 4. 章节结构(六段式)

每章按以下结构组织(小节标题可微调,但六要素齐全):

1. **一句话定位**:本章讲什么、在 harness 中扮演什么角色。
2. **心智模型**:用类比/图先把概念立起来,再进源码。
3. **源码走读**:分若干小节,每节带 `file:line` 摘录 + 注释。这是章节主体。
4. **设计决策与权衡**:提炼 2-4 条"为什么这样设计/牺牲了什么"。
5. **与 Claude Code harness 的对照**:1-2 段,点出 BMAD 范式与 Claude Code 运行时 harness 的本质差异(可参考 `claude-code-book` 的对应章节主题,但结论是对照而非照搬)。
6. **小结**:3-5 句收束,并指向下一章。

## 5. 约束

- **不评审 bug**:本书是架构释义,不做缺陷审查、不提改进建议(除非作为"设计权衡"的一部分顺带提及)。
- **不臆造**:任何源码引用必须来自实际 Read;任何行为描述无法在源码中印证的,标注"据 SKILL.md 描述"或省略。
- **不复制源码到本书**:摘录仅用于释义;不把整文件搬进 `bmad-book/`。
- **跨章引用**:引用他章用相对链接,如 `[第 7 章](../第二部分-核心系统篇/07-定制化与三层合并.md)`。

## 6. 输出

- 直接用 Write 工具写到指定路径。
- 文件以一级标题 `# <章号>. <标题>` 开头。
- 完成后通过 schema 返回元信息(path / title / 引用的源码文件清单 / Mermaid 数量 / status)。
