# 附录 A · Preamble KEY 字典

> Preamble bash（`scripts/resolvers/preamble/generate-preamble-bash.ts`）echo 到 stdout 的所有 KEY，按语义分 6 组。每条给出：类型、值域、agent 决策用途、出处章节。

## A.1 位置 / 分支

| KEY | 值域 | 决策用途 | 出处 |
|---|---|---|---|
| `BRANCH` | git branch name / `unknown` | 大多数 skill 用它组 slug 命名 artifact；ship 用它决定是否在 base branch abort | [Ch 04 · 4.6](../第二部分-Router与编排/04-router-的路由决策.md#46-三个阀依次过--一张-mermaid), [Ch 11](../第四部分-Execution-Agent/11-ship-决策边界.md) |
| `SLUG` | git-remote-derived kebab | learnings / decisions 目录 | [Ch 14](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md) |

## A.2 用户偏好

| KEY | 值域 | 决策用途 | 出处 |
|---|---|---|---|
| `PROACTIVE` | `true` / `false` | Router 是否主动 dispatch skill | [Ch 04 · 4.3](../第二部分-Router与编排/04-router-的路由决策.md#43-阀-1proactive-gate) |
| `PROACTIVE_PROMPTED` | `yes` / `no` | 是否已问过 proactive 偏好 | [Ch 04](../第二部分-Router与编排/04-router-的路由决策.md) |
| `SKILL_PREFIX` | `true` / `false` | 建议 `/gstack-*` 命名 vs `/*` 命名 | [Ch 01 · 1.5](../第一部分-输入层/01-preamble-作为-LLM-state-feed.md#15-preamble-的-21-个-key-完整拉一遍) |
| `EXPLAIN_LEVEL` | `default` / `terse` | preamble 段是否压缩 | [Ch 02 · 2.8](../第一部分-输入层/02-preamble-tier-与上下文密度.md#28-用户-overrideexplain_level) |
| `QUESTION_TUNING` | `true` / `false` | AUQ 前是否 check preference | [Ch 13 · 13.3](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#133-question-tuning让-auq-记住用户偏好) |
| `CHECKPOINT_MODE` | `explicit` / `continuous` | 是否自动 WIP-commit | [Ch 02 · 2.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#23-tier--section-组合表) |
| `CHECKPOINT_PUSH` | `true` / `false` | continuous 是否 push | 同上 |
| `TELEMETRY` | `community` / `anonymous` / `off` | 是否上传遥测 | [Ch 01 · 1.5](../第一部分-输入层/01-preamble-作为-LLM-state-feed.md#15-preamble-的-21-个-key-完整拉一遍) |
| `TEL_PROMPTED` | `yes` / `no` | 是否已问过遥测偏好 | 同上 |

## A.3 Session 类型

| KEY | 值域 | 决策用途 | 出处 |
|---|---|---|---|
| `SESSION_KIND` | `interactive` / `headless` / `spawned` | AUQ 失败时如何降级 | [Ch 03](../第一部分-输入层/03-session-kind-与-first-run.md), [Ch 06](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md) |
| `CONDUCTOR_SESSION` | `true` / (缺席) | 主动走 prose fallback | [Ch 06 · 6.5](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#65-conductor主动降级) |
| `SPAWNED_SESSION` | `true` / (缺席) | orchestrator 起的子会话 —— 禁 AUQ、禁 telemetry | [Ch 03 · 3.3.1](../第一部分-输入层/03-session-kind-与-first-run.md#331-spawned-session不问不装不引导) |
| `GSTACK_PLAN_MODE` | `active` / `inactive` | Claude Code plan mode 状态 | [Ch 06 · 6.2](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#62-gstack-的答案auq--end-of-turn) |

## A.4 First-run activation

| KEY | 值域 | 决策用途 | 出处 |
|---|---|---|---|
| `ACTIVATED` | `yes` / `no` | 是否曾跑过 gstack skill | [Ch 03 · 3.5](../第一部分-输入层/03-session-kind-与-first-run.md#35-first-run-activationv1585-引入的三层探测) |
| `FIRST_LOOP_SHOWN` | `yes` / `no` | 首环路 tip 是否显过 | 同上 |
| `FIRST_TASK` | `greenfield` / `code_node` / `code_python` / `code_rust` / `code_go` / `code_ruby` / `code_ios` / `branch_ahead` / `dirty_default` / `clean_default` / `nongit` / (空) | 冷启动推荐 skill | [Ch 03 · 3.6](../第一部分-输入层/03-session-kind-与-first-run.md#36-gstack-first-task-detect--一枚枚举) |
| `LAKE_INTRO` | `yes` / `no` | Boil the Ocean 介绍是否显过 | [Ch 01 · 1.5](../第一部分-输入层/01-preamble-作为-LLM-state-feed.md#15-preamble-的-21-个-key-完整拉一遍) |

## A.5 项目 / 仓库信号

| KEY | 值域 | 决策用途 | 出处 |
|---|---|---|---|
| `REPO_MODE` | `solo` / `collaborative` / `unknown` | tier 3+ skill 决定是主动修还是只 flag | [Ch 02 · 2.6.1](../第一部分-输入层/02-preamble-tier-与上下文密度.md#261-repo-mode--see-something-say-something) |
| `LEARNINGS` | `N entries loaded` / `0` | 是否有历史 learning | [Ch 14 · 14.3](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#143-layer-2search--preamble-主动预取) |
| `HAS_ROUTING` | `yes` / `no` | CLAUDE.md 是否有 skill routing 段 | [Ch 04](../第二部分-Router与编排/04-router-的路由决策.md) |
| `ROUTING_DECLINED` | `true` / `false` | 用户明确不装 routing | 同上 |
| `VENDORED_GSTACK` | `yes` / `no` | 项目内 vendored 了 gstack（deprecated） | [Ch 04 · 4.3](../第二部分-Router与编排/04-router-的路由决策.md#43-阀-1proactive-gate) |

## A.6 Model / brain

| KEY | 值域 | 决策用途 | 出处 |
|---|---|---|---|
| `MODEL_OVERLAY` | `claude` / `gpt-5` / `gemini` / `none` | 使用哪个 model 的 behavioral overlay | [Ch 02 · 2.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#23-tier--section-组合表) |
| `BRAIN_HEALTH` | `<score> (<fails> failures, <warns> warnings)` / (仅 gbrain / hermes host) | gbrain 后端健康 | [Ch 14 · 14.6](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#146-layer-5gbrain--跨机同步) |

## A.7 Skill body 分岔的组合规则

大多数 skill body 用 "If `<KEY>` is `<value>`" 的规则查表。多 KEY 组合出决策矩阵：

| KEY 组合 | 规则 |
|---|---|
| `SESSION_KIND=headless` + AUQ 失败 | STATUS: BLOCKED |
| `SESSION_KIND=spawned` | Auto-choose recommended，禁 AUQ / telemetry / lake intro |
| `CONDUCTOR_SESSION=true` | 主动走 prose，永不调 AUQ |
| `PROACTIVE=false` | 不主动 dispatch |
| `ACTIVATED=no` + `FIRST_TASK` 非空 + `SESSION_KIND=interactive` | 显示 first-run tip、touch `.activated` |
| `ACTIVATED=yes` + `FIRST_LOOP_SHOWN=no` | 显示 plan→review→ship tip、touch `.first-loop-tip-shown` |
| `LEARNINGS>5` | preamble 主动 search top-3 |
| `EXPLAIN_LEVEL=terse` | writing style / completeness / confusion / context health 段 skip |
| `QUESTION_TUNING=true` + skill 有 AUQ | AUQ 前 check `gstack-question-preference` |
| `CHECKPOINT_MODE=continuous` | 完成 logical unit 后自动 WIP commit |

## A.8 磁盘 flag 一览

Preamble 用文件系统标记来当"一次性 flag"。相关文件在 `~/.gstack/`：

| 路径 | 语义 |
|---|---|
| `.activated` | 曾跑过任何 gstack skill |
| `.first-loop-tip-shown` | 首环路 tip 已显 |
| `.proactive-prompted` | proactive 偏好已问 |
| `.telemetry-prompted` | 遥测偏好已问 |
| `.completeness-intro-seen` | Boil the Ocean 介绍已显 |
| `.vendoring-warned-<slug>` | vendored 警告已显 |
| `.feature-prompted-continuous-checkpoint` | continuous checkpoint 特性已问 |
| `.feature-prompted-model-overlay` | model overlay 特性已问 |
| `.writing-style-prompted` | writing style 迁移已问 |
| `sessions/<PPID>` | 每 PPID 一个空文件，120min GC |
| `projects/<slug>/learnings.jsonl` | 项目 learnings 追加 |
| `projects/<slug>/decisions.active.json` | 项目 durable decisions |
| `projects/<slug>/timeline.jsonl` | skill start/complete 事件流 |
| `analytics/skill-usage.jsonl` | 本地遥测 |
| `analytics/eureka.jsonl` | first-principles 反直觉发现 |
| `builder-profile.jsonl` | office-hours 用户画像 |

**gstack agent 逻辑用文件存在与否表达"这件事发生过没"** —— 不用配置文件、不用数据库。

[← 回到全书目录](../README.md) | [下一篇：B · 20+ resolver 与它们注入的 agent 指令 →](B-resolver-与注入指令.md)
