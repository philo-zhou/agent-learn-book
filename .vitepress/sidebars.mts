// VitePress sidebar configuration for agent-learn-book.
// Generated from the actual on-disk chapter layout under gstack-book/ and bmad-book/.
// Chapter text mirrors each file's H1 heading (with the leading "NN·" / "NN." prefix
// preserved for ordering, but any trailing subtitle after "—" / ":" trimmed for brevity).

export const gstackSidebar = [
  {
    text: '简介',
    items: [
      { text: '总目录', link: '/gstack-book/' },
      { text: '00 前言', link: '/gstack-book/00-前言' },
    ],
  },
  {
    text: '第一部分 · 输入层',
    collapsed: false,
    items: [
      { text: '01 Preamble 作为 LLM state feed', link: '/gstack-book/第一部分-输入层/01-preamble-作为-LLM-state-feed' },
      { text: '02 Preamble-tier 与上下文密度', link: '/gstack-book/第一部分-输入层/02-preamble-tier-与上下文密度' },
      { text: '03 Session kind 与 first-run', link: '/gstack-book/第一部分-输入层/03-session-kind-与-first-run' },
    ],
  },
  {
    text: '第二部分 · Router 与编排',
    collapsed: false,
    items: [
      { text: '04 Router 的路由决策', link: '/gstack-book/第二部分-Router与编排/04-router-的路由决策' },
      { text: '05 Skill 之间的编排契约', link: '/gstack-book/第二部分-Router与编排/05-skill-之间的编排契约' },
    ],
  },
  {
    text: '第三部分 · Plan-mode Agent',
    collapsed: true,
    items: [
      { text: '06 Plan-mode handshake', link: '/gstack-book/第三部分-Plan-mode-Agent/06-plan-mode-handshake' },
      { text: '07 Review army 4 视角', link: '/gstack-book/第三部分-Plan-mode-Agent/07-review-army-4-视角' },
      { text: '08 Autoplan 6 决策原则', link: '/gstack-book/第三部分-Plan-mode-Agent/08-autoplan-6-决策原则' },
      { text: '09 Second opinion 三件套', link: '/gstack-book/第三部分-Plan-mode-Agent/09-second-opinion-三件套' },
    ],
  },
  {
    text: '第四部分 · Execution Agent',
    collapsed: true,
    items: [
      { text: '10 Iron Laws', link: '/gstack-book/第四部分-Execution-Agent/10-iron-laws' },
      { text: '11 Ship 决策边界', link: '/gstack-book/第四部分-Execution-Agent/11-ship-决策边界' },
      { text: '12 Plan completion audit', link: '/gstack-book/第四部分-Execution-Agent/12-plan-completion-audit' },
      { text: '13 QA fix-loop 与 confidence', link: '/gstack-book/第四部分-Execution-Agent/13-qa-fix-loop-与-confidence' },
    ],
  },
  {
    text: '第五部分 · 记忆与安全',
    collapsed: true,
    items: [
      { text: '14 Learnings loop 与 gbrain', link: '/gstack-book/第五部分-记忆与安全/14-learnings-loop-与-gbrain' },
      { text: '15 Safety boundary 与 hook', link: '/gstack-book/第五部分-记忆与安全/15-safety-boundary-与-hook' },
    ],
  },
  {
    text: '第六部分 · Capstone',
    collapsed: true,
    items: [
      { text: '16 写一个只有 agent 逻辑的 skill', link: '/gstack-book/第六部分-Capstone/16-写一个只有-agent-逻辑的-skill' },
    ],
  },
  {
    text: '附录',
    collapsed: true,
    items: [
      { text: 'A Preamble KEY 字典', link: '/gstack-book/附录/A-preamble-KEY-字典' },
      { text: 'B Resolver 与注入指令', link: '/gstack-book/附录/B-resolver-与注入指令' },
      { text: 'C Agent 决策术语表', link: '/gstack-book/附录/C-agent-决策术语表' },
    ],
  },
];

export const bmadSidebar = [
  {
    text: '简介',
    items: [
      { text: '总目录', link: '/bmad-book/' },
      { text: '00 前言与范式总论', link: '/bmad-book/00-前言与范式总论' },
    ],
  },
  {
    text: '第一部分 · 基础篇',
    collapsed: false,
    items: [
      { text: '01 范式转移与心智模型', link: '/bmad-book/第一部分-基础篇/01-范式转移与心智模型' },
      { text: '02 安装器入口 — 心跳起搏', link: '/bmad-book/第一部分-基础篇/02-安装器入口-心跳起搏' },
      { text: '03 模块系统 — 基因', link: '/bmad-book/第一部分-基础篇/03-模块系统-基因' },
      { text: '04 安装引擎 — 落到磁盘', link: '/bmad-book/第一部分-基础篇/04-安装引擎-落到磁盘' },
    ],
  },
  {
    text: '第二部分 · 核心系统篇',
    collapsed: false,
    items: [
      { text: '05 渠道与版本解析', link: '/bmad-book/第二部分-核心系统篇/05-渠道与版本解析' },
      { text: '06 技能系统 — 双手', link: '/bmad-book/第二部分-核心系统篇/06-技能系统-双手' },
      { text: '07 定制化与三层合并', link: '/bmad-book/第二部分-核心系统篇/07-定制化与三层合并' },
      { text: '08 确定性解析核 — Python 约束 LLM', link: '/bmad-book/第二部分-核心系统篇/08-确定性解析核-Python约束LLM' },
      { text: '09 IDE 集成 — 部署到宿主', link: '/bmad-book/第二部分-核心系统篇/09-IDE集成-部署到宿主' },
    ],
  },
  {
    text: '第三部分 · 高级模式篇',
    collapsed: true,
    items: [
      { text: '10 模块管理 — 官方 / 外部 / 自定义', link: '/bmad-book/第三部分-高级模式篇/10-模块管理-官方外部自定义' },
      { text: '11 多智能体编排 — Party Mode', link: '/bmad-book/第三部分-高级模式篇/11-多智能体编排-PartyMode' },
      { text: '12 意图捕获与 Spec 契约', link: '/bmad-book/第三部分-高级模式篇/12-意图捕获与Spec契约' },
    ],
  },
  {
    text: '第四部分 · 工程实践篇',
    collapsed: true,
    items: [
      { text: '13 四阶段交付流水线', link: '/bmad-book/第四部分-工程实践篇/13-四阶段交付流水线' },
      { text: '14 开发循环 — dev-auto 与 quick-dev', link: '/bmad-book/第四部分-工程实践篇/14-开发循环-dev-auto与quick-dev' },
      { text: '15 质量与审查 — Review 三件套', link: '/bmad-book/第四部分-工程实践篇/15-质量与审查-Review三件套' },
      { text: '16 构建你自己的方法论 harness', link: '/bmad-book/第四部分-工程实践篇/16-构建你自己的方法论harness' },
    ],
  },
  {
    text: '附录',
    collapsed: true,
    items: [
      { text: 'A 源码导航地图', link: '/bmad-book/附录/A-源码导航地图' },
      { text: 'B 技能完整清单', link: '/bmad-book/附录/B-技能完整清单' },
      { text: 'C 模块注册表与渠道速查', link: '/bmad-book/附录/C-模块注册表与渠道速查' },
      { text: 'D 术语表', link: '/bmad-book/附录/D-术语表' },
    ],
  },
];

export const deerflowSidebar = [
  {
    text: '简介',
    items: [
      { text: '总目录', link: '/deerflow-book/' },
      { text: '00 前言', link: '/deerflow-book/00-前言' },
    ],
  },
  {
    text: '第零部分 · 前置篇',
    collapsed: false,
    items: [
      { text: 'LangChain 基础 — Agent 的砖石', link: '/deerflow-book/第零部分-前置篇/LangChain基础-Agent的砖石' },
      { text: 'LangGraph 基础 — Agent 的骨架', link: '/deerflow-book/第零部分-前置篇/LangGraph基础-Agent的骨架' },
      { text: '函数调用管线总览', link: '/deerflow-book/第零部分-前置篇/函数调用管线总览' },
      { text: '能力注入与运行模式', link: '/deerflow-book/第零部分-前置篇/能力注入与运行模式' },
    ],
  },
  {
    text: '第一部分 · 基础篇',
    collapsed: false,
    items: [
      { text: '01 智能体编程的新范式', link: '/deerflow-book/第一部分-基础篇/01-智能体编程的新范式' },
      { text: '02 对话循环 — Agent 的心跳', link: '/deerflow-book/第一部分-基础篇/02-对话循环-Agent的心跳' },
      { text: '03 工具系统 — Agent 的双手', link: '/deerflow-book/第一部分-基础篇/03-工具系统-Agent的双手' },
      { text: '04 沙箱与权限 — Agent 的护栏', link: '/deerflow-book/第一部分-基础篇/04-沙箱与权限-Agent的护栏' },
    ],
  },
  {
    text: '第二部分 · 核心系统篇',
    collapsed: true,
    items: [
      { text: '05 配置系统 — Agent 的基因', link: '/deerflow-book/第二部分-核心系统篇/05-配置系统-Agent的基因' },
      { text: '06 状态与线程 — Agent 的工作内存', link: '/deerflow-book/第二部分-核心系统篇/06-状态与线程-Agent的工作内存' },
      { text: '07 中间件链 — Agent 的生命周期扩展点', link: '/deerflow-book/第二部分-核心系统篇/07-中间件链-Agent的生命周期扩展点' },
      { text: '08 上下文管理 — Agent 的上下文预算', link: '/deerflow-book/第二部分-核心系统篇/08-上下文管理-Agent的上下文预算' },
      { text: '09 记忆系统 — Agent 的长期记忆', link: '/deerflow-book/第二部分-核心系统篇/09-记忆系统-Agent的长期记忆' },
    ],
  },
  {
    text: '第三部分 · 高级模式篇',
    collapsed: true,
    items: [
      { text: '10 子智能体系统 — Agent 的分身', link: '/deerflow-book/第三部分-高级模式篇/10-子智能体系统-Agent的分身' },
      { text: '11 协调器模式与多智能体编排', link: '/deerflow-book/第三部分-高级模式篇/11-协调器模式与多智能体编排' },
      { text: '12 技能系统与插件架构', link: '/deerflow-book/第三部分-高级模式篇/12-技能系统与插件架构' },
      { text: '13 MCP 集成与外部协议', link: '/deerflow-book/第三部分-高级模式篇/13-MCP集成与外部协议' },
    ],
  },
  {
    text: '第四部分 · 工程实践篇',
    collapsed: true,
    items: [
      { text: '14 运行时与流式架构', link: '/deerflow-book/第四部分-工程实践篇/14-运行时与流式架构' },
      { text: '15 持久化与 Schema 迁移', link: '/deerflow-book/第四部分-工程实践篇/15-持久化与Schema迁移' },
      { text: '16 Gateway API 与 IM 渠道', link: '/deerflow-book/第四部分-工程实践篇/16-Gateway-API与IM渠道' },
      { text: '17 嵌入式客户端与 TUI', link: '/deerflow-book/第四部分-工程实践篇/17-嵌入式客户端与TUI' },
      { text: '18 构建你自己的 Agent Harness', link: '/deerflow-book/第四部分-工程实践篇/18-构建你自己的Agent-Harness' },
    ],
  },
  {
    text: '第五部分 · 架构总结',
    collapsed: true,
    items: [
      { text: '整体管线 — 一条消息的完整旅程', link: '/deerflow-book/第五部分-架构总结/整体管线-一条消息的完整旅程' },
      { text: 'G1 图的装配', link: '/deerflow-book/第五部分-架构总结/G1-图的装配' },
    ],
  },
  {
    text: '附录',
    collapsed: true,
    items: [
      { text: 'A 源码导航地图', link: '/deerflow-book/附录/A-源码导航地图' },
      { text: 'B 工具完整清单', link: '/deerflow-book/附录/B-工具完整清单' },
      { text: 'C 中间件完整清单', link: '/deerflow-book/附录/C-中间件完整清单' },
      { text: 'D 配置项速查表', link: '/deerflow-book/附录/D-配置项速查表' },
      { text: 'E 术语表', link: '/deerflow-book/附录/E-术语表' },
    ],
  },
];
