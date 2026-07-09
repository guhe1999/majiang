# Design System Inspired by Mahjong Project Parse

> Category: Developer Tools
> 一个克制、清晰、可长时间阅读的源码知识工作台。

## 1. 视觉主题与氛围

Mahjong Project Parse 的界面像一张铺在工程桌上的白色蓝图纸。它不是展示“酷”的控制台，也不是面向玩家的游戏界面，而是让团队在复杂 Go 源码前坐下来，把入口、模块、流程、风险和验收点一格一格对齐。浅色背景提供长时间阅读的稳定感，蓝色作为可靠的路线标记，只在关键入口、源码引用和可进入下一步的状态里出现。

用户使用时应感到清醒、可靠、低噪音。lei 需要从文件堆里建立结构感，he 需要从需求想法里判断影响范围，Coding Agent 需要找到可执行的契约入口。这个系统的情绪不是兴奋，而是“终于能看清了”。

选择浅色模式，是因为这是文档阅读和源码对照的长期工作环境。深色控制台会强化技术气氛，但会让表格、长段文字和状态标签在连续阅读时产生负担。这里的视觉策略是像优秀的技术文档和代码审查工具一样，让信息自己站稳。

风格定位参考 Linear 的节制状态表达、GitHub 文档的工程可信感、Notion 的低噪音组织能力，以及 Vercel 文档的留白和排版秩序。它不模仿任何一个产品，而是把它们共同的“清晰”提炼成内部工程知识台。

| 色彩 | Hex | 角色 |
| :--- | :--- | :--- |
| Blueprint Blue | #0b5fba | 源码引用、主操作、可进入下一步 |
| Ink | #172033 | 主要阅读文字 |
| Slate | #667085 | 次级说明和元信息 |
| Paper | #ffffff | 文档卡片和主内容面 |
| Warm Paper | #fbfaf7 | 轻提示、引用说明、辅助区域 |

设计签名是“源码引用 / 验收状态 / 影响范围”三联信息。每一个关键结论旁边都要能看到它来自哪里、是否可靠、会影响什么。这个签名让截图不再像普通文档站，而像专门为源码协作设计的知识台。

## 2. 色彩美学

色彩策略以中性色承载 85% 画面，强调色控制在 5-10%，语义色控制在 0-5%。`--accent` 每屏最多 2 处可见使用，典型是一处主入口和一处状态强调；链接、hover、focus ring 都算强调色使用。

| Token | Hex | 用途 |
| :--- | :--- | :--- |
| --bg | #f7f8fa | 页面底色，提供低噪音环境 |
| --surface | #ffffff | 主卡片和内容面 |
| --surface-warm | #fbfaf7 | 引用块、说明和轻提示 |
| --border | #d9dee8 | 结构边界 |
| --border-soft | #edf0f5 | 弱分隔 |

| Token | Hex | 情感定义 |
| :--- | :--- | :--- |
| --accent | #0b5fba | 可靠路径和工程确认 |
| --success | #137a4b | 已验证和可进入下一步 |
| --warn | #a05a00 | 待补充和需注意 |
| --danger | #b42318 | 越界、缺引用、不可交付 |

| Token | Hex | 可读性 |
| :--- | :--- | :--- |
| --fg | #172033 | 正文和标题，对白底有高对比 |
| --fg-2 | #344054 | 次级标题和强调说明 |
| --muted | #667085 | 帮助文字和摘要 |
| --meta | #8a94a6 | 时间、来源、辅助元信息 |

所有普通文本与主要背景的对比度按 WCAG AA 设计。按钮文字使用 `--accent-on`，保证在 `--accent` 背景上清晰可读。

## 3. 排版与字体

字体使用系统无衬线作为主体，是为了让中文、英文路径、模块名在不同机器上都稳定显示。代码路径与源码引用使用等宽字体，让文件名、模块名和状态标记有可扫描的纵向节奏。

Font labels for catalog extraction:

Display: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Body: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Mono: "SFMono-Regular", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace

字号从 12px 到 48px，页面标题使用 36px 或 48px，卡片标题使用 18px 到 22px，正文保持 16px。正文 `letter-spacing: 0`，小文本 `0.01em`，按钮和标签 `0.02em`，大标题使用 `-0.02em`，ALL CAPS 文本至少 `0.06em`。正文行高 1.65，标题行高 1.15，保证长文档可读。

## 4. 间距体系

间距采用 4px 基准，因为这个工具需要同时容纳表格、路径、状态标签和长文档。4px 节奏让密度可控，不会像消费级卡片那样松散。常用间距从 4px 到 48px，桌面 section 节奏为 72px，平板 56px，手机 40px。

## 5. 布局与空间构成

布局采用左侧导航 + 内容区 + 可选右侧锚点目录。总览页使用 Bento Grid，把解析进度、源码概览、风险、最近文档和下一步入口变成独立认知单元。模块地图、核心流程和影响范围页使用主内容 + 右侧摘要，避免用户在长文档里迷路。

容器最大宽度 1200px，桌面 gutter 32px。卡片圆角不超过 8px，体现工程工具的精确感。层级用细边框和轻投影表达，重要内容浮起，次要说明沉入 `--surface-warm`。

## 6. 组件设计

组件哲学是“每个组件都回答一个工程问题”。按钮表示进入下一步，卡片表示一个可独立理解的信息单元，徽章表示验证状态，引用块表示结论来源。

交互哲学采用色彩响应型：hover 时边框或背景微变，不使用夸张位移。

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 40px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  font: 600 var(--text-sm)/1 var(--font-body);
  letter-spacing: 0.02em;
  transition: border-color var(--motion-fast) var(--ease-standard), background var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard);
}
.btn:hover { border-color: var(--accent); }
.btn:active { background: var(--border-soft); }
.btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.btn-primary { background: var(--accent); color: var(--accent-on); border-color: var(--accent); }
.btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
.btn-primary:active { background: var(--accent-active); border-color: var(--accent-active); }

.card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--elev-ring);
  transition: border-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard);
}
.card:hover { border-color: var(--border); box-shadow: var(--elev-raised); }
.card:focus-within { box-shadow: var(--focus-ring); }

.input {
  min-height: 40px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--fg);
  padding: 0 var(--space-3);
  transition: border-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard);
}
.input:hover { border-color: var(--accent); }
.input:active { border-color: var(--accent-active); }
.input:focus-visible { outline: none; box-shadow: var(--focus-ring); border-color: var(--accent); }

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border-radius: var(--radius-pill);
  padding: 3px var(--space-2);
  border: 1px solid var(--border-soft);
  background: var(--surface-warm);
  color: var(--fg-2);
  font: 600 var(--text-xs)/1 var(--font-body);
}
.badge:hover { border-color: var(--accent); }
.badge:active { background: var(--border-soft); }
.badge:focus-visible { outline: none; box-shadow: var(--focus-ring); }

.source-ref {
  font-family: var(--font-mono);
  color: var(--accent);
  background: color-mix(in oklab, var(--accent), transparent 92%);
  border: 1px solid color-mix(in oklab, var(--accent), transparent 80%);
  border-radius: var(--radius-sm);
  padding: 2px var(--space-2);
}
.source-ref:hover { border-color: var(--accent); }
.source-ref:active { background: color-mix(in oklab, var(--accent), transparent 86%); }
.source-ref:focus-visible { outline: none; box-shadow: var(--focus-ring); }
```

## 7. 动效与交互物理

动效必须像文档翻页一样安静。按钮、卡片和输入框只使用 150ms 到 200ms 的过渡，帮助用户知道元素可交互，但不抢夺阅读注意力。

```css
.fade-in {
  animation: fade-in var(--motion-base) var(--ease-standard) both;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.stagger > * { animation: fade-in var(--motion-base) var(--ease-standard) both; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .stagger > * {
    animation: none;
    transition: none;
  }
}
```

## 8. 品牌情感与声音

品牌像一位安静的资深工程师：可靠、清晰、谨慎、可追溯。空状态不卖萌，只告诉用户缺什么、下一步去哪。Loading 使用骨架屏和“正在读取索引”这类明确文案。404 或缺文档状态要提供回到总览和查看脚本索引的路径。

Agent 设计指令：

1. 永远把源码引用和验收状态放在关键结论旁边。
2. 不要把页面做成营销页或游戏界面。
3. 不要使用大面积彩色卡片。
4. 需要密度，但不要牺牲阅读节奏。
5. 状态色只表达状态，不做装饰。

## 9. 设计禁忌

- 禁止使用深色游戏化界面，因为本产品不是麻将客户端。
- 禁止使用大圆角和卡通插画，因为会削弱工程文档的严谨感。
- 禁止让强调色铺满页面，因为源码引用和关键入口需要保持稀缺。
- 禁止把所有内容堆在单页长文档里，因为用户需要在模块、流程和影响范围之间高频切换。
- 禁止隐藏未验证结论，因为这个产品的价值就是让不确定性可见。
- 禁止脚本操作看起来像可以修改业务代码，因为第一版必须保持源码安全边界。
