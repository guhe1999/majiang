# TDD 工作流：从 PRD 到代码（v0.3 思路 A）

**核心立场**：PRD-master **不写测试代码**。测试代码让 AI 编码助手（Claude Code / Codex / Cursor）写。

本文档教你：拿到 PRD-master 输出的 PRD 后，**怎么跟 AI 编码助手走 TDD 红绿重构循环**。

---

## 为什么 TDD

不做 TDD 的代价：
- AI 编码助手凭"看起来合理"写代码，可能跟 PRD 隐性偏差
- 没有红→绿的反馈循环，重构会引入回归
- 缺乏可执行的"做完了"标准（PRD §10 AC 是描述性的，测试是可执行的）

做 TDD 的收益：
- **每个 AC 都被翻译成可跑的测试** → 真正"做完"看绿不看嘴
- **AI 编码助手有边界** → 写出的代码必须让测试通过，不能信口开河
- **回归保护** → 重构时跑测试就知道改坏没

---

## 标准三步循环（红 → 绿 → 重构）

```
1. 红 (RED)    : 写测试，确认全部失败
2. 绿 (GREEN)  : 写最小实现让测试通过
3. 重构 (REFACTOR): 改进代码结构，测试保持绿
```

每个 AC 走一遍这个循环。

---

## 标准 prompt 模板（跟 AI 编码助手说）

### 一次性铺底（项目启动时一次）

```
我有一份 PRD：{PRD.md 路径}

接下来我们按 TDD 方式实现。请：
1. 读完整个 PRD，重点关注 §3 算法、§4 数据模型、§5 详细功能、§10 验收标准
2. 告诉我你对 PRD 的理解（核心目标 + 关键约束 + 你看到的潜在风险）
3. 提议项目目录结构 + 推荐的测试框架（基于 §8 技术栈建议）
4. 提议工时分阶段（先做 §10 哪些 AC，分几个 milestone）

我看完你的提议后会决定开工方式。
```

### 阶段 1：红（写测试让全失败）

```
现在开始 TDD 第 1 步：基于 PRD §10 的 AC-XXX 到 AC-YYY（先做 P0 主流程 AC），
用 {pytest / vitest / playwright} 写测试。

要求：
- 每个 AC 一个测试函数，函数名带 AC ID（如 def test_AC_001_xxx）
- 测试要能跑（语法没错）但全部失败（因为还没实现）
- 跑一次确认：所有测试都 fail 且 fail 原因是"模块/函数不存在"，不是"测试本身写错"
- 不要写实现代码

跑完给我看 pytest output，确认全红。
```

### 阶段 2：绿（写最小实现）

```
TDD 第 2 步：从 AC-001 开始，写最小实现让它变绿。

要求：
- 只写让 AC-001 通过所需的代码，不要"顺便实现 AC-002"
- 代码风格优先"清楚"，不优先"优雅"
- 跑测试，AC-001 变绿即可
- AC-002 到 AC-N 继续保持红

跑完给我看 pytest output，AC-001 绿，其他红。
```

依次做 AC-002、AC-003 ... 直到全绿。

### 阶段 3：重构（结构改进）

```
TDD 第 3 步：现在所有 P0 AC 都绿了。重构以下方面：
1. 提取重复代码为函数/类
2. 命名优化（用 PRD §12 术语表）
3. 拆分超过 30 行的函数

每改一次跑一次测试，必须保持全绿。如果一改就红，说明重构破坏了行为，撤回。
```

### 阶段 4：补 P1/P2 AC

回到阶段 1，把 P1 AC 加进来走红→绿→重构。再 P2。

---

## 不同技术栈的命令示例

### Python 后端（pytest）

```bash
# 红
pytest tests/  # 期望全红

# 绿（写完一个 AC 实现后）
pytest tests/test_xxx.py::test_AC_001  # 期望绿

# 全跑
pytest --cov=src tests/  # 覆盖率
```

### TS/JS Web（Vitest）

```bash
# 红
npx vitest run  # 期望全红

# 绿
npx vitest run -t "AC-001"

# Watch 模式（开发时用）
npx vitest
```

### Web E2E（Playwright）

```bash
# 安装
npx playwright install chromium

# 红
npx playwright test e2e/  # 期望全红

# 绿
npx playwright test e2e/AC-001.spec.ts --headed  # headed 模式肉眼看
```

### Mobile（iOS XCTest / Android Espresso）

mobile 项目的 TDD 节奏不一样——E2E 跑得慢，建议：
- unit test 走完整 TDD 红绿重构
- E2E 测试只覆盖关键流程，作为 smoke test 而非 TDD 节奏

---

## PRD 4 件硬校验 vs TDD 校验的衔接

| 校验 | 何时跑 | 关系 |
|------|-------|------|
| `check_evidence.py` | PRD 定稿前 | PRD 内部的证据合规 |
| `check_format.py` | PRD 定稿前 | PRD 内部的格式 |
| `check_consistency.py` | PRD 定稿前 | PRD 内部的 PASS/FAIL |
| `check_executability.py` | PRD 定稿前 | PRD 能否给 AI 写代码 |
| **TDD 红绿** | **代码开发期** | **PRD AC 能否真正通过测试** |

前 4 件是 PRD 阶段的事，TDD 是代码阶段的事。**前 4 件全过 = PRD 可发 → TDD 才有意义**。

如果 `check_executability.py` < 60%（PRD 还不能给 AI 写代码），不要急着进 TDD，先回去补 PRD。

---

## 常见问题

### Q1：AC 写得太粗，转不成测试怎么办

例：AC = "用户能成功下单"——太粗。
应该：回 PRD §10，把它拆细：
- AC-N.1: 输入有效信用卡 → 看到成功提示 + 订单号
- AC-N.2: 输入无效信用卡 → 看到错误提示 + 不创建订单
- AC-N.3: 网络超时 → 看到重试按钮 + 不重复扣款

**这是 PRD 的责任，不是 TDD 的责任**。PRD-master 的 §10 应该已经做到这个粒度（PRD-v2 §10.A 自动化测试矩阵有 60+ 条 AC 就是这个意思）。

### Q2：测试要不要 mock 外部依赖

3 层金字塔：
- **Unit Test**：mock 外部依赖（数据库、API）
- **Integration Test**：用真实依赖的测试副本（test DB、mock server）
- **E2E Test**：用近生产环境

比例建议（Martin Fowler 测试金字塔）：
- 70% unit
- 20% integration
- 10% E2E

### Q3：覆盖率多少算够

- **业务核心模块**：> 90%
- **基础设施**：> 80%
- **UI / 胶水代码**：> 60%

但**覆盖率高不等于质量高**。一个 100% 覆盖率但只测 happy path 的测试套件，价值不如 70% 覆盖但测了所有 PRD §10 异常分支的。

### Q4：AI 编码助手写的测试可信吗

**默认不可信**。每次让 Claude Code 写完测试，你必须：
1. **读测试代码**（不要只看"全过"）—— 看测试到底测了什么
2. **故意改坏实现**，看测试能不能抓到（mutation testing 的思想）
3. **跑覆盖率**看哪些路径没被覆盖

AI 经常写"装饰性测试"——看起来覆盖了 AC 但实际没测核心逻辑。

### Q5：什么时候停止 TDD

- 所有 P0 AC 绿
- 所有 P1 AC 绿
- P2 AC 按需做（如果时间紧可以延后）
- 覆盖率达标
- mutation test 通过率 > 70%（可选高阶）

然后进入"功能测试 + 性能测试 + 安全测试"阶段（这些在 PRD §10.B 测试数据规范 / §10.C 回归基线里有）。

---

## 一个完整的端到端流程（参考）

假设你有 PRD-master 跑出来的 `PRD.md`，下面是从 0 到第一个绿测试的标准流程：

```
1. 在 IDE 打开一个新项目目录
2. 把 PRD.md 复制到项目根目录
3. 启动 Claude Code

4. 你: 我有一份 PRD ./PRD.md。请按本仓库 /docs/TDD-WORKFLOW.md 流程，
       从"一次性铺底"开始。

5. Claude Code: [读 PRD，提议项目结构 + 测试框架 + milestone]

6. 你: 同意。开始 TDD 第 1 步：基于 §10 P0 主流程 AC 写测试，全失败。

7. Claude Code: [写 tests/，跑 pytest，给你看全红 output]

8. 你: 绿。从 AC-001 开始写最小实现。

9. Claude Code: [写 src/，跑 pytest，AC-001 绿其他红]

10. 你: 继续 AC-002。
... 循环 ...
```

---

## 给企业家的话

如果你不是开发者，TDD 的细节你不用管。你只需要：

1. 拿到 PRD 后给开发团队/外包/AI 编码助手
2. 让他们走 TDD 流程（这份文档给他们）
3. 你定期问："P0 AC 多少绿了？P1 呢？"——这是个**透明的进度**

不要相信"做得差不多了"——绿的才算做完。
