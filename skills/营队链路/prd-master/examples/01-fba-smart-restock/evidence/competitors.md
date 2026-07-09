# 竞品分析 · FBA 智能补货系统

**调研日期**: 2026-05-23
**品类**: FBA 卖家补货决策工具

---

## 一、直接竞品

### 1. SoStocked

- **官网**: sostocked.com
- **定位**: Amazon-only 专家级 FBA 补货预测工具，"由 Amazon 卖家亲自打造"
- **核心功能**:
  - 适应 FBA 特性的预测引擎（仓位限制、转运、Lead Time）
  - 季节性、促销尖峰、销售速度变化适应
  - 可定制预测模型
  - Supplier lead time 管理
- **定价**: 月费制（具体未公开，需注册）
- **优点（用户反馈）**: 专攻 Amazon，比通用工具更懂 FBA
- **痛点**: 仅服务 Amazon，多渠道卖家不适用
- **来源**: https://skucompass.com/best-inventory-forecasting-software-amazon-sellers/ (2026)

### 2. RestockPro (by eComEngine)

- **官网**: ecomengine.com/restockpro
- **定位**: 老牌成熟的 FBA 补货工具
- **核心功能**:
  - Kits（套装产品支持）
  - Supplier management
  - 决策工作流（哪些 SKU 补、何时补、补多少）
  - 安全库存 + 再订货点 + 防意外 buffer 策略
- **优点**: 逻辑扎实，被很多老牌 FBA 品牌信任
- **痛点**: UI 显老
- **来源**: https://www.ecomengine.com/blog/amazon-fba-reorder-point

### 3. SKU Compass

- **官网**: skucompass.com
- **定位**: 多渠道（Amazon + Walmart + Shopify）+ 人工团队全托管
- **核心功能**:
  - 三层服务：软件订阅 / Partner（团队帮你跑预测）/ Full Service（团队帮你下单）
- **定价**:
  - Tier 1: $350/月起（按量）
  - Tier 2: $1,997/月（Partner）
  - Tier 3: $3,997/月（Full Service）
- **优点**: 软件+人工结合
- **痛点**: 价格高，纯软件党觉得过度服务

### 4. Helium 10

- **官网**: helium10.com
- **定位**: Amazon 全套（25+ tools），Inventory Management 是其中一块
- **核心功能**:
  - Inventory Dashboard 同步 Seller Central
  - Restock alerts
  - Lead time 管理
  - Inbound shipment 跟踪
- **优点**: 一站式，跟其他模块（产品研究、关键词）打通
- **痛点**: Inventory 不是核心强项，深度不及专门工具

### 5. Sellerboard

- **官网**: sellerboard.com
- **定位**: 性价比最高的 FBA 工具
- **定价**: $19/月起（3000 订单内）
- **优点**: 便宜，30 天免费试用
- **痛点**: 功能广而不深

---

## 二、间接竞品

### 6. AMZ Prep（免费）

- **定位**: 免费 FBA 库存预测
- **核心功能**: 无限 SKU、95%+ 准确率（自称）、再订货建议、仓储费预警
- **优点**: 免费
- **痛点**: 功能基础，不可定制
- **来源**: https://amzprep.com/fba-inventory-forecast-tool/

### 7. Prediko

- **定位**: 多渠道（含 Shopify）库存预测
- **来源**: https://www.prediko.io/blog/amazon-inventory-forecasting-tools

---

## 三、差评/痛点挖掘 Top 8

基于公开评测和论坛汇总：

| # | 痛点 | 涉及工具 | 典型表现 |
|---|------|---------|---------|
| 1 | 预测精度低（特别是新品/季节性 SKU） | RestockPro, Helium 10 | "Forecasting doesn't account for promotional spikes" |
| 2 | UI 陈旧 / 学习成本高 | RestockPro | "UI shows its age" |
| 3 | 多渠道支持差 | SoStocked | "Amazon-only, no Walmart" |
| 4 | 海空运决策没做 | 全部（这是空白！） | 大多工具只告诉你"补多少"，不告诉你"怎么运" |
| 5 | 价格不透明 | SKU Compass, SoStocked | 需要 demo / 询价 |
| 6 | 不考虑广告投放对销量的影响 | 多数 | 纯历史预测，忽略 ad spend |
| 7 | 国内卖家适配差 | 几乎全部 | 都是英文 UI，不支持人民币、不接 1688/淘宝供应商 |
| 8 | 缺乏算法可解释性 | 几乎全部 | 给数字不给理由 |

---

## 四、差异化机会矩阵

### 4.1 大家都没做好的（蓝海）

1. **海空运决策结合**：现有工具几乎都只告诉你"补多少"，不告诉你"用海运还是空运"。这是关键空白
2. **决策可解释性**：每条建议背后的成本结构、关键假设、替代方案对比 —— 现有工具几乎都是黑盒
3. **接入广告投放数据做预测**：BSR + Ad Spend 联动很少见
4. **基于虚拟数据集的算法回测**：让卖家先看到"系统建议 vs 当前策略"的回测对比再投资真实数据接入
5. **中国卖家本地化**：人民币 + 1688/淘宝供应商 lead time + 国内货代

### 4.2 大家都做了但都不够好

1. 季节性预测（黑五/Prime Day/圣诞）
2. 新品冷启动预测
3. Lead time 不稳定的供应商处理

### 4.3 大家都做得好（不打）

1. 库存阈值告警
2. 基础销量预测
3. Seller Central API 接入

---

## 五、给我们的启示

### 必须做的（避免成为又一个平庸工具）
- ✅ **海空运决策**（最大差异化点）
- ✅ **决策可解释性**（让卖家信任）
- ✅ **接入广告数据做预测**（销量准）
- ✅ **虚拟数据回测**（v1 MVP 必经之路）

### 必须避免的
- ❌ 复制 SoStocked 的功能矩阵（卷不过老玩家）
- ❌ 做全套（如 Helium 10）—— 聚焦补货决策
- ❌ 黑盒算法（FBA 卖家被"AI 黑盒"骗多了，不信）

### 差异化定位（一句话）
**"市面上唯一一个把'发多少 + 用什么运'两个决策一起做、并能给出完整成本对比的 FBA 补货系统"**

---

## 六、未找到的数据

| 想知道的 | 已尝试 | 找不到原因 | 建议 |
|---------|--------|----------|------|
| 各竞品的 ARR / 用户数 | WebSearch | 私营公司不披露 | 看 Linkedin 员工数推断 |
| 用户切换工具的真实原因 | 评测站 | 评测倾向友好叙述 | 上线后访谈 |

---

Sources:
- [SKU Compass: Best Inventory Forecasting 2026](https://skucompass.com/best-inventory-forecasting-software-amazon-sellers/)
- [RestockPro Inventory Forecasting](https://www.ecomengine.com/restockpro/inventory-forecasting)
- [Prediko: Amazon Inventory Forecasting Tools](https://www.prediko.io/blog/amazon-inventory-forecasting-tools)
- [Jarvio: Top 10 Amazon Inventory Tools](https://jarvio.io/blog/top-10-amazon-inventory-tools)
- [AMZ Prep: FBA Inventory Forecast Tool](https://amzprep.com/fba-inventory-forecast-tool/)
