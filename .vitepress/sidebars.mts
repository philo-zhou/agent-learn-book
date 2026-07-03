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
