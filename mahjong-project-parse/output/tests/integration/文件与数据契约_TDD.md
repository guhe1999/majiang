# TDD 测试设计文档：文件与数据契约

## 1. 单元元信息

| 字段 | 内容 |
| :--- | :--- |
| 测试层 | 集成契约 |
| 单元短码 | `FILE` |
| 对应上游产物 | `测试决策蓝图.md` L3、`页面清单.md`、`技术方案.md` §5 |
| 所属产品 / 模块 | Mahjong Project Parse / 文件与数据契约 |
| 覆盖范围 | `output/`、`pages/`、`tokens.css`、`DESIGN.md`、`document/`、脚本输出 |

## 2. 测试策略

| 优先级 | 测试维度 | 依据来源 | 理由 |
| :--- | :--- | :--- | :--- |
| P0 | 页面清单、页面文档、HTML、同步契约 | 蓝图 L3 | 缺文件会直接破坏交付 |
| P1 | 设计系统、索引字段、脚本输出契约 | 技术方案 §5 / §8 | 保证页面可消费数据 |
| P2 | 命名一致性和辅助元信息 | 页面清单 | 降低维护成本 |

### 2.2 不测什么

- 不测 HTTP API、数据库 schema 或真实麻将前后端接口。

## 3. 测试用例清单

| ID | 用例名称 | 优先级 | Given | When | Then | 预期失败原因 | 来源 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| I-FILE-01 | 页面清单 6 页均有 MD | P0 | `页面清单.md` 声明 6 个 MVP 页面 | 扫描 `output/pages/*.md` | 每页均有对应页面文档 | 缺映射逻辑时漏页不报错 | 页面清单 |
| I-FILE-02 | 页面清单 6 页均有 HTML | P0 | 6 个 MVP 页面已声明 | 扫描 `output/pages/*.html` | 每页均有对应 HTML 原型 | 缺 HTML 时契约检查仍通过 | 页面清单 |
| I-FILE-03 | 页面文档章节完整 | P0 | 给定任一页面 MD | 校验章节标题 | 包含元信息、概述、信息架构、交互、状态、流转、数据、验收标准 | 章节检查未实现时空壳文档通过 | 页面模板 / 蓝图 L3 |
| I-FILE-04 | HTML 与页面文档主标题一致 | P1 | 页面 MD 与 HTML 同名 | 校验页面标题和主区域 | 标题/模块能对应 | 标题不一致时页面与文档脱节 | 蓝图 L3 |
| I-FILE-05 | HTML 跨页链接有效 | P0 | 页面 HTML 中存在导航链接 | 检查链接目标文件 | 目标 HTML 文件存在 | 断链时用户旅程中断但契约通过 | 设计蓝图 §2 |
| I-FILE-06 | tokens.css 与页面 token 使用一致 | P1 | 页面使用状态色、间距、字号 | 校验关键 CSS 变量 | 页面引用的关键 token 在 `tokens.css` 存在 | token 缺失时页面退化但检查不报错 | DESIGN.md / tokens.css |
| I-FILE-07 | 文档索引字段支撑搜索筛选 | P0 | JSON 索引 fixture | 校验字段集合 | 包含 title、path、type、status、sourceRefs、risk、acStatus | 字段缺失时搜索/筛选无法实现 | 技术方案 §5.1 |
| I-FILE-08 | 脚本输出可被验收契约消费 | P1 | 脚本输出文件 fixture | 校验输出字段 | 包含 scriptName、status、startedAt、summary、writeScope | 输出结构不稳定时页面无法展示 | 脚本索引页 §10 |
| I-FILE-09 | output 到 document 同步可检测过期 | P0 | `output/` 文件更新时间晚于 `document/` | 执行同步契约检查 | 标记 document 过期 | 同步检查未实现时旧文档被当成最新 | PRD F5 |
| I-FILE-10 | 业务代码目录不在写入范围 | P0 | 脚本声明写入范围 | 校验写入路径 | `code-back/mahjong` 写入被拒绝 | 越界写入未被契约捕获 | PRD F6 / 蓝图 L5 |

## 4. Mock 策略

| 依赖 | Mock 方式 | 理由 | 关联用例 |
| :--- | :--- | :--- | :--- |
| 文件系统 | 使用临时目录或虚拟文件树 | 不修改真实源码 | 全部 |
| JSON 索引 | 使用 fixture | 验证 schema 而非真实数据量 | I-FILE-07 |

## 5. 实现顺序建议

**P0**：`I-FILE-01 → I-FILE-02 → I-FILE-03 → I-FILE-05 → I-FILE-07 → I-FILE-09 → I-FILE-10`

**P1**：`I-FILE-04 → I-FILE-06 → I-FILE-08`
