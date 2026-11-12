[English](README.md) | 简体中文

[![npm version](https://img.shields.io/npm/v/new-echarts-liquidfill.svg)](https://www.npmjs.com/package/new-echarts-liquidfill)
[![license](https://img.shields.io/npm/l/new-echarts-liquidfill.svg)](https://github.com/addTime/new-echarts-liquidfill/blob/main/license.md)

> 这是非官方修改版，与原作者及 Apache ECharts 官方无关，也未获其背书。

本版本的改动见 [CHANGELOG.md](CHANGELOG.md)。

# 水球图

[Apache ECharts](https://github.com/apache/echarts) 的水球图扩展，常用于以百分比形式展示数据。

![渲染效果](http://g.recordit.co/zHeMqqlh4j.gif)

## 安装 ECharts

使用 ECharts 扩展时，需要在 ECharts 文件之后引入扩展的 JavaScript 文件。

```html
<script src='echarts.js'></script>
<script src='echarts-liquidfill.js'></script>
```

ECharts 可以在 [GitHub dist 目录](https://github.com/apache/echarts/tree/master/dist) 或 [官网下载页](https://echarts.apache.org/zh/download.html) 下载。

#### 注意

>
> 水球图要求的最低 ECharts 包是 GitHub 上的 [simple 版本](https://github.com/apache/echarts/blob/master/dist/echarts.simple.js)，或者在[在线构建](https://echarts.apache.org/zh/download.html)中不做任何勾选。如果你的其他图表需要其他图表类型或组件，请按需一并引入。

## 使用 npm 安装 new-echarts-liquidfill

```sh
# 将 echarts 安装为 peer dependency
npm install echarts
npm install new-echarts-liquidfill
```

注意：

| new-echarts-liquidfill | echarts |
| --- | --- |
| 4.0.x（当前） | 5.x 和 6.x |
| 3.0.x - 3.1.x | 5.x |
| 2.x | 4.x |

从 4.0.0 起，本包不再限制 `echarts` 的版本范围（`peerDependencies.echarts` 为 `*`），因此可以与 echarts 5 或 echarts 6 一起安装，不会产生 peer dependency 冲突。

引入方式：

```js
import * as echarts from 'echarts';
import 'new-echarts-liquidfill'
```

或者：

```js
import * as echarts from 'echarts/core';
import 'new-echarts-liquidfill'
```

CodeSandbox 上的基础示例见[这里](https://codesandbox.io/s/brave-rosalind-dj280?file=/src/index.js)。

## 从 GitHub 下载 new-echarts-liquidfill

你可以在 [ECharts 官网](https://echarts.apache.org/zh/download.html) 下载最新的 ECharts 文件，并在[dist 目录](https://github.com/addTime/new-echarts-liquidfill/tree/main/dist)下载本扩展。

**注意：如果需要水球图的 tooltip，需要使用完整版 ECharts；否则 simple 版本即可满足需求。**

## 重要说明

### 省略 `normal`

从 [ECharts v4.0.0](https://github.com/apache/echarts/releases/tag/4.0.0) 起，`itemStyle` 和 `label` 中不再需要 `normal`。

### 扁平化 `textStyle`

从 [ECharts v3.7.0](https://github.com/apache/echarts/releases/tag/3.7.0) 起，`textStyle` 配置被扁平化，原先的 `series.label[normal|emphasis].textStyle.xxx` 现在可以直接写成 `series.label[normal|emphasis].textStyle`。echarts-liquidfill 从 [v1.0.6](https://github.com/ecomfe/echarts-liquidfill/releases/tag/v1.0.6) 开始支持这种写法。所以如果你在旧示例中看到带 `textStyle` 的写法，不必感到意外。

## 快速上手

- [API](#api)
- [ECharts Gallery 上的示例](https://www.makeapie.com/explore.html#tags=liquidFill~sort=rank~timeframe=all~author=all)

以下是一些常见用法：

- [在一个图表中使用多个波浪](#多个波浪)
- [修改波浪颜色和透明度](#颜色与透明度)
- [让波浪静止](#静态波浪)
- [没有波浪的水面](#静水)
- [为单个波浪设置属性](#修改单个波浪)
- [修改背景和边框样式](#背景样式)
- [隐藏图表轮廓](#轮廓样式)
- [用 SVG 修改形状](#形状)
- [设置动画](#动画)
- [修改文字内容和样式](#修改文字)
- [修改阴影样式](#阴影)
- [设置 tooltip](#tooltip)
- [点击事件](#点击事件)
- [让元素不可交互](#不可交互)

如有问题，可以 fork [Gallery 上的水球图示例](https://www.makeapie.com/editor.html?c=xr1XplzB4e)，把你的代码贴进去，然后在项目中[提 issue](https://github.com/addTime/new-echarts-liquidfill/issues/new)。

## 示例

### 简单示例

要创建水球图，需要一个 `type` 为 `'liquidFill'` 的 series。基础配置如下：

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6]
    }]
};
```

![简单水球图](http://g.recordit.co/RsjUlo69JN.gif)

[运行](https://www.makeapie.com/editor.html?c=xr1XplzB4e)

### 多个波浪

水球图很容易创建多个波浪，既可以表示多个数据，也可以增强视觉效果。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3]
    }]
};
```

以上配置会创建水位分别为 60%、50%、40% 和 30% 的波浪。

![多个波浪](http://g.recordit.co/HJ3z3ITqzL.gif)

[运行](https://www.makeapie.com/editor.html?c=xSyIEWMBNl)

### 颜色与透明度

为水球图 series 设置颜色时，将 `color` 设为颜色数组。设置透明度时，使用 `itemStyle.opacity` 和 `itemStyle.emphasis.opacity` 分别控制普通状态和 hover 状态。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.5, 0.4, 0.3],
        color: ['red', '#0f0', 'rgb(0, 0, 255)'],
        itemStyle: {
                opacity: 0.6
        },
        emphasis: {
            itemStyle: {
                opacity: 0.9
            }
        }
    }]
};
```

![颜色与透明度](http://g.recordit.co/ZVRBdxO6oY.gif)

[运行](https://www.makeapie.com/editor.html?c=xrJpDC704l)

也可以通过下面的方式设置单个数据项的颜色和透明度：

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.5, 0.4, {
            value: 0.3,
            itemStyle: {
                color: 'red',
                opacity: 0.6
            },
            emphasis: {
                itemStyle: {
                    opacity: 0.9
                }
            }
        }]
    }]
};
```

![单个数据项的颜色与透明度](http://g.recordit.co/Smz5G8ypvO.gif)

[运行](https://www.makeapie.com/editor.html?c=xBJPCRXR4l)

### 静态波浪

如果不想让波浪左右移动，将 `waveAnimation` 设为 `false` 即可。如果要关闭水位上升动画，将 `animationDuration` 和 `animationDurationUpdate` 设为 0。

```js
var option = {
    series: [{
        type: 'liquidFill',
        waveAnimation: false,
        animationDuration: 0,
        animationDurationUpdate: 0,
        data: [0.6, 0.5, 0.4, 0.3]
    }]
};
```

![静态波浪](http://g.recordit.co/Wze7eblLPM.gif)

[运行](https://www.makeapie.com/editor.html?c=xH1VfVVREx)

### 静水

将 `amplitude` 设为 0 可以得到静止的水面。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        amplitude: 0,
        waveAnimation: 0
    }]
};
```

这种情况下建议将 `waveAnimation` 设为 `false`，出于性能考虑关闭动画。

![静水](http://g.recordit.co/EQ5pnYDAtN.gif)

[运行](https://www.makeapie.com/editor.html?c=xHy1NHVCNx)

### 修改单个波浪

要修改单个波浪，在数据项中覆盖相应配置即可。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, {
            value: 0.5,
            direction: 'left',
            itemStyle: {
                color: 'red'
            }
        }, 0.4, 0.3]
    }]
};
```

![修改单个波浪](http://g.recordit.co/31VHgsRV2y.gif)

[运行](https://www.makeapie.com/editor.html?c=xry6CHNCVl)

### 背景样式

可以使用 `backgroundStyle` 设置背景形状的描边和填充样式。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        backgroundStyle: {
            borderWidth: 5,
            borderColor: 'red',
            color: 'yellow'
        }
    }]
};
```

![修改边框宽度和颜色](http://g.recordit.co/nXCxOcV4IQ.gif)

[运行](https://www.makeapie.com/editor.html?c=xSkJoa_kBx)

### 轮廓样式

要隐藏轮廓，将 `outline.show` 设为 `false`。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        outline: {
            show: false
        }
    }]
};
```

![无轮廓](http://g.recordit.co/nIxiw5KAGC.gif)

[运行](https://www.makeapie.com/editor.html?c=xSySxR_JBg)

### 形状

水球图的形状可以是：

- 内置 symbol 之一：`'circle'`、`'rect'`、`'roundRect'`、`'triangle'`、`'diamond'`、`'pin'`、`'arrow'`；
- `'container'`：铺满整个容器；
- 以 `'path://'` 开头的 SVG 路径。

```js
var options = [{
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        shape: 'diamond'
    }]
}];
```

![菱形波浪](http://g.recordit.co/1v9490ijKg.gif)

[运行](https://www.makeapie.com/editor.html?c=xry0tUfcBe)

```
option = {
    series: [{
        type: 'liquidFill',
        data: [0.5, 0.4, 0.3, 0.2],
        shape: 'container',
        outline: {
            show: false
        }
    }]
};
```

![铺满容器](http://g.recordit.co/iuMJckv5lB.gif)

[运行](https://www.makeapie.com/editor.html?c=xrko4E9zKb&v=1)

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.55, 0.4, 0.25],
        radius: '60%',
        outline: {
            show: false
        },
        backgroundStyle: {
            borderColor: '#156ACF',
            borderWidth: 1,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            shadowBlur: 20
        },
        shape: 'path://M367.855,428.202c-3.674-1.385-7.452-1.966-11.146-1.794c0.659-2.922,0.844-5.85,0.58-8.719 c-0.937-10.407-7.663-19.864-18.063-23.834c-10.697-4.043-22.298-1.168-29.902,6.403c3.015,0.026,6.074,0.594,9.035,1.728 c13.626,5.151,20.465,20.379,15.32,34.004c-1.905,5.02-5.177,9.115-9.22,12.05c-6.951,4.992-16.19,6.536-24.777,3.271 c-13.625-5.137-20.471-20.371-15.32-34.004c0.673-1.768,1.523-3.423,2.526-4.992h-0.014c0,0,0,0,0,0.014 c4.386-6.853,8.145-14.279,11.146-22.187c23.294-61.505-7.689-130.278-69.215-153.579c-61.532-23.293-130.279,7.69-153.579,69.202 c-6.371,16.785-8.679,34.097-7.426,50.901c0.026,0.554,0.079,1.121,0.132,1.688c4.973,57.107,41.767,109.148,98.945,130.793 c58.162,22.008,121.303,6.529,162.839-34.465c7.103-6.893,17.826-9.444,27.679-5.719c11.858,4.491,18.565,16.6,16.719,28.643 c4.438-3.126,8.033-7.564,10.117-13.045C389.751,449.992,382.411,433.709,367.855,428.202z',
        label: {
            position: ['38%', '40%'],
            formatter: function() {
                return 'ECharts\nLiquid Fill';
            },
            fontSize: 40,
            color: '#D94854'
        }
    }]
};
```

![ECharts Liquid Fill](http://g.recordit.co/CfZq1v9tzv.gif)

[运行](https://www.makeapie.com/editor.html?c=xH1HouM9Sl)

### 动画

一般来说，水球图中有两类动画。

第一类是初始动画，效果是水位上升。其缓动方式由 `animationEasing` 控制，时长由 `animationDuration` 控制。

第二类是更新动画，通常在数据变化、水位高度变化时触发。它们由 `animationEasingUpdate` 和 `animationDurationUpdate` 控制。

例如，关闭水位上升动画，并将更新动画时长设为两秒、缓动设为 `cubicOut`，可以使用以下配置：

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        animationDuration: 0,
        animationDurationUpdate: 2000,
        animationEasingUpdate: 'cubicOut'
    }]
};
chart.setOption(option);
setTimeout(function () {
    chart.setOption({
        series: [{
            type: 'liquidFill',
            data: [0.8, 0.6, 0.4, 0.2]
        }]
    })
}, 3000);
```

![更新动画](http://g.recordit.co/qt87aYQ9SO.gif)

[运行](https://www.makeapie.com/editor.html?c=xSk8I5JcHe)

### 修改文字

默认情况下，水球图的文字标签显示第一个数据的百分比。例如数据为 `[0.6, 0.5, 0.4, 0.3]` 时，默认文字为 `60%`。

要修改文字，可以使用 `label.formatter`，它可以是字符串或函数。

如果是字符串，`{a}` 表示 series 名称，`{b}` 表示数据项名称，`{c}` 表示数据值。

```js
var option = {
    series: [{
        type: 'liquidFill',
        name: 'Liquid Fill',
        data: [{
            name: 'First Data',
            value: 0.6
        }, 0.5, 0.4, 0.3],
        label: {
            formatter: '{a}\n{b}\nValue: {c}',
            fontSize: 28
        }
    }]
};
```

该示例的标签文字为 `'Liquid Fill\nFirst Data\nValue: 0.6'`。

![字符串形式的 label.formatter](http://g.recordit.co/3Zcftu8tpL.gif)

[运行](https://www.makeapie.com/editor.html?c=xrkwSn1qHx)

将 `formatter` 写成函数可以得到相同的结果：

```js
var option = {
    series: [{
        type: 'liquidFill',
        name: 'Liquid Fill',
        data: [{
            name: 'First Data',
            value: 0.6
        }, 0.5, 0.4, 0.3],
        label: {
            formatter: function(param) {
                return param.seriesName + '\n'
                    + param.name + '\n'
                    + 'Value:' + param.value;
            },
            fontSize: 28
        }
    }]
};
```

[运行](https://www.makeapie.com/editor.html?c=xHk5831cHg)

文字位置默认在中心。`label.position` 可以设为 `'inside'`、`'left'`、`'right'`、`'top'`、`'bottom'`，或者像 `['10%', '20%']` 这样的水平和垂直位置，表示距左侧 `'10%'`（由 `label.align` 控制，可取 `'left'`、`'center'`、`'right'`）、距顶部 `'20%'`（由 `label.baseline` 控制，可取 `'top'`、`'middle'`、`'bottom'`）。

### 阴影

默认情况下，波浪和轮廓都带有阴影。可以通过以下方式修改。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        itemStyle: {
            shadowBlur: 0
        },
        outline: {
            borderDistance: 0,
            itemStyle: {
                borderWidth: 5,
                borderColor: '#156ACF',
                shadowBlur: 20,
                shadowColor: 'rgba(255, 0, 0, 1)'
            }
        }
    }]
};
```

![修改阴影](http://g.recordit.co/nIy6lZaS8C.gif)

[运行](https://www.makeapie.com/editor.html?c=xrJO4CyqSl)

### Tooltip

添加 tooltip：

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6],
        name: 'Liquid Fill'
    }],
    tooltip: {
        show: true
    }
};
```

![Tooltip](http://g.recordit.co/S1zQTS6B0G.gif)

[运行](https://www.makeapie.com/editor.html?c=xSJqXeg5He)

### 点击事件

为波浪添加点击事件：

```js
chart.setOption(option);
chart.on('click', function() {
    console.log(arguments);
    // do something useful here
});
```

与其他图表类型一样，上面的代码只会在波浪上触发事件。如果要监听整个画布或特定元素上的事件，可以给 zrender 添加监听：

```js
chart.getZr().on('click', function() {
       console.log(arguments);
});
```

### 不可交互

要让某个元素（例如波浪）不可交互，将 `silent` 设为 `true` 即可。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        silent: true
    }]
};
```

[运行](https://www.makeapie.com/editor.html?c=xSJqev71Jb)

## API

水球图的默认配置如下：

```js
{
    data: [],

    color: ['#294D99', '#156ACF', '#1598ED', '#45BDFF'],
    center: ['50%', '50%'],
    radius: '50%',
    amplitude: '8%',
    waveLength: '80%',
    phase: 'auto',
    period: 'auto',
    direction: 'right',
    shape: 'circle',

    waveAnimation: true,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    animationDuration: 2000,
    animationDurationUpdate: 1000,

    outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
            color: 'none',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
    },

    backgroundStyle: {
        color: '#E3F7FF'
    },

    itemStyle: {
        opacity: 0.95,
        shadowBlur: 50,
        shadowColor: 'rgba(0, 0, 0, 0.4)'
    },

    label: {
        show: true,
        color: '#294D99',
        insideColor: '#fff',
        fontSize: 50,
        fontWeight: 'bold',

        align: 'center',
        baseline: 'middle',
        position: 'inside'
    },

    emphasis: {
        itemStyle: {
            opacity: 0.8
        }
    }
}
```

### data {(number|Object)[]}

每个数据项的值应在 0 到 1 之间。

数据项也可以是对象，用于配置单个数据项的选项。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, {
            value: 0.5,
            itemStyle: {
                color: 'red'
            }
        }, 0.4, 0.3]
    }]
};
```

上面的配置会让第二个波浪显示为红色。

### color {string[]}

波浪颜色。

### shape {string}

水球图的形状。可以是内置 symbol 之一：`'circle'`、`'rect'`、`'roundRect'`、`'triangle'`、`'diamond'`、`'pin'`、`'arrow'`；也可以是 `'container'`（铺满整个容器）；或者是以 `'path://'` 开头的 SVG 路径。

### center {string[]}

图表位置。第一个值是 x 坐标，第二个值是 y 坐标。每个值都可以是相对值（如 `'50%'`，相对于容器宽高中较小的值），也可以是绝对值（如 `100px`）。

### radius {string}

图表半径。可以是相对值（如 `'50%'`，相对于容器宽高中较小的值），也可以是绝对值（如 `100px`）。

### amplitude {number}

波浪振幅，单位为像素或百分比。如果是百分比，则相对于直径。

### waveLength {string|number}

波浪长度。可以是相对值（如 `'50%'`，相对于直径），也可以是绝对值（如 `'100px'` 或 `100`）。

### phase {number}

波浪相位，单位为弧度。默认值为 `'auto'`，此时每个波浪的相位比前一个多 `Math.PI / 4`。

### period {number|'auto'|function}

波浪向前移动一个波长的毫秒数。默认值为 `'auto'`，此时位于前面的波浪速度更快。

也可以是一个格式化函数。

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        radius: '70%',
        phase: 0,
        period: function (value, index) {
            // 该函数会被调用四次，分别对应 series 中的每个数据项。
            // `value` 依次为 0.6、0.5、0.4、0.3，`index` 依次为 0、1、2、3。
            return 2000 * index + 1000;
        }
    }]
}
```

### direction {string}

波浪移动方向，可取 `'right'` 或 `'left'`。

### waveAnimation {boolean}

是否让波浪左右移动。

### animationEasing {string}

初始动画的缓动方式，即图表开始时波浪从底部上升的动画。

### animationEasingUpdate {string}

其他动画的缓动方式，例如数据值变化、波浪位置变化时的动画。

### animationDuration {number}

初始动画时长，单位为毫秒。

### animationDurationUpdate {number}

其他动画时长，单位为毫秒。

### outline.show {boolean}

是否显示轮廓。

### outline.borderDistance {number}

边框与内圈之间的距离。

### outline.itemStyle.borderColor {string}

边框颜色。

### outline.itemStyle.borderWidth {number}

边框宽度。

### outline.itemStyle.shadowBlur {number}

轮廓阴影模糊大小。

### outline.itemStyle.shadowColor {string}

轮廓阴影颜色。

### backgroundStyle.color {string}

背景填充颜色。

### backgroundStyle.borderWidth {string}

背景描边线宽。

### backgroundStyle.borderColor {string}

背景描边颜色。

### backgroundStyle.itemStyle.shadowBlur {number}

背景阴影模糊大小。

### backgroundStyle.itemStyle.shadowColor {string}

背景阴影颜色。

### backgroundStyle.itemStyle.opacity {number}

背景透明度。

### itemStyle.opacity {number}

波浪透明度。

### itemStyle.shadowBlur {number}

波浪阴影宽度。

### itemStyle.shadowColor {string}

波浪阴影颜色。

### emphasis.itemStyle.opacity {number}

hover 时的波浪透明度。

### label.show {boolean}

是否显示标签文字。

### label.color {string}

文字在背景上显示时的颜色。

### label.insideColor {string}

文字在波浪上显示时的颜色。

### label.fontSize {number}

标签字号。

### label.fontWeight {string}

标签字重。

### label.align {string}

文字水平对齐方式，可取 `'left'`、`'center'` 或 `'right'`。

### label.baseline {string}

文字垂直对齐方式，可取 `'top'`、`'middle'` 或 `'bottom'`。

### label.position {string|string[]}

文字位置默认在中心。`label.position` 可以设为 `'inside'`、`'left'`、`'right'`、`'top'`、`'bottom'`，或者像 `['10%', '20%']` 这样的水平和垂直位置，表示距左侧 `'10%'`、距顶部 `'20%'`。

## TypeScript

类型定义随包提供，位于 `index.d.ts`：

```ts
import * as echarts from 'echarts';
import 'new-echarts-liquidfill';
import type { LiquidFillSeriesOption } from 'new-echarts-liquidfill';

const series: LiquidFillSeriesOption = {
    type: 'liquidFill',
    data: [0.6, 0.5, 0.4]
};

const option: echarts.EChartsOption = {
    series: [series as any]
};
```

## 构建与开发

```
$ npm install
$ npm run dev     # watch 模式，生成 development 产物
$ npm run build   # 在 dist/ 中生成 development 和 production（压缩）产物
```

示例页面加载的是 `dist/echarts-liquidfill.js`，因此修改源码后需要先运行 `npm run build`，再在浏览器中打开 `example/index.html`。

使用该包只需 Node.js 16 及以上；本地构建与发布因 webpack-cli 7 需要 Node.js 20.9 及以上，两者要求不同。

## 来源与授权

本项目是非官方修改版，基于 Ovilia 的
[ecomfe/echarts-liquidfill](https://github.com/ecomfe/echarts-liquidfill)
修改而来，原项目使用 BSD 3-Clause 许可。原始版权声明保留在
[NOTICE](NOTICE)（[English](NOTICE) | [简体中文](NOTICE.zh-CN.md)），修改内容见 [CHANGELOG.md](CHANGELOG.md)，完整许可文本见
[license.md](license.md)。本项目与原作者及 Apache ECharts 官方无关，也未获其背书。

## 声明

Apache Software Foundation 的 [Apache ECharts, ECharts](https://echarts.apache.org/)、Apache、Apache feather 以及 Apache ECharts 项目 logo 是 [Apache Software Foundation](https://www.apache.org/) 的注册商标或商标。
