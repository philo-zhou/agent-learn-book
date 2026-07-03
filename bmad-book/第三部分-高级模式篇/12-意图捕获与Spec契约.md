# 12. 意图捕获与 Spec 契约

## 一句话定位

四阶段流水线(第 13 章)的第一口料,不是写好的需求文档,而是一团模糊的人类意图。本章拆解 BMAD 如何用三个捕获技能——brainstorming(技术库发散)、advanced-elicitation(引导式追问)、forge-idea(角色压力测试)——把意图搅动、压紧,最终交给 bmad-spec 蒸馏成一份锁 WHAT 不锁 HOW 的 SPEC.md 机器契约,为下游规划供料。

## 心智模型

意图捕获的难点不在"收集",而在"蒸馏前的搅动"和"蒸馏时的克制"。

```mermaid
flowchart LR
  Intent["模糊意图<br/>idea / PRD / transcript / email"]

  subgraph Capture["意图捕获三件套"]
    direction TB
    BS["brainstorming<br/>brain.py 技术库<br/>发散:越多越好"]
    EL["advanced-elicitation<br/>methods.csv<br/>深化:结构化追问"]
    FG["forge-idea<br/>persona 对打<br/>压测:硬化或证伪"]
  end

  ForgeLog[("forged-idea.md<br/>+ .memlog.md")]

  subgraph Spec["bmad-spec 蒸馏"]
    direction TB
    SpecLog[(".memlog.md<br/>append-only 唯一事实源")]
    SpecMD["SPEC.md<br/>五字段 kernel + companions<br/>每次派生,不可手改")]
  end

  Pipeline["四阶段流水线<br/>analysis → plan → solutioning → impl<br/>第 13 章"]

  Intent --> BS
  Intent --> EL
  Intent --> FG
  BS -->|任意产物作输入| Spec
  EL -->|对任一段落深化| Spec
  FG --> ForgeLog
  ForgeLog -->|forged-idea.md 喂入| Spec
  SpecLog -->|"derive 每次重渲染"| SpecMD
  SpecMD --> Pipeline
```

类比一座矿山。brainstorming 是探矿——用各种技术(地质、化学、玄学)尽可能多地挖出矿脉,越多越好,先不挑。advanced-elicitation 是对某块矿石做光谱分析——用不同方法(苏格拉底、第一性原理、预演失败)追问它到底是不是真金。forge-idea 是把矿石扔进熔炉,派攻击方和辩护方对打,扛住的硬化、扛不住的早死早超生。bmad-spec 是把存活下来的矿石炼成一块标准锭——五字段 kernel 锁定"要什么"和"怎样算成",但绝不规定"怎么炼"。

四个技能共享一个底层机制:memlog(append-only 记忆)。发散和压测的一切产物先落进 memlog,而 SPEC.md 不是手写的——它每次从 memlog 派生。这意味着意图捕获和契约生成之间永远隔着一层"日志即事实源"的间接:你可以反复追加 memlog,但改不了已派生的契约,除非重新派生。

## 源码走读

### 12.1 brainstorming:把技术库变成按需服务

brainstorming 的核心矛盾:一个发散式头脑风暴技能需要大量"创意技术"(SCAMPER、Six Hats、逆向头脑风暴……),但把它们全塞进上下文会立刻耗光 token,且大部分本次用不上。BMAD 的解法是——技术库是数据(CSV),不是提示词;一个 Python 脚本按需服务,只把当前需要的技术送进上下文。

brain.py 的 docstring 开宗明义:

> `src/core-skills/bmad-brainstorming/scripts/brain.py:5`
>
> ```python
> """Serve the brainstorming technique library without loading it all into context.
>
> The library is a CSV (category, technique_name, description, detail). `description`
> is a short gist — enough to propose and run most techniques. `detail` is optional:
> a path (relative to the CSV's directory) to a fuller instruction file for a technique
> complex enough to warrant one. Only `show` resolves detail files, and only for the
> technique asked for — so the heavy material never enters context until it is run.
> ```

技术库每一行分两层:`description` 是一句话 gist,足够 LLM 提议和运行大多数技术;`detail` 是可选的更完整指令文件路径,只有 `show` 命令在被点名时才解析。这是一个经典的"两级缓存"——摘要常驻可用,详情惰性加载,重材料直到真正要跑才进上下文。

brain-methods.csv 里有约 108 条技术,横跨 13 个类别:

> `src/core-skills/bmad-brainstorming/assets/brain-methods.csv:38`
>
> ```csv
> structured,SCAMPER Method,"Run your idea through seven lenses: Substitute, Combine, Adapt, Modify, Put-to-other-use, Eliminate, Reverse",,classic,feature|novel,either
> structured,Six Thinking Hats,"Examine the problem six ways one at a time: facts, feelings, benefits, risks, new ideas, process",,classic,strategy|diagnosis|planning|personal,either
> ```

字段不止基础四列——`provenance`(classic/signature/playful)驱动"Proven & Professional"引导组,`good_for`(goal 标签)驱动浏览页的目标筛选。这些是数据驱动的展示逻辑:换标签不用改代码。

brain.py 用命令分发表把"我要看什么"翻译成"只送什么进来":

> `src/core-skills/bmad-brainstorming/scripts/brain.py:699`
>
> ```python
> if args.cmd == "categories":
>     print(fmt_categories(categories(rows), args.json))
> elif args.cmd == "list":
>     if not args.category and not args.all:
>         print(
>             "error: `list` needs --category (one or more) — or --all to dump the whole "
>             "catalog on purpose. Use `categories` for the cheap map, or `random` to draw blind.",
>             file=sys.stderr,
>         )
>         return 2
>     print(fmt_list(filter_cats(rows, args.category), args.json))
> ```

`list` 命令在既没有 `--category` 也没有 `--all` 时直接拒绝运行——这不是疏忽,而是刻意的防呆:把整个目录一次性灌进上下文是 footgun,所以"看全部"必须是一个明确的、故意的选择(`--all`)。`categories` 是便宜的入口:只返回类别名加计数,让 LLM 先看地图再决定钻进哪个类别。

SKILL.md 本身也强化了这条纪律。当用户用 "you choose N" 把选技术委托给 LLM 时:

> `src/core-skills/bmad-brainstorming/SKILL.md:64`
>
> > **`you choose N`** (Facilitator Chosen) — pick N techniques fitting the goal, `{workflow.favorite_techniques}` first; confirm exact names with a scoped `uv run {skill-root}/scripts/brain.py --file {workflow.brain_methods} list --category <cat>`. Never pull the library whole into context.

"Never pull the library whole into context"——一条写进技能行为的硬约束:LLM 被要求用 scoped `list --category` 精确取数,而不是把 CSV 整体读进来自己挑。确定性脚本充当了上下文的闸门。

brainstorming 还有一个独特的产物:一个离线 HTML 选择器页面。brain.py 的 `html` 子命令把整个目录渲染成自包含浏览页,用户在浏览器里勾选技术、拼装会话、点 "Copy prompt" 把结果粘回聊天:

> `src/core-skills/bmad-brainstorming/scripts/brain.py:724`
>
> ```python
> elif args.cmd == "html":
>     if not args.out:
>         print(
>             "error: `html` needs --out PATH — it writes the selection page to a file and "
>             "never prints the catalog to stdout (which would defeat the point).",
>             file=sys.stderr,
>         )
>         return 2
>     out = Path(args.out)
>     out.parent.mkdir(parents=True, exist_ok=True)
>     out.write_text(html_doc(rows), encoding="utf-8")
> ```

`html` 写文件、不输出到 stdout——因为把目录打印到 stdout 同样会灌进上下文。这个选择器是"人机分工"的设计:浏览和勾选是人类的活(在浏览器里),执行是 LLM 的活(读粘回来的 prompt 块)。LLM 永远看不到浏览器画面,所以 SKILL.md 明确要求 "never claim it opened"。

整个会话的产物不是散落的想法,而是 memlog:

> `src/core-skills/bmad-brainstorming/SKILL.md:37`
>
> > **The memlog** is the session's memory: the single source every output builds from, and the file a resume reloads. Whatever isn't in it is gone.

memlog 是会话的单一事实源:每个想法、决策、问题、用户方向各占一行,按时间顺序追加,永不编辑、永不重排。窗口关了,没写进 memlog 的就丢了。这是 BMAD 把"易失的对话状态"下沉为"持久的磁盘记录"的核心手段,也是它能为四阶段流水线供料的前提——状态在磁盘上,不怕中断。

### 12.2 advanced-elicitation:把追问方法注册成可选项

brainstorming 面向发散——生成更多想法。advanced-elicitation 面向收敛前的深化——对已有输出(一段需求、一个方案、一个章节)施加结构化的批判性追问,逼 LLM 重新审视、修正、改进。

它的方法库同样是 CSV:

> `src/core-skills/bmad-advanced-elicitation/methods.csv:1`
>
> ```csv
> num,category,method_name,description,output_pattern
> 1,advanced,Tree of Thoughts,Explore multiple reasoning paths simultaneously then evaluate and select the best - perfect for complex problems with multiple valid approaches,paths → evaluation → selection
> ```

每条方法有 `category`(advanced/collaboration/core/risk/technical 等 12 类)、`description`(富文本说明,含何时用、为何有价值)、`output_pattern`(用箭头表达的柔性流程,如 "paths → evaluation → selection")。69 条方法覆盖了从第一性原理、苏格拉底追问到预演失败、红蓝对抗的谱系。

与 brainstorming 不同,elicitation 不给 LLM 整个方法库,而是做"智能选取"——根据当前内容特征选 5 条最匹配的:

> `src/core-skills/bmad-advanced-elicitation/SKILL.md:58`
>
> > #### Smart Selection
> >
> > 1. Analyze context: Content type, complexity, stakeholder needs, risk level, creative potential
> > 2. Parse descriptions: Understand each method's purpose from the rich descriptions in CSV
> > 3. Select 5 methods: Choose methods that best match the context based on their descriptions
> > 4. Balance approach: Include mix of foundational and specialized techniques as appropriate

这里没有 Python 脚本参与选取——选取逻辑留给 LLM 的判断力,CSV 只提供"可被解析的富描述"。这与 brainstorming 的"脚本闸门"形成对照:brainstorming 防的是 token 爆炸(108 条全进上下文),elicitation 的 69 条规模可控,所以把选取委托给 LLM 的语义匹配能力,换取灵活性。

用户交互是一个紧凑的循环:

> `src/core-skills/bmad-advanced-elicitation/SKILL.md:88`
>
> > **Case 1-5 (User selects a numbered method):**
> >
> > - Execute the selected method using its description from the CSV
> > - Adapt the method's complexity and output format based on the current context
> > - Apply the method creatively to the current section content being enhanced
> > - Display the enhanced version showing what the method revealed or improved
> > - **CRITICAL:** Ask the user if they would like to apply the changes to the doc (y/n/other) and HALT to await response.
> > - **CRITICAL:** ONLY if Yes, apply the changes. IF No, discard your memory of the proposed changes.

用户选一个方法(1-5),LLM 用 CSV 里的 description 执行它,展示改进后的版本,然后 HALT 等用户决定是否采纳。不采纳就丢弃——proposed change 不留痕,除非用户点头。`r` 重洗、`a` 列全部、`x` 结束。每次执行后重新呈现同一组选项,允许多轮叠加深化。

elicitation 的定位是"插件式深化":它可以从别的技能里被间接调用,对刚生成的某段内容施加追问,然后把增强版交回去替换原内容。它是意图捕获阶段的"放大镜",不是独立产物——它深化已有内容,不自己产生新的 intent。

### 12.3 forge-idea:用角色对打把想法压到极限

forge-idea 是三个捕获技能里攻击性最强的。它不发散、不追问,而是把一个半成形的想法扔进审讯室,用角色驱动的交叉盘问压力测试它,直到它硬化、被证伪、或被想清楚。

它的目标声明就反直觉:

> `src/core-skills/bmad-forge-idea/SKILL.md:10`
>
> > Take a half-formed idea and pressure-test it in conversation, while changing your mind is still cheap, until it becomes something the user can act on with conviction or reject. The main risk is what the user has not examined yet: unchecked assumptions and unresolved decisions usually become more expensive problems later.
> >
> > The main goal is better thinking, not producing an artifact. Strengthening an idea, rejecting it, or thinking it through more clearly are all complete outcomes.

"更好的思考,不是产出工件"——hardening、killing、clarifying 都是合法结局。这和 brainstorming 的"目标 100 个想法、别急着收"形成两极:brainstorming 推迟收敛,forge-idea 逼到必须收敛(或证伪)。

forge-idea 的核心机制是角色压力。用户可以随时喊 "attack this"/"defend this"/"switch roles" 切换论证立场:

> `src/core-skills/bmad-forge-idea/SKILL.md:49`
>
> > Tell the user they can say **"attack this"**, **"defend this"**, or **"switch roles"** at any time to change how the current idea is argued. In attack mode, do not agree with the idea; look for contradictions, weak assumptions, and failure cases. In defend mode, argue for the strongest version of the idea.

attack 模式下 LLM 不许认同,只找矛盾和失败路径;defend 模式下 LLM 替想法建最强版本。这种"立场可切换的对抗"把 LLM 从"附和型助手"变成"受控的魔鬼代言人"——而且攻击性是用户随时可开关的。

每个回合用两个声音施压:

> `src/core-skills/bmad-forge-idea/SKILL.md:88`
>
> > Each turn uses two voices:
> > - **One available persona** — choose an installed agent or user-defined persona whose expertise fits the current branch. Vary this voice every few turns; do not let one voice dominate.
> > - **One generated persona** — create a fresh outside voice, such as a competitor, buyer, finance reviewer, domain expert, or critic.

一个是从已安装 BMad agent / 用户 persona 池里选的(通过 `resolve_personas.py` 解析),一个是当场生成的外部视角(竞争对手、买方、审计……)。两个声音交叉盘问当前分支,然后 LLM 综合它们的输入形成下一个问题。注意约束——"do not let the session turn into a panel debate or persona performance":角色是施压工具,不是表演。

forge-idea 的纪律同样体现在"不讨好":

> `src/core-skills/bmad-forge-idea/SKILL.md:74`
>
> > Do not use agreement or praise to make the interaction smoother; they lower pressure and lead to shallower thinking. Agreement is allowed only when it helps the user think better. Praise is noise. Continued engagement and ego-stroking are not objectives. In attack mode, never agree with the idea until the user ends the mode.

这是写在 SKILL.md 里对抗 LLM 默认行为的指令:附和和夸奖降低压力、导致更浅的思考,所以默认禁用。这种"反默认"的显式约束,正是 BMAD harness 用声明式技能重塑宿主 agent 行为的典型手法——把"别讨好"这条难以靠运行时机制保证的软约束,固化成可读、可 lint 的技能文本。

会话产物同样是 memlog,类型词表更尖锐:`decision|assumption|crack|kill|direction|lock|note`。`lock` 是用户硬化的想法——settled,不再重开;`forged-idea.md` 从 lock 项蒸馏。三种合法出口:Hardened(硬化,可喂给 bmad-spec/prd/prfaq)、Killed(证伪,早死早超生也是有效结果)、Clearer(想清楚了但没有可交付的硬化想法)。

### 12.4 bmad-spec:把意图蒸馏成锁 WHAT 不锁 HOW 的契约

三个捕获技能搅动意图,bmad-spec 把搅动后的产物(或任何原始输入——PRD、GDD、RFC、Slack 线程、邮件、会议记录、mockup)蒸馏成一份机器契约。它的定位是"canonical transformer":

> `src/core-skills/bmad-spec/SKILL.md:9`
>
> > Canonical transformer for the BMad spec-kernel ecosystem. Takes any intent input — vague idea, brain dump, PRD, GDD, RFC, brief, Slack thread, customer email, meeting transcript, mockups, mixed multi-source — and produces **SPEC.md** carrying the five-field kernel (Why, Capabilities, Constraints, Non-goals, Success signal) plus companion files for load-bearing content that does not fit or would bloat the kernel with expansive line-item detail.

五字段 kernel:Why(为什么做)、Capabilities(能做什么,带 CAP-N ID)、Constraints(真正约束设计的硬限制)、Non-goals(明确不做)、Success signal(怎样算成)。这是下游每个 BMad 技能消费的机器契约。

模板里 capability 的结构是契约的脊梁:

> `src/core-skills/bmad-spec/assets/spec-template.md:23`
>
> ```markdown
> - **CAP-1**
>   - **intent:** {One sentence. "User or system can do X to achieve Y." WHAT, not HOW.}
>   - **success:** {Testable or demonstrable criterion. Something a test or a real demonstration can decide.}
> ```

每个 capability 必须同时有 `intent` 和 `success`。intent 的模板注释直接写死 "WHAT, not HOW"——实现处方(技术栈、架构选型)属于 companion(stack.md、conventions.md),不进 kernel。这是 bmad-spec 最核心的克制:锁住"要什么",放开"怎么做",把实现自由度留给下游架构阶段。

这份克制被 Spec Law 编成八条可检验规则:

> `src/core-skills/bmad-spec/SKILL.md:102`
>
> > 1. **Each capability has both `intent` and `success`.** Missing either = not a capability.
> > 2. **Intents describe WHAT, not HOW.** Implementation prescription belongs in a companion (stack, conventions).
> > 3. **Constraints actually bend design decisions.** A "constraint" that rules nothing out is decoration.
> > 4. **Non-goals are explicit.** At least one. Absence means downstream skills fill the vacuum.
> > 5. **Success signal is concrete enough to test or demonstrate against.** "Users love it" doesn't qualify.
> > 6. **Capability IDs are stable and unique.** Never reused, never renumbered.

规则 3 尤其锋利:一个什么都没排除掉的"约束"是装饰,不配进 Constraints。规则 4 要求至少一个 Non-goal——不写就等于把范围决策让给下游填真空。规则 5 把 "Users love it" 这类不可测的成功信号直接判出局。这些规则不是建议,而是 self-validate 阶段的判据。

### 12.5 memlog 即事实源:SPEC.md 每次从日志派生

bmad-spec 最反直觉的设计:SPEC.md 不是手写的,也不是手改的——它是从 `.memlog.md` 每次派生的。

> `src/core-skills/bmad-spec/SKILL.md:54`
>
> > `.memlog.md` is canonical — an append-only, chronological record of every decision, constraint, capability (with its stable `CAP-N`), assumption, open question, and bit of user direction, one line each in the order it happened, never edited or reordered. `SPEC.md` and every spec-authored companion are **derived on each run** from the memlog (the decision-of-record) plus the sources it cites for raw content — never hand-patched.

spec 文件夹里 `.memlog.md` 是规范的(canonical),SPEC.md 是派生的(derived)。这带来一个关键性质——spec 周围的步骤(PRD、UX、架构、epic)可以任意顺序运行、都喂同一个 spec,而不产生 merge drift:

> `src/core-skills/bmad-spec/SKILL.md:56`
>
> > Deriving the contract from a living log instead of editing the contract in place is what lets the steps around the spec (PRD, UX, architecture, epics) run in any order and feed the same spec without merge drift: the log only accumulates, the artifact is re-rendered. So the spec is updated *only* by re-deriving it here — bmad-spec is its single writer; a hand-edit to `SPEC.md` from outside is unsupported and is overwritten on the next derive.

"日志只累积,产物只重渲染"——这是 event sourcing 的思路用在 spec 上:bmad-spec 是 SPEC.md 的唯一写入者,外部手改会在下次派生时被覆盖。capability ID 因此稳定:同一 slug 的第二次调用落在已有文件夹上原地更新,保留已有 CAP-N,新 capability 取下一个未用 ID,永不复用退役 ID。

写入通过共享脚本 `memlog.py`,与 brainstorming/forge-idea 用的是同一个脚本:

> `src/core-skills/bmad-spec/SKILL.md:58`
>
> > Writes go through the shared script — `{project-root}/_bmad/scripts/memlog.py`, the same location as `resolve_customization.py` (atomic; never read it back except to resume):
> >
> > - `uv run {project-root}/_bmad/scripts/memlog.py init --workspace {spec-folder} --field topic="<what is being specced>"` — once, at create.
> > - `uv run {project-root}/_bmad/scripts/memlog.py append --workspace {spec-folder} --type <decision|constraint|capability|assumption|question|direction|note|event> --text "<one-line gist, reason included>"` — as each lands.

三个技能共用 memlog.py,但用不同的 `--type` 词表:brainstorming 用 idea/insight/technique,forge-idea 用 crack/kill/lock,spec 用 decision/capability/constraint。同一个原子追加机制,适配三种语义。这是 BMAD"确定性核共享、声明式层分化"的典型分工——脚本管追加的确定性,SKILL.md 管各技能的语义和流程。

派生之后是两遍自检:

> `src/core-skills/bmad-spec/SKILL.md:117`
>
> > **Pass 1 — Coherence.** Judge the spec against Spec Law rules 1–6 and 8. For anything that fails or feels weak, attempt to fix it without inventing content the input did not support. Calls made without direct confirmation become `assumptions[]`; gaps that could not be filled become `open_questions[]`.
> >
> > **Pass 2 — Preservation.** Walk the source claim by claim. Confirm each load-bearing claim landed in SPEC.md or a companion. Wrapper-ceremony drops are logged under "Wrapper-only content" so the drop is on the record, not silent.

Pass 1 查自洽:Spec Law 规则是否满足,但"不能发明输入没支撑的内容"——缺直接确认的记进 `assumptions[]`,填不上的记进 `open_questions[]`。Pass 2 查保全:逐条走源材料,确认每条 load-bearing 声明都落进了 kernel 或 companion,丢掉的包装性内容也要记在案(不是静默丢弃)。两遍的裁决都 append 进 memlog 作为 `event`——下游读到 memlog 就知道这份 spec 经过怎样的自检、留了哪些待决问题。

## 设计决策与权衡

**1. 技术库是数据,不是提示词。** brainstorming 的 108 条技术放在 CSV 里,brain.py 按命令分发表只送需要的那部分进上下文。代价是多了一个脚本调用层和 HTML 选择器的人机分工复杂度;收益是上下文不被技术库占满,且目录可被 `--extra` overlay 扩展(自定义技术成为一等公民)而无需改代码。elicitation 的 69 条规模较小,选取委托给 LLM 语义匹配——在同一套"数据即方法库"思路下做了不同的调度权衡:规模大时用脚本闸门防爆炸,规模可控时用语义匹配换灵活。

**2. memlog 是唯一事实源,SPEC 派生而非手编。** 这是整章最重的决策。把 spec 当 event sourcing 的 log 来管:bmad-spec 是唯一写入者,外部手改会被覆盖。代价是用户不能直接改 SPEC.md(必须通过 bmad-spec 重新派生),且需要严格维护 capability ID 的稳定性;收益是 spec 周围任意步骤可以乱序运行、都喂同一个 spec 而不 merge drift——日志只累积,产物只重渲染。这是一个用"不可变日志 + 可重算视图"换"多源无冲突写入"的架构选择。

**3. 锁 WHAT 不锁 HOW 被编成可检验规则。** Spec Law 的八条规则不是建议而是 self-validate 判据。规则 2(WHAT not HOW)、规则 3(constraint 要真正排除选项)、规则 4(至少一个 non-goal)共同构成"克制"的硬约束。代价是 spec 写起来更费力——每条 capability 都要配 testable success,每条 constraint 都要经得起"它排除了什么"的追问;收益是下游架构阶段拿到的是干净的"要什么",实现自由度不被过早锁死。

**4. 三个捕获技能正交,不构成强制流水线。** brainstorming 发散(推迟收敛)、elicitation 深化(对已有输出施加追问)、forge-idea 压测(逼到收敛或证伪)。它们按意图成熟度选用:想法太散用 brainstorming,某段内容不够深用 elicitation,某个具体想法要验硬用 forge-idea。三者产物都能喂 bmad-spec 作输入,但 bmad-spec 本来就接受"任何 intent 输入",不要求上游是特定技能。代价是没有强制的捕获流程,依赖用户或编排判断何时进 spec;收益是灵活性——模糊到 "an app for hikers" 也能直接进 spec(只是大概率被建议改用 bmad-prd)。

## 与 Claude Code harness 的对照

Claude Code 作为运行时 harness,意图捕获发生在对话循环里——用户的每条消息就是意图,LLM 在上下文窗口里即时响应,没有独立的"捕获阶段"。上下文窗口本身是易失的:窗口满了就压缩,细节可能丢失。BMAD 把意图捕获显式拆成技能,并用 memlog 把易失的对话状态持久化到磁盘——"Whatever isn't in it is gone"这条纪律,在 Claude Code 里没有对等物;Claude Code 的 `/compact` 是被动的压缩,BMAD 的 memlog 是主动的、结构化的、按类型标记的追加。

更深层的对照在约束机制。Claude Code 用 hooks 和权限管线约束"agent 能做什么动作"(能否调用某工具、是否需要确认);BMAD 用 Spec Law 这类写在 SKILL.md 里的规则约束"agent 产出什么形状的工件"。前者是运行时闸门(拦截行为),后者是声明式契约(规范产物)——规则 3"constraint 要真正排除选项"不是阻止某个工具调用,而是让 LLM 在生成时自检、在 self-validate 阶段被判定。两种 harness 约束的层面不同:Claude Code 约束行为,BMAD 约束产物。这也是"方法论 harness"与"运行时 harness"在意图捕获这一环上的本质分野。

## 小结

意图捕获三件套(brainstorming 发散、elicitation 深化、forge-idea 压测)把模糊的人类意图搅动到足够稠密,再由 bmad-spec 蒸馏成锁 WHAT 不锁 HOW 的五字段 kernel 契约。贯穿四者的是 memlog——append-only 的唯一事实源,让 SPEC.md 派生而非手编、让 spec 周围步骤乱序无冲突。这份 SPEC.md 连同 companions,正是四阶段流水线的入口物料。下一章 [第 13 章](13-四阶段流水线与技能路由.md) 将拆解 analysis → plan → solutioning → implementation 这张技能路由图如何消费这份契约、如何用 phase/preceded-by/followed-by 把技能织成方法论主干。
