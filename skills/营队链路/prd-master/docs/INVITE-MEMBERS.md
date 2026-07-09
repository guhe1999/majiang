# PRD 大师 · 学员/成员上手指南

> 你被邀请使用「PRD 大师」。这份文档教你从 0 到能跑第一个 PRD，约 15 分钟。

---

## ⚠️ 必读：核心概念 = "工具目录" vs "项目目录"

**这是 90% 新手会困惑的地方，请先看完再操作。**

```
╔══════════════════════════════════════════════════════════╗
║  📦 工具（PRD 大师本体）—— 一次装好，永远不动             ║
║  ~/.claude/skills/prd-master/                            ║
║     ├── SKILL.md                                         ║
║     ├── agents/  docs/  templates/  ...                  ║
║                                                          ║
║  📂 你的项目（每个产品一个独立目录）                       ║
║  ~/code/my-product-A/     ← 第一个产品                    ║
║     ├── PRD.md                                           ║
║     └── src/                                             ║
║                                                          ║
║  ~/code/my-product-B/     ← 第二个产品（独立目录）         ║
║     ├── PRD.md                                           ║
║     └── ...                                              ║
║                                                          ║
║  铁律：                                                   ║
║   ❌ 永远不要 cd 到 ~/.claude/skills/prd-master 跑 PRD     ║
║   ❌ 永远不要把项目文件写到 ~/.claude/skills/prd-master    ║
║   ✅ Claude Code 在哪个目录启动，PRD 就跑在哪个目录        ║
╚══════════════════════════════════════════════════════════╝
```

**类比**：PRD 大师就像 `git` 命令——你装了它（工具），然后在你**自己的项目目录里**用它（在哪里 `git init` 就是哪里的仓库）。`git` 工具本身不在你的项目里。PRD 大师也是这样。

---

## 准备工作（一次性，约 10 分钟）

### Step 1：装 Claude Code

下载安装：https://claude.com/claude-code

支持 Mac / Windows / Linux。装完确认终端能跑 `claude --version`。

### Step 2：装 GitHub CLI（gh）

下载安装：https://cli.github.com/

装完确认终端能跑 `gh --version`。

### Step 3：登录 GitHub

终端跑：

```bash
gh auth login
```

按提示走完（选 GitHub.com → HTTPS → 浏览器登录）。

完成后确认：

```bash
gh auth status
# 应该显示 "Logged in to github.com account {你的用户名}"
```

### Step 4：确认你已被邀请到 prd-master 仓库

打开邮箱，应该有一封 GitHub 邀请邮件，点 "Accept invitation"。

或者直接访问：https://github.com/runliu2me/prd-master —— 看到代码就说明权限 OK。

---

## 拉取 PRD 大师（一次性，约 1 分钟）

终端跑（**3 选 1**，按你的系统选）：

**Mac / Linux**
```bash
gh repo clone runliu2me/prd-master ~/.claude/skills/prd-master
```

**Windows（PowerShell）**
```powershell
gh repo clone runliu2me/prd-master "$HOME\.claude\skills\prd-master"
```

**Windows（Git Bash / WSL）**
```bash
gh repo clone runliu2me/prd-master ~/.claude/skills/prd-master
```

成功的标志：

```bash
ls ~/.claude/skills/prd-master/      # Mac/Linux
dir $HOME\.claude\skills\prd-master\  # Windows
```

能看到 `SKILL.md`、`agents/`、`docs/`、`playbooks/` 等文件夹。

---

## 启动你的第一个 PRD（30-90 分钟）

### Step 1：给你的产品建一个独立项目目录

⚠️ **不是** `~/.claude/skills/prd-master/`（那是工具，不是项目）

```bash
# Mac / Linux
mkdir ~/code/my-product           # 项目目录命名为你产品名（如 my-fba-tool）
cd ~/code/my-product

# Windows PowerShell
mkdir $HOME\code\my-product
cd $HOME\code\my-product
```

每个产品都建一个独立目录。**你做 N 个产品就建 N 个目录**，互不干扰。

### Step 2：在项目目录里启动 Claude Code

```bash
claude
```

**关键**：当前你应该在 `~/code/my-product/` 里，**不是**在 `~/.claude/skills/prd-master/` 里。可以 `pwd` 确认。

### Step 3：触发 PRD 大师

在 Claude Code 里输入：

> 启动 PRD 大师

或

> 用 prd-master 帮我写个产品的 PRD

Claude Code 会自动加载 `~/.claude/skills/prd-master/SKILL.md`（工具），但所有产出文件都落在你当前的 `~/code/my-product/` 里（项目目录）。

### Step 4：跟着流程走

PRD 大师会带你走 6 阶段：

| 阶段 | 你做什么 | 系统做什么 | 时间 |
|------|---------|----------|------|
| 0 自由倾诉 | 用大白话讲你想做什么 | 听 + 回放 + 抽取关键信息 | 1-3 分钟 |
| 1 苏格拉底深挖 | 回答系统的关键问题（每轮 1-2 个） | 把你的模糊想法挖成结构化场景 | 10-20 分钟 |
| 2 自动调研 | 等系统跑 | 自动搜索竞品、行业 benchmark | 5-15 分钟 |
| 3 多 Agent 吵架 | 看四方评审 + 拍板 | 4 个 reviewer 独立挑刺 + 3 轮博弈 | 15-30 分钟 |
| 4 Demo（可选） | 看交互 demo | 出 HTML demo | 10-20 分钟 |
| 5 PRD 终稿 | 等系统跑 + 看结果 | 3 author 协同写 PRD + 校验 | 20-40 分钟 |

每个阶段结束系统会问你"对不对/继续/调整"——按提示拍板。

### Step 5：拿到产出

跑完后，`my-prd-projects/projects/{你的项目名}/` 下会有：

```
├── PRD.md                  ← 完整 PRD（给开发用）
├── PRD-summary.md          ← 老板版（5 分钟）
├── PRD-dev.md              ← 开发版（30 分钟）
├── assumptions.md          ← 待验证假设清单
├── debate-log.md           ← 多 Agent 吵架记录
├── conversation.md         ← 你跟系统的完整对话
└── evidence/               ← 调研数据
```

---

## 拿到 PRD 之后

### 推荐：让 PRD 跟代码住在同一个项目目录

PRD 大师阶段 5.8 会问你"要不要整理目录"——**选"要"**。整理后你的目录变成：

```
~/code/{你的项目名}/
├── PRD.md                  ← 主 PRD（拿去给开发/AI 写代码）
├── PRD-summary.md          ← 老板版（5 分钟看完）
├── PRD-dev.md              ← 开发版（给程序员/AI 编码助手）
├── assumptions.md          ← 上线后逐条验证
├── evidence/               ← 调研数据
├── .prd-history/           ← 过程文物（默认 gitignore）
└── .gitignore
```

**这就是你的项目目录** —— 之后写的代码（src/、tests/）也放在这里，跟 PRD 同步演化。

### 想直接写代码

在这个目录里启动 Claude Code，说：

> 读 PRD-dev.md，按 ~/.claude/skills/prd-master/docs/TDD-WORKFLOW.md 走 TDD 开始实现

详见 `~/.claude/skills/prd-master/docs/TDD-WORKFLOW.md`。

### 想找老板/合伙人讨论

发 `PRD-summary.md`（50 行老板版），不要发完整 PRD。

### 想做迭代

任何时候在项目目录启动 Claude Code 说"继续上次的 PRD"，系统会读 .prd-history/state.json 让你接着上次的进度。

### 不喜欢"PRD + 代码同目录"想分开管理

阶段 5.8 选 B（保留原结构），跑出来的 PRD 都在 `projects/{项目名}/` 下，自己复制到代码项目即可。但要注意 **PRD 改了代码项目要同步**，否则会过期。

---

## 常见问题

### Q: 没收到邀请邮件

- 检查 GitHub 账号绑定的邮箱（可能在 spam）
- 或者直接访问 https://github.com/runliu2me/prd-master —— 如果能看到代码就说明已经有权限
- 找邀请你的人确认 GitHub 用户名输对了

### Q: clone 提示 Permission denied

- `gh auth status` 检查是否登录正确账号
- 邀请是否已 accept（在 https://github.com/notifications 看）
- 重新登录 `gh auth login`

### Q: Claude Code 不识别 skill

- 确认文件路径：`ls ~/.claude/skills/prd-master/SKILL.md` 能看到
- 重启 Claude Code（退出 `/exit` 重新 `claude`）
- 直接在 Claude Code 里输入 "读 ~/.claude/skills/prd-master/SKILL.md 并按它的指示来做"

### Q: 跑到一半中断怎么办

- 直接关 Claude Code
- 下次启动说"继续上次的 PRD"或"继续 fba-smart-restock"
- 系统读 state.json 从中断点接着走

### Q: 我想看真实案例

`~/.claude/skills/prd-master/examples/01-fba-smart-restock/` 是一个完整跑通的 FBA 智能补货 PRD 案例（含场景锚点 → 辩论记录 → V1 方案 → 协同写作 R1+R2+R3 → 终稿 PRD-v2.md）。

特别推荐看 `debate-log.md` —— 学多 Agent 充分博弈是怎么把方案打磨清楚的。

### Q: 我一不小心在 ~/.claude/skills/prd-master/ 里启动 Claude Code 跑了 PRD 怎么办

**症状**：你看到 `~/.claude/skills/prd-master/projects/` 里多了一个项目。

**修复**：

```bash
# 1. 把项目目录移到你想放的位置
mv ~/.claude/skills/prd-master/projects/{你的项目名} ~/code/

# 2. 把工具仓库回滚到干净状态（删掉无关产出）
cd ~/.claude/skills/prd-master
git status         # 看看多出了什么
git clean -fd      # 删除所有未跟踪文件（小心：会删除整个 projects/）
git checkout .     # 撤销所有修改

# 3. 以后在 ~/code/{项目名}/ 里启动 Claude Code，不在工具目录里
```

### Q: 我想同时做多个产品的 PRD

每个产品建一个独立项目目录就行：

```bash
~/code/
├── product-a/      ← 在这里 cd + claude 跑 product-a 的 PRD
├── product-b/      ← 在这里 cd + claude 跑 product-b 的 PRD
└── product-c/      ← 在这里 cd + claude 跑 product-c 的 PRD
```

每个目录里的 PRD 互不干扰。说"继续上次的 PRD"时，要确认你在哪个项目目录里。

### Q: 想贡献新 playbook / agent / 案例

`playbooks/` 加新品类（如医疗 / 金融 / 教育），或 `examples/` 加新案例。提 PR。

### Q: 商业使用 / 二次分发

请联系仓库 owner（刘润）取得授权。

---

## 重要约定

### 关于隐私

- 你跑出来的 PRD 在你本地 `my-prd-projects/projects/` 下，**不会自动上传任何地方**
- 你的对话 + 调研 + 方案都是你自己的
- 如果你愿意分享案例（去敏后），可以 PR 到 `examples/`

### 关于使用

- 这是 v0.3 早期版本，跑通约 60-90 分钟，可能有小 bug
- 遇到问题可以发回反馈（邀请你的人会有渠道）
- 跑完一个项目欢迎分享体验

---

## 一句话总结

```bash
# 一次性装好工具
gh repo clone runliu2me/prd-master ~/.claude/skills/prd-master

# 每做一个新产品：
mkdir ~/code/我的产品名
cd ~/code/我的产品名
claude
> 启动 PRD 大师
```

**记住铁律**：
- 🔒 `~/.claude/skills/prd-master/` = 工具（一次装好不动）
- 📂 `~/code/{产品名}/` = 项目（每个产品独立目录，在这里跑 PRD + 写代码）

祝你跑出第一个让人说"卧槽这就是我想要的"的 PRD。
