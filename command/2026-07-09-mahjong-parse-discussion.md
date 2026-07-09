# 2026-07-09 Mahjong 项目解析讨论记录

## 用户目标

用户希望将已有项目 `code-back/mahjong` 解析到当前项目目录结构中：

- `code-front/`：存放前端代码。
- `command/`：存放用户与 Codex 的对话记录。
- `document/`：存放项目文档，也就是解析之后沉淀的文档。
- `script/`：存放脚本文件。

## 当前共识

- 先讨论可行性。
- 暂不深入分析业务代码。
- 可以先扫描目录结构，形成解析计划草案。
- 原始项目 `code-back/mahjong` 暂时不修改、不迁移。

## 已执行的只读检查

- 确认当前工作目录：`/Users/mac/majiang-1`。
- 确认顶层目录已存在：
  - `code-back/`
  - `code-front/`
  - `command/`
  - `document/`
  - `script/`
- 确认 `code-back/mahjong` 当前包含：
  - `mahjong.go`
  - `cmds/cmds.go`
  - `engine/*.go`
- 粗略统计 `code-back/mahjong` Go 代码约 8129 行。

## 生成产物

- `document/mahjong-parse-plan.md`
- `command/2026-07-09-mahjong-parse-discussion.md`

## 待确认事项

- 下一阶段是否允许进入只读代码解析。
- 是否需要修正各目录 README 的描述，使其与目录职责一致。
- 是否需要添加结构扫描脚本到 `script/`。
