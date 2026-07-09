export const PAGE_DEFINITIONS = [
  {
    key: "overview",
    module: "工作台总览",
    title: "总览页",
    route: "阶段1_工作台总览_总览页.html",
    doc: "阶段1_工作台总览_总览页.md",
    downstream: ["modules", "flows", "impact", "scripts", "acceptance"],
  },
  {
    key: "modules",
    module: "模块地图",
    title: "模块地图页",
    route: "阶段1_模块地图_模块地图页.html",
    doc: "阶段1_模块地图_模块地图页.md",
    downstream: ["flows", "impact"],
  },
  {
    key: "flows",
    module: "核心流程",
    title: "核心流程页",
    route: "阶段1_核心流程_核心流程页.html",
    doc: "阶段1_核心流程_核心流程页.md",
    downstream: ["impact", "acceptance"],
  },
  {
    key: "impact",
    module: "影响范围",
    title: "影响范围页",
    route: "阶段1_影响范围_影响范围页.html",
    doc: "阶段1_影响范围_影响范围页.md",
    downstream: ["flows", "acceptance"],
  },
  {
    key: "scripts",
    module: "脚本索引",
    title: "脚本索引页",
    route: "阶段1_脚本索引_脚本索引页.html",
    doc: "阶段1_脚本索引_脚本索引页.md",
    downstream: ["overview", "acceptance"],
  },
  {
    key: "acceptance",
    module: "验收契约",
    title: "验收契约页",
    route: "阶段1_验收契约_验收契约页.html",
    doc: "阶段1_验收契约_验收契约页.md",
    downstream: ["overview"],
  },
];

export const MODULE_GROUPS = [
  { key: "entry", name: "入口", sourceRefs: ["code-back/mahjong/mahjong.go"], impact: "中影响" },
  { key: "cmds", name: "命令", sourceRefs: ["code-back/mahjong/cmds/cmds.go"], impact: "中影响" },
  { key: "engine", name: "引擎", sourceRefs: ["code-back/mahjong/engine/engine.go"], impact: "高影响" },
  { key: "room", name: "房间", sourceRefs: ["code-back/mahjong/engine/room_run.go"], impact: "高影响" },
  { key: "user", name: "用户", sourceRefs: ["code-back/mahjong/engine/user.go"], impact: "高影响" },
  { key: "match", name: "匹配", sourceRefs: ["code-back/mahjong/engine/match_jd.go"], impact: "中影响" },
  { key: "rpc", name: "外部边界", sourceRefs: ["code-back/mahjong/engine/rpc.go"], impact: "中影响" },
];

export const FLOW_TYPES = [
  { key: "room", name: "房间生命周期", modules: ["room", "user"], sourceRefs: ["code-back/mahjong/engine/room_run.go"], exceptions: ["超时", "恢复"] },
  { key: "user", name: "用户状态", modules: ["user"], sourceRefs: ["code-back/mahjong/engine/user_run.go"], exceptions: ["离线"] },
  { key: "game", name: "牌局运行", modules: ["room", "user"], sourceRefs: ["code-back/mahjong/engine/room.go"], exceptions: ["非法操作"] },
  { key: "match", name: "匹配玩法", modules: ["match"], sourceRefs: ["code-back/mahjong/engine/match_jd.go"], exceptions: ["无匹配"] },
  { key: "rpc", name: "RPC 外部边界", modules: ["rpc"], sourceRefs: ["code-back/mahjong/engine/rpc.go"], exceptions: ["调用失败"] },
  { key: "failover", name: "异常恢复", modules: ["task", "failover"], sourceRefs: ["code-back/mahjong/engine/failover.go"], exceptions: ["断线恢复"] },
];

export const IMPACT_TYPES = [
  { type: "新增玩法规则", modules: ["match_*", "room_run"], flows: ["牌局运行"], risk: "高", acceptance: "补充规则分支 AC", reading: "核心流程" },
  { type: "调整房间流程", modules: ["room_before", "room_run"], flows: ["房间生命周期"], risk: "高", acceptance: "准备状态回归", reading: "核心流程" },
  { type: "增加用户行为", modules: ["user_hd_*", "user_run"], flows: ["用户状态"], risk: "中", acceptance: "操作合法性", reading: "模块地图" },
  { type: "修改匹配策略", modules: ["match_*", "engine"], flows: ["匹配玩法"], risk: "中", acceptance: "匹配边界验证", reading: "核心流程" },
  { type: "补充日志", modules: ["room_log", "rpc"], flows: ["RPC 外部边界"], risk: "低", acceptance: "日志字段可追溯", reading: "模块地图" },
  { type: "异常恢复", modules: ["failover", "task"], flows: ["异常恢复"], risk: "高", acceptance: "恢复路径用例", reading: "核心流程" },
];

export const SCRIPT_DEFINITIONS = [
  {
    name: "scan-mahjong-structure.sh",
    purpose: "扫描文件清单、目录结构和代码规模",
    input: "code-back/mahjong",
    output: "document/module-index.md",
    writeScope: ["document"],
    readonlySource: true,
  },
  {
    name: "count-source-lines.sh",
    purpose: "统计 Go 文件行数",
    input: "code-back/mahjong",
    output: "document/source-line-report.txt",
    writeScope: ["document"],
    readonlySource: true,
  },
  {
    name: "build-doc-index.sh",
    purpose: "生成本地 JSON 文档索引",
    input: "mahjong-project-parse/output",
    output: "mahjong-project-parse/output/document-index.json",
    writeScope: ["mahjong-project-parse/output"],
    readonlySource: true,
  },
  {
    name: "check-document-sync.sh",
    purpose: "检查 output 与 document 同步状态",
    input: "mahjong-project-parse/output",
    output: "document/sync-check.md",
    writeScope: ["document"],
    readonlySource: true,
  },
];

export const ACCEPTANCE_ITEMS = [
  { id: "AC-1", feature: "F1", name: "项目画像可读", priority: "P0", status: "通过", sourceRefs: ["code-back/mahjong"] },
  { id: "AC-2", feature: "F2", name: "模块地图可追溯", priority: "P0", status: "通过", sourceRefs: ["code-back/mahjong/engine"] },
  { id: "AC-3", feature: "F3", name: "核心流程覆盖完整", priority: "P0", status: "待补充", sourceRefs: ["code-back/mahjong/engine/room_run.go"] },
  { id: "AC-4", feature: "F4", name: "影响范围支持新需求", priority: "P0", status: "通过", sourceRefs: ["code-back/mahjong"] },
  { id: "AC-5", feature: "F5", name: "文档同步策略明确", priority: "P1", status: "通过", sourceRefs: ["mahjong-project-parse/output"] },
  { id: "AC-6", feature: "F6", name: "脚本边界只读业务源码", priority: "P0", status: "通过", sourceRefs: ["script"] },
  { id: "AC-7", feature: "F7", name: "验收契约齐全", priority: "P0", status: "通过", sourceRefs: ["mahjong-project-parse/output/tests"] },
];

export const REQUIRED_INDEX_FIELDS = ["title", "path", "type", "status", "sourceRefs", "risk", "acStatus"];
export const VALID_STATUSES = new Set(["通过", "已验证", "未验证", "待补充", "阻塞", "失败", "成功", "可进入 TDD"]);
export const VALID_RISKS = new Set(["低", "中", "高"]);

export function validateIndexEntry(entry) {
  const missing = REQUIRED_INDEX_FIELDS.filter((field) => !(field in entry));
  return { ok: missing.length === 0, missing };
}

export function parseDocumentIndex(index) {
  if (!Array.isArray(index)) {
    throw new Error("document index must be an array");
  }
  return index.map((entry) => {
    const result = validateIndexEntry(entry);
    if (!result.ok) {
      throw new Error(`index entry missing fields: ${result.missing.join(", ")}`);
    }
    return {
      ...entry,
      status: normalizeStatus(entry.status),
      risk: VALID_RISKS.has(entry.risk) ? entry.risk : "中",
    };
  });
}

export function normalizeStatus(status) {
  return VALID_STATUSES.has(status) ? status : "待确认";
}

export function calculateCompletion(items) {
  const total = items.length;
  const completed = items.filter((item) => ["通过", "已验证", "成功", "可进入 TDD"].includes(normalizeStatus(item.status))).length;
  const blockers = items.filter((item) => ["阻塞", "失败"].includes(normalizeStatus(item.status)));
  return {
    total,
    completed,
    blockers,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function hasSourceReference(item) {
  return Array.isArray(item.sourceRefs) && item.sourceRefs.some((ref) => ref.includes("code-back/mahjong"));
}

export function markVerification(item) {
  return hasSourceReference(item) ? { ...item, verification: "已验证" } : { ...item, verification: "未验证" };
}

export function calculateRisk(items) {
  const reasons = [];
  if (items.some((item) => item.priority === "P0" && !hasSourceReference(item))) reasons.push("P0 缺源码引用");
  if (items.some((item) => normalizeStatus(item.status) === "失败")) reasons.push("脚本或检查失败");
  if (items.some((item) => normalizeStatus(item.status) === "阻塞")) reasons.push("存在阻塞项");
  if (reasons.length > 0) return { level: "高", reasons };
  if (items.some((item) => normalizeStatus(item.status) === "待补充" || normalizeStatus(item.status) === "待确认")) {
    return { level: "中", reasons: ["存在待补充或待确认项"] };
  }
  return { level: "低", reasons: [] };
}

export function aggregateAcStatus(items) {
  const byPriority = {};
  for (const item of items) {
    byPriority[item.priority] ??= { total: 0, passed: 0, failed: 0, pending: 0 };
    byPriority[item.priority].total += 1;
    const status = normalizeStatus(item.status);
    if (["通过", "已验证", "成功"].includes(status)) byPriority[item.priority].passed += 1;
    else if (["阻塞", "失败"].includes(status)) byPriority[item.priority].failed += 1;
    else byPriority[item.priority].pending += 1;
  }
  const p0 = byPriority.P0 ?? { failed: 0, pending: 0 };
  const gate = p0.failed > 0 || p0.pending > 0 ? "阻塞" : "可交付";
  return { byPriority, gate };
}

export function evaluateScriptSafety(script) {
  const writeScope = script.writeScope ?? [];
  const writesBusinessCode = writeScope.some((scope) => scope.includes("code-back/mahjong"));
  if (writesBusinessCode) {
    return { ok: false, status: "越界", reason: "脚本不得写入 code-back/mahjong 业务代码" };
  }
  return { ok: true, status: script.readonlySource ? "只读源码" : "写产物", reason: "" };
}

export function searchItems(items, keyword) {
  const term = String(keyword ?? "").trim().toLowerCase();
  if (!term) return { items, empty: false, nextStep: "" };
  const matched = items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  return {
    items: matched,
    empty: matched.length === 0,
    nextStep: matched.length === 0 ? "清空筛选或回到核心流程确认开放问题" : "",
  };
}

export function getPageState({ loading = false, error = "", items = [], ready = true } = {}) {
  if (loading) return { state: "加载", message: "数据加载中" };
  if (error) return { state: "失败", message: error };
  if (!ready) return { state: "异常", message: "数据状态不一致" };
  if (items.length === 0) return { state: "空状态", message: "暂无数据，查看 PRD 或运行扫描脚本" };
  return { state: "成功", message: "数据可读" };
}

export function getNavigationTargets(pageKey) {
  const page = PAGE_DEFINITIONS.find((item) => item.key === pageKey);
  return page ? page.downstream : [];
}

export function buildOverviewViewModel({ documents = [], acItems = ACCEPTANCE_ITEMS, scripts = SCRIPT_DEFINITIONS } = {}) {
  const completion = calculateCompletion(acItems);
  const risk = calculateRisk(acItems);
  const gate = aggregateAcStatus(acItems);
  return {
    metrics: [
      { label: "核心页面", value: PAGE_DEFINITIONS.length },
      { label: "文档完成度", value: completion.percent },
      { label: "高风险项", value: risk.level === "高" ? risk.reasons.length : 0 },
      { label: "业务代码改动", value: scripts.filter((script) => !evaluateScriptSafety(script).ok).length },
    ],
    risk,
    gate: gate.gate,
    recentDocuments: documents.slice(0, 4),
    next: ["modules", "flows", "acceptance"],
  };
}

export function buildModuleViewModel(modules = MODULE_GROUPS) {
  return modules.map((item) => ({
    ...item,
    verification: hasSourceReference(item) ? "已验证" : "未验证",
  }));
}

export function buildFlowViewModel(selected = "room", flows = FLOW_TYPES) {
  const flow = flows.find((item) => item.key === selected) ?? flows[0];
  return {
    selected: flow.key,
    flow,
    all: flows,
    verification: hasSourceReference(flow) ? "已验证" : "未验证",
    acceptance: flow.exceptions.length > 0 ? "需覆盖异常路径" : "主路径已覆盖",
  };
}

export function buildImpactViewModel(keyword = "", impacts = IMPACT_TYPES) {
  const result = searchItems(impacts, keyword);
  return {
    items: result.items.sort((a, b) => riskRank(b.risk) - riskRank(a.risk)),
    empty: result.empty,
    nextStep: result.nextStep,
  };
}

export function buildScriptViewModel(scripts = SCRIPT_DEFINITIONS, runs = []) {
  return scripts.map((script) => {
    const safety = evaluateScriptSafety(script);
    const run = runs.find((item) => item.scriptName === script.name);
    const hasRun = Boolean(run);
    const runSummary = hasRun && String(run.summary ?? "").trim().length === 0 ? "待人工核查：脚本输出为空" : (run?.summary ?? "暂无运行记录");
    return {
      ...script,
      safety,
      runStatus: run?.status ?? "未运行",
      runSummary,
    };
  });
}

export function buildAcceptanceViewModel(items = ACCEPTANCE_ITEMS) {
  const marked = items.map(markVerification);
  const aggregate = aggregateAcStatus(marked);
  return {
    items: marked,
    aggregate,
    unverified: marked.filter((item) => item.verification === "未验证"),
    canEnterTdd: aggregate.gate === "可交付",
  };
}

export function shouldBlockDelivery({ acItems = [], scripts = [], syncStatus = "通过" }) {
  const ac = aggregateAcStatus(acItems);
  const unsafeScript = scripts.some((script) => !evaluateScriptSafety(script).ok);
  return ac.gate !== "可交付" || unsafeScript || syncStatus !== "通过";
}

function riskRank(risk) {
  return { 高: 3, 中: 2, 低: 1 }[risk] ?? 0;
}
