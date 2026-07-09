脚本

## GOAL 门禁验证

运行解析工作台第一版的 Coding Agent 验收门禁：

```bash
node script/validate-goal.mjs
```

验证范围来自 `mahjong-project-parse/output/tests/验收门禁与GOAL契约.md`，当前会执行 108 条 P0/P1 契约检查，并输出报告到：

```text
mahjong-project-parse/output/goal-validation-report.json
```
