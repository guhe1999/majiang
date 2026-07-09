# Mahjong 项目解析计划草案

生成日期：2026-07-09

## 目标

将已有项目 `code-back/mahjong` 按当前仓库约定进行解析、记录和后续整理，为后续前后端拆分、文档沉淀、脚本化辅助和可能的重构迁移做准备。

当前阶段只基于目录结构与文件清单判断，不分析业务代码、不修改原项目代码。

## 当前目录约定

- `code-back/`：后端代码目录，当前已有 `mahjong` 项目。
- `code-front/`：前端代码目录，后续如需补充管理后台、调试界面、牌局回放或客户端页面，可放在这里。
- `command/`：对话记录、操作记录、关键决策记录。
- `document/`：项目文档，包括架构、模块、接口、数据结构、部署和迁移计划。
- `script/`：辅助脚本，包括目录扫描、文档生成、启动检查、测试辅助等。

## 已观察到的 Mahjong 项目结构

```text
code-back/mahjong
├── mahjong.go
├── cmds
│   └── cmds.go
└── engine
    ├── base.go
    ├── card.go
    ├── engine.go
    ├── failover.go
    ├── generate.go
    ├── match_hfs.go
    ├── match_hytw.go
    ├── match_jd.go
    ├── room.go
    ├── room_before.go
    ├── room_daemon.go
    ├── room_end.go
    ├── room_info.go
    ├── room_log.go
    ├── room_manage.go
    ├── room_run.go
    ├── rpc.go
    ├── task.go
    ├── user.go
    ├── user_hd.go
    ├── user_hd_handle.go
    ├── user_hd_hint.go
    ├── user_hd_play.go
    ├── user_info.go
    ├── user_manage.go
    └── user_run.go
```

## 初步判断

- 项目形态：Go 后端项目或 Go 后端子模块。
- 主要代码集中在 `engine/`，疑似包含麻将核心逻辑、房间生命周期、用户状态、出牌处理、匹配规则、RPC 交互等。
- `cmds/` 可能存放命令或外部调用封装。
- `mahjong.go` 可能是包入口或统一导出文件。
- 当前没有看到前端代码迹象，`code-front/` 可暂时保持为空或作为后续调试/管理界面位置。

以上判断均来自文件名和目录结构，需要后续阅读代码后确认。

## 建议解析顺序

1. 项目元信息
   - 确认 Go module、包名、依赖来源、构建方式、运行方式。
   - 输出到 `document/mahjong-overview.md`。

2. 模块边界
   - 梳理 `mahjong.go`、`cmds/`、`engine/` 的职责边界。
   - 输出到 `document/mahjong-module-map.md`。

3. 核心领域模型
   - 梳理房间、用户、牌、牌局、匹配、任务等核心结构。
   - 输出到 `document/mahjong-domain-model.md`。

4. 房间与牌局流程
   - 梳理房间创建、准备、开始、运行、结算、结束、异常恢复流程。
   - 输出到 `document/mahjong-room-flow.md`。

5. 用户行为与操作处理
   - 梳理用户进入、离开、准备、出牌、碰杠胡、托管或超时等行为。
   - 输出到 `document/mahjong-user-actions.md`。

6. 接口与外部依赖
   - 梳理 RPC、命令、外部服务、日志、持久化或容错相关逻辑。
   - 输出到 `document/mahjong-integration.md`。

7. 迁移与整理建议
   - 判断是否需要拆分前端、是否需要新增脚本、是否需要重排目录。
   - 输出到 `document/mahjong-migration-plan.md`。

## 建议产物

- `document/mahjong-overview.md`
- `document/mahjong-module-map.md`
- `document/mahjong-domain-model.md`
- `document/mahjong-room-flow.md`
- `document/mahjong-user-actions.md`
- `document/mahjong-integration.md`
- `document/mahjong-migration-plan.md`
- `command/2026-07-09-mahjong-parse-discussion.md`
- `script/scan-mahjong-structure.sh`（可选）

## 当前阶段边界

- 不移动 `code-back/mahjong`。
- 不修改业务代码。
- 不生成前端代码。
- 不运行依赖安装。
- 不做业务规则结论，只记录可验证事实和待确认项。

## 下一步建议

下一步可以进入“只读代码解析”阶段，优先读取入口文件、包声明、依赖导入和核心结构定义，而不是逐行分析全部逻辑。这样可以快速建立项目地图，再决定是否需要更深的业务流程文档。
