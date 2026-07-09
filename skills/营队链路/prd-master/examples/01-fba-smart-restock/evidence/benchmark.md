# 行业 Benchmark · FBA 补货决策

**调研日期**: 2026-05-23
**品类**: FBA 库存优化算法 + 海空运决策

---

## 一、库存优化算法基线

### 1.1 经典算法

| 算法 | 用途 | 公式核心 |
|------|------|---------|
| **EOQ (Economic Order Quantity)** | 一次订多少最划算 | EOQ = √(2 × 年需求 × 订货成本 / 年持有成本) |
| **ROP (Reorder Point)** | 何时下单 | ROP = (平均日销 × Lead Time) + Safety Stock |
| **Safety Stock** | 缓冲量 | Z × σ × √Lead Time（Z 为服务水平因子）|
| **(s, S) Policy** | 比 ROP 更高级，库存跌到 s 就补到 S | 仿真/动态规划求解 |

### 1.2 行业经验数字

| 指标 | 数值 | 来源 |
|------|------|------|
| EOQ 应用得当可降总库存成本 | **15-30%** | Finale Inventory |
| FBA 卖家典型 Safety Stock | 销售 10-30 天的量 | eComEngine RestockPro |
| 服务水平 (Service Level) 目标 | 95-99% 缺货率 | 通用零售 |
| 销售速度变化容差 | ±20% 内视为正常 | SoStocked |

### 1.3 (s, S) 策略 vs ROP 对比

- ROP：跌到 s 就补，每次补固定量 EOQ
- (s, S)：跌到 s 就补到 S（多少需求就补多少差额）
- (s, S) 在变动需求下更优，但需求预测必须够准
- **本项目建议**：MVP 用 ROP + Safety Stock；v1.5 升级 (s, S)

---

## 二、销量预测方法

### 2.1 模型选择路径

| 场景 | 推荐模型 | 备注 |
|------|---------|------|
| 销量稳定、无明显季节 | 简单移动平均 / 指数平滑 | Baseline |
| 有季节性 | Prophet / SARIMA | Facebook Prophet 对季节敏感 |
| 有广告影响 / 排名影响 | XGBoost / LightGBM（含特征） | 特征工程是关键 |
| 受多因素影响、数据量足 | LSTM / Transformer | 复杂，过拟合风险 |

### 2.2 关键特征清单（FBA 销量预测）

基于学术研究和行业实践：

| 特征类别 | 具体特征 |
|---------|---------|
| **历史销量** | 过去 N 天每日销量、7 天滚动均值、30 天均值 |
| **BSR (Best Sellers Rank)** | 当前 BSR、BSR 变化趋势、BSR 在品类内百分位 |
| **价格** | 当前售价、价格变化、与竞品价差 |
| **广告投放** | Daily ad spend、Impressions、CTR、CVR、ACoS |
| **库存状态** | FBA 在仓量、IPI (Inventory Performance Index) |
| **Listing 质量** | Review 数、平均星级、Title 关键词覆盖 |
| **季节性** | 月份、节假日 dummy、Prime Day / 黑五距离 |
| **外部** | Trend (Google Trends)、竞品动态 |

### 2.3 关键洞察

> "BSR is calculated based on historical sales. BSR reflects how well a product is sold in the past few months and also in the past few hours."

BSR 是销量的**滞后但快反应**指标 → 既能反映短期变化，又能验证销量趋势

> "If your BSR improves only when running ads, the demand may not be organic. Track BSR alongside ad spend to assess true health."

广告 + BSR 联动是区分"自然需求"和"投放驱动需求"的关键 → 决定是否值得长期备货

---

## 三、海运 vs 空运决策框架

### 3.1 时效对比

| 方式 | 中国 → 美西 | 中国 → 美东 |
|------|------------|------------|
| **海运 FCL** | 25-32 天 | 35-42 天 |
| **海运 LCL** | 30-40 天 | 40-50 天 |
| **空运** | 2-4 天（短）| 7-14 天（含清关到 FBA） |

### 3.2 成本对比

| 维度 | 数值 | 来源 |
|------|------|------|
| 空运 vs 海运（按 kg） | 贵 **4-16 倍** | ExFreight 2026 |
| 空运经济舱单价 | $4.50-8.50/kg | Unicargo 2026-03 |
| 海运 vs 空运（按单 landed cost）| 海运便宜 **3-5 倍** | 同上 |

### 3.3 关键决策临界点

> "Total landed math including lost sales makes air the real winner in approximately **68% of launch/peak restock cases**."

**意味着**：单看运费空运贵，但加上"缺货损失"和"上架等待"的 landed cost，**68% 的发货/促销补货场景空运实际更优**。

### 3.4 决策决策框架

| 条件 | 推荐方式 |
|------|---------|
| 库存可撑 > 45 天 | 海运 FCL（最便宜）|
| 库存可撑 30-45 天 | 海运 LCL |
| 库存可撑 15-30 天 | 海运 + 安全 buffer / 部分空运 |
| 库存可撑 7-15 天 | 空运（避免缺货）|
| 库存可撑 < 7 天 | 紧急空运（贵也要走）|
| 货物轻小（< 150 kg）| 空运（边界临界点）|
| 货物重大 | 海运 |
| 高价值/低体积 SKU | 倾向空运（运费占比小）|
| 低价值/大体积 SKU | 倾向海运（运费占比大）|

### 3.5 关键公式

**Landed Cost per Unit (LCU)**:
```
LCU = 货值 + (运费/件) + (关税 + 派送) + (持有成本 × 在途天数 / 365)
```

**缺货损失估算 (Stockout Cost)**:
```
Stockout Cost = 缺货天数 × 日销额 × (1 + 排名恢复倍数)
排名恢复倍数 ≈ 2-4（行业经验）
```

**决策目标函数**:
```
Minimize: 物流成本 + 持有成本 + 仓储成本 + 期望缺货损失
约束: 服务水平 >= 95-99%
```

---

## 四、FBA 特殊考虑

### 4.1 FBA 仓储费率（2026）

- **月度仓储费**: $0.87/立方英尺（标准品，旺季 10-12 月翻倍至 $2.40）
- **长期仓储费 (Aged Inventory Surcharge)**: 库龄 >271 天开始加费，>365 天 $6.90/立方英尺
- **删除/移除费**: 标准品 $0.97/件

### 4.2 FBA Restock Limits

- 亚马逊会基于 IPI（Inventory Performance Index）限制你的仓位上限
- IPI > 400 通常不受限；< 400 可能被限
- 决策系统必须考虑这个上限

### 4.3 Inbound Shipping 时效

- 海运到港后到 FBA 入仓：3-7 天
- 空运到机场后到 FBA 入仓：1-3 天
- 旺季（黑五前后）入仓延迟翻倍

---

## 五、未找到的数据

| 想知道的 | 已尝试 | 替代方案 |
|---------|--------|---------|
| 中国到美国具体航线实时报价 | WebSearch | 接入货代 API（Flexport、菜鸟国际等）—— v1.5 任务 |
| FBA 仓储费 2026 最新费率（精确到品类） | 找到大致范围 | 亚马逊 Seller Central 实时查 |
| 各品类销量预测准确度基准 | 部分案例 | 用 SoStocked / Helium 10 的回测数据 |

---

Sources:
- [Finale Inventory: EOQ Guide](https://www.finaleinventory.com/inventory-planning-software/economic-order-quantity)
- [eComEngine: Reorder Point Playbook](https://www.ecomengine.com/blog/amazon-fba-reorder-point)
- [SoStocked: Amazon Reorder Point](https://www.sostocked.com/amazon-reorder-point/)
- [ExFreight: Air vs Ocean Decision Framework](https://www.exfreight.com/air-freight-vs-ocean-freight-cost-transit-decision-framework/)
- [Unicargo: Air vs Ocean 2026 FBA](https://www.unicargo.com/air-vs-ocean-freight-2026-amazon-fba/)
- [Forceget: FBA Replenishment Best Practices](https://forceget.com/blog/inventory-replenishment-processes-and-best-practices-for-fba-sellers/)
- [Sell Amazon: BSR Guide](https://sell.amazon.com/blog/amazon-best-sellers-rank)
- [Sino Shipping: Sea vs Air for Amazon FBA](https://www.sino-shipping.com/sea-freight-vs-air-freight-for-amazon-fba-the-best-shipping-strategy/)
