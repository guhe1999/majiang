# 开发交接

最后更新：2026-07-11

## 当前状态

- 当前持续开发分支：`jiahe`。
- `jiahe` 已同步 `main` 至提交 `8b56b33`，并已推送到 GitHub。
- 项目当前以青岛麻将“推倒胡”的规则研究、需求解析和研发基线为重点。
- 已建立跨设备 Codex 协作机制：`AGENTS.md`、`CONTEXT.md`、`HANDOFF.md`。

## 最近完成

- 从 GitHub 获取项目并建立本地 `jiahe` 跟踪分支。
- 将 `main` 的最新内容快进同步到 `jiahe`。
- 明确 GitHub 作为家里和公司两台 Mac 的代码及项目上下文同步中心。

## 下一步

1. 在另一台 Mac 克隆仓库或拉取 `jiahe`。
2. 新建 Codex 任务时，要求先阅读 `AGENTS.md`、`CONTEXT.md` 和本文件。
3. 根据 `outline.md` 和青岛麻将资料确定下一项具体研发任务。
4. 每次完成任务后更新本文件并推送。

## 待确认事项

- 青岛推倒胡玩法规则的最终权威来源和版本。
- 首个进入实现阶段的功能模块及验收标准。
- 前后端技术栈、运行方式和部署环境尚需进一步明确。

## 新任务启动提示词

```text
请先阅读 AGENTS.md、CONTEXT.md、HANDOFF.md 和 outline.md，检查当前 jiahe 分支状态，然后从 HANDOFF.md 的下一步继续开发。完成后更新 HANDOFF.md，并提交、推送到 jiahe。
```
