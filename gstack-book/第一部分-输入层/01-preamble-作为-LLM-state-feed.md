# 01 · Preamble：把 bash 输出当作 LLM 的 state feed

> 本章拆 gstack 最核心的 agent 设计模式：**不在代码里做决策，而是把决策上下文用 bash 输出成 `KEY: value` 直接喂给 LLM，让 LLM 自己决策**。这是 gstack agent 逻辑的基石。

## 1.1 一个反直觉的模式

你会以为 gstack 会这样写：

```typescript
// 假想代码 —— gstack 实际上不这么写
if (session.isFirstRun && session.hasCode && session.branch !== 'main') {
  suggest('/qa');
} else if (session.hasUncommittedChanges) {
  suggest('/review');
}
```

用代码判断状态、代码里做决策、代码里拼决策提示。

gstack **不这么写**。它把上面的每一个"状态 bit"用 bash 输出到 stdout，让 LLM 读到之后自己按 skill body 里写的规则决策。这是 preamble。

## 1.2 preamble 的形状

去看任何 skill 生成的 SKILL.md，`## Preamble (run first)` 段下有一个 bash 块。以 router 为例（`SKILL.md:29-138`），它 echo 出的是这样一堆行：

```text
BRANCH: main
PROACTIVE: true
PROACTIVE_PROMPTED: yes
SKILL_PREFIX: false
REPO_MODE: solo
SESSION_KIND: interactive
ACTIVATED: yes
FIRST_LOOP_SHOWN: yes
FIRST_TASK: 
LAKE_INTRO: yes
TELEMETRY: community
TEL_PROMPTED: yes
EXPLAIN_LEVEL: default
QUESTION_TUNING: false
LEARNINGS: 12 entries loaded
HAS_ROUTING: yes
ROUTING_DECLINED: false
VENDORED_GSTACK: no
MODEL_OVERLAY: claude
CHECKPOINT_MODE: explicit
CHECKPOINT_PUSH: false
GSTACK_PLAN_MODE: inactive
```

这些行是给 LLM 看的。LLM 读到 `PROACTIVE: false` 就知道不该主动叫 skill；读到 `SESSION_KIND: headless` 就知道不能用 AskUserQuestion；读到 `LEARNINGS: 12` 就知道有累积经验可查。

## 1.3 生成 preamble 的 generator

这一整段 bash 由 `scripts/resolvers/preamble/generate-preamble-bash.ts` 生成。摘几行看：

```ts
// from scripts/resolvers/preamble/generate-preamble-bash.ts:27-32
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
_SKILL_PREFIX=$(${ctx.paths.binDir}/gstack-config get skill_prefix 2>/dev/null || echo "false")
echo "PROACTIVE: $_PROACTIVE"
echo "PROACTIVE_PROMPTED: $_PROACTIVE_PROMPTED"
echo "SKILL_PREFIX: $_SKILL_PREFIX"
```

每一个 `echo "KEY: value"` 就是一个"输入位"。LLM 会在后续 skill body 里看到形如 "If `PROACTIVE` is `false`: ..." 的分支指令。

## 1.4 为什么这么设计 —— 三条理由

### 1.4.1 决策要用户自己覆写

`~/.gstack/config.yaml` 里的 `proactive` / `explain_level` / `checkpoint_mode` / `question_tuning` 是用户偏好。硬编码到脚本里意味着改偏好要改代码。**preamble 每次读**（`bin/gstack-config get`），用户改了偏好下一次 skill 调用立刻生效，不用 rebuild。

### 1.4.2 gstack 自己不 host LLM

gstack 不是 runtime，它跑在 Claude Code / Codex / Factory 上。它 **没有** LLM 调用 API 可用。它能做的只有：写 markdown、echo 文本。**LLM 只能通过看到 stdout 学到状态**。preamble 就是这个 stdout。

### 1.4.3 支持"状态可扩展"

新增一个开关（比如 v1.58.5 引入的 `FIRST_TASK`）不需要改 skill body。generator 里加一行 echo，body 里加一段 "If `FIRST_TASK` is `greenfield`: ..."，其他 skill 不受影响。这是 gstack 应对 v1.x 频繁演进的关键 —— 每个 release 只加 KEY，不改协议。

## 1.5 preamble 的 21 个 KEY 完整拉一遍

`generate-preamble-bash.ts` 生成的所有 KEY（`SKILL.md:29-138`）：

| KEY | 类型 | 决策用途 |
|---|---|---|
| `BRANCH` | string | 分支名，几乎所有 skill 都用 |
| `PROACTIVE` | true / false | 是否主动 dispatch skill |
| `PROACTIVE_PROMPTED` | yes / no | 是否已问过用户偏好 |
| `SKILL_PREFIX` | true / false | 建议 `/gstack-*` 还是 `/*` 命令名 |
| `REPO_MODE` | solo / collaborative / unknown | 这个仓库的所有权 |
| `SESSION_KIND` | interactive / headless / spawned | 是否可以问用户 |
| `CONDUCTOR_SESSION` | true / (缺席) | AUQ 走 prose fallback |
| `ACTIVATED` | yes / no | 首次运行标记 |
| `FIRST_LOOP_SHOWN` | yes / no | 首环路 tip 是否显过 |
| `FIRST_TASK` | greenfield / code_* / branch_ahead / dirty_default / clean_default / (空) | 首次运行推荐入口 |
| `LAKE_INTRO` | yes / no | Boil the Ocean 介绍是否显过 |
| `TELEMETRY` | community / anonymous / off | 遥测级别 |
| `TEL_PROMPTED` | yes / no | 遥测偏好是否已问 |
| `EXPLAIN_LEVEL` | default / terse | 解释密度 |
| `QUESTION_TUNING` | true / false | AskUserQuestion 触发敏感度 |
| `LEARNINGS` | `N entries loaded` / `0` | 本项目累积 learning 数 |
| `HAS_ROUTING` | yes / no | CLAUDE.md 是否有 skill routing 段 |
| `ROUTING_DECLINED` | true / false | 用户明确拒绝加 routing |
| `VENDORED_GSTACK` | yes / no | 项目内 vendored 了 gstack |
| `MODEL_OVERLAY` | claude / gpt-5 / gemini / none | model overlay 名 |
| `CHECKPOINT_MODE` | explicit / continuous | 是否 auto-commit WIP |
| `CHECKPOINT_PUSH` | true / false | continuous 是否也 push |
| `GSTACK_PLAN_MODE` | active / inactive | Claude Code plan mode 状态 |
| `SPAWNED_SESSION` | true / (缺席) | 被 orchestrator spawn 而来 |
| `BRAIN_HEALTH` | (仅 gbrain/hermes host) | gbrain doctor 分数 |

完整字典见 [附录 A](../附录/A-preamble-KEY-字典.md)。

## 1.6 KEY → 决策指令的连接方式

preamble bash 输出 KEY，skill body 里用 markdown prose 把 KEY 映射到决策。以 `PROACTIVE` 为例，router 的 body（`SKILL.md.tmpl:38-45`）：

```markdown
# from SKILL.md.tmpl:38-45
If `PROACTIVE` is `false`: do NOT proactively invoke or suggest other gstack skills during
this session. Only run skills the user explicitly invokes. This preference persists across
sessions via `gstack-config`.

If `PROACTIVE` is `true` (default): **invoke the Skill tool** when the user's request
matches a skill's purpose. Do NOT answer directly when a skill exists for the task.
Use the Skill tool to invoke it.
```

**这是 LLM 的分支代码**。LLM 读 preamble stdout → 匹配 body 里的 "If `X` is `Y`" 段 → 按对应指令决策。

同样的模式在其他 KEY 上重复：

- `SESSION_KIND` → `spawned` 走 `Auto-choose recommended`（`SKILL.md:126-138` + `generate-spawned-session-check.ts:3-10`）
- `FIRST_TASK` → 每个 token 一句推荐（`generate-first-run-guidance.ts:20-24`）
- `CHECKPOINT_MODE: continuous` → auto-commit WIP（`generate-continuous-checkpoint.ts:3-27`）

## 1.7 一个具体例子：LEARNINGS 触发主动搜

`generate-preamble-bash.ts:84-92`：

```bash
# from scripts/resolvers/preamble/generate-preamble-bash.ts:84-92
_LEARN_FILE="${GSTACK_HOME:-$HOME/.gstack}/projects/${SLUG:-unknown}/learnings.jsonl"
if [ -f "$_LEARN_FILE" ]; then
  _LEARN_COUNT=$(wc -l < "$_LEARN_FILE" 2>/dev/null | tr -d ' ')
  echo "LEARNINGS: $_LEARN_COUNT entries loaded"
  if [ "$_LEARN_COUNT" -gt 5 ] 2>/dev/null; then
    ${ctx.paths.binDir}/gstack-learnings-search --limit 3 2>/dev/null || true
  fi
else
  echo "LEARNINGS: 0"
fi
```

三层动作：

1. count 有多少 learning
2. echo `LEARNINGS: N entries loaded` 让 LLM 知道有历史
3. 如果 > 5 条，**主动跑 search 抽 top-3**，让 LLM 直接读到 3 条最相关经验

这是 preamble 不只输出状态、还能"主动预取相关上下文"的地方 —— **把 RAG 塞进 stdout**。LLM 不需要显式说 "去查我上次遇到什么", search 结果已经在它的 context 里了。

## 1.8 不写代码、写 markdown 的代价

这套模式好处清楚：可扩展、用户可覆写、不 host LLM。但代价也真实：

- **状态一致性靠 LLM 读**：如果 LLM 忽略某个 KEY，就没人拦它。gstack 只能通过 skill body 里反复"如果 X is Y then ..."的 prose 加强
- **stdout 长度是成本**：preamble 每次跑都在 LLM context 里占位。`preamble-tier` 就是为了控制这个长度（下一章）
- **bash 兼容性**：跨 macOS / Linux / Git Bash / WSL 都要能跑；某些 idiom 要用 POSIX 兼容写法

第二个问题正是 tier 系统要解决的。

## 1.9 章末导航

[← 00 前言](../00-前言.md) | [下一章：02 · preamble-tier 与上下文密度 →](02-preamble-tier-与上下文密度.md)
