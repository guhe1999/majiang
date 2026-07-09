# 项目状态管理 + 快速恢复协议（v0.3 P1-6）

**问题**: 当前 PRD 大师没有"项目状态文件"。企业家中断 3 天回来，Controller 只能靠**读 conversation.md + 猜**来恢复上下文——慢且不可靠。

**v0.3 改进**: 每个项目目录维护一个 `state.json`，跟踪当前阶段、未解决问题、上次行动。"继续上次"协议明确化。

---

## state.json 结构

```json
{
  "project_name": "fba-smart-restock",
  "project_started_at_utc": "2026-05-23T10:00:00Z",
  "last_updated_at_utc": "2026-05-23T14:32:00Z",
  
  "current_stage": "5.4",
  "current_substep": "controller-merging",
  "completed_stages": ["0", "1", "2", "3.1", "3.2", "3.3", "3.4", "3.5", "5.1", "5.2", "5.3"],
  "skipped_stages": ["4"],
  
  "next_action": {
    "type": "user_decision",
    "description": "等企业家拍板：V1 方案对吗？",
    "askuserquestion_options": ["接受 V1 走终稿", "继续吵一轮", "大方向调整"]
  },
  
  "open_questions": [
    {"id": "OQ-1", "title": "ROI 算清楚", "category": "strategy", "priority": "P0"},
    {"id": "OQ-2", "title": "影子模式 SKU 选择", "category": "operations", "priority": "P1"}
  ],
  
  "key_decisions_made": [
    {"id": "D-1", "decision": "v1 用虚拟数据集 + 影子真实 SKU", "stage": "1", "rationale": "..."},
    {"id": "D-2", "decision": "每日决策（不是每周）", "stage": "1"}
  ],
  
  "category": "saas",
  "prd_type": "feature",
  
  "agents_used": {
    "lead_pm_calls": 5,
    "reviewer_calls": 8,
    "author_calls": 6,
    "total_tokens_estimated": 250000
  },
  
  "deliverables": {
    "scene_anchor": "scene-anchor.md",
    "proposal_v0": "proposal-v0.md",
    "proposal_v1": "proposal-v1.md",
    "debate_log": "debate-log.md",
    "assumptions": "assumptions.md",
    "conversation": "conversation.md",
    "evidence": ["evidence/competitors.md", "evidence/benchmark.md"],
    "drafts": ["drafts/r1-pm.md", "drafts/r1-architect.md", "drafts/r1-engineer.md", "..."],
    "final_prd": null,
    "prd_summary": null,
    "prd_dev": null
  },
  
  "user_inputs_log": [
    {"stage": "1.1", "timestamp": "...", "summary": "选 SaaS 品类"},
    {"stage": "1.2", "timestamp": "...", "summary": "选 CEO 拍板模式"}
  ]
}
```

## Controller 何时更新 state.json

- 每次阶段切换（如 0→1、3.5→5.1）
- 每次跑完 agent（更新 agents_used）
- 每次企业家拍板（写入 key_decisions_made）
- 每次发现新 OQ（写入 open_questions）
- 每次输出文件（更新 deliverables）

**写入方式**：用 Read + Write 原子操作（先读再覆盖）。

## 启动协议改进

当用户说"启动 PRD 大师"或"继续上次的 PRD"时，Controller：

### Step 1: 扫描已有项目

```bash
ls -d */  # 找出所有项目（每个项目=工作区下一个以项目名命名的目录）
```

每个项目读 `state.json`，按 `last_updated_at_utc` 倒序。

### Step 2: 用 AskUserQuestion 让用户选

```
question: "我看到你有几个进行中的项目"
options:
  - "继续 fba-smart-restock（上次到阶段 5.4，2 天前）"
  - "继续 xxx-xxx（上次到阶段 1.3，1 周前）"
  - "开始新项目"
```

### Step 3a: 选"继续"

Controller 读对应 state.json 的 `next_action` 字段，**直接执行那个 action**（如发对应 AskUserQuestion）。

同时给企业家一份"上次进度回顾"行动卡：

```
📌 你上次的项目: fba-smart-restock（FBA 智能补货决策引擎）

📍 上次进度：阶段 5.4（Controller 合并 PRD 中）
🎯 已完成: 3 author R1+R2+R3 写完
⏸ 暂停原因: 你说"我先想想"

🔄 现在你需要做的:
   {next_action.description}

📚 你想先看历史吗？
   - 看场景锚点 scene-anchor.md
   - 看 V1 方案 proposal-v1.md
   - 看 5 个待拍板的 OPEN_QUESTION
```

### Step 3b: 选"开始新项目"

走标准启动协议。

## 快速恢复的 3 种场景

### 场景 A: 1 小时内继续

直接读 state.json 的 `next_action`，立刻执行。无需任何展示。

### 场景 B: 1 天-1 周回来

展示"上次进度回顾"行动卡（见 Step 3a），让用户决定是否需要先回看历史。

### 场景 C: 1 周以上回来

主动展示：
- 上次场景锚点（提醒"你当时想的是这个"）
- 上次 V1 方案
- 上次未解决的 OPEN_QUESTION
- 询问"过去 X 天有什么变化吗？要更新场景理解吗？"

如果用户说"有变化"→ 回到阶段 0 重做激进抽取（输入 = 老场景 + 新变化）

---

## state.json 跟 conversation.md 的区别

| 文件 | 用途 | 写入方式 |
|------|------|---------|
| `state.json` | 结构化状态（机器读） | Controller 自动维护 |
| `conversation.md` | 完整对话存档（人读） | Controller 累加追加 |

state.json 是 conversation.md 的"索引"。conversation.md 是史诗，state.json 是 TOC。

## 兜底机制

如果 state.json 损坏或缺失：

```python
# Controller 启动时
if not state_json.exists():
    # 重建：扫描 deliverables 目录推断状态
    if PRD.md exists: state.current_stage = "完成"
    elif draft/r3-*.md exists: state.current_stage = "5.3"
    elif proposal-v1.md exists: state.current_stage = "3.5"
    elif scene-anchor.md exists: state.current_stage = "1.5"
    else: state.current_stage = "0"
```

## 工作量

新增维护成本：每次阶段切换额外 1 个 Write 调用。

回报：
- 中断恢复体验大幅改善
- 多项目并行管理变可能
- 教学/分析用（统计每阶段 token 消耗、平均时长等）
