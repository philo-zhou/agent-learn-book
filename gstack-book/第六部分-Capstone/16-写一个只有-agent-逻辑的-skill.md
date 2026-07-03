# 16 · 写一个只有 agent 逻辑的 skill

> 前 15 章拆完 gstack agent 逻辑的每一个层。这一章反过来 —— 用一个具体新 skill 把学到的每一层用一遍。**不讲怎么 build、怎么 gen-skill-docs、怎么发布**（那是基础设施，不在本书范围）。**只讲这个 skill 的 SKILL.md.tmpl 里 agent 决策逻辑怎么写**。

## 16.1 一个具体假想

假设我们要写 `/dependency-audit` —— 检查项目依赖有没有 known CVE 或严重过期。

它是一个中等复杂度的 skill：不是 tier 1（不是 router 那么轻）、不是 tier 4（不 push 不 commit）。它读依赖文件、跑 audit CLI、找 finding、让用户拍板 upgrade。

## 16.2 决策 1：Tier

从 [Ch 02 · 2.4](../第一部分-输入层/02-preamble-tier-与上下文密度.md#24-skill-按-tier-分档) 的 tier 分档判断：

- 不路由 → 不是 tier 1
- 要用 AskUserQuestion 让用户挑 upgrade 目标 → 需要 tier 2+ 的 AUQ Format
- 要判断 completeness（"只查 direct deps 还是 transitive"）→ 需要 tier 2 的 completeness section
- 不做架构决策 → 不需要 tier 3 的 repo mode
- 不 push、不 commit → 不是 tier 4

**tier 2**。

对应 frontmatter：

```yaml
---
name: dependency-audit
preamble-tier: 2
version: 0.1.0
description: |
  Audit project dependencies for known CVEs and severely outdated versions. Reads
  package.json / requirements.txt / Cargo.toml / Gemfile.lock, runs the ecosystem's
  audit CLI, presents findings with confidence scores, and offers upgrade paths.
  Use when asked to "audit dependencies", "check CVEs", "are my deps up to date". (gstack)
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
  - WebSearch
triggers:
  - audit dependencies
  - check for cves
  - dependency audit
---
```

**allowed-tools 明确不带 Edit / Write**：这个 skill 不改代码，只报告。想升级依赖是另一件事（用户后续手动或另一个 skill）。

## 16.3 决策 2：Preamble 组合（自动）

写 `preamble-tier: 2` 意味着自动继承 [Ch 02 · 2.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#23-tier--section-组合表) 组合表里 tier 2 的所有段：

- preamble bash（21 KEY 输出）
- Plan Mode Safe Ops
- Upgrade check / Telemetry / Proactive prompt / First-run guidance
- **AUQ Format** (tier 2+)
- **Context recovery** (tier 2+)
- **Completeness principle** (tier 2+)
- **Confusion protocol** (tier 2+)
- **Continuous checkpoint** (tier 2+)
- **Context health** (tier 2+)
- **Question tuning** (tier 2+)
- Completion status protocol

**skill body 不需要显式引用这些**。preamble.ts 主循环自动组合。skill body 只需要 `{{PREAMBLE}}` placeholder。

## 16.4 决策 3：Body 结构

body 一个典型分层：

```markdown
{{PREAMBLE}}

# /dependency-audit — Dependency Vulnerability Audit

You are running the `/dependency-audit` workflow. Read the project's dependency files,
run the ecosystem's audit CLI, present findings with confidence, and offer upgrade paths.

**Only stop for:**
- No dependency file detected (nothing to audit — abort with a friendly note)
- Audit CLI unavailable and no fallback (BLOCKED with install hint)
- HIGH-severity CVE in a direct dependency (must ask before continuing)

**Never stop for:**
- Transitive-only findings (list in report, don't gate)
- Dev dependency warnings (list, don't gate)

## Step 0: Detect ecosystem

...

## Step 1: Run audit

...

## Step 2: Score findings

For each finding, score confidence 1-10. Show ≥7 in main report; suppress <5.

...

## Step 3: Offer upgrade path (if HIGH-severity found)

Use AskUserQuestion (D1). Follow AUQ Format from preamble.

...
```

关键的 3 个"agent 逻辑"设计点：

### 16.4.1 显式 Only / Never stop（[Ch 11](../第四部分-Execution-Agent/11-ship-决策边界.md)）

即使不是 tier 4 skill，用 `Only stop for` / `Never stop for` 双清单让边界清晰。**这不是 ship 特权，是好 skill 的通用 pattern**。

### 16.4.2 Confidence 打分（[Ch 13 · 13.2](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#132-confidence-calibration--finding-的-1-10-分)）

每个 finding 打 1-10 分。需要引用 `{{CONFIDENCE_CALIBRATION}}` resolver：

```markdown
{{CONFIDENCE_CALIBRATION}}

## Step 2: Score findings

For each finding output line:
`[SEVERITY] (confidence: N/10) <package>@<version> — <CVE-ID or issue>`
```

resolver 自动注入 [Ch 13 · 13.2.1](../第四部分-Execution-Agent/13-qa-fix-loop-与-confidence.md#1321-pre-emit-verification-gate-bug-1539) 的 pre-emit verification gate —— 强制 quote motivating line。适合 CVE audit 场景：**quote 出 CVE 具体 payload 才算高置信**。

### 16.4.3 AUQ Format 遵循（[Ch 06 · 6.6](../第三部分-Plan-mode-Agent/06-plan-mode-handshake.md#66-结构化-auq-的自检)）

Step 3 里用户面临"upgrade 到哪个版本"决策。preamble tier 2 的 AUQ Format 已经在 body 里，Step 3 直接按 D1 header + ELI10 + Recommendation + Completeness/kind-note + ✅❌ 的模板写 AUQ。

**agent 逻辑**：Step 3 的 `RECOMMENDATION` 应该基于 `Boil the Ocean`（[Ch 10 · 10.4](../第四部分-Execution-Agent/10-iron-laws.md#104-iron-law-3--boil-the-ocean完整度默认高)）—— 推荐"完整升级到 latest"（10/10 completeness）而非"升到最小 patched 版本"（7/10）。用户看到 completeness 分对比，选 shortcut 时明白代价。

## 16.5 决策 4：不需要 review army / autoplan / codex 的部分

`/dependency-audit` 是 execution 类只读 skill。它 **不是** review army 成员、**不 orchestrate** 别的 skill、**不需要** codex second opinion（依赖漏洞的 authoritative source 是 CVE database，不是另一个 LLM）。

所以 body 不引用：

- `{{REVIEW_ARMY}}`
- `{{CODEX_SECOND_OPINION}}` / `{{ADVERSARIAL_STEP}}` / `{{CODEX_PLAN_REVIEW}}`
- `{{PLAN_COMPLETION_AUDIT_*}}`
- `{{BENEFITS_FROM}}` / `benefits-from` frontmatter
- `{{INVOKE_SKILL}}`

**这不是 gap，是判断**。这些机制是给 **plan-mode 或 review skill** 的，audit 类 skill 不该硬套。

## 16.6 决策 5：Learnings 集成（[Ch 14 · 14.4](../第五部分-记忆与安全/14-learnings-loop-与-gbrain.md#144-layer-3per-topic-search--具体-hypothesis-加载)）

Preamble 已经有 broad-topic learnings pull（if `LEARNINGS > 5`）。body 里加 per-topic 二次 pull —— 找到具体 CVE 后 refresh learnings：

```markdown
## Step 2.5: Refresh learnings for the CVE

Once a HIGH finding is identified, re-pull learnings keyed to the vulnerable package.

Pick ONE keyword: the package name (kebab-case), no version. Example: `express`, `axios`,
`lodash`. Alphanumeric or hyphen only.

{{LEARNINGS_SEARCH:query=cve dependency vulnerability upgrade}}

If any learnings come back, name which one applies to the upgrade decision.
```

**resolver 校验 query**：`{{LEARNINGS_SEARCH:query=...}}` 里 query 必须匹配 `/^[A-Za-z0-9 _-]+$/`（`scripts/resolvers/learnings.ts:21`）。这不是运行时防御，是 build 时静态校验。

## 16.7 决策 6：Completion Status（[Ch 10 · 10.5.1](../第四部分-Execution-Agent/10-iron-laws.md#1051-escalation-is-legit)）

skill 结束时按 4-status 报告：

- **DONE** —— audit 跑完，所有 finding presented
- **DONE_WITH_CONCERNS** —— 有 UNVERIFIABLE finding（CVE database 不可达）
- **BLOCKED** —— 依赖文件不存在 / audit CLI 完全不可用
- **NEEDS_CONTEXT** —— 项目用了非标准 dep manager，需要用户澄清

**BLOCKED / NEEDS_CONTEXT 是合法产出**。skill 不必须 DONE 才算成功。

## 16.8 决策 7：需要 hook 吗

`/dependency-audit` 不改文件、不跑 destructive 命令。**不需要挂 careful / freeze hook**。

对比 `/investigate`—— 它挂 freeze hook（[Ch 15 · 15.6](../第五部分-记忆与安全/15-safety-boundary-与-hook.md#156-investigate-主动接入-freeze--agent-skill-的横向-hook-集成)）—— 因为 debug 会改代码。

**agent 逻辑判断**：不改文件的 skill 不需要 file-hook；不跑 bash 的 skill 不需要 bash-hook。**不多加防御** —— hooks 有性能代价（每次 tool call 跑 script）。

## 16.9 决策 8：Sensitive 吗

`/dependency-audit` 不 push、不 commit、不 delete。**不是 sensitive**。

对比 `/ship`（`sensitive: true`）—— push + PR。sensitive 让 Factory host 加 `disable-model-invocation: true`（`hosts/factory.ts:22-24`），防止别的 agent 无意 invoke。

**agent 逻辑判断**：只读 skill 不 sensitive。有 side effect 才 sensitive。

## 16.10 完整 SKILL.md.tmpl 骨架

汇总所有决策：

```markdown
---
name: dependency-audit
preamble-tier: 2
version: 0.1.0
description: |
  Audit project dependencies for known CVEs and severely outdated versions. Reads
  package.json / requirements.txt / Cargo.toml / Gemfile.lock, runs the ecosystem's
  audit CLI, presents findings with confidence scores, and offers upgrade paths.
  Use when asked to "audit dependencies", "check CVEs", "are my deps up to date". (gstack)
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
  - WebSearch
triggers:
  - audit dependencies
  - check for cves
  - dependency audit
---

{{PREAMBLE}}

{{CONFIDENCE_CALIBRATION}}

# /dependency-audit — Dependency Vulnerability Audit

**Only stop for:**
- No dependency file detected (abort friendly)
- Audit CLI unavailable + no fallback (BLOCKED)
- HIGH-severity CVE in direct dependency (AUQ before offering upgrade path)

**Never stop for:**
- Transitive-only findings
- Dev dependency warnings
- Outdated < 1 major version

## Step 0: Detect ecosystem

Look for `package.json` / `requirements.txt` / `pyproject.toml` / `Cargo.toml` /
`Gemfile.lock`. Set `$ECOSYSTEM` accordingly. If none found, output DONE with note
"No dependency manifest — nothing to audit."

## Step 1: Run audit CLI

Ecosystem-specific:
- node → `npm audit --json` or `pnpm audit --json`
- python → `pip-audit --format json`
- rust → `cargo audit --json`
- ruby → `bundle audit check`

If CLI unavailable, output BLOCKED with install hint.

## Step 2: Score findings

For each finding: `[SEVERITY] (confidence: N/10) <package>@<version> — <CVE-ID>`.
Follow the pre-emit gate above: quote the CVE payload before promoting to confidence 7+.

## Step 2.5: Refresh learnings

{{LEARNINGS_SEARCH:query=cve dependency vulnerability upgrade}}

## Step 3: Report + upgrade path

If any HIGH finding in a direct dep, use AskUserQuestion (D1) with 3 options:

D1 — Upgrade path for {package}
Project: {name} on {branch}
ELI10: {package} version X has CVE-YYYY-ZZZZ. Upgrading to Y closes it. Y is a major
version bump — the API might change slightly.
Stakes if we pick wrong: staying on X leaves the vulnerability open.
Recommendation: A because the fix is one major bump and the changelog shows minimal breaking changes.
Completeness: A=10/10, B=7/10, C=3/10
Pros / cons:
A) Upgrade to Y (recommended)
  ✅ Closes CVE-YYYY-ZZZZ, gets 3 other minor fixes for free
  ❌ May require adjusting import paths in 2 files
B) Upgrade to nearest patched (X.Y.Z2)
  ✅ Zero API changes
  ❌ Skips 3 unrelated fixes; still on end-of-life major
C) Defer with issue tracker note
  ✅ No upgrade cost now
  ❌ CVE remains open in prod
Net: A closes the vuln fully; B is a quick patch; C is delay with visibility.

## Step 4: Report structure

Output:
- Summary: N high, M medium, K low
- Direct-dependency findings (with confidence ≥7)
- Transitive findings (informational)
- Upgrade decisions taken (A/B/C from Step 3)

Then follow Completion Status Protocol from preamble.
```

## 16.11 什么被这个例子覆盖了

回顾一下这个 skill 用到的 agent 逻辑层：

| Ch | 层 | 这个 skill 里的落点 |
|---|---|---|
| 01 | Preamble state feed | 通过 `{{PREAMBLE}}` 自动获取 21 KEY |
| 02 | preamble-tier | 选 tier 2 |
| 03 | Session kind | preamble 自动分岔 (spawned auto-choose) |
| 04 | Router dispatch | 通过 triggers 让 router match |
| 05 | 编排 | 不用（独立 skill） |
| 06 | Plan-mode handshake | AUQ 满足 end-of-turn（tier 2 preamble 提供） |
| 07 | Review army | 不用 |
| 08 | Autoplan | 不用 |
| 09 | Second opinion | 不用（CVE 权威源不是 LLM） |
| 10 | Iron Laws | Boil the Ocean 通过 completeness 分注入 AUQ 选项 |
| 11 | Ship 决策边界 | Only/Never stop 双清单 pattern |
| 12 | Plan completion audit | 不用 |
| 13 | Confidence | `{{CONFIDENCE_CALIBRATION}}` resolver 自动注入 |
| 14 | Learnings | preamble broad + Step 2.5 per-topic |
| 15 | Safety hook | 不需要（只读 skill） |

**所有覆盖都是"选择性"**：需要就用、不需要不用。gstack 的 agent 逻辑是**可组合的层**，不是必须走完的 pipeline。

## 16.12 完成一个 gstack-style skill 的心智

回过头看，写一个 gstack-style skill 的 agent 逻辑基本 5 步：

1. **判 tier**：只读简单 skill = tier 1 或 2；plan-mode = tier 3；effect-bearing = tier 4
2. **写 frontmatter**：name / preamble-tier / description / allowed-tools / triggers / (sensitive if effect)
3. **body 顶部 `{{PREAMBLE}}` + tier 2+ 时可加 `{{CONFIDENCE_CALIBRATION}}`**
4. **写 Only stop / Never stop 双清单** —— 显式定义决策边界
5. **每个 step 遵循 tier 提供的 preamble 段**（AUQ Format、Iron Laws、Completion Status）

不需要重新发明决策方法。gstack 已经把方法学做成 preamble section + resolver 注入。skill 作者只需要 **组合** 已有层 + 写自家业务 step。

**这是 gstack agent 逻辑的核心**：**layered composition, not from-scratch design**。

## 16.13 结语

Agent 逻辑不是 prompt engineering trick。它是一整套**决策协议**：

- 什么状态喂给 LLM 让它决策（Preamble）
- 什么样的分岔（tier / SESSION_KIND）
- 什么时候必须问用户（AUQ Format + Iron Laws）
- 什么时候可以替用户决定（autoplan 6 原则）
- 找出问题时哪些是高置信（confidence）
- Effect 前哪些必须停（ship Only stop）
- 交付后怎么自查（plan completion audit）
- 哪些经验要留下（learnings）
- 什么绝不能做（safety hooks）

gstack 把这些全用 markdown + resolver + hook 编成一个可组合的系统。理解这套系统 = 理解一个"人类工程团队工作流" 怎么被 encode 到 LLM 决策空间里。

## 16.14 章末导航 —— 全书结束

[← 15 safety boundary 与 hook](../第五部分-记忆与安全/15-safety-boundary-与-hook.md) | [附录 A · Preamble KEY 字典 →](../附录/A-preamble-KEY-字典.md)

---

[← 回到全书目录](../README.md)
