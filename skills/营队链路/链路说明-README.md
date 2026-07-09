# 营队链路 Skills 包

把"一个想法"一站到底变成"Coding Agent 能直接开工的全套交付物"。三个 skill 串成一条流水线，每一步吃上一步的产物，最后交给 Claude Code `/go` 写代码。

## 链路总览

```
prd-master ──► design-master ──► tdd-master ──► Coding Agent /go
   │               │                  │              │
产出            产出               产出            消费
PRD详细版.md   技术方案.md          tests/          读 GOAL 契约
              设计决策蓝图.md       验收门禁与        → 生成可执行测试
              DESIGN.md+tokens.css  GOAL契约.md      → 红绿重构
              页面清单+pages/*.md                    → 全绿才算交付
```

| 步 | Skill | 触发 | 吃什么 | 产出什么 |
|----|-------|------|--------|----------|
| 1 | **prd-master** | "做prd / 做个产品" | 一句话想法 | `PRD详细版.md`（+老板版/开发版） |
| 2 | **design-master** | "做设计 / 接着做设计" | `PRD详细版.md` | `技术方案.md` + `设计决策蓝图.md` + `DESIGN.md` + `tokens.css` + 页面清单 + `pages/*.md` + `pages/*.html` |
| 3 | **tdd-master** | "做TDD / 接着做测试" | PRD + 技术方案 + pages/*.md | 分层 `tests/` + ⭐`验收门禁与GOAL契约.md` |
| 4 | **Coding Agent** | `/go`（GOAL 模式） | 验收门禁与GOAL契约.md | 真代码，全绿交付 |

> 第 4 步不是本包里的 skill，是 Claude Code / Codex 等 Coding Agent 自带的 `/go` GOAL 模式。tdd-master 的产物就是喂给它当"完成定义"的。

## 安装

把三个目录拷到 `~/.claude/skills/`：

```bash
bash 安装.sh
# 或手动：
# cp -R prd-master design-master tdd-master ~/.claude/skills/
```

装完在 Claude Code 里直接说"做prd"即可触发第一步，后面每步说"接着做设计 / 接着做测试"顺着走。

## 各 skill 内部结构

- **prd-master**：`SKILL.md` 主流程 + `agents/`（多角色评审：Lead PM / 技术/产品/商业/战略 reviewer）+ `docs/`（协议与陷阱）+ `templates/` + `playbooks/`（电商/SaaS/App/通用）+ `validators/`（格式/一致性/可执行性 Python 校验）+ `examples/`（FBA 智能补货完整范例）。
- **design-master**：`SKILL.md` 两阶段主流程 + `references/`（设计系统设计师/展示页/页面清单规划师/页面文档/HTML 开发师/页面串联器/页面模板/技术方案架构 共 8 份规范）。合并了原 design + prototype + tech 三个 master。
- **tdd-master**：`SKILL.md` 两阶段主流程 + `references/`（分层测试设计规范/测试单元设计师/TDD 模板/⭐验收门禁与GOAL契约规范）。按测试金字塔分层，产物给 Coding Agent 当验收门禁。

## 版本备注

- design-master 已合并旧的 prototype-master + tech-master 能力，链路里只需这一步。
- 本包不含 ppt-master（链路另一支，做汇报用），如需可单独取。
