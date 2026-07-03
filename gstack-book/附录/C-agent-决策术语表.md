# 附录 C · Agent 决策术语表

> 全书出现的 agent 逻辑术语，按字母表排。每条 ≤ 25 字定义 + 出处章。

## A

- **Anti-shortcut clause** —— review skill 里"有 finding → 必 AUQ、不能自答自问"的硬约束。[Ch 10 · 10.3](../第四部分-Execution-Agent/10-iron-laws.md#103-iron-law-2--anti-shortcut-clauseplan-阶段的对偶)
- **Adversarial review** —— 攻击者视角 review：Claude subagent + Codex 双 pass。[Ch 09 · 9.4](../第三部分-Plan-mode-Agent/09-second-opinion-三件套.md#94-adversarial-review--pre-landing-攻击性-review)
- **AskUserQuestion (AUQ)** —— 结构化决策 brief 工具。plan mode 里满足 end-of-turn。[Ch 06](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md)
- **AUQ Format** —— tier 2+ 注入的 AUQ 结构契约（D-number / ELI10 / Recommendation / Completeness / ✅❌ / Net）。[Ch 06 · 6.6](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#66-结构化-auq-的自检)
- **`(recommended)` label** —— AUQ 选项后缀，是 auto-decide 的锚点。两个 = 拒绝 auto-decide。[Ch 13 · 13.3.3](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#1333-recommended-是-auto-decide-的锚)
- **Auto-decide** —— autoplan 用 6 原则替用户拍中间决策。[Ch 08](../第三部分-Plan-mode-Agent/08-autoplan-6-决策原则.md)
- **`ACTIVATED`** —— preamble KEY，`.activated` 文件是否存在。[Ch 03 · 3.5](../第一部分-输入层/03-session-kind-与-first-run.md#35-first-run-activationv1585-引入的三层探测)
- **Atomic commit** —— qa fix loop 每个 fix 一个独立 commit。[Ch 13 · 13.1](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#131-qa-fix-loopatomic-commit--beforeafter-证据)

## B

- **BLOCKED** —— 4-status 之一：agent 无法推进，说明 blocker 与已试。[Ch 10 · 10.5.1](../第四部分-Execution-Agent/10-iron-laws.md#1051-escalation-is-legit)
- **Boil the Ocean** —— 完整度默认高的原则。选项打完整度分。[Ch 10 · 10.4](../第四部分-Execution-Agent/10-iron-laws.md#104-iron-law-3--boil-the-ocean完整度默认高)
- **Boundary instruction** —— 跨 host prompt injection 防御，写 filesystem 边界。[Ch 15 · 15.2](../第五部分-记忆与安全/15-safety-boundary-与-hook.md#152-威胁-across-host-boundary-instruction)
- **Blast radius** —— eng review 直觉：改动最坏影响多大范围 / 多少人。[Ch 07 · 7.3.1](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#731-15-条-eng-manager-cognitive-patterns)
- `benefits-from` —— frontmatter 声明"如果先跑 X 我的输入更锋利"。软推荐。[Ch 05 · 5.2](../第二部分-Router与编排/05-skill-之间的编排契约.md#52-编排模式-1--benefits-from前置提示)

## C

- **CEO review** —— 4 mode + 9 directives + 16 patterns 的产品视角 review。[Ch 07 · 7.2](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#72-视角-1--ceo--4-mode--16-cognitive-patterns)
- **Confidence calibration** —— finding 打 1-10 分，pre-emit gate 强制 quote 锚点。[Ch 13 · 13.2](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#132-confidence-calibrationfinding-的-1-10-分)
- **Confusion protocol** —— 高风险模糊时 STOP + 2-3 选项 AUQ。tier 2+。[Ch 02 · 2.5.1](../第一部分-输入层/02-preamble-tier-与上下文密度.md#251-confusion-protocol--高风险模糊时的强制-stop)
- **Continuous checkpoint** —— `CHECKPOINT_MODE=continuous` 时 auto-commit WIP。[Ch 02 · 2.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#23-tier--section-组合表)
- **Completeness score** —— AUQ 选项上的 X/10 完整度评分。[Ch 06 · 6.4.3](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#643-prose-fallback-的三段必备)
- **Context Recovery** —— tier 2+，加载最近 artifacts + `gstack-decision-search`。[Ch 14 · 14.7](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#147-layer-6decision-search--显式决策记录)
- **Context Health** —— 反 loop 指令：同一诊断 / 文件 / fix variant → STOP。[Ch 02 · 2.5.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#253-context-health--反-loop)
- **CONDUCTOR_SESSION** —— preamble KEY，Conductor 里 AUQ 主动走 prose。[Ch 06 · 6.5](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#65-conductor主动降级)
- **Cross-review dedup** —— 多 review 结果去重合并 + 4 类分组。[Ch 09 · 9.5](../第三部分-Plan-mode-Agent/09-second-opinion-三件套.md#95-cross-review-dedup--多个-review-结果合并)
- **Cross-project learnings** —— 跨项目 learnings search，用户 opt-in。[Ch 14 · 14.5](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#145-layer-4cross-project--用户-opt-in)

## D

- **D-number** —— AUQ / prose 决策 brief 的稳定标签（`D1`, `D3.2`）。[Ch 06 · 6.4.3](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#643-prose-fallback-的三段必备)
- **Decision** —— durable choice。`gstack-decision-log` + `--supersede` reversal 机制。[Ch 14 · 14.7](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#147-layer-6decision-search--显式决策记录)
- **DIFF-VERIFIABLE** —— plan completion audit 的 4 类可验证性之一。[Ch 12 · 12.3.3](../第四部分-Execution-Agent/12-plan-completion-audit.md#1233-verification-modev1584-修的-bug)
- **Dispatch table** —— router body 里的 IF-THEN 规则表。[Ch 04 · 4.4](../第二部分-Router与编排/04-router-的路由决策.md#44-阀-2dispatch-表)
- **DONE** —— 4-status 之一：agent 已完成 + 有 evidence。[Ch 10 · 10.5.1](../第四部分-Execution-Agent/10-iron-laws.md#1051-escalation-is-legit)
- **DONE_WITH_CONCERNS** —— 4-status 之一：完成但有 caveat。同上
- **DX review** —— TTHW + persona + competitive tier 的开发者体验视角 review。[Ch 07 · 7.5](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#75-视角-4--dx--tthw--persona--competitive-tier)

## E

- **ELI10** —— AUQ / prose 里的 plain-English 解释，2-4 sentences。[Ch 06 · 6.4.3](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#643-prose-fallback-的三段必备)
- **Eng review** —— Scope gate + 15 patterns 的工程视角 review。[Ch 07 · 7.3](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#73-视角-2--工程--scope-gate-硬停--15-条-pattern)
- **`EXPLAIN_LEVEL`** —— preamble KEY / build flag。terse 时压 4 段 preamble。[Ch 02 · 2.8](../第一部分-输入层/02-preamble-tier-与上下文密度.md#28-用户-overrideexplain_level)
- **ExitPlanMode** —— Claude Code plan mode 的正式退出。skill 结束时才调。[Ch 06 · 6.2](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#62-gstack-的答案auq--end-of-turn)
- **EXTERNAL-STATE** —— plan completion audit 4 类之一：外部系统状态，永远 UNVERIFIABLE。[Ch 12 · 12.3.3](../第四部分-Execution-Agent/12-plan-completion-audit.md#1233-verification-modev1584-修的-bug)

## F

- **First-run scaffold** —— v1.58.5 引入。冷启动按 `FIRST_TASK` token 推入口 skill。[Ch 03 · 3.5](../第一部分-输入层/03-session-kind-与-first-run.md#35-first-run-activationv1585-引入的三层探测)
- **`FIRST_TASK`** —— 11 种 token 枚举 → 一句 skill 推荐 mapping。[Ch 03 · 3.6](../第一部分-输入层/03-session-kind-与-first-run.md#36-gstack-first-task-detect--一枚枚举)
- **Fix-First** —— review army finding 分类：FIXABLE 自动修 / INVESTIGATE 只报告。[Ch 09 · 9.4.3](../第三部分-Plan-mode-Agent/09-second-opinion-三件套.md#943-findings-有-fix-first--investigate-分类)
- **freeze hook** —— hard-deny Edit / Write 越界 file_path 的 PreToolUse hook。[Ch 15 · 15.4](../第五部分-记忆与安全/15-safety-boundary-与-hook.md#154-威胁-cfreeze-的-scope-lock)

## G

- **`GSTACK_PLAN_MODE`** —— preamble KEY：Claude Code plan mode 状态。[Ch 06 · 6.2](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#62-gstack-的答案auq--end-of-turn)
- **GBrain** —— 跨机 memory backend。planning skill 主动 search + save。[Ch 14 · 14.6](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#146-layer-5gbrain--跨机同步)
- **guard** —— careful + freeze 的合并入口。[Ch 15 · 15.5](../第五部分-记忆与安全/15-safety-boundary-与-hook.md#155-三层协同guard-skill)

## H

- **`handoff` / `handoff-policy`** —— frontmatter 字段：plan-mode skill artifact 落地路径。[Ch 05 · 5.5](../第二部分-Router与编排/05-skill-之间的编排契约.md#55-编排模式-4--handoffartifact-交接)
- **`HAS_ROUTING`** —— preamble KEY：CLAUDE.md 是否有 skill routing 段。[附录 A](A-preamble-KEY-字典.md#a5-项目--仓库信号)

## I

- **`{{INVOKE_SKILL:name}}`** —— resolver：内联加载另一个 skill 的 body、跳过 12 段共享。[Ch 05 · 5.3](../第二部分-Router与编排/05-skill-之间的编排契约.md#53-编排模式-2--invoke_skillxxx内联加载)
- **Iron Law** —— 单方面无豁免的硬约束。3+1 条：no fix without root cause / anti-shortcut / boil the ocean / progress mustn't loop。[Ch 10](../第四部分-Execution-Agent/10-iron-laws.md)
- **Idempotent** —— ship 的 action 幂等 —— 已做过的 action 只 skip、verification 每次跑。[Ch 11 · 11.5](../第四部分-Execution-Agent/11-ship-决策边界.md#115-verification--action-分离)
- **`interactive: true`** —— frontmatter 字段：skill 期望 AUQ 循环，preamble 里 emit 相关规则。[Ch 07 · 7.1](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#71-为什么是-4-视角)

## L

- **Learnings** —— `~/.gstack/projects/<slug>/learnings.jsonl` 追加式记忆。[Ch 14](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md)
- **`{{LEARNINGS_SEARCH:query=...}}`** —— resolver：per-topic search，query 白名单校验。[Ch 14 · 14.4](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#144-layer-3per-topic-search--具体-hypothesis-加载)

## M

- **Mechanical** —— autoplan 决策分类：唯一正确答案、silent auto-decide。[Ch 08 · 8.3.1](../第三部分-Plan-mode-Agent/08-autoplan-6-决策原则.md#831-mechanical--自动决不打扰)
- **`MODEL_OVERLAY`** —— preamble KEY：model-specific behavioral patch。[附录 A](A-preamble-KEY-字典.md#a6-model--brain)

## N

- **NEEDS_CONTEXT** —— 4-status 之一：缺信息。说明具体缺什么。[Ch 10 · 10.5.1](../第四部分-Execution-Agent/10-iron-laws.md#1051-escalation-is-legit)
- **Never stop for** —— ship 的 auto-decide 白名单。[Ch 11 · 11.4](../第四部分-Execution-Agent/11-ship-决策边界.md#114-never-stop-for--8-项-auto-decide)
- **No fix without root cause** —— Iron Law 1，investigate 4-phase 硬要求。[Ch 10 · 10.2](../第四部分-Execution-Agent/10-iron-laws.md#102-iron-law-1--no-fixes-without-root-cause)

## O

- **Only stop for** —— ship 的 pause 白名单，11 项。[Ch 11 · 11.3](../第四部分-Execution-Agent/11-ship-决策边界.md#113-only-stop-for--11-项白名单)

## P

- **`PROACTIVE`** —— preamble KEY / user preference：router 是否主动 dispatch。[Ch 04 · 4.3](../第二部分-Router与编排/04-router-的路由决策.md#43-阀-1proactive-gate)
- **Plan completion audit** —— ship / review 里对 plan file items 的 5-status 审计。[Ch 12](../第四部分-Execution-Agent/12-plan-completion-audit.md)
- **Plan-mode handshake** —— plan mode 里 AUQ 满足 end-of-turn 的规则。[Ch 06](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md)
- **`preamble-tier`** —— frontmatter 字段：1-4 决定 preamble 组合密度。[Ch 02](../第一部分-输入层/02-preamble-tier-与上下文密度.md)
- **Pre-emit verification gate** —— confidence 前置 gate：quote motivating line 才能 ≥7 分。[Ch 13 · 13.2.1](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#1321-pre-emit-verification-gate-bug-1539)
- **Progress mustn't loop** —— Iron Law 4：同一 diagnostic / file / fix variant 循环 → STOP。[Ch 10 · 10.5](../第四部分-Execution-Agent/10-iron-laws.md#105-iron-law-4--progress-mustnt-loop)
- **Prose fallback** —— AUQ 不可用时降级为 markdown decision brief。[Ch 06 · 6.4.3](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#643-prose-fallback-的三段必备)

## Q

- **`question_id`** —— AUQ 稳定 ID。preference check 用它 lookup。[Ch 13 · 13.3.1](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#1331-question-id--registry)
- **Question tuning** —— 用户设 `never-ask` / `always-ask` 记住 AUQ 偏好。[Ch 13 · 13.3](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#133-question-tuning让-auq-记住用户偏好)
- **QUESTION_TUNING** —— preamble KEY，是否 check preference。[Ch 13 · 13.3](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#133-question-tuning让-auq-记住用户偏好)

## R

- **Repo Mode** —— tier 3+ 段：`solo` 主动修 / `collaborative` 只 flag。[Ch 02 · 2.6.1](../第一部分-输入层/02-preamble-tier-与上下文密度.md#261-repo-mode--see-something-say-something)
- **Restore point** —— autoplan pre-flight：改 plan file 前先 backup。[Ch 08 · 8.7](../第三部分-Plan-mode-Agent/08-autoplan-6-决策原则.md#87-一个-restore-point-的设计)
- **Review Army** —— CEO / eng / design / DX 4 视角 review 集合。[Ch 07](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md)
- **Review dashboard** —— `bin/gstack-review-log` + `bin/gstack-review-read` 磁盘黑板，7-day window。[Ch 05 · 5.4](../第二部分-Router与编排/05-skill-之间的编排契约.md#54-编排模式-3--review-dashboard共享黑板)
- **Router** —— gstack 前门 skill，`preamble-tier: 1`，只做路由不执行。[Ch 04](../第二部分-Router与编排/04-router-的路由决策.md)

## S

- **Scope drift** —— review / ship 检测 SCOPE CREEP + MISSING REQUIREMENTS。[附录 B · B.2](B-resolver-与注入指令.md#b2-review-methodology-placeholder)
- **Scope gate** —— eng review 的 hard STOP：确认 review target 才动。[Ch 07 · 7.3](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#73-视角-2--工程--scope-gate-硬停--15-条-pattern)
- **Scope Lock** —— investigate 内嵌 freeze，debug 时锁 file 编辑范围。[Ch 15 · 15.6](../第五部分-记忆与安全/15-safety-boundary-与-hook.md#156-investigate-主动接入-freeze--agent-skill-的横向-hook-集成)
- **Search Before Building** —— tier 3+ 段：3-layer 认知 + eureka log。[Ch 02 · 2.6.2](../第一部分-输入层/02-preamble-tier-与上下文密度.md#262-search-before-building)
- **Second opinion** —— 独立 model / fresh subagent 的 review 视角。[Ch 09](../第三部分-Plan-mode-Agent/09-second-opinion-三件套.md)
- **`sensitive: true`** —— frontmatter 字段：effect-bearing skill 标记。Factory 会加 disable-model-invocation。[Ch 11 · 11.7](../第四部分-Execution-Agent/11-ship-决策边界.md#117-ship-的一个副作用sensitive-frontmatter)
- **`SESSION_KIND`** —— preamble KEY：`interactive` / `headless` / `spawned`。[Ch 03](../第一部分-输入层/03-session-kind-与-first-run.md)
- **Split chain (AUQ)** —— 5+ options 时 D<N>.k 逐 option 问，`-split-` id 禁 auto-decide。[Ch 06 · 6.6](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#66-结构化-auq-的自检)
- **`SPAWNED_SESSION`** —— preamble KEY：orchestrator 起的子会话。禁 AUQ / telemetry / lake intro。[Ch 03 · 3.3.1](../第一部分-输入层/03-session-kind-与-first-run.md#331-spawned-session不问不装不引导)

## T

- **Taste** —— autoplan 决策分类：合理人分歧、auto-decide + 最终关口呈现。[Ch 08 · 8.3.2](../第三部分-Plan-mode-Agent/08-autoplan-6-决策原则.md#832-taste--自动决最终关口呈现)
- **`tune:`** —— 用户 in-chat 指令。user-origin gate 只在 chat message 里生效。[Ch 13 · 13.3.4](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#1334-user-origin-gate)
- **TTHW** —— Time To Hello World。DX review 的核心 metric。[Ch 07 · 7.5](../第三部分-Plan-mode-Agent/07-review-army-4-视角.md#75-视角-4--dx--tthw--persona--competitive-tier)

## U

- **UNVERIFIABLE** —— plan completion audit 5-status 之一。逐项 Y/N/D 确认。[Ch 12 · 12.4.2](../第四部分-Execution-Agent/12-plan-completion-audit.md#1242-p2-unverifiable-逐项确认vas-449-修复)
- **User Challenge** —— autoplan 决策分类：两个 model 都想推翻用户方向、永不 auto-decide。[Ch 08 · 8.3.3](../第三部分-Plan-mode-Agent/08-autoplan-6-决策原则.md#833-user-challenge--从不自动决)
- **User Sovereignty** —— second opinion 三件套底线：跨 model 一致 = 强信号 ≠ 执行许可。[Ch 09 · 9.6](../第三部分-Plan-mode-Agent/09-second-opinion-三件套.md#96-user-sovereignty--三件套的共同底线)
- **User-origin gate** —— tune preference 只当前 user chat message 才写；防 profile poisoning。[Ch 13 · 13.3.4](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#1334-user-origin-gate)

## V

- **VAS-449** —— 历史 bug：plan completion audit blanket-confirm UNVERIFIABLE。修补：per-item AUQ。[Ch 12 · 12.4.2](../第四部分-Execution-Agent/12-plan-completion-audit.md#1242-p2-unverifiable-逐项确认vas-449-修复)
- **`(recommended)` label** —— 见 R
- **Verification / Action separation** —— ship idempotency：verify 每次跑、action 已做过就 skip。[Ch 11 · 11.5](../第四部分-Execution-Agent/11-ship-决策边界.md#115-verification--action-分离)

## W

- **When in doubt, invoke** —— router 的兜底 heuristic：宁可错叫 skill 也不要 ad-hoc 回答。[Ch 04 · 4.5](../第二部分-Router与编排/04-router-的路由决策.md#45-阀-3when-in-doubt-invoke)
- **Writing style** —— tier 2+ 段：outcome framing / user impact closer / jargon glossing。[Ch 02 · 2.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#23-tier--section-组合表)

[← B · resolver 与注入指令](B-resolver-与注入指令.md) | [回到全书目录 →](../README.md)
