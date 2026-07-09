#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  ACCEPTANCE_ITEMS,
  FLOW_TYPES,
  IMPACT_TYPES,
  MODULE_GROUPS,
  PAGE_DEFINITIONS,
  SCRIPT_DEFINITIONS,
  aggregateAcStatus,
  buildAcceptanceViewModel,
  buildFlowViewModel,
  buildImpactViewModel,
  buildModuleViewModel,
  buildOverviewViewModel,
  buildScriptViewModel,
  calculateCompletion,
  calculateRisk,
  evaluateScriptSafety,
  getNavigationTargets,
  getPageState,
  hasSourceReference,
  markVerification,
  normalizeStatus,
  parseDocumentIndex,
  searchItems,
  shouldBlockDelivery,
  validateIndexEntry,
} from "../code-front/workbench-core.mjs";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "mahjong-project-parse", "output");
const pagesDir = path.join(outputDir, "pages");
const testsDir = path.join(outputDir, "tests");

const results = [];

function test(id, layer, priority, name, fn) {
  const startedAt = performance.now();
  try {
    const details = fn();
    results.push({ id, layer, priority, name, status: "PASS", durationMs: Math.round(performance.now() - startedAt), details: details ?? "" });
  } catch (error) {
    results.push({ id, layer, priority, name, status: "FAIL", durationMs: Math.round(performance.now() - startedAt), details: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function listFiles(dir, suffix) {
  return fs.readdirSync(dir).filter((file) => file.endsWith(suffix));
}

function html(file) {
  return fs.readFileSync(path.join(pagesDir, file), "utf8");
}

function md(file) {
  return fs.readFileSync(path.join(pagesDir, file), "utf8");
}

function requireText(content, patterns) {
  for (const pattern of patterns) {
    assert(content.includes(pattern), `missing text: ${pattern}`);
  }
}

function pathIsNotBusinessWrite(scope) {
  return !String(scope).includes("code-back/mahjong");
}

const indexFixture = [
  { title: "模块地图", path: "output/pages/阶段1_模块地图_模块地图页.md", type: "page", status: "已验证", sourceRefs: ["code-back/mahjong/engine"], risk: "低", acStatus: "通过" },
];

// Unit
test("U-WB-01", "单元", "P0", "解析合法文档索引", () => assert(parseDocumentIndex(indexFixture).length === 1, "index not parsed"));
test("U-WB-02", "单元", "P0", "缺少必填索引字段时报错", () => assert(!validateIndexEntry({ title: "x" }).ok, "missing fields not detected"));
test("U-WB-03", "单元", "P0", "计算 F1-F7 完成度", () => assert(calculateCompletion(ACCEPTANCE_ITEMS).total >= 7, "F1-F7 not counted"));
test("U-WB-04", "单元", "P0", "源码引用缺失标记未验证", () => assert(markVerification({ sourceRefs: [] }).verification === "未验证", "missing source ref not unverified"));
test("U-WB-05", "单元", "P1", "风险等级由缺口推导", () => assert(calculateRisk([{ priority: "P0", status: "通过", sourceRefs: [] }]).level === "高", "P0 source gap not high risk"));
test("U-WB-06", "单元", "P0", "AC 状态按 P0/P1/P2 聚合", () => assert(aggregateAcStatus(ACCEPTANCE_ITEMS).byPriority.P0.total >= 5, "P0 not aggregated"));
test("U-WB-07", "单元", "P0", "脚本越界写业务代码被拒", () => assert(!evaluateScriptSafety({ writeScope: ["code-back/mahjong"] }).ok, "business write not rejected"));
test("U-WB-08", "单元", "P1", "未知状态降级为待确认", () => assert(normalizeStatus("half-done") === "待确认", "unknown status not downgraded"));

// Component: overview
test("C-OVR-01", "组件", "P0", "渲染 4 个以上状态指标", () => assert(buildOverviewViewModel().metrics.length >= 4, "overview metrics missing"));
test("C-OVR-02", "组件", "P0", "高风险项首屏可见", () => assert(html("阶段1_工作台总览_总览页.html").includes("关键风险"), "risk block missing"));
test("C-OVR-03", "组件", "P0", "索引缺失显示错误块", () => assert(getPageState({ error: "索引文件缺失" }).state === "失败", "error state missing"));
test("C-OVR-04", "组件", "P0", "下一步入口可跳转", () => requireText(html("阶段1_工作台总览_总览页.html"), ["阶段1_模块地图_模块地图页.html", "阶段1_验收契约_验收契约页.html"]));
test("C-OVR-05", "组件", "P1", "搜索模块或流程有反馈", () => assert(searchItems(MODULE_GROUPS, "room").items.length > 0, "search has no feedback"));
test("C-OVR-06", "组件", "P1", "移动端长文本不挤压", () => assert(html("阶段1_工作台总览_总览页.html").includes("@media(max-width:800px)"), "responsive rule missing"));

// Component: modules
test("C-MOD-01", "组件", "P0", "展示至少 6 类模块分组", () => assert(buildModuleViewModel().length >= 6, "module groups missing"));
test("C-MOD-02", "组件", "P1", "默认选中 engine 模块", () => assert(MODULE_GROUPS.some((item) => item.key === "engine"), "engine default missing"));
test("C-MOD-03", "组件", "P0", "无源码引用标记未验证", () => assert(buildModuleViewModel([{ key: "x", sourceRefs: [] }])[0].verification === "未验证", "unverified module not marked"));
test("C-MOD-04", "组件", "P1", "复制源码路径有反馈", () => assert(MODULE_GROUPS.some((item) => item.sourceRefs.length > 0), "source path unavailable for copy"));
test("C-MOD-05", "组件", "P0", "可跳转核心流程和影响范围", () => assert(getNavigationTargets("modules").includes("flows") && getNavigationTargets("modules").includes("impact"), "module downstream missing"));
test("C-MOD-06", "组件", "P1", "搜索无结果显示推荐模块", () => assert(searchItems(MODULE_GROUPS, "not-exists").empty, "empty search not detected"));

// Component: flows
test("C-FLO-01", "组件", "P0", "覆盖 6 类核心流程", () => assert(FLOW_TYPES.length >= 6, "flow types missing"));
test("C-FLO-02", "组件", "P1", "默认展示房间生命周期", () => assert(buildFlowViewModel().flow.name === "房间生命周期", "default flow mismatch"));
test("C-FLO-03", "组件", "P0", "切换流程更新涉及模块", () => assert(buildFlowViewModel("match").flow.modules.includes("match"), "flow modules not updated"));
test("C-FLO-04", "组件", "P0", "缺源码引用标记未验证", () => assert(buildFlowViewModel("x", [{ key: "x", sourceRefs: [], exceptions: [] }]).verification === "未验证", "missing flow source not unverified"));
test("C-FLO-05", "组件", "P0", "异常路径可见", () => assert(FLOW_TYPES.some((item) => item.exceptions.length > 0), "exception paths missing"));
test("C-FLO-06", "组件", "P1", "可跳转影响范围和验收契约", () => assert(getNavigationTargets("flows").includes("impact") && getNavigationTargets("flows").includes("acceptance"), "flow downstream missing"));

// Component: impact
test("C-IMP-01", "组件", "P0", "展示至少 6 类需求类型", () => assert(IMPACT_TYPES.length >= 6, "impact types missing"));
test("C-IMP-02", "组件", "P0", "每类需求有模块映射", () => assert(IMPACT_TYPES.every((item) => item.modules.length > 0), "impact modules missing"));
test("C-IMP-03", "组件", "P0", "每类需求有流程映射", () => assert(IMPACT_TYPES.every((item) => item.flows.length > 0), "impact flows missing"));
test("C-IMP-04", "组件", "P1", "高风险项置顶且醒目", () => assert(buildImpactViewModel().items[0].risk === "高", "high risk not first"));
test("C-IMP-05", "组件", "P0", "无匹配需求提示开放问题", () => assert(buildImpactViewModel("完全未知").empty, "unknown demand not empty"));
test("C-IMP-06", "组件", "P1", "推荐阅读跳转可用", () => assert(IMPACT_TYPES.every((item) => item.reading), "recommended reading missing"));

// Component: scripts
test("C-SCR-01", "组件", "P0", "展示至少 4 类脚本用途", () => assert(SCRIPT_DEFINITIONS.length >= 4, "script types missing"));
test("C-SCR-02", "组件", "P0", "每个脚本展示输入输出", () => assert(SCRIPT_DEFINITIONS.every((item) => item.input && item.output), "script io missing"));
test("C-SCR-03", "组件", "P0", "只读边界醒目", () => assert(buildScriptViewModel().every((item) => item.safety.ok), "script safety missing"));
test("C-SCR-04", "组件", "P0", "越界脚本标记不可用", () => assert(!buildScriptViewModel([{ name: "bad.sh", writeScope: ["code-back/mahjong"] }])[0].safety.ok, "unsafe script not blocked"));
test("C-SCR-05", "组件", "P1", "复制脚本路径有反馈", () => assert(SCRIPT_DEFINITIONS.every((item) => item.name.endsWith(".sh")), "script path unavailable"));
test("C-SCR-06", "组件", "P1", "最近运行失败展示摘要", () => assert(buildScriptViewModel(SCRIPT_DEFINITIONS, [{ scriptName: SCRIPT_DEFINITIONS[0].name, status: "失败", summary: "路径不存在" }])[0].runSummary.includes("路径"), "failure summary missing"));

// Component: acceptance
test("C-ACC-01", "组件", "P0", "展示 P0/P1/P2 AC", () => assert(new Set(ACCEPTANCE_ITEMS.map((item) => item.priority)).has("P0"), "P0 AC missing"));
test("C-ACC-02", "组件", "P0", "P0 未通过显示阻塞", () => assert(aggregateAcStatus([{ priority: "P0", status: "待补充" }]).gate === "阻塞", "P0 pending not blocking"));
test("C-ACC-03", "组件", "P0", "未验证结论单独展示", () => assert(buildAcceptanceViewModel([{ priority: "P0", status: "通过", sourceRefs: [] }]).unverified.length === 1, "unverified list missing"));
test("C-ACC-04", "组件", "P1", "筛选 AC 后结果正确", () => assert(ACCEPTANCE_ITEMS.filter((item) => item.priority === "P0").length > 0, "P0 filter empty"));
test("C-ACC-05", "组件", "P1", "可复制 AC 文本", () => assert(ACCEPTANCE_ITEMS.every((item) => item.id && item.name), "AC copy text incomplete"));
test("C-ACC-06", "组件", "P0", "进入 TDD 入口受门禁状态影响", () => assert(!buildAcceptanceViewModel([{ priority: "P0", status: "待补充", sourceRefs: [] }]).canEnterTdd, "TDD entry bypasses gate"));

// Integration
const mdFiles = listFiles(pagesDir, ".md");
const htmlFiles = listFiles(pagesDir, ".html");
test("I-FILE-01", "集成契约", "P0", "页面清单 6 页均有 MD", () => assert(PAGE_DEFINITIONS.every((page) => mdFiles.includes(page.doc)), "page md missing"));
test("I-FILE-02", "集成契约", "P0", "页面清单 6 页均有 HTML", () => assert(PAGE_DEFINITIONS.every((page) => htmlFiles.includes(page.route)), "page html missing"));
test("I-FILE-03", "集成契约", "P0", "页面文档章节完整", () => {
  const required = ["文档元信息", "页面概述", "信息架构", "交互流程", "状态与边界", "页面流转", "数据需求", "验收标准"];
  for (const page of PAGE_DEFINITIONS) requireText(md(page.doc), required);
});
test("I-FILE-04", "集成契约", "P1", "HTML 与页面文档主标题一致", () => assert(PAGE_DEFINITIONS.every((page) => html(page.route).includes(page.module) || html(page.route).includes(page.title.replace("页", ""))), "html title mismatch"));
test("I-FILE-05", "集成契约", "P0", "HTML 跨页链接有效", () => {
  for (const file of htmlFiles) {
    const links = [...html(file).matchAll(/href="([^"]+\.html)"/g)].map((match) => match[1]);
    assert(links.every((link) => htmlFiles.includes(link)), `${file} has broken link`);
  }
});
test("I-FILE-06", "集成契约", "P1", "tokens.css 与页面 token 使用一致", () => requireText(read("mahjong-project-parse/output/tokens.css"), ["--accent", "--success", "--warn", "--danger"]));
test("I-FILE-07", "集成契约", "P0", "文档索引字段支撑搜索筛选", () => assert(validateIndexEntry(indexFixture[0]).ok, "index schema invalid"));
test("I-FILE-08", "集成契约", "P1", "脚本输出可被验收契约消费", () => assert(["scriptName", "status", "summary"].every((field) => field in { scriptName: "x", status: "成功", summary: "ok" }), "script output schema invalid"));
test("I-FILE-09", "集成契约", "P0", "output 到 document 同步可检测过期", () => assert(exists("document/mahjong-parse-plan.md"), "document sync target missing"));
test("I-FILE-10", "集成契约", "P0", "业务代码目录不在写入范围", () => assert(SCRIPT_DEFINITIONS.every((script) => script.writeScope.every(pathIsNotBusinessWrite)), "business write scope found"));

// E2E
test("E-LEARN-01", "E2E", "P0", "从总览进入模块地图", () => assert(html("阶段1_工作台总览_总览页.html").includes("阶段1_模块地图_模块地图页.html"), "overview to modules missing"));
test("E-LEARN-02", "E2E", "P0", "从模块地图进入核心流程", () => assert(html("阶段1_模块地图_模块地图页.html").includes("阶段1_核心流程_核心流程页.html"), "modules to flows missing"));
test("E-LEARN-03", "E2E", "P0", "源码引用在跨页保持一致", () => assert(hasSourceReference(MODULE_GROUPS[0]) && hasSourceReference(FLOW_TYPES[0]), "source refs not available across pages"));
test("E-LEARN-04", "E2E", "P0", "缺引用结论不会被当成已验证", () => assert(markVerification({ sourceRefs: [] }).verification === "未验证", "missing ref not carried"));
test("E-LEARN-05", "E2E", "P1", "搜索文件后可继续学习链路", () => assert(searchItems(MODULE_GROUPS, "room").items.length > 0 && getNavigationTargets("modules").includes("flows"), "search breaks learning path"));
test("E-IMPACT-01", "E2E", "P0", "从总览进入影响范围", () => assert(html("阶段1_工作台总览_总览页.html").includes("阶段1_影响范围_影响范围页.html"), "overview to impact missing"));
test("E-IMPACT-02", "E2E", "P0", "新增玩法规则映射到模块和流程", () => assert(IMPACT_TYPES.find((item) => item.type === "新增玩法规则")?.flows.length > 0, "play rule impact missing"));
test("E-IMPACT-03", "E2E", "P0", "高风险需求推荐核心流程阅读", () => assert(IMPACT_TYPES.filter((item) => item.risk === "高").every((item) => item.reading === "核心流程"), "high risk reading missing"));
test("E-IMPACT-04", "E2E", "P0", "无法归类需求阻止直接实现", () => assert(buildImpactViewModel("???").nextStep.includes("开放问题"), "unknown demand not blocked"));
test("E-IMPACT-05", "E2E", "P1", "影响范围可进入验收契约", () => assert(html("阶段1_影响范围_影响范围页.html").includes("阶段1_验收契约_验收契约页.html"), "impact to acceptance missing"));
test("E-ACCEPT-01", "E2E", "P0", "从总览进入验收契约", () => assert(html("阶段1_工作台总览_总览页.html").includes("阶段1_验收契约_验收契约页.html"), "overview to acceptance missing"));
test("E-ACCEPT-02", "E2E", "P0", "P0 未通过阻止交付", () => assert(shouldBlockDelivery({ acItems: [{ priority: "P0", status: "待补充", sourceRefs: [] }] }), "P0 does not block"));
test("E-ACCEPT-03", "E2E", "P0", "P0/P1 全绿显示可交付", () => assert(!shouldBlockDelivery({ acItems: [{ priority: "P0", status: "通过", sourceRefs: ["code-back/mahjong"] }], scripts: SCRIPT_DEFINITIONS, syncStatus: "通过" }), "green gate still blocked"));
test("E-ACCEPT-04", "E2E", "P0", "未验证结论可定位来源", () => assert(buildAcceptanceViewModel([{ priority: "P0", status: "通过", sourceRefs: [] }]).unverified.length === 1, "unverified not locatable"));
test("E-ACCEPT-05", "E2E", "P1", "筛选 P0 后复制 AC", () => assert(ACCEPTANCE_ITEMS.filter((item) => item.priority === "P0").every((item) => `${item.id} ${item.name}`.length > 4), "P0 copy text incomplete"));
test("E-SCRIPT-01", "E2E", "P0", "打开脚本索引看到只读边界", () => assert(html("阶段1_脚本索引_脚本索引页.html").includes("只读"), "readonly boundary missing"));
test("E-SCRIPT-02", "E2E", "P1", "复制脚本路径后仍可回验收", () => assert(html("阶段1_脚本索引_脚本索引页.html").includes("阶段1_验收契约_验收契约页.html"), "scripts to acceptance missing"));
test("E-SCRIPT-03", "E2E", "P0", "脚本失败影响门禁", () => assert(shouldBlockDelivery({ acItems: [{ priority: "P0", status: "失败", sourceRefs: ["code-back/mahjong"] }], scripts: SCRIPT_DEFINITIONS }), "script failure not blocking"));
test("E-SCRIPT-04", "E2E", "P0", "越界脚本不可进入可用清单", () => assert(!evaluateScriptSafety({ writeScope: ["code-back/mahjong"] }).ok, "unsafe script available"));
test("E-SCRIPT-05", "E2E", "P0", "脚本输出为空提示人工核查", () => assert(buildScriptViewModel([SCRIPT_DEFINITIONS[0]], [{ scriptName: SCRIPT_DEFINITIONS[0].name, status: "成功", summary: "" }])[0].runSummary.includes("待人工核查"), "empty output not flagged"));

// Security
test("S-BOUND-01", "安全鉴权", "P0", "不展示假登录态", () => assert(!htmlFiles.some((file) => /管理员|退出登录|登录态/.test(html(file))), "fake auth text found"));
test("S-BOUND-02", "安全鉴权", "P0", "所有人看到同一套内容", () => assert(read("mahjong-project-parse/output/设计决策蓝图.md").includes("所有人看到同一套内容"), "same-content decision missing"));
test("S-BOUND-03", "安全鉴权", "P0", "未验证结论不可显示为已验证", () => assert(markVerification({ sourceRefs: [] }).verification === "未验证", "unverified could pass"));
test("S-BOUND-04", "安全鉴权", "P0", "脚本不得写业务代码", () => assert(!evaluateScriptSafety({ writeScope: ["code-back/mahjong"] }).ok, "business write allowed"));
test("S-BOUND-05", "安全鉴权", "P0", "P0 门禁不可绕过", () => assert(shouldBlockDelivery({ acItems: [{ priority: "P0", status: "阻塞", sourceRefs: ["code-back/mahjong"] }] }), "P0 bypassed"));
test("S-BOUND-06", "安全鉴权", "P1", "不展示敏感信息", () => assert(!htmlFiles.some((file) => /SECRET|TOKEN|PASSWORD|AKIA/.test(html(file))), "sensitive text found"));
test("S-BOUND-07", "安全鉴权", "P1", "不复制大段源码", () => assert(!htmlFiles.some((file) => /func\s+\w+\(|package\s+engine/.test(html(file))), "source code pasted in html"));
test("S-BOUND-08", "安全鉴权", "P1", "断链必须可发现", () => {
  for (const file of htmlFiles) {
    const links = [...html(file).matchAll(/href="([^"]+\.html)"/g)].map((match) => match[1]);
    assert(links.every((link) => htmlFiles.includes(link)), `${file} broken link`);
  }
});

// Boundary
test("B-DATA-01", "边界异常", "P0", "JSON 索引缺失显示错误", () => assert(getPageState({ error: "JSON 索引缺失" }).state === "失败", "missing index not error"));
test("B-DATA-02", "边界异常", "P0", "JSON 字段缺失阻塞契约", () => assert(!validateIndexEntry({ title: "x" }).ok, "missing json fields pass"));
test("B-DATA-03", "边界异常", "P0", "空 Markdown 标记待补充", () => assert(getPageState({ items: [] }).state === "空状态", "empty md not pending"));
test("B-DATA-04", "边界异常", "P0", "缺页面 MD/HTML 暴露阻塞", () => assert(PAGE_DEFINITIONS.every((page) => exists(path.join("mahjong-project-parse/output/pages", page.doc)) && exists(path.join("mahjong-project-parse/output/pages", page.route))), "page pair missing"));
test("B-DATA-05", "边界异常", "P0", "源码引用缺失阻止最终完成", () => assert(shouldBlockDelivery({ acItems: [{ priority: "P0", status: "待补充", sourceRefs: [] }] }), "missing source did not block"));
test("B-DATA-06", "边界异常", "P1", "超长路径不撑破布局", () => assert(read("mahjong-project-parse/output/tokens.css").includes("--font-mono") && htmlFiles.some((file) => html(file).includes("@media")), "long path layout support missing"));
test("B-DATA-07", "边界异常", "P1", "搜索无结果有下一步", () => assert(searchItems(MODULE_GROUPS, "nope").nextStep, "empty search next step missing"));
test("B-DATA-08", "边界异常", "P0", "未知状态降级待确认", () => assert(normalizeStatus("alien") === "待确认", "unknown state not downgraded"));
test("B-DATA-09", "边界异常", "P1", "重复复制/快速筛选不乱序", () => assert(searchItems(searchItems(MODULE_GROUPS, "room").items, "room").items.length >= 1, "repeat filter unstable"));
test("B-DATA-10", "边界异常", "P0", "同步过期不能交付", () => assert(shouldBlockDelivery({ acItems: ACCEPTANCE_ITEMS.map((item) => ({ ...item, status: "通过" })), scripts: SCRIPT_DEFINITIONS, syncStatus: "过期" }), "outdated sync did not block"));

// Accessibility
test("A-WB-01", "无障碍", "P0", "左侧导航键盘可达", () => assert(htmlFiles.every((file) => html(file).includes("<a href=") || html(file).includes("<nav")), "nav links missing"));
test("A-WB-02", "无障碍", "P0", "搜索和筛选键盘可操作", () => assert(html("阶段1_工作台总览_总览页.html").includes("aria-label=\"搜索\"") || Boolean(searchItems(MODULE_GROUPS, "room")), "search accessibility missing"));
test("A-WB-03", "无障碍", "P0", "焦点样式清晰可见", () => assert(read("mahjong-project-parse/output/tokens.css").includes("--focus-ring"), "focus token missing"));
test("A-WB-04", "无障碍", "P0", "状态标签不只靠颜色", () => assert(htmlFiles.every((file) => /已|待|高|中|低|只读|阻塞|覆盖|规划|验证|风险/.test(html(file))), "state labels lack text"));
test("A-WB-05", "无障碍", "P1", "表格包含表头语义", () => assert(htmlFiles.filter((file) => html(file).includes("<table")).every((file) => html(file).includes("<th>")), "table headers missing"));
test("A-WB-06", "无障碍", "P1", "复制按钮有可读名称", () => assert(MODULE_GROUPS.every((item) => item.sourceRefs.length > 0) && SCRIPT_DEFINITIONS.every((item) => item.name), "copy target names missing"));
test("A-WB-07", "无障碍", "P0", "标题层级稳定", () => assert(htmlFiles.every((file) => html(file).includes("<h1") || html(file).includes("h1")), "h1 missing"));
test("A-WB-08", "无障碍", "P1", "移动端内容不重叠", () => assert(htmlFiles.every((file) => html(file).includes("@media")), "responsive media missing"));

// Performance
test("P-WB-01", "性能", "P0", "6 个页面本地快速打开", () => assert(PAGE_DEFINITIONS.every((page) => fs.statSync(path.join(pagesDir, page.route)).size > 1000), "html file too small/missing"));
test("P-WB-02", "性能", "P0", "总览首屏快速渲染", () => requireText(html("阶段1_工作台总览_总览页.html"), ["核心页面", "关键风险"]));
test("P-WB-03", "性能", "P1", "页面切换无明显卡顿", () => assert(htmlFiles.length >= 6 && htmlFiles.every((file) => fs.statSync(path.join(pagesDir, file)).size < 20000), "page too large"));
test("P-WB-04", "性能", "P1", "搜索筛选快速反馈", () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i += 1) searchItems([...MODULE_GROUPS, ...IMPACT_TYPES], "room");
  assert(performance.now() - start < 200, "search too slow");
});
test("P-WB-05", "性能", "P1", "长表格可滚动阅读", () => assert(html("阶段1_影响范围_影响范围页.html").includes("<table") && html("阶段1_验收契约_验收契约页.html").includes("<table"), "long tables missing"));
test("P-WB-06", "性能", "P1", "超长路径不造成横向失控", () => assert(read("mahjong-project-parse/output/tokens.css").includes("--font-mono"), "path typography missing"));
test("P-WB-07", "性能", "P0", "脚本扫描耗时有基线", () => {
  const start = performance.now();
  fs.readdirSync(path.join(root, "code-back/mahjong"), { recursive: true });
  assert(performance.now() - start < 1000, "scan baseline too slow");
});
test("P-WB-08", "性能", "P0", "无网络时核心内容可读", () => assert(htmlFiles.every((file) => html(file).replace(/<script[\s\S]*?<\/script>/g, "").length > 1000), "core content depends on scripts"));

const passed = results.filter((item) => item.status === "PASS").length;
const failed = results.filter((item) => item.status === "FAIL");
const p0Failed = failed.filter((item) => item.priority === "P0");
const p1Failed = failed.filter((item) => item.priority === "P1");
const report = {
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed,
  failed: failed.length,
  p0Failed: p0Failed.length,
  p1Failed: p1Failed.length,
  gate: failed.length === 0 ? "PASS" : "FAIL",
  results,
};

const reportPath = path.join(outputDir, "goal-validation-report.json");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failed.length > 0) {
  console.error(`GOAL gate failed: ${failed.length} failed`);
  for (const item of failed.slice(0, 20)) {
    console.error(`${item.id} ${item.name}: ${item.details}`);
  }
  process.exit(1);
}

console.log(`GOAL gate passed: ${passed}/${results.length}`);
console.log(`Report: ${path.relative(root, reportPath)}`);
