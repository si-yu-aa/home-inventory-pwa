# 家庭库存 PWA 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 构建一个 local-first、适合 iPhone 使用的家庭库存 PWA，支持库存记录、到期提醒、照片、备份恢复、纯文本批量录入和多关键词搜索。

**架构：** 使用聚焦的 TypeScript 模块承载领域规则、库存存储、搜索、批量录入解析和浏览器能力封装。React 页面只负责组合这些模块和展示移动端 UI。

**技术栈：** Vite、React、TypeScript、浏览器 `localStorage`、Node built-in test runner、手写 PWA manifest 和 service worker。

---

### 任务 1：核心领域规则

**文件：**
- 创建：`src/domain/inventory.ts`
- 创建：`src/domain/expiry.ts`
- 创建：`tests/unit/expiry.test.ts`

- [ ] 为已过期、30 天内到期、正常、未设置到期日这几种状态写测试。
- [ ] 运行 `npm test`，确认测试因为模块缺失而失败。
- [ ] 实现库存类型、默认分类、默认位置和到期状态 helper。
- [ ] 再次运行 `npm test`，确认测试通过。

### 任务 2：批量录入解析器

**文件：**
- 创建：`src/features/bulkImport/parser.ts`
- 创建：`tests/unit/bulkImport.test.ts`

- [ ] 为中文表头、空到期日、非法数量、非法日期和正常解析结果写测试；批量文本不包含存放位置列。
- [ ] 运行 `npm test`，确认测试因为模块缺失而失败。
- [ ] 实现纯函数解析器，返回 `items` 和 `errors`。
- [ ] 再次运行 `npm test`，确认测试通过。

### 任务 3：库存存储和备份

**文件：**
- 创建：`src/features/inventory/storage.ts`
- 创建：`src/features/inventory/useInventory.ts`

- [ ] 实现 `localStorage` 读写，并用 schema guard 过滤无效数据；读取失败时回退为空列表。
- [ ] 实现新增、更新、删除、批量新增、导出 JSON、导入 JSON 和清空数据。
- [ ] 保持所有库存创建都经过同一个 factory，让手动录入和批量录入共用默认字段逻辑。

### 任务 4：多关键词搜索

**文件：**
- 创建：`src/features/inventory/search.ts`
- 创建：`tests/unit/search.test.ts`
- 修改：`src/pages/InventoryPage.tsx`

- [ ] 为关键词拆分写测试，覆盖空格、英文逗号、中文逗号、顿号、分号和换行。
- [ ] 为搜索匹配写测试，确认任意关键词命中名称、分类、位置、品牌、备注或日期时都能返回物品。
- [ ] 实现 `parseSearchTerms` 和 `filterInventoryBySearch`。
- [ ] 在库存页接入该搜索模块，避免页面直接拼接字段实现搜索。
- [ ] 运行 `npm test`，确认测试通过。

### 任务 5：移动端 UI

**文件：**
- 替换：`src/App.tsx`
- 替换：`src/App.css`
- 替换：`src/index.css`
- 创建：`src/components/*`
- 创建：`src/pages/*`
- 创建：`src/lib/photos.ts`

- [ ] 构建首页、库存页、录入页和设置页；录入页内包含“单个录入”和“批量录入”两种模式。
- [ ] 在表单中把必填字段和选填字段视觉上分开。
- [ ] 支持照片上传，并将压缩后的 browser data URL 存入本地数据。
- [ ] 添加底部导航和 mobile-first 响应式样式；底部导航保持首页、库存、录入、设置四个入口。

### 任务 6：大模型提示词复制

**文件：**
- 创建：`src/lib/clipboard.ts`
- 创建：`tests/unit/clipboard.test.ts`
- 修改：`src/pages/BulkImportPage.tsx`

- [ ] 为 Clipboard API 路径写测试。
- [ ] 为 iOS/非安全上下文下的 textarea fallback 写测试。
- [ ] 实现 `copyText` helper，优先使用 `navigator.clipboard.writeText`，失败时退回到隐藏 textarea 和 `execCommand('copy')`。
- [ ] 在录入页的批量模式里给大模型提示词添加复制按钮，并显示复制结果；提示词要求大模型不要输出存放位置。
- [ ] 运行 `npm test`，确认测试通过。

### 任务 6.1：批量录入统一位置

**文件：**
- 修改：`src/features/bulkImport/parser.ts`
- 修改：`src/pages/BulkImportPage.tsx`
- 修改：`tests/unit/bulkImport.test.ts`

- [ ] 将批量录入格式调整为 `名称 | 分类 | 数量 | 单位 | 到期日 | 品牌规格 | 备注`。
- [ ] 在录入页的批量模式里添加“本批统一存放位置”输入框，可留空。
- [ ] 导入时把统一位置合并到每条 parsed item；文本本身不再解析位置列。
- [ ] 更新测试，确认品牌规格和备注不会因为删除位置列而错位。

### 任务 6.2：数量单位

**文件：**
- 修改：`src/domain/inventory.ts`
- 修改：`src/pages/ItemFormPage.tsx`
- 修改：`src/components/ItemCard.tsx`
- 修改：`src/features/bulkImport/parser.ts`
- 修改：`tests/unit/bulkImport.test.ts`

- [ ] 在库存数据模型中新增 `unit` 字段，并为旧数据默认补 `件`。
- [ ] 单个录入表单在数量旁边添加单位字段，默认 `件`，支持常用单位 datalist。
- [ ] 库存列表显示为 `数量 2 瓶` 这样的组合。
- [ ] 批量录入格式增加 `单位` 列，并更新提示词、示例和 parser 测试。

### 任务 6.3：搜索关键词扩写

**文件：**
- 创建：`src/features/inventory/searchPrompt.ts`
- 创建：`tests/unit/searchPrompt.test.ts`
- 修改：`src/pages/InventoryPage.tsx`

- [ ] 为搜索扩写 prompt 生成函数写测试，确认 prompt 要求大模型输出一行空格分隔的关键词。
- [ ] 在库存页搜索框旁添加扩写按钮；搜索词为空时禁用。
- [ ] 点击后复制扩写 prompt，并尝试打开豆包 app。
- [ ] 显示复制和跳转状态提示。

### 任务 7：PWA 外壳

**文件：**
- 修改：`index.html`
- 修改：`src/main.tsx`
- 创建：`public/manifest.webmanifest`
- 创建：`public/sw.js`
- 创建：`public/icon.svg`

- [ ] 添加 PWA metadata、iPhone home screen metadata 和图标。
- [ ] 从 `src/main.tsx` 注册 service worker。
- [ ] 构建生产包，并运行本地 dev server 验证页面可以打开。

### 任务 8：验证

**命令：**

```bash
npm test
npm run lint
npm run build
```

- [ ] 确认所有单元测试通过。
- [ ] 确认 ESLint 无错误。
- [ ] 确认生产构建成功。
