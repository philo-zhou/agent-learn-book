# 附录 B · 20+ resolver 与它们注入的 agent 指令

> `scripts/resolvers/index.ts:40-105` 的 RESOLVERS registry 里每个 placeholder 对应一个 generator。它们把"agent 决策指令"注入到 skill body。本附录按用途分组列出每个 resolver **注入什么 agent 指令**、被哪些 skill 用。

## B.1 Preamble composition（自动，非 placeholder）

这些 generator 不是通过 `{{...}}` 引用，而是被 `generatePreamble` 按 tier 自动组合（[Ch 02 · 2.3](../第一部分-输入层/02-preamble-tier-与上下文密度.md#23-tier--section-组合表)）：

| Generator | 注入指令 |
|---|---|
| `generatePreambleBash` | 21 KEY 输出 stdout（[附录 A](A-preamble-KEY-字典.md)） |
| `generatePlanModeInfo` | AUQ 满足 end-of-turn 规则；plan mode safe operations |
| `generateAskUserFormat` (tier ≥ 2) | AUQ Format 契约 + 12 checkbox self-check |
| `generateWritingStyle` (tier ≥ 2) | jargon glossing、outcome framing、user impact closer |
| `generateCompletenessSection` (tier ≥ 2) | Boil the Ocean、每选项打完整度分 |
| `generateConfusionProtocol` (tier ≥ 2) | 高风险模糊时强制 STOP + 2-3 选项 |
| `generateContextRecovery` (tier ≥ 2) | 加载最近 artifacts + decision-search |
| `generateContextHealth` (tier ≥ 2) | 检测 loop → STOP + reassess |
| `generateContinuousCheckpoint` (tier ≥ 2) | CHECKPOINT_MODE=continuous 时 auto-commit WIP |
| `generateQuestionTuning` (tier ≥ 2) | AUQ 前 check preference、embed marker |
| `generateRepoModeSection` (tier ≥ 3) | solo 主动修 / collaborative 只 flag |
| `generateSearchBeforeBuildingSection` (tier ≥ 3) | 3 层认知 + eureka log |
| `generateFirstRunGuidance` | FIRST_TASK token → 一句推荐 mapping |
| `generateSpawnedSessionCheck` | SPAWNED_SESSION=true 时禁 AUQ / telemetry |
| `generateModelOverlay` | 按 `--model` overlay 加特定 model 的 behavioral patch |
| `generateVoiceDirective` | 语音输入相关的 prompt |
| `generateCompletionStatus` | 4-status 报告规范 + 遥测收尾 bash |

## B.2 Review methodology（`{{...}}` placeholder）

用于 review / plan review / ship 类 skill：

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{REVIEW_ARMY}}` | `generateReviewArmy` | Specialist dispatch + parallel subagent + JSON finding format |
| `{{REVIEW_DASHBOARD}}` | `generateReviewDashboard` | 读 `bin/gstack-review-read` + 表格 + verdict 逻辑（7 天窗口） |
| `{{PLAN_FILE_REVIEW_REPORT}}` | `generatePlanFileReviewReport` | 生成 GSTACK REVIEW REPORT markdown 表 |
| `{{EXIT_PLAN_MODE_GATE}}` | `generateExitPlanModeGate` | ExitPlanMode 前的 blocking checklist |
| `{{ANTI_SHORTCUT_CLAUSE}}` | `generateAntiShortcutClause` | ["Anti-shortcut clause"](../第四部分-Execution-Agent/10-iron-laws.md#103-iron-law-2--anti-shortcut-clauseplan-阶段的对偶) |
| `{{SPEC_REVIEW_LOOP}}` | `generateSpecReviewLoop` | 5-dimension reviewer subagent + 3 iteration + convergence guard |
| `{{BENEFITS_FROM}}` | `generateBenefitsFrom` | ["Prerequisite Skill Offer"](../第二部分-Router与编排/05-skill-之间的编排契约.md#52-编排模式-1--benefits-from前置提示) |
| `{{CROSS_REVIEW_DEDUP}}` | `generateCrossReviewDedup` | 4 类合并（多 source 一致 / 每 source 独有） |
| `{{SCOPE_DRIFT}}` | `generateScopeDrift` | 检测 SCOPE CREEP / MISSING REQUIREMENTS + 输出 3-line summary |
| `{{PLAN_COMPLETION_AUDIT_SHIP}}` | `generatePlanCompletionAuditShip` | [Ch 12](../第四部分-Execution-Agent/12-plan-completion-audit.md) 完整 audit + ship gate 逻辑 |
| `{{PLAN_COMPLETION_AUDIT_REVIEW}}` | `generatePlanCompletionAuditReview` | 同上 review 变体（不 gate） |
| `{{PLAN_VERIFICATION_EXEC}}` | `generatePlanVerificationExec` | 用 /qa-only 跑 plan 里 verification section |

## B.3 Second opinion / adversarial

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{CODEX_SECOND_OPINION}}` | `generateCodexSecondOpinion` | codex CLI 探测 + AUQ 询问 + prompt 组装 + 5min timeout + Claude subagent fallback |
| `{{ADVERSARIAL_STEP}}` | `generateAdversarialStep` | Claude adversarial subagent + Codex adversarial + P1 gate（≥200 diff） |
| `{{CODEX_PLAN_REVIEW}}` | `generateCodexPlanReview` | 独立 model plan challenge，default-on |
| `{{CODEX_DOC_REVIEW}}` | `generateCodexDocReview` | Codex 审 markdown / doc |

**Codex host 上都返回空**（`if (ctx.host === 'codex') return '';`）—— 防 codex 调 codex。

## B.4 Confidence / question tuning

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{CONFIDENCE_CALIBRATION}}` | `generateConfidenceCalibration` | 1-10 分 rubric + pre-emit gate（quote motivating line） + FP class 表 |
| `{{QUESTION_PREFERENCE_CHECK}}` | `generateQuestionPreferenceCheck` | AUQ 前 preference check |
| `{{QUESTION_LOG}}` | `generateQuestionLog` | AUQ 后 log |
| `{{INLINE_TUNE_FEEDBACK}}` | `generateInlineTuneFeedback` | 提供 `tune:` 指令 + user-origin gate |

## B.5 Learnings / decisions

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{LEARNINGS_SEARCH:query=...}}` | `generateLearningsSearch` | per-topic search，query 白名单校验 |
| `{{LEARNINGS_LOG}}` | `generateLearningsLog` | log format + 过滤规则（"5+ min saveable durable quirk"） |

## B.6 GBrain-aware（gbrain host only 生效）

其他 host 上都被 suppressedResolvers 静默为空字符串：

| Placeholder | Resolver | 注入什么（gbrain 上生效时） |
|---|---|---|
| `{{GBRAIN_CONTEXT_LOAD}}` | `generateGBrainContextLoad` | `gbrain search + get_page` 3 结果 |
| `{{GBRAIN_SAVE_RESULTS}}` | `generateGBrainSaveResults` | skill-specific slug + tag 保存到 brain |
| `{{BRAIN_PREFLIGHT}}` | `generateBrainPreflight` | plan skill 起手 gbrain doctor |
| `{{BRAIN_CACHE_REFRESH}}` | `generateBrainCacheRefresh` | brain-cache 增量更新 |
| `{{BRAIN_WRITE_BACK}}` | `generateBrainWriteBack` | plan artifact 落回 brain |

## B.7 Design methodology

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{DESIGN_METHODOLOGY}}` | `generateDesignMethodology` | 主设计方法学 |
| `{{DESIGN_HARD_RULES}}` | `generateDesignHardRules` | 反 AI-slop 硬规则 |
| `{{UX_PRINCIPLES}}` | `generateUXPrinciples` | UX 原则 |
| `{{DESIGN_OUTSIDE_VOICES}}` | `generateDesignOutsideVoices` | 引外部设计师视角 |
| `{{DESIGN_REVIEW_LITE}}` | `generateDesignReviewLite` | 轻量 design review |
| `{{DESIGN_SKETCH}}` / `{{DESIGN_SETUP}}` / `{{DESIGN_MOCKUP}}` / `{{DESIGN_SHOTGUN_LOOP}}` | design 相关 | design-shotgun / design-html 用 |
| `{{TASTE_PROFILE}}` | `generateTasteProfile` | 用户品味画像 |

## B.8 Dev-experience methodology

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{DX_FRAMEWORK}}` | `generateDxFramework` | TTHW + persona + competitive tier + magical moments 框架 |

## B.9 Testing / bootstrap

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{TEST_BOOTSTRAP}}` | `generateTestBootstrap` | 检测 test framework，缺失时提示 install |
| `{{TEST_COVERAGE_AUDIT_PLAN}}` | `generateTestCoverageAuditPlan` | plan 阶段 coverage 检查 |
| `{{TEST_COVERAGE_AUDIT_SHIP}}` | `generateTestCoverageAuditShip` | ship 阶段 coverage 硬 gate |
| `{{TEST_COVERAGE_AUDIT_REVIEW}}` | `generateTestCoverageAuditReview` | review 阶段 coverage 报告 |
| `{{TEST_FAILURE_TRIAGE}}` | `generateTestFailureTriage` | tier 4 独立 placeholder，测试失败分类逻辑 |

## B.10 Utility

| Placeholder | Resolver | 注入什么 |
|---|---|---|
| `{{SLUG_EVAL}}` / `{{SLUG_SETUP}}` | slug 相关 | 项目 slug 从 git remote 派生 |
| `{{BASE_BRANCH_DETECT}}` | `generateBaseBranchDetect` | main / master / 自定义 base 探测 |
| `{{BROWSE_SETUP}}` | `generateBrowseSetup` | 用 browse daemon 前的路径解析 |
| `{{QA_METHODOLOGY}}` | `generateQAMethodology` | QA 6 phase 方法学 |
| `{{CO_AUTHOR_TRAILER}}` | `generateCoAuthorTrailer` | git commit 尾部 co-author 行（每 host 不同） |
| `{{CHANGELOG_WORKFLOW}}` | `generateChangelogWorkflow` | ship 生成 CHANGELOG 的规则 |
| `{{DEPLOY_BOOTSTRAP}}` | `generateDeployBootstrap` | deploy config 检测 |
| `{{INVOKE_SKILL:name}}` | `generateInvokeSkill` | [Ch 05 · 5.3](../第二部分-Router与编排/05-skill-之间的编排契约.md#53-编排模式-2--invoke_skillxxx内联加载) 内联加载 skill body |
| `{{SECTION:id}}` / `{{SECTION_INDEX:skill}}` | `SECTION` / `SECTION_INDEX` | 加载 sections/*.md.tmpl 分体 |
| `{{MAKE_PDF_SETUP}}` | `generateMakePdfSetup` | make-pdf 特有 setup |
| `{{TASKS_SECTION_EMIT}}` / `{{TASKS_SECTION_AGGREGATE}}` | tasks-section | 任务清单结构 |
| `{{REDACT_TAXONOMY_TABLE}}` / `{{REDACT_INVOCATION_BLOCK}}` | redact-doc | 敏感字段 redaction |
| `{{BIN_DIR}}` | (inline lambda) | `ctx.paths.binDir` |

## B.11 一个 resolver 有 3 种 host 行为

绝大多数 resolver 有分岔：

- **正常渲染**：默认 host（Claude）
- **静默为空**：某些 host `hostConfig.suppressedResolvers` 里列了它
- **变体渲染**：resolver 内部 `if (ctx.host === 'codex') { ... }` 定制

这是 gstack agent 逻辑"生成时决定 skill 什么形态"的机制。作为 skill 作者，只需要写 `{{PLACEHOLDER}}`，resolver 自己按 host 分岔。

## B.12 Resolver 的 threat model

`generateLearningsSearch`（`scripts/resolvers/learnings.ts:16-21`）里有一个明确的 threat model 声明：

> Static template queries hand-written in gstack are safe, but the resolver API must
> defend against future contributors writing dangerous values.

**resolver 是 defense-in-depth 层**：不假设 skill 作者永远写正确 query，通过白名单校验拦异常。这是 gstack 把 agent 逻辑做成 **可扩展但可审计** 的关键。

[← A · Preamble KEY 字典](A-preamble-KEY-字典.md) | [下一篇：C · Agent 决策术语表 →](C-agent-决策术语表.md)
