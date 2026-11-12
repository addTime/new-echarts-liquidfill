[English](NOTICE) | 简体中文

声明

本项目是 echarts-liquidfill（https://github.com/ecomfe/echarts-liquidfill）
的非官方修改版，原项目由 Ovilia（Zhang Wenli）创建，并以 BSD 3-Clause 许可发布。

原始版权声明（保留英文原文）：

  Copyright (c) 2020, Baidu Inc.
  All rights reserved.

（即：版权所有 (c) 2020，Baidu Inc.，保留所有权利。）

本修改版维护于 https://github.com/addTime/new-echarts-liquidfill，与原作者、
原项目及 Apache ECharts 官方无关，也未获其赞助或背书。

相对原项目的主要改动：

- 同时支持 ECharts 5.x 与 6.x，并移除 peer dependency 的版本限制
- 改为从 `echarts/core` 导入，不再使用内部深层路径
- 新增用于 Node.js ESM 与 SSR 的 ESM 产物
- 修复数值截断、空数据以及 `shape: 'container'` 布局问题
- 类型声明（TypeScript definitions）
- 包配置与发布配置

完整的 BSD 3-Clause 许可文本见 license.md。
