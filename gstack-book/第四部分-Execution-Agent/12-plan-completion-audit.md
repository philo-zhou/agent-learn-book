# 12 · Plan completion audit：agent 自查交付

> 一个 skill 说"我做完了"和"agent 真做完了"是两码事。gstack 让 execution agent 在 ship / review 里跑一个 **自查审计**：读 plan file 抽出每个 actionable item、把每个 item 归类、和 diff 比对、生成 DONE / PARTIAL / NOT DONE / CHANGED / UNVERIFIABLE 表格、在 gate 里为 NOT DONE / UNVERIFIABLE 各自触发不同的用户确认。这一章拆这个 audit 的 5 步 + 一个 v1.58.4 修的 bug（VAS-449）。

## 12.1 一个诚信问题

LLM 说"任务完成"最常见的偏差：

- **实际只做 happy path**：说"加了 UserService"其实 controller 没改
- **实际做了别的**：说"用 Redis"其实用了 Sidekiq
- **假定外部状态**：说"更新 Supabase RLS" 但根本没登录 Supabase
- **在别的 repo**：说"docs/dashboard.md 更新了" 但那个文件在 sibling repo，diff 里看不到

Ship 让 agent 直接说 "done" 不查 → 这些偏差全溜过去。gstack 用 plan completion audit 强制 **agent 自查 + 用户确认**。

## 12.2 什么是 plan completion audit

resolver 是 `generatePlanCompletionAudit{Ship,Review}`（`scripts/resolvers/review.ts:1113-1119`）：

```ts
// from scripts/resolvers/review.ts:1113-1119
export function generatePlanCompletionAuditShip(_ctx: TemplateContext): string {
  return generatePlanCompletionAuditInner('ship');
}

export function generatePlanCompletionAuditReview(_ctx: TemplateContext): string {
  return generatePlanCompletionAuditInner('review');
}
```

Ship 和 review 两个模式共享 `generatePlanCompletionAuditInner`，末尾 gate 逻辑不同：ship 的 gate 会阻断发布，review 的 gate 只信息化输出。

## 12.3 五步流程

audit 分 5 步（`review.ts:876-982`）：

### 12.3.1 Plan file discovery

先找 plan file（`review.ts:840-869`）。三级 fallback：

```text
# from scripts/resolvers/review.ts:842-865 (摘)
1. Conversation context (primary): Check if there is an active plan file in this
   conversation. The host agent's system messages include plan file paths when in plan mode.

2. Content-based search (fallback):
   ```bash
   for PLAN_DIR in "$HOME/.gstack/projects/$_PLAN_SLUG" "$HOME/.claude/plans" "$HOME/.codex/plans" ".gstack/plans"; do
     [ -d "$PLAN_DIR" ] || continue
     PLAN=$(ls -t "$PLAN_DIR"/*.md 2>/dev/null | xargs grep -l "$BRANCH" 2>/dev/null | head -1)
     ...
   done

3. Validation: If found via content search, read first 20 lines and verify relevance
   to current branch. If different project, treat as "no plan file found."
```

**优先用 host 提供的 plan file 路径**（plan mode 下 Claude Code 在 system message 里给），退化到磁盘搜。搜到了还要**验证内容相关**——不能拿别的 branch 的 plan 来 audit 这个 branch。

**没找到 plan file → 直接跳过 audit**（`review.ts:867-869`）：

```text
No plan file found → skip with "No plan file detected — skipping."
```

不假设、不 gate、不 block。这是"缺输入 → 优雅退出"的默认。

### 12.3.2 Actionable Item Extraction

从 plan file 抽 items（`review.ts:883-908`）：

```text
# from scripts/resolvers/review.ts:886-901 (摘)
Extract every actionable item — anything that describes work to be done. Look for:

- Checkbox items: `- [ ] ...` or `- [x] ...`
- Numbered steps under implementation headings
- Imperative statements: "Add X to Y", "Create a Z service"
- File-level specifications: "New file: path/to/file.ts"
- Test requirements: "Test that X", "Verify Z"
- Data model changes: "Add column X to table Y"

**Ignore:**
- Context/Background sections
- Questions and open items (marked with ?, "TBD", "TODO: decide")
- Review report sections (`## GSTACK REVIEW REPORT`)
- Explicitly deferred items ("Future:", "Out of scope:", "P2:", "P3:")
- CEO Review Decisions sections
```

**"actionable" 明确定义**：可以完成的具体动作。**"ignored" 也明确列举**：deferred / open questions / review section 都不 count。这是让 audit 结果不飘的抓手。

**cap 50 items**（`review.ts:902`）—— 太长的 plan 只审 top 50，剩下让用户在 plan file 自查。

### 12.3.3 Verification Mode（v1.58.4 修的 bug）

这是最有意思的一步。`review.ts:911-931`：

```text
# from scripts/resolvers/review.ts:914-919
Before judging completion, classify HOW each item can be verified. The diff alone
cannot prove every kind of work. Items outside the current repo or system are
structurally invisible to `git diff`.

- **DIFF-VERIFIABLE** — A code change in this repo would manifest in `git diff`.
- **CROSS-REPO** — Item names a file or change in a sibling repo. The current diff CANNOT prove this.
- **EXTERNAL-STATE** — Item names state in an external system (Supabase, Cloudflare DNS, ...).
- **CONTENT-SHAPE** — Item requires a file to follow a specific convention.
```

**每个 item 归类到 4 种可验证性**。这是 v1.58.4 加的（audit CHANGELOG 有）——**audit 之前只会 diff-verify，跨 repo 或外部状态的 item 就报"DONE"**（因为 diff 没 negative evidence），造成假阳性。

Verification dispatch（`review.ts:923-926`）明确规定每种类型怎么验：

```text
# from scripts/resolvers/review.ts:923-926
- DIFF-VERIFIABLE → cross-reference against diff.
- CROSS-REPO → if sibling repo reachable on disk, run `[ -f <path> ]`. File exists → DONE. Missing → NOT DONE. Unreachable → UNVERIFIABLE.
- EXTERNAL-STATE → UNVERIFIABLE. Cite the specific check the user must perform.
- CONTENT-SHAPE in another repo → if reachable, run project-detected validator; else UNVERIFIABLE.
```

**agent 主动尝试用磁盘检查而非 diff**：sibling repo 在 `~/Development/<repo>/` 或 `~/code/<repo>/` 就 `[ -f <path> ]` 一下。**能磁盘验证就不 UNVERIFIABLE**。

### 12.3.4 Cross-Reference + 5 分类

跑完 verification 判定，item 落到 5 状态之一（`review.ts:940-946`）：

```text
# from scripts/resolvers/review.ts:940-946
- **DONE** — Clear evidence the item shipped.
- **PARTIAL** — Some work exists but incomplete.
- **NOT DONE** — Verification ran and produced negative evidence.
- **CHANGED** — Implemented differently than plan described, but same goal achieved.
- **UNVERIFIABLE** — Cannot prove or disprove. Cite the manual check.
```

关键规则（`review.ts:948-950`）：

```text
# from scripts/resolvers/review.ts:948-950
**Be conservative with DONE** — require clear evidence.
**Be generous with CHANGED** — if the goal is met by different means, that counts.
**Be honest with UNVERIFIABLE** — better to surface 5 items to confirm than silently classify DONE.
```

**保守 DONE / 慷慨 CHANGED / 诚实 UNVERIFIABLE** —— 一句话概括 agent 该有的判定 posture。

### 12.3.5 Honesty rule

`review.ts:932`：

```text
# from scripts/resolvers/review.ts:932
Do NOT classify an item as DONE just because related code shipped. Code that *handles*
a deliverable is not the deliverable. Shipping a markdown-extraction library is not
the same as shipping the markdown file. When in doubt between DONE and UNVERIFIABLE,
prefer UNVERIFIABLE — better to surface a confirmation prompt than silently miss a deliverable.
```

**"处理 deliverable 的代码 ≠ deliverable 本身"**。这句是防"我加了 markdown 解析库 → done"的 anti-pattern。gstack 认为**中间产物不算交付**，最终 artifact 存在磁盘上或用户能验证的外部才算。

## 12.4 Ship gate 逻辑：优先级串联

Ship 里 audit 后有硬 gate（`review.ts:989-1027`），按优先级 4 段：

### 12.4.1 P1: NOT DONE 硬 gate

```text
# from scripts/resolvers/review.ts:993-1001
1. **Any NOT DONE items** (highest priority — known missing work). Use AskUserQuestion:
   - Options:
     A) Stop — implement the missing items before shipping
     B) Ship anyway — defer these to a follow-up (will create P1 TODOs in Step 5.5)
     C) These items were intentionally dropped — remove from scope
```

**NOT DONE 三选一**：修、defer 到 P1 TODO、明确 dropped。**没有"忽略"选项** —— 要么解决要么在 PR body 明说"故意不做"。

### 12.4.2 P2: UNVERIFIABLE 逐项确认（VAS-449 修复）

`review.ts:1003-1019`：

```text
# from scripts/resolvers/review.ts:1005-1019 (摘)
**Per-item confirmation is mandatory.** Do NOT use a single AskUserQuestion to
blanket-confirm all UNVERIFIABLE items. Blanket confirmation is the failure mode
that surfaced in VAS-449 (user clicks A without opening any file). Instead:

- Loop through UNVERIFIABLE items one at a time.
- For each item, use AskUserQuestion with the item's *specific* manual check.
- Options per item:
  Y) Confirmed done — cite what you verified
  N) Not done — block ship; treat as NOT DONE and re-enter the priority-1 gate
  D) Intentionally dropped — note in PR body

**Cap.** If there are more than 5 UNVERIFIABLE items, present as a numbered list
and ask whether the user wants to (1) confirm each individually, (2) stop and reduce
scope, or (3) explicitly accept blanket-confirmation with the warning that this is
the VAS-449 failure shape.
```

**VAS-449 是历史 bug**：ship 曾用一个 AUQ blanket 问"这些外部状态都验过了吗"→ 用户按 A → 什么都没验但 ship 通过。修补：**逐项问**、每项都要给"具体验什么"。

**5 项以上再上一层 meta gate**：让用户选是逐项 vs 停 vs 明确接受 blanket（承担 VAS-449 风险）。**不移除 blanket 选项，但让选它必须是明确、有风险认知的选择**。这是 gstack 处理"用户主动 opt out safety" 的 pattern。

### 12.4.3 P3-4: PARTIAL / all DONE

```text
# from scripts/resolvers/review.ts:1021-1023
3. Only PARTIAL items (no NOT DONE, no UNVERIFIABLE): Continue with a note in PR body. Not blocking.
4. All DONE or CHANGED: Pass. "Plan completion: PASS — all items addressed."
```

**PARTIAL 不 block ship**，只写进 PR body。因为 partial 通常是"边界处理不全"，用户能自己决定要不要发。

## 12.5 学习 loop

audit 里发现 gap 会 log learning（`review.ts:1064-1077`）：

```text
# from scripts/resolvers/review.ts:1069-1077
~/.claude/skills/gstack/bin/gstack-learnings-log '{
  "type": "pitfall",
  "key": "plan-delivery-gap-KEBAB_SUMMARY",
  "insight": "Planned X but delivered Y because Z",
  "confidence": 8,
  "source": "observed",
  "files": ["PLAN_FILE_PATH"]
}'
```

**"planned X but delivered Y because Z" 是可复用 pattern**。Log 到 learnings.jsonl，未来 audit 会通过 learnings-search 拿回来做 cross-check。

关键约束（`review.ts:1081`）：

```text
# from scripts/resolvers/review.ts:1081
Do NOT log learnings from commit-message-derived or TODOS.md-derived discrepancies.
These are informational in the review output but too noisy for durable memory.
```

**只记 plan-file-derived gap**，不记 commit / TODOS 推的 gap。因为后者太 noisy —— commit message 和 diff 差一点是常态，不值得作为长期学习。这是 gstack "只记高信噪比 signal 到 learnings" 的规则。

## 12.6 一张 Mermaid：audit 的决策树

```mermaid
flowchart TB
    START[/ship 或 /review 到 audit step/]
    START --> DISC[Plan file discovery<br/>1 conversation → 2 disk search → 3 validate]
    DISC -->|无| SKIP[skip with "No plan file"]
    DISC -->|有| EXTRACT[Extract actionable items]
    EXTRACT --> CAP{items ≥ 50?}
    CAP -->|yes| TOP50[取 top 50 + note]
    CAP -->|no| ALL

    TOP50 --> CLASS[Verification Mode:<br/>DIFF-VERIFIABLE / CROSS-REPO / EXTERNAL-STATE / CONTENT-SHAPE]
    ALL --> CLASS

    CLASS --> XREF[Cross-reference:<br/>DONE / PARTIAL / NOT DONE / CHANGED / UNVERIFIABLE]
    XREF --> HONESTY[Honesty rule<br/>doubt → UNVERIFIABLE]

    HONESTY -->|Ship mode| SG{gate 优先级}
    HONESTY -->|Review mode| RG[输出信息不 gate]

    SG -->|1 NOT DONE| ND[AUQ ABC:<br/>A stop / B P1 TODO / C dropped]
    SG -->|2 UNVERIFIABLE| UV[逐项 AUQ Y/N/D<br/>≥5 项加 meta gate]
    SG -->|3 PARTIAL only| PART[记 PR body 不 block]
    SG -->|4 all done/changed| PASS[PASS 继续]

    ND --> LOG[log learning<br/>plan-delivery-gap-*]
    UV --> LOG

    style ND fill:#fdd
    style PASS fill:#dfd
    style LOG fill:#ffe
```

## 12.7 章末导航

[← 11 ship 决策边界](11-ship-决策边界.md) | [下一章：13 · QA fix-loop + Confidence + Question tuning →](13-qa-fix-loop-与-confidence.md)
