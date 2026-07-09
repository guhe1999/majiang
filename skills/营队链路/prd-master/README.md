# PRD 大师 · 企业家版（v0.3）

> **用大白话讲完想做什么，30-90 分钟后拿到经过多角色评审的完美 PRD，可直接交给 Claude Code / Codex / Cursor 写代码。**

[![version](https://img.shields.io/badge/version-v0.3-blue)]() [![status](https://img.shields.io/badge/status-active-green)]() [![for](https://img.shields.io/badge/for-Entrepreneurs-orange)]()

## v0.3 关键能力

- 🎯 **企业家入口**：自由倾诉、不丢模板、不丢黑话
- 🔍 **苏格拉底深挖**：每轮 1-2 问 + Recommended 选项 + 犹豫信号识别 + 10 种典型卡点应对
- 📊 **自动调研**：4 大品类 playbook（SaaS / App / 电商 / 通用）+ 3 档深度（快/标准/深度）
- 🥊 **多 Agent 充分吵架**：4 角色独立挑刺 + 3 轮博弈（工程/设计/商业/战略）
- ✍️ **PRD 协同写作**：3 author（PM/架构师/工程师）并行写 + R0 预协商 + R2 互 review + R3 修订
- 🔗 **跨章节平滑**：R4 reviewer 专门找 6 类跨章节冲突（同一概念不同口径）
- 📐 **4 件硬校验**：证据合规 + 格式越界 + 一致性 PASS/FAIL + 可执行性自检
- 📦 **分层输出**：PRD.md（完整）+ PRD-summary.md（老板版）+ PRD-dev.md（开发版）
- 💡 **教学注释**：10 处关键阶段附"为什么这么做"
- 🔄 **state.json + 快速恢复**：中断后再回来 30 秒重建上下文
- 📍 **行动卡**：每次输出末尾"📍 当前在哪 / 还有多远 / 你该做啥"

## 一、这是什么

一套服务**企业家**的 PRD 生成系统。不是给受训过的 PM 用的，是给只懂业务、不懂产品方法论的创始人/老板用的。

灵感来源：
- **MAGI** (Kira2red/magi-product) —— 多 Agent 协作 + 产品/技术边界铁律
- **GitHub Spec-Kit** —— 分类驱动的歧义扫描 + 跨文件一致性
- **senior-pm-prompt** —— 激进抽取 + 对模糊驳回 + PASS/FAIL 一致性
- **ai-prd-generator-plugin** —— 反卡死规则 + verdict 分级 + FR 可追溯
- **润米咨询** "信息差三钉子" 内容方法论 —— 移植到 PRD 证据要求

## 二、跟其他 PRD 工具的差异

| | 其他工具 | PRD 大师 |
|---|---------|---------|
| 用户 | 受训过的 PM | 企业家（不懂方法论） |
| 入口 | 丢空白模板 | "你想做什么？随便说" |
| 追问 | 一次问 20 个字段 | 苏格拉底式深挖（每轮 1-2 问，给推荐选项） |
| 调研 | 通用 WebSearch | 三品类 playbook（SaaS / App / 电商）切换打法 |
| 评审 | 单个 reviewer | 4 角色独立挑刺 + 3 轮辩论 |
| 校验 | 靠 LLM 自觉 | Python 硬校验（数字溯源/格式/一致性） |
| 假设 | 隐含在文档里 | 显性化 assumptions.md（带验证条件） |
| 输出 | 单 .md 文件 | PRD + 假设 + 证据 + 吵架记录 + 对话存档 |

## 三、6 阶段流程

```
阶段 0 · 自由倾诉（你随便说）
   ↓
阶段 1 · 苏格拉底深挖（每轮 1-2 个推荐选项问题）
   ↓
阶段 2 · 自动调研（按品类切 playbook，所有数据带来源）
   ↓
阶段 3 · 方案 V0 + 4 Agent 充分吵架（3 轮博弈）
   ↓
阶段 4 · 交互验证 Demo（可选，功能型 PRD 才做）
   ↓
阶段 5 · PRD 终稿 + Python 硬校验
   ↓
交付：PRD.md + assumptions.md + evidence/ + debate-log.md + conversation.md
```

## 四、安装与使用

### 4.1 前置条件

- Claude Code（推荐）/ Codex CLI / Cursor / 其他支持 sub-agent 的 AI Coding 工具
- Python 3.10+（用来跑硬校验脚本）
- 终端 + 一点点耐心（30-90 分钟）

### 4.2 安装

```bash
# 把整个 prd-master/ 文件夹放到你常用的位置
git clone <this-repo>  # 或直接复制 prd-master/ 文件夹

# 进入项目目录
cd prd-master/
```

### 4.3 在 Claude Code 里使用

把 `prd-master/SKILL.md` 复制（或符号链接）到 `~/.claude/skills/` 让它全局可用：

```bash
# macOS / Linux
mkdir -p ~/.claude/skills/prd-master
cp -r prd-master/* ~/.claude/skills/prd-master/

# Windows (PowerShell)
New-Item -ItemType Directory -Path "$HOME\.claude\skills\prd-master" -Force
Copy-Item -Path "prd-master\*" -Destination "$HOME\.claude\skills\prd-master\" -Recurse
```

然后在 Claude Code 里说：

> 启动 PRD 大师

或

> 用 prd-master skill 帮我写一个 PRD

### 4.4 在其他 AI Coding 工具里使用

把 `SKILL.md` 当 system prompt 贴进去就行。

---

## 五、典型 30-90 分钟流程示例

### 你（企业家）说：

> 我想做一个让员工愿意主动写日报的 AI 工具。

### PRD 大师（Lead PM）回应：

> 我听到的是这样：
>
> - 产品定位：AI 日报工具
> - 目标用户：企业员工
> - 核心痛点（猜测）：员工不愿意主动写日报，HR/老板要追
> - 我猜你可能想用 AI 帮员工自动生成日报草稿，减少负担
>
> 我可能猜错的地方：
> - 不确定你说的"日报"是给老板看的工作汇报，还是给团队同步的进度
> - 不确定 AI 介入到什么程度（自动生成？语音转写？智能提取？）
>
> 这个理解大致对吗？

### 你确认后，PRD 大师启动苏格拉底深挖：

> 问题 1: 你想优先解决的是「员工不想写」还是「写完老板不看」？
> 
> Recommended: 员工不想写 → 因为日报是上游问题，解决了下游自然好
> 选项 2: 老板不看 → 那应该做"日报摘要 + 推送"而非"AI 写"
> 选项 3: 都解决

### 你选完，下一个问题：

> 问题 2: 你的核心用户群体规模？
> 
> Recommended: 5000+ 企业（中大型）→ 适合做 SaaS，决策周期长但 ARPU 高
> 选项 2: 50-500 人企业 → SMB 市场，需要快速试用
> 选项 3: 个人/小团队 → 走 PLG 自助注册

### ... 3-5 轮深挖后，进入调研

PRD 大师自动判定品类是 "B 端 SaaS"，切换到 `playbooks/saas.md`，开始：

- 搜索竞品（钉钉日报 / 飞书 OKR / 微北OKR / 同步管家 ...）
- 抓官网/定价页
- 找 G2 / 小红书 / 知乎差评
- 找 OpenView SaaS Benchmarks 行业基线

输出 `evidence/competitors.md` + `evidence/benchmark.md`。

### 阶段 3：4 Agent 吵架

工程评审说："员工设备多，要支持微信/钉钉/飞书三端，3 个月做不完"

设计评审说："新手怎么知道这个工具存在？需要让 HR 帮推"

商业评审说："冷启动靠 HR 推送，但 HR 自己也烦——需要给 HR 一个'省事'的钩子"

战略评审说："核心假设是'员工愿意用 AI 写日报'——但调研显示同类产品打开率 < 5%。这才是真问题"

3 轮博弈后收敛。

### 阶段 5：PRD 终稿 + 校验

```
$ py validators/check_evidence.py projects/ai-daily-report/PRD.md
=== 证据合规校验: PRD.md ===
✅ 证据合规检查全部通过

$ py validators/check_format.py projects/ai-daily-report/PRD.md
✅ 格式检查全部通过

$ py validators/check_consistency.py projects/ai-daily-report/PRD.md
=== 一致性校验 PASS/FAIL ===
✅ US-1 → FR-1, FR-3 [PASS]
✅ US-2 → FR-2, FR-4 [PASS]
✅ Business Goal "DAU 6 月达 1 万" → Metric "DAU" [PASS]
✅ 全部 PASS — PRD 一致性 OK
```

### 你拿到的：

```
projects/ai-daily-report/
├── PRD.md                  ← 主文档（拿去喂 Claude Code）
├── assumptions.md          ← 12 条核心假设 + 验证条件
├── debate-log.md           ← 完整 3 轮辩论记录
├── conversation.md         ← 我们的完整对话
└── evidence/
    ├── competitors.md      ← 8 个竞品深度分析
    └── benchmark.md        ← 行业基线
```

---

## 六、文件结构

```
prd-master/
├── SKILL.md                      ← 主 Controller（先读这个）
├── README.md                     ← 本文件
├── docs/
│   └── ARCHITECTURE.md           ← 架构决策记录
├── agents/                       ← 5 个子 Agent
│   ├── lead-pm.md                ← 主笔 PM（含苏格拉底追问）
│   ├── reviewer-tech.md          ← 工程评审
│   ├── reviewer-design.md        ← 设计评审
│   ├── reviewer-business.md      ← 商业评审
│   └── reviewer-strategy.md      ← 战略评审
├── playbooks/                    ← 三品类调研打法
│   ├── saas.md
│   ├── mobile-app.md
│   └── ecommerce.md
├── templates/                    ← 交付物模板
│   ├── prd-saas.md
│   ├── prd-app.md
│   ├── prd-ecommerce.md
│   ├── assumptions.md
│   ├── debate-log.md
│   └── evidence/
│       ├── competitors.md
│       └── benchmark.md
└── validators/                   ← Python 硬校验
    ├── check_evidence.py
    ├── check_format.py
    └── check_consistency.py
```

## 七、常见问题

### Q: 我可以中途打断吗？

可以。任何阶段说"等等"/"我有问题"/"换个方向" 都会暂停。

### Q: PRD 大师会编造数据吗？

不会。所有数字必须有真实来源 URL 或明确标"假设值"+ 给出假设依据。找不到的标"未找到公开资料"。

### Q: 多 Agent 吵架到底吵几轮？

最多 3 轮。3 轮内收敛不了的分歧标 [OPEN_QUESTION] 给你拍板。

### Q: 我不是企业家，我是 PM 受训过的，能用吗？

能用。但你可能觉得苏格拉底追问太啰嗦——你可以直接把场景锚点写好喂给 Lead PM，跳过阶段 0-1。

### Q: 这能写硬件 / 嵌入式 / 物联网 PRD 吗？

能，但要注意：playbook 还没有专门的硬件版（计划后续加）。当前用 SaaS playbook + 在 lead-pm.md 的产品/技术边界铁律会自动避免技术细节越界。

### Q: PRD 写完直接喂给 Claude Code 写代码，能直接编译运行吗？

PRD 提供完整需求描述，Claude Code 会根据 PRD 设计技术架构、写代码。但是否能直接 run 取决于 PRD 复杂度和 Claude Code 的实际表现。建议先做 MVP 部分。

### Q: 怎么持续迭代 PRD？

- 第一版上线后，用 assumptions.md 逐条验证
- 验证通过 / 证伪的都回头标记到 assumptions.md
- 重大假设证伪 → 触发 PRD 重写（回到阶段 1）

---

## 八、设计原则速查

1. **服务企业家，不是 PM** —— 别用 PM 黑话，别丢空白模板
2. **激进抽取 + 反复追问** —— 但每轮最多 1-2 问，给推荐选项
3. **对模糊驳回** —— "提升体验" → "哪个指标？基线？目标？时间？"
4. **真证据，不编造** —— 找不到就标"未找到"
5. **多角色独立挑刺** —— 4 个 Reviewer 不准互相参考 Round 1 意见
6. **3 轮博弈收敛** —— 收敛不了就让企业家拍板
7. **硬校验，不靠 LLM 自觉** —— Python 脚本拦截，最多 3 轮迭代
8. **假设显性化** —— 把"猜测"变成"可证伪的假设 + 验证方式"

---

## 九、贡献 / 反馈

这是为刘润老师及其学员（企业家）定制的工具。

欢迎：
- 提建议（issue / PR）
- 加新品类 playbook（医疗 / 金融 / 教育 / 硬件等）
- 改进 prompt（让 Lead PM 更懂你的行业）

---

## 十、版本

- v0.1（{今天}）: 初版，10 个核心文件，可跑通最小闭环
- 下一版规划：
  - 加 demo 设计系统（shadcn 基座）
  - 加证据库本地积累机制
  - 加更多品类 playbook
  - 加 PRD 跨项目术语一致性检查
