# 企业家 PRD 大师 · 架构决策记录

## 一、项目目标（一句话）

让**企业家**用大白话讲完想做什么，30-90 分钟后拿到一份**经过多角色评审的完美 PRD**，可直接交给 Claude Code / Codex / Cursor 写代码。

## 二、用户画像

**主要用户：企业家**（不是受过训练的 PM）

特征：
- 有商业直觉但缺产品方法论
- 说话方式抽象、跳跃："想做一个像 XX 一样的 AI 工具"
- 不愿意填模板，不耐烦被问 20 个字段
- 时间宝贵，但要求结果"上得了台面"
- 不会量化指标（说"提升用户体验"）
- 混淆用户和客户、功能和价值
- 想象力大于收敛能力

**次要用户**：刘润老师本人（教学演示 + 自己真实写 PRD）

## 三、设计原则

### 吸收的精华（来自 spec-kit / senior-pm-prompt / ai-prd-generator）

| 来源 | 吸收的机制 | 用在哪 |
|------|----------|--------|
| **senior-pm-prompt** | "What do you want to build?" 单一开放入口 | 阶段 0 入口 |
| **senior-pm-prompt** | Multi-slot 第一轮激进抽取 | 苏格拉底追问 |
| **senior-pm-prompt** | 对模糊词驳回（"提升用户体验"→which metric/baseline/target/timeframe） | Lead PM 铁律 |
| **senior-pm-prompt** | Pair every Goal with its Metric | 每问一个目标立即追问指标 |
| **senior-pm-prompt** | Never fabricate，没说就标 _TBD_ | 数据合规 |
| **senior-pm-prompt** | PASS/FAIL 一致性检查块（US→FR / Goal→Metric） | 终审前必跑 |
| **spec-kit /clarify** | 分类驱动的歧义扫描（9 大类） | 苏格拉底追问的扫描框架 |
| **spec-kit /clarify** | 每问只问 1 个，最多 5 个 | 不批量、不轰炸 |
| **spec-kit /clarify** | 每选项题给 Recommended + 理由 | 企业家友好 |
| **spec-kit /clarify** | 接受 "yes"/"recommended" 用默认 | 减少摩擦 |
| **spec-kit /clarify** | 每答完立刻写回（原子保存） | 防止状态丢失 |
| **spec-kit /analyze** | 跨文件一致性扫描 | 终审 |
| **spec-kit /checklist** | "需求的单元测试"思想（不是测代码） | 校验设计 |
| **ai-prd-generator** | 8 步执行清单 + 反卡死规则 | Controller 主流程 |
| **ai-prd-generator** | 5 种验证 verdict (PASS / SPEC-COMPLETE / NEEDS-RUNTIME / INCONCLUSIVE / FAIL) | 假设清单 |
| **ai-prd-generator** | FR 必须有可追溯来源 | 证据系统 |
| **ai-prd-generator** | AskUserQuestion 是硬约束 | 所有用户交互 |
| **MAGI** | 多 Agent 协作 + 双 Agent 共识 | 多角色评审团 |
| **MAGI** | 产品 vs 技术边界铁律 | Lead PM 铁律 |
| **MAGI** | 证据等级 A/B/C/D/E | 假设清单 |

### 丢掉的（不适合 Claude Code / 不适合企业家场景）

| 丢掉的东西 | 原因 |
|----------|------|
| MAGI 的 `watchdog.sh` | Claude Code 同步调用不会卡死 |
| MAGI 的 🔖 心跳机制 | 同上 |
| MAGI 的 `sessions_spawn` 接续规则 | Claude Code Agent 工具天然支持 |
| spec-kit 的 PowerShell 脚本调用 | 我们不强绑定 spec-kit 项目结构 |
| ai-prd-generator 的 64 条规则中纯技术细节（如 SP 算术、SQL注入预防） | 企业家 PRD 阶段不需要写代码细节，留给下游 Codex |
| ai-prd-generator 的 MCP server 依赖 | 增加复杂度，不是必需 |
| BMAD 的庞大模块生态 | 我们要轻量启动 |

### 我们新加的（别人没有的）

| 新机制 | 解决什么问题 |
|-------|------------|
| **三品类 playbook** (SaaS/App/电商) | 不同品类竞品调研打法不同，通用工具会调研得很浅 |
| **阶段 3 多角色评审团 + 辩论协议** | 单 reviewer 找的问题深度不够；4 角色独立 + 互相 challenge 才能挖出真问题 |
| **阶段 5 多角色协同写作 (v0.2 新增)** ⭐ | 把"PM 单写 + 终审"改为"PM+架构师+工程师 3 author 并行写 + 互 review + 收敛"——产出更细节、更可执行的 PRD |
| **企业家典型卡点表** | 企业家常见错误模式（混淆用户/客户、把功能当价值、不会量化等）的专项应对 |
| **三钉子证据系统**（数据/细节/案例） | 借鉴刘润内容方法论，移植到 PRD 证据要求 |
| **假设显性化清单**（assumptions.md） | 把"猜测"变成"可证伪的假设 + 验证方式"——这是教学王牌 |
| **吵架记录**（debate-log.md） | 把多 Agent 博弈过程留档，本身就是教学素材 |
| **完整对话存档**（conversation.md） | 跟企业家的全过程留档，方便复盘 |
| **品类自适应 PRD 模板** | 不同品类（SaaS vs App vs 电商）模板侧重不同 |

## 四、六阶段流程

```
┌─────────────────────────────────────────────────────────────┐
│ 阶段 0 · 自由倾诉（30 秒-3 分钟）                            │
│   入口："你想做什么？随便说"                                 │
│   Lead PM 不打断，听完，多 slot 抽取                         │
│   输出："我听到的是这样..." + 初步理解                       │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 阶段 1 · 苏格拉底深挖（核心）                                │
│   按 9 大类扫描歧义 → 队列里挑 Top 5 关键问题                │
│   每轮问 1-2 个，附 Recommended 选项                         │
│   反复 3-5 轮直到场景骨架清晰                                │
│   输出：场景锚点 + 假设清单 v1                               │
│   ⏸ 企业家确认                                              │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 阶段 2 · 自动调研                                            │
│   品类判定（SaaS/App/电商）→ 切对应 playbook                 │
│   竞品深度抓取 / 差评挖掘 / Benchmark 查询                   │
│   输出：研究报告（带来源 URL） → 假设清单 v2                 │
│   ⏸ 企业家可打回继续挖                                      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 阶段 3 · 方案 V0 + 多 Agent 充分吵架（核心）                 │
│   Lead PM 出 V0 方案概要                                     │
│   ↓                                                          │
│   四方评审 同时启动：                                        │
│   ├─ 工程 Reviewer（可行性/工时/风险）                       │
│   ├─ 设计 Reviewer（UX 完整性/一致性）                       │
│   ├─ 商业 Reviewer（运营落地/资源）                          │
│   └─ 战略 Reviewer（战略对齐/底层假设）                      │
│                                                              │
│   辩论协议（3 轮博弈）：                                     │
│     R1: 各方独立挑刺                                         │
│     R2: Lead PM 回应/修订                                    │
│     R3: 互相 challenge 直到收敛                              │
│                                                              │
│   输出：V1 方案 + debate-log.md                              │
│   ⏸ 企业家拍板（可循环修改）                                │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 阶段 4 · 交互验证（HTML Demo，可跳过）                       │
│   基于设计系统（shadcn/Tailwind）出 HTML                     │
│   设计 Reviewer 审 UX → 企业家确认                           │
│   策略型/架构型/修复型 PRD 跳过                              │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 阶段 5 · PRD 终稿                                            │
│   Lead PM 写完整 PRD（按品类模板）                           │
│   四方终审                                                   │
│   Python 硬校验：                                            │
│     ├─ check_evidence.py（数字溯源/三钉子/空话词）           │
│     ├─ check_format.py（ASCII框图/技术细节越界）             │
│     └─ check_consistency.py（US↔FR/Goal↔Metric PASS/FAIL）   │
│   校验通过 → 交付                                            │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
              ┌────────────────────────┐
              │ 最终交付套件            │
              ├────────────────────────┤
              │ PRD.md (主文档)         │
              │ assumptions.md (假设)   │
              │ evidence/ (证据附录)    │
              │ debate-log.md (吵架)    │
              │ demo/ (HTML，可选)      │
              │ conversation.md (存档)  │
              └────────────────────────┘
```

## 五、文件目录结构

```
prd-master/
├── SKILL.md                      ← 主 Controller（Skill 入口）
├── README.md                     ← 项目说明
├── 部署说明.md                   ← 部署指南
├── docs/
│   └── ARCHITECTURE.md           ← 本文件（架构决策）
├── agents/                       ← 6 个 subagent
│   ├── lead-pm.md                ← 主笔 PM
│   ├── reviewer-tech.md          ← 工程评审
│   ├── reviewer-design.md        ← 设计评审
│   ├── reviewer-business.md      ← 商业评审（运营/资源）
│   ├── reviewer-strategy.md      ← 战略评审（对齐/底层假设）
│   └── debate-moderator.md       ← 辩论主持（可选，复杂场景用）
├── playbooks/                    ← 三品类调研打法
│   ├── saas.md                   ← B 端 SaaS
│   ├── mobile-app.md             ← C 端 App
│   └── ecommerce.md              ← C 端 电商
├── templates/                    ← 交付物模板
│   ├── prd-saas.md               ← SaaS 类 PRD 模板
│   ├── prd-app.md                ← App 类 PRD 模板
│   ├── prd-ecommerce.md          ← 电商类 PRD 模板
│   ├── assumptions.md            ← 假设清单
│   ├── debate-log.md             ← 吵架记录
│   └── evidence/
│       ├── competitors.md        ← 竞品分析
│       └── benchmark.md          ← Benchmark
├── validators/                   ← Python 硬校验
│   ├── check_evidence.py         ← 数字溯源/三钉子/空话词
│   ├── check_format.py           ← 格式越界拦截
│   └── check_consistency.py      ← PASS/FAIL 一致性
└── examples/                     ← 示例（跑通后填充）
    └── (sample PRDs)

projects/                         ← 跟 prd-master/ 平级，存学员/客户的具体 PRD
└── {项目名}/
    ├── PRD.md
    ├── assumptions.md
    ├── debate-log.md
    ├── conversation.md
    ├── evidence/
    │   ├── competitors.md
    │   └── benchmark.md
    └── demo/                     (可选)
```

## 六、核心机制

### 6.1 苏格拉底入口（阶段 0 → 1）

**入口铁律**：
- 第一句问开放问题（"你想做什么？"），不丢模板
- 第一轮回复**激进抽取**所有可识别 slot（参考 senior-pm-prompt）
- 输出"我听到的是这样..."回放确认，让企业家知道被听到

**追问铁律**：
- 每轮最多问 2 个问题，每个问题给 Recommended 选项 + 1-2 句理由
- 对模糊词（"提升用户体验"、"更好用"、"年轻人喜欢"）必须驳回 → 要 metric/baseline/target/timeframe
- 接受 "yes"/"用推荐的" 直接用默认
- 最多 5 轮追问，再不清楚就 _TBD_ 标记进 assumptions

**9 大类扫描（来自 spec-kit /clarify，企业家版调整）**：
1. 用户画像（谁用、不用谁、决策者 vs 使用者）
2. 核心场景（什么时候用、当前替代方案）
3. 核心痛点（多痛、怎么忍受的）
4. 成功定义（什么样算成功、怎么衡量）
5. 边界（不做什么、装饰还是核心）
6. 资源约束（预算/团队/时间）
7. 技术约束（多端/性能/合规要求）
8. 业务模式（收费/免费/补贴）
9. 最大不确定性（你最不确定什么）

### 6.2 多角色辩论协议（阶段 3）

**4 个评审角色**（每个有自己的 system prompt）：

| 角色 | 视角 | 典型问题 |
|------|------|---------|
| 工程 Reviewer | 可行性、工时、技术风险 | "这个 3 个月做得完吗？""有现成方案吗？""依赖什么硬件/数据/API？" |
| 设计 Reviewer | UX 完整性、交互一致性 | "新手怎么发现这个功能？""失败状态怎么显示？""跟现有产品风格冲突吗？" |
| 商业 Reviewer | 运营、资源、变现 | "冷启动怎么做？""谁来推送/客服/数据？""第一批用户从哪来？" |
| 战略 Reviewer | 战略对齐、底层假设 | "这是真问题还是伪需求？""做这个跟你公司主线的关系是？""为什么是现在？" |

**辩论协议（3 轮）**：

```
Round 1（独立挑刺）
  四方同时收到方案 V0，各自独立输出问题清单
  禁止互相参考，避免群体思维
  输出：4 份独立挑刺清单

Round 2（Lead PM 回应）
  Lead PM 汇总四方意见，对每条挑刺要么：
    - 接受 → 修订方案
    - 驳回 → 给理由
    - 待决 → 标记需要企业家拍板
  输出：V0.5 修订 + 取舍清单

Round 3（互相 challenge）
  四方看 V0.5 后再发言，重点 challenge 别人的逻辑：
    - 工程："COO 说的运营成本不算技术成本，但是其实..."
    - 战略："产品评审纠结的功能细节，其实底层假设是错的..."
  输出：V1 方案 + 完整 debate-log.md
  ⏸ 企业家拍板
```

**辩论限制**：
- 总轮数 ≤ 3，再有分歧标 [OPEN_QUESTION] 给企业家
- 每角色每轮发言 ≤ 300 字，避免冗长
- 不准说"我同意以上所有观点"——必须独立思考

### 6.3 证据系统硬校验（阶段 5）

**check_evidence.py** 扫描：
- 裸数字（如"提升 30%"）必须紧跟 `[来源: ...]` 或 `[假设值]` 或 `[待验证]`
- 空话词清单：提升用户体验、年轻人喜欢、更好用、市场反响热烈、刚需 → 拦截
- "信息差三钉子"检查：每个核心论点需要至少 1 个数据 + 1 个细节 + 1 个案例

**check_format.py** 扫描（继承 MAGI 思路）：
- ASCII 框图（`┌└│├─`）→ 拦截，要求改 Mermaid
- HTTP 方法 + API 路径（`POST /api/...`）→ 拦截，要求改产品语言
- 数据库字段类型（`varchar(\d+)`）→ 拦截
- 章节序号混乱 → 警告

**check_consistency.py**（PASS/FAIL 检查，来自 senior-pm-prompt）：
```
- 每个 US 必须有 ≥1 个 FR 实现 → PASS/FAIL
- 每个 Business Goal 必须有 ≥1 个 Metric 跟踪 → PASS/FAIL
- 每个 User Goal 必须有 ≥1 个 Metric 跟踪 → PASS/FAIL
- Persona vs Goal vs User Story 一致性 → PASS/FAIL
- 任何 FAIL 自动写入 assumptions.md 的 Weak Spots
```

### 6.4 假设清单（assumptions.md）

这是教学王牌。每个假设：

```markdown
## A-001: 用户会主动打开 App 写日报

- **依据等级**: D（基于团队访谈推断，非真实数据）
- **证伪条件**: 上线 14 天，DAU < 30%
- **验证方法**: 埋点 + A/B 测试（实验组打开率 vs 对照组）
- **如果证伪怎么办**: 改用 Slack 集成主动推送
- **风险等级**: 🔴 高（核心假设，错了整个产品逻辑崩）
```

每份 PRD 必须有 assumptions.md，列出 5-15 个核心假设。

## 七、跟现成方案的关系

| 方案 | 我们的关系 | 借鉴的部分 |
|------|----------|----------|
| **github/spec-kit** | 学习其方法论 | clarify 的 9 类扫描、checklist 的"需求单元测试"、analyze 的跨文件一致性 |
| **wwwazzz/senior-pm-prompt** | 借鉴单一系统提示词的简洁性 | "What do you want to build?" 入口、激进抽取、对模糊驳回、PASS/FAIL 块 |
| **cdeust/ai-prd-generator-plugin** | 学习其严苛度 | 多文件输出、反卡死规则、verdict 分级、FR 可追溯 |
| **bmad-code-org/BMAD-METHOD** | 知道有这条路 | 多 agent 协作思想（但不抄其复杂模块系统） |
| **MAGI** (Kira2red/magi-product) | 知道有这个起点 | 产品/技术边界铁律、证据等级 A-E、双 Agent 共识 |

**关键差异**：他们都是"通用工具给 PM 用"，我们是"企业家友好的教练 + 三品类 playbook + 多角色辩论 + 三钉子证据"。

## 八、最小可跑通路径（MVP）

为了让你尽早试，先做这 5 件事跑通最小闭环：

1. **SKILL.md**（主 Controller）
2. **agents/lead-pm.md**（含苏格拉底追问）
3. **agents/reviewer-tech.md + reviewer-strategy.md**（先两个 Reviewer 跑通辩论）
4. **templates/prd-saas.md**（先做 SaaS 模板，最常用）
5. **validators/check_consistency.py**（PASS/FAIL 校验，最值钱的一招）

后续再补：另两个 Reviewer / 另两个 playbook / 另两个校验器 / 假设模板 / Demo 系统 / README。

---

**架构决策版本**: v1.0
**决策日期**: 2026-05-23
**状态**: 已确认，可进入实现
