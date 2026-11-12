# 后续优化清单

本文档只记录 **4.0.0 之后尚未完成** 的改进项。

4.0.0 已完成的内容：兼容 echarts 5.x / 6.x、移除 `peerDependencies` 版本限制、新增 Node ESM 产物、value 截断到 0–1、空 data 不渲染水波、`container` 与 `center` 布局冲突修复、TypeScript 类型声明（`index.d.ts`）、发布包配置（`files` / `exports` / `types` / `prepublishOnly`）。

优先级说明：**P1** 建议在下个版本前完成；**P2** 可排入后续迭代；**待确认** 需要先做决策，暂不排期。

---

## 1. 支持 dataset 与 name 维度

**现状问题**
`getInitialData` 只从 `series.data` 读取数据，`helper.createDimensions` 只注册了 `value` 维度。因此：

- `dataset` 数据源完全不可用；
- 纯数字写法下 `data.getName(0)` 没有有效名称，`label.formatter` 的 `{b}` 不可用；
- 无法通过 dataset 的 dimensions 指定名称、颜色等字段。

**改法**
优先从 `dataset` 取源（`getSourceManager().getSource`）；若存在 `series.data` 则保持现有优先级。维度注册增加 `name`，并在取值时使用 `data.getName(0)` 作为默认名称；补充 dataset 示例与 SSR 测试。

**涉及文件**
`src/liquidFillSeries.js`、`src/liquidFillView.js`、`index.d.ts`、`README.md` / `README.zh-CN.md`、`test/`

**优先级**：P1

---

## 2. 使用主题调色板 `getColorFromPalette`

**现状问题**
`defaultOption.color` 写死了 4 个颜色，视图层用 `seriesModel.get('color')` 按下标取色（`idx % colors.length`），绕过了 ECharts 的调色板机制。结果是在主题中设置的 `color` 对水波不生效，与 ECharts 其他 series 的行为不一致。

**改法**
未显式配置 `color` 时调用 `seriesModel.getColorFromPalette(data.getName(idx), idx, false)` 取主题色；显式 `color` 仍优先。评估是否移除 `defaultOption.color`，或在文档中说明它是 fallback。该改动会改变依赖默认配色或主题切换的图表外观，需要写入 changelog。

**涉及文件**
`src/liquidFillSeries.js`、`src/liquidFillView.js`、`README.md` / `README.zh-CN.md`、`test/`

**优先级**：P1

---

## 3. 按职责拆分 `liquidFillView.js`

**现状问题**
视图文件约 500 行，布局计算、shape 工厂、波浪创建/更新、文字裁剪、动画都集中在一个 `render` 闭包里，通过 `radius`、`left`、`top`、`wavePath` 等闭包变量隐式共享状态，难以单测和局部修改。

**改法**
按职责拆为独立模块，`render` 只做编排：

- `layout.js`：`center` / `radius` / 两种 `shape` 分支 / outline 与背景尺寸；
- `wave.js`：创建、更新、diff、渐变与 clip；
- `text.js`：双色文字与 water clipPath；
- `animation.js`：初始水位、更新插值、循环相位；
- 共享的纯计算函数下沉到 `utils/`（见第 4 项）。

拆分目标是不改变对外 option 与事件行为，必要时用 SSR SVG 快照做回归对比。

**涉及文件**
`src/liquidFillView.js`、新增 `src/layout.js`、`src/wave.js`、`src/text.js`、`src/animation.js`

**优先级**：P1

---

## 4. 纯计算逻辑抽函数并补单元测试

**现状问题**
水位换算、相位、`period` 计算、百分比解析、shape 路径计算与图表实例、闭包状态耦合，当前仓库没有任何测试，边界行为（0 / 1、负数、空数组、`container`、`path://`）只能靠手写示例验证。

**改法**
将这些逻辑抽为无副作用函数，例如 `parsePercent`、`clamp01`、`getWaterLevel`、`getPhaseOffset`、`getPeriod`、`buildShapePath`。引入 Vitest：

- 纯函数单测覆盖边界值；
- SSR SVG 渲染冒烟测试（`echarts.init(null, null, { renderer: 'svg', ssr: true })`）覆盖正常、空 data、越界值、`container`、`path://`；
- 增加 `npm test` 脚本。

**涉及文件**
新增 `src/utils/*.js`、`test/*.test.js`、`package.json`

**优先级**：P1

---

## 5. 引入 ESLint + Prettier

**现状问题**
没有 lint / format 配置，风格（4 空格缩进、单引号）靠人工维护；已清理的未使用变量、重复声明等问题缺少自动拦截。

**改法**
ESLint 9 flat config + Prettier：单引号、4 空格、`no-unused-vars`、`eqeqeq` 等基础规则；新增 `lint` / `format` 脚本，并在 CI 中执行。首次接入只修复机械性问题，避免与业务改动混在一起。

**涉及文件**
新增 `eslint.config.js`、`.prettierrc.json`、`.prettierignore`、`package.json`

**优先级**：P2

---

## 6. 增加 CI（lint / test / build + echarts 双版本矩阵）

**现状问题**
仓库没有 GitHub Actions workflow，构建质量依赖本地环境（此前就遇到过 Node 24 + 旧版 webpack 的 md4 报错）。

**改法**
新增 `.github/workflows/ci.yml`：

- Node 20 / 22；
- `echarts` 版本矩阵：5.6.x 与 6.x；
- 步骤：`npm ci` → `npm run lint` → `npm test`（含 SSR 渲染）→ `npm run build` → `npm pack --dry-run`；
- 缓存 npm 依赖。

**涉及文件**
新增 `.github/workflows/ci.yml`、`package.json`

**优先级**：P1

---

## 7. `path://` 形状切换时的 clipPath 形变

**现状问题**
形状切换时，代码对内置 symbol 做 clipPath 形变，但对 `path://` 直接跳过（源码中留有 TODO），表现为形状瞬时切换、与其它形状的动画观感不一致。

**改法**
两种方案择一：

1. 使用 zrender 的路径插值能力，对同构 SVG path 做 shape 过渡；
2. 非同构路径时采用双 clip 交叉淡入淡出，保证有过渡效果。

需要在测试中覆盖内置 symbol → `path://`、`path://` → 内置 symbol 的切换。

**涉及文件**
`src/liquidFillView.js`（`getWave` 与 update 分支）、`test/`

**优先级**：P2

---

## 8. 波浪动画的每帧重绘开销

**现状问题**
波浪循环动画的 `during` 回调中每帧调用 `wavePath.dirty(true)`，会重新构建所有波浪组成的 CompoundPath；同时每次 `setOption` 都 `removeAll` 重建 outline、背景与文字，并重新创建动画。多波浪或大尺寸场景下存在持续开销。

**改法**
- 降低 clip 刷新频率：缓存静态部分，仅在形状/尺寸变化时重建；
- 更新时复用背景、轮廓、文字元素，只 diff 波浪；
- 复用同一 animator，避免重复 `animate('shape', true)` 叠加；
- 用性能基准（如 8 波浪 × 600×600、持续 10 秒的帧耗时）验证优化前后差异。

**涉及文件**
`src/liquidFillView.js`、`src/liquidFillShape.js`

**优先级**：P2

---

## 9. 发布自动化

**现状问题**
已有 `prepublishOnly` 会执行构建，但缺少版本 tag、CHANGELOG 与发布 workflow；`dist/` 手动构建并入库，存在源码与产物漂移风险。

**改法**
- 增加 `CHANGELOG.md`，按语义化版本记录；
- 用 `npm version <minor|major>` 同步 `package.json` / `package-lock.json` 并打 tag；
- 新增 tag 触发的 GitHub Release workflow：安装依赖 → `npm test` → `npm run build` → `npm publish`（使用 `NPM_TOKEN`）→ 上传构建产物；
- 发布前保留 `npm pack --dry-run` 校验步骤。

**涉及文件**
`package.json`、新增 `.github/workflows/release.yml`、新增 `CHANGELOG.md`

**优先级**：P2

---

## 10. license 字段不一致（待确认，不排期）

**现状问题**
`package.json` 的 `license` 字段是 `MIT`，但 `license.md` 是 BSD 3-Clause；两份 README 的 License 小节按 `license.md` 写为 BSD 3-Clause。

**待确认事项**
需要确定以哪一份为准，再统一 `package.json`、`license.md`、`README.md` / `README.zh-CN.md` 以及 npm 页面上的元数据。在决定前不做任何修改，本文档也不预设结论。

**涉及文件**
`package.json`、`license.md`、`README.md`、`README.zh-CN.md`

**优先级**：待确认
