# 变更记录

## 4.0.0

上一个已发布版本：3.1.0。

> 3.2.0 是本次改造过程中的中间版本号，**从未发布**，其改动已全部并入 4.0.0。

### 兼容性

- 支持 echarts 5.x 与 6.x；`peerDependencies.echarts` 由 `^5.0.1` 改为 `*`，安装时不再因 echarts 版本产生 peer 冲突。
- 源码导入从 `echarts/lib/echarts` 改为 `echarts/core`（`src/liquidFillSeries.js`、`src/liquidFillView.js`、`src/liquidFillShape.js`），避免把 CanvasRenderer、Dataset 等模块拖进使用方 bundle。`labelLayout` 是 `echarts/core` 自身默认包含的能力，不是本插件引入的。
- 移除 `echarts/lib/util/number` 深路径依赖，`parsePercent` 改为本地实现；dist 中不再重复打包 echarts 的这份代码。
- webpack `externals` 改为 `echarts/core -> echarts`，并设置 `output.globalObject: 'this'`，UMD 产物可在 Node（SSR）中 `require`。
- 新增 `dist/echarts-liquidfill.esm.mjs`（webpack `outputModule`，external 为 `echarts/core`），`exports` 的 `node.import` 指向它。这解决了 Node ESM 下 UMD 的 `require('echarts')` 与应用 `import 'echarts'` 形成两个 echarts 实例、导致 `Unknown series liquidFill` 的问题。

### 修复

- `value` 截断到 0–1：`src/liquidFillView.js` 中波浪水位与默认百分比文案统一按截断后的值计算。
- 空 `data` 只渲染背景与轮廓，不再创建水波和文字（`render` 中按 `data.count()` 分支）。
- `shape: 'container'` 忽略 `center`，始终以画布中心铺满容器，修复 `center` 非 50% 时错位或被裁切的问题，文字区域也随之为 `(0, 0)`。
- 删除 `src/liquidFillSeries.js` 中 `optionUpdated` 对 `gridSize` 的处理（v2 遗留，字段已不存在）。
- 轮廓只创建一次（原先 `getOutline()` 被调用两次，第一次设置的 `lineWidth` 被丢弃）。
- 删除 `data.diff` 更新分支中重复的 `var i` 声明。

### 行为变更（会改变渲染结果）

1. **值越界被截断**：`data` 中 `< 0` 或 `> 1` 的值按 0 或 1 渲染，默认百分比文案也取截断后的值（例如 `-0.5` 显示 `0%`）。
2. **空数据**：`data: []` 时不再生成水波和文字，只保留背景与轮廓。
3. **container 布局**：`shape: 'container'` 时 `center` 不再生效，图表始终铺满容器。

### 工程化

- `package.json`：新增 `files`、`exports`（含 `node` / `import` / `require`、`dist/*`、`src/*`、`package.json`）、`types`、`prepublishOnly`；`build` 一次产出 development、minified 与 ESM 三种产物；`peerDependencies.echarts` 为 `*`。
- 新增 `index.d.ts`：提供 `LiquidFillSeriesOption`、数据项、样式、label、outline 等类型，不依赖 echarts 内部类型路径，兼容 5/6。
- 文档：新增 `README.zh-CN.md`，`README.md` 顶部加入中英文切换；兼容表明确 4.0.x 支持 echarts 5.x / 6.x；补充 TypeScript、构建与 License 小节。
- 构建工具：webpack / webpack-cli 升级至 5.112.2 / 7.3.1，旧版 5.11.1 依赖 md4，在 Node 24 下会报 `ERR_OSSL_EVP_UNSUPPORTED`。
- 版本号提升为 4.0.0（3.2.0 未发布）。

### 升级注意事项

- `peerDependencies.echarts` 已不再限制版本，5.x / 6.x 都可安装；仍建议在项目中锁定 echarts 具体版本。
- Node ESM 场景请使用 `import 'new-echarts-liquidfill'`，走 `exports` 的 `node.import` 条件加载 ESM 产物；不要直接引用 `dist/echarts-liquidfill.js`，否则可能与应用中的 echarts 形成两个实例。
- `shape: 'container'` 下 `center` 不再生效。
- 依赖越界值或空数据产生特定视觉效果的用法，升级后渲染结果会变化，请按上面的行为变更检查。
