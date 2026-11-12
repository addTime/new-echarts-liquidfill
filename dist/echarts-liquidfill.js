(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["echarts-liquidfill"] = factory(require("echarts"));
	else
		root["echarts-liquidfill"] = factory(root["echarts"]);
})(this, (__WEBPACK_EXTERNAL_MODULE_echarts_core__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "echarts/core"
/*!**************************!*\
  !*** external "echarts" ***!
  \**************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE_echarts_core__;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./index.js + 4 modules ***!
  \******************************/

// EXTERNAL MODULE: external "echarts"
var external_echarts_ = __webpack_require__("echarts/core");
;// ./src/liquidFillSeries.js


external_echarts_.extendSeriesModel({

    type: 'series.liquidFill',

    getInitialData: function (option, ecModel) {
        var dimensions = external_echarts_.helper.createDimensions(option.data, {
            coordDimensions: ['value']
        });
        var list = new external_echarts_.List(dimensions, this);
        list.initData(option.data);
        return list;
    },

    defaultOption: {
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
});

;// ./src/liquidFillShape.js


/* harmony default export */ const liquidFillShape = (external_echarts_.graphic.extendShape({
    type: 'ec-liquid-fill',

    shape: {
        waveLength: 0,
        radius: 0,
        radiusY: 0,
        cx: 0,
        cy: 0,
        waterLevel: 0,
        amplitude: 0,
        phase: 0,
        inverse: false
    },

    buildPath: function (ctx, shape) {
        if (shape.radiusY == null) {
            shape.radiusY = shape.radius;
        }

        /**
         * We define a sine wave having 4 waves, and make sure at least 8 curves
         * is drawn. Otherwise, it may cause blank area for some waves when
         * wave length is large enough.
         */
        var curves = Math.max(
            Math.ceil(2 * shape.radius / shape.waveLength * 4) * 2,
            8
        );

        // map phase to [-Math.PI * 2, 0]
        while (shape.phase < -Math.PI * 2) {
            shape.phase += Math.PI * 2;
        }
        while (shape.phase > 0) {
            shape.phase -= Math.PI * 2;
        }
        var phase = shape.phase / Math.PI / 2 * shape.waveLength;

        var left = shape.cx - shape.radius + phase - shape.radius * 2;

        /**
         * top-left corner as start point
         *
         * draws this point
         *  |
         * \|/
         *  ~~~~~~~~
         *  |      |
         *  +------+
         */
        ctx.moveTo(left, shape.waterLevel);

        /**
         * top wave
         *
         * ~~~~~~~~ <- draws this sine wave
         * |      |
         * +------+
         */
        var waveRight = 0;
        for (var c = 0; c < curves; ++c) {
            var stage = c % 4;
            var pos = getWaterPositions(c * shape.waveLength / 4, stage,
                shape.waveLength, shape.amplitude);
            ctx.bezierCurveTo(pos[0][0] + left, -pos[0][1] + shape.waterLevel,
                pos[1][0] + left, -pos[1][1] + shape.waterLevel,
                pos[2][0] + left, -pos[2][1] + shape.waterLevel);

            if (c === curves - 1) {
                waveRight = pos[2][0];
            }
        }

        if (shape.inverse) {
            /**
             * top-right corner
             *                  2. draws this line
             *                          |
             *                       +------+
             * 3. draws this line -> |      | <- 1. draws this line
             *                       ~~~~~~~~
             */
            ctx.lineTo(waveRight + left, shape.cy - shape.radiusY);
            ctx.lineTo(left, shape.cy - shape.radiusY);
            ctx.lineTo(left, shape.waterLevel);
        }
        else {
            /**
             * top-right corner
             *
             *                       ~~~~~~~~
             * 3. draws this line -> |      | <- 1. draws this line
             *                       +------+
             *                          ^
             *                          |
             *                  2. draws this line
             */
            ctx.lineTo(waveRight + left, shape.cy + shape.radiusY);
            ctx.lineTo(left, shape.cy + shape.radiusY);
            ctx.lineTo(left, shape.waterLevel);
        }

        ctx.closePath();
    }
}));



/**
 * Using Bezier curves to fit sine wave.
 * There is 4 control points for each curve of wave,
 * which is at 1/4 wave length of the sine wave.
 *
 * The control points for a wave from (a) to (d) are a-b-c-d:
 *          c *----* d
 *     b *
 *       |
 * ... a * ..................
 *
 * whose positions are a: (0, 0), b: (0.5, 0.5), c: (1, 1), d: (PI / 2, 1)
 *
 * @param {number} x          x position of the left-most point (a)
 * @param {number} stage      0-3, stating which part of the wave it is
 * @param {number} waveLength wave length of the sine wave
 * @param {number} amplitude  wave amplitude
 */
function getWaterPositions(x, stage, waveLength, amplitude) {
    if (stage === 0) {
        return [
            [x + 1 / 2 * waveLength / Math.PI / 2, amplitude / 2],
            [x + 1 / 2 * waveLength / Math.PI,     amplitude],
            [x + waveLength / 4,                   amplitude]
        ];
    }
    else if (stage === 1) {
        return [
            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 2),
            amplitude],
            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 1),
            amplitude / 2],
            [x + waveLength / 4,                   0]
        ]
    }
    else if (stage === 2) {
        return [
            [x + 1 / 2 * waveLength / Math.PI / 2, -amplitude / 2],
            [x + 1 / 2 * waveLength / Math.PI,     -amplitude],
            [x + waveLength / 4,                   -amplitude]
        ]
    }
    else {
        return [
            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 2),
            -amplitude],
            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 1),
            -amplitude / 2],
            [x + waveLength / 4,                   0]
        ]
    }
}

;// ./src/liquidFillView.js



// Local copy of the percent parser, so that this extension doesn't have to
// import echarts internals (which are not part of the public API).
function parsePercent(value, maxValue) {
    if (typeof value === 'string') {
        value = value.trim();
        if (value === 'center' || value === 'middle') {
            value = '50%';
        }
        else if (value === 'left' || value === 'top') {
            value = '0%';
        }
        else if (value === 'right' || value === 'bottom') {
            value = '100%';
        }
        return value.indexOf('%') >= 0
            ? parseFloat(value) / 100 * maxValue
            : parseFloat(value);
    }
    return value == null ? NaN : value;
}

function clamp01(value) {
    value = typeof value === 'number' ? value : parseFloat(value);
    if (!isFinite(value)) {
        return 0;
    }
    return Math.min(Math.max(value, 0), 1);
}

function isPathSymbol(symbol) {
    return symbol && symbol.indexOf('path://') === 0
}

external_echarts_.extendChartView({

    type: 'liquidFill',

    render: function (seriesModel, ecModel, api) {
        var self = this;
        var group = this.group;
        group.removeAll();

        var data = seriesModel.getData();
        var dataCount = data.count();

        // When there is no data, fall back to the series model so that the
        // layout (center / radius / shape) can still be rendered.
        var itemModel = dataCount > 0 ? data.getItemModel(0) : seriesModel;

        var center = itemModel.get('center');
        var radius = itemModel.get('radius');

        var width = api.getWidth();
        var height = api.getHeight();
        var size = Math.min(width, height);
        // itemStyle
        var outlineDistance = 0;
        var outlineBorderWidth = 0;
        var showOutline = seriesModel.get('outline.show');

        if (showOutline) {
            outlineDistance = seriesModel.get('outline.borderDistance');
            outlineBorderWidth = parsePercent(
                seriesModel.get('outline.itemStyle.borderWidth'), size
            );
        }

        var symbol = seriesModel.get('shape');
        var isFillContainer = symbol === 'container';

        // 'container' always fills the whole canvas, so center doesn't apply.
        var cx = isFillContainer ? width / 2 : parsePercent(center[0], width);
        var cy = isFillContainer ? height / 2 : parsePercent(center[1], height);

        var outterRadius;
        var innerRadius;
        var paddingRadius;

        if (isFillContainer) {
            // a shape that fully fills the container
            outterRadius = [
                width / 2,
                height / 2
            ];
            innerRadius = [
                outterRadius[0] - outlineBorderWidth / 2,
                outterRadius[1] - outlineBorderWidth / 2
            ];
            paddingRadius = [
                parsePercent(outlineDistance, width),
                parsePercent(outlineDistance, height)
            ];

            radius = [
                Math.max(innerRadius[0] - paddingRadius[0], 0),
                Math.max(innerRadius[1] - paddingRadius[1], 0)
            ];
        }
        else {
            outterRadius = parsePercent(radius, size) / 2;
            innerRadius = outterRadius - outlineBorderWidth / 2;
            paddingRadius = parsePercent(outlineDistance, size);

            radius = Math.max(innerRadius - paddingRadius, 0);
        }

        if (showOutline) {
            var outline = getOutline();
            outline.style.lineWidth = outlineBorderWidth;
            group.add(outline);
        }

        var left = isFillContainer ? 0 : cx - radius;
        var top = isFillContainer ? 0 : cy - radius;

        var wavePath = null;

        group.add(getBackground());

        // each data item for a wave
        var oldData = this._data;
        var waves = [];
        if (dataCount > 0) {
            data.diff(oldData)
                .add(function (idx) {
                    var wave = getWave(idx, false);

                    var waterLevel = wave.shape.waterLevel;
                    wave.shape.waterLevel = isFillContainer ? height / 2 : radius;
                    external_echarts_.graphic.initProps(wave, {
                        shape: {
                            waterLevel: waterLevel
                        }
                    }, seriesModel);

                    wave.z2 = 2;
                    setWaveAnimation(idx, wave, null);

                    group.add(wave);
                    data.setItemGraphicEl(idx, wave);
                    waves.push(wave);
                })
                .update(function (newIdx, oldIdx) {
                    var waveElement = oldData.getItemGraphicEl(oldIdx);

                    // new wave is used to calculate position, but not added
                    var newWave = getWave(newIdx, false, waveElement);

                    // changes with animation
                    var shape = {};
                    var shapeAttrs = ['amplitude', 'cx', 'cy', 'phase', 'radius', 'radiusY', 'waterLevel', 'waveLength'];
                    var i;
                    for (i = 0; i < shapeAttrs.length; ++i) {
                        var attr = shapeAttrs[i];
                        if (newWave.shape.hasOwnProperty(attr)) {
                            shape[attr] = newWave.shape[attr];
                        }
                    }

                    var style = {};
                    var styleAttrs = ['fill', 'opacity', 'shadowBlur', 'shadowColor'];
                    for (i = 0; i < styleAttrs.length; ++i) {
                        attr = styleAttrs[i];
                        if (newWave.style.hasOwnProperty(attr)) {
                            style[attr] = newWave.style[attr];
                        }
                    }

                    if (isFillContainer) {
                        shape.radiusY = height / 2;
                    }

                    // changes with animation
                    external_echarts_.graphic.updateProps(waveElement, {
                        shape: shape,
                        x: newWave.x,
                        y: newWave.y
                    }, seriesModel);

                    if (seriesModel.isUniversalTransitionEnabled && seriesModel.isUniversalTransitionEnabled()) {
                        external_echarts_.graphic.updateProps(waveElement, {
                            style: style
                        }, seriesModel);
                    }
                    else {
                        waveElement.useStyle(style);
                    }

                    // instant changes
                    var oldWaveClipPath = waveElement.getClipPath();
                    var newWaveClipPath = newWave.getClipPath();

                    waveElement.setClipPath(newWave.getClipPath());
                    waveElement.shape.inverse = newWave.inverse;

                    if (oldWaveClipPath && newWaveClipPath
                        && self._shape === symbol
                        // TODO use zrender morphing to apply complex symbol animation.
                        && !isPathSymbol(symbol)
                    ) {
                        // Can be animated.
                        external_echarts_.graphic.updateProps(newWaveClipPath, {
                            shape: oldWaveClipPath.shape
                        }, seriesModel, { isFrom: true });
                    }

                    setWaveAnimation(newIdx, waveElement, waveElement);
                    group.add(waveElement);
                    data.setItemGraphicEl(newIdx, waveElement);
                    waves.push(waveElement);
                })
                .remove(function (idx) {
                    var wave = oldData.getItemGraphicEl(idx);
                    group.remove(wave);
                })
                .execute();
        }

        if (dataCount > 0 && itemModel.get('label.show')) {
            group.add(getText(waves));
        }

        this._shape = symbol;
        this._data = data;

        /**
         * Get path for outline, background and clipping
         *
         * @param {number} r outter radius of shape
         * @param {boolean|undefined} isForClipping if the shape is used
         *                                          for clipping
         */
        function getPath(r, isForClipping) {
            if (symbol) {
                // customed symbol path
                if (isPathSymbol(symbol)) {
                    var path = external_echarts_.graphic.makePath(symbol.slice(7), {});
                    var bouding = path.getBoundingRect();
                    var w = bouding.width;
                    var h = bouding.height;
                    if (w > h) {
                        h = r * 2 / w * h;
                        w = r * 2;
                    }
                    else {
                        w = r * 2 / h * w;
                        h = r * 2;
                    }

                    var left = isForClipping ? 0 : cx - w / 2;
                    var top = isForClipping ? 0 : cy - h / 2;
                    path = external_echarts_.graphic.makePath(
                        symbol.slice(7),
                        {},
                        new external_echarts_.graphic.BoundingRect(left, top, w, h)
                    );
                    if (isForClipping) {
                        path.x = -w / 2;
                        path.y = -h / 2;
                    }
                    return path;
                }
                else if (isFillContainer) {
                    // fully fill the container
                    var x = isForClipping ? -r[0] : cx - r[0];
                    var y = isForClipping ? -r[1] : cy - r[1];
                    return external_echarts_.helper.createSymbol(
                        'rect', x, y, r[0] * 2, r[1] * 2
                    );
                }
                else {
                    var x = isForClipping ? -r : cx - r;
                    var y = isForClipping ? -r : cy - r;
                    if (symbol === 'pin') {
                        y += r;
                    }
                    else if (symbol === 'arrow') {
                        y -= r;
                    }
                    return external_echarts_.helper.createSymbol(symbol, x, y, r * 2, r * 2);
                }
            }

            return new external_echarts_.graphic.Circle({
                shape: {
                    cx: isForClipping ? 0 : cx,
                    cy: isForClipping ? 0 : cy,
                    r: r
                }
            });
        }
        /**
         * Create outline
         */
        function getOutline() {
            var outlinePath = getPath(outterRadius);
            outlinePath.style.fill = null;

            outlinePath.setStyle(seriesModel.getModel('outline.itemStyle')
                .getItemStyle());

            return outlinePath;
        }

        /**
         * Create background
         */
        function getBackground() {
            // Seperate stroke and fill, so we can use stroke to cover the alias of clipping.
            var strokePath = getPath(radius);
            strokePath.setStyle(seriesModel.getModel('backgroundStyle')
                .getItemStyle());
            strokePath.style.fill = null;

            // Stroke is front of wave
            strokePath.z2 = 5;

            var fillPath = getPath(radius);
            fillPath.setStyle(seriesModel.getModel('backgroundStyle')
                .getItemStyle());
            fillPath.style.stroke = null;

            var group = new external_echarts_.graphic.Group();
            group.add(strokePath);
            group.add(fillPath);

            return group;
        }

        /**
         * wave shape
         */
        function getWave(idx, isInverse, oldWave) {
            var radiusX = isFillContainer ? radius[0] : radius;
            var radiusY = isFillContainer ? height / 2 : radius;

            var itemModel = data.getItemModel(idx);
            var itemStyleModel = itemModel.getModel('itemStyle');
            var phase = itemModel.get('phase');
            var amplitude = parsePercent(itemModel.get('amplitude'),
                radiusY * 2);
            var waveLength = parsePercent(itemModel.get('waveLength'),
                radiusX * 2);

            var value = clamp01(data.get('value', idx));
            var waterLevel = radiusY - value * radiusY * 2;
            phase = oldWave ? oldWave.shape.phase
                : (phase === 'auto' ? idx * Math.PI / 4 : phase);
            var normalStyle = itemStyleModel.getItemStyle();
            if (!normalStyle.fill) {
                var seriesColor = seriesModel.get('color');
                var id = idx % seriesColor.length;
                normalStyle.fill = seriesColor[id];
            }

            var x = radiusX * 2;
            var wave = new liquidFillShape({
                shape: {
                    waveLength: waveLength,
                    radius: radiusX,
                    radiusY: radiusY,
                    cx: x,
                    cy: 0,
                    waterLevel: waterLevel,
                    amplitude: amplitude,
                    phase: phase,
                    inverse: isInverse
                },
                style: normalStyle,
                x: cx,
                y: cy,
            });
            wave.shape._waterLevel = waterLevel;

            var hoverStyle = itemModel.getModel('emphasis.itemStyle')
                .getItemStyle();
            hoverStyle.lineWidth = 0;

            wave.ensureState('emphasis').style = hoverStyle;
            external_echarts_.helper.enableHoverEmphasis(wave);

            // clip out the part outside the circle
            var clip = getPath(radius, true);
            // set fill for clipPath, otherwise it will not trigger hover event
            clip.setStyle({
                fill: 'white'
            });
            wave.setClipPath(clip);

            return wave;
        }

        function setWaveAnimation(idx, wave, oldWave) {
            var itemModel = data.getItemModel(idx);

            var maxSpeed = itemModel.get('period');
            var direction = itemModel.get('direction');

            var value = data.get('value', idx);

            var phase = itemModel.get('phase');
            phase = oldWave ? oldWave.shape.phase
                : (phase === 'auto' ? idx * Math.PI / 4 : phase);

            var defaultSpeed = function (maxSpeed) {
                var cnt = data.count();
                return cnt === 0 ? maxSpeed : maxSpeed *
                    (0.2 + (cnt - idx) / cnt * 0.8);
            };
            var speed = 0;
            if (maxSpeed === 'auto') {
                speed = defaultSpeed(5000);
            }
            else {
                speed = typeof maxSpeed === 'function'
                    ? maxSpeed(value, idx) : maxSpeed;
            }

            // phase for moving left/right
            var phaseOffset = 0;
            if (direction === 'right' || direction == null) {
                phaseOffset = Math.PI;
            }
            else if (direction === 'left') {
                phaseOffset = -Math.PI;
            }
            else if (direction === 'none') {
                phaseOffset = 0;
            }
            else {
                console.error('Illegal direction value for liquid fill.');
            }

            // wave animation of moving left/right
            if (direction !== 'none' && itemModel.get('waveAnimation')) {
                wave
                    .animate('shape', true)
                    .when(0, {
                        phase: phase
                    })
                    .when(speed / 2, {
                        phase: phaseOffset + phase
                    })
                    .when(speed, {
                        phase: phaseOffset * 2 + phase
                    })
                    .during(function () {
                        if (wavePath) {
                            wavePath.dirty(true);
                        }
                    })
                    .start();
            }
        }

        /**
         * text on wave
         */
        function getText(waves) {
            var labelModel = itemModel.getModel('label');

            function formatLabel() {
                var formatted = seriesModel.getFormattedLabel(0, 'normal');
                var defaultVal = clamp01(data.get('value', 0)) * 100;
                var defaultLabel = data.getName(0) || seriesModel.name;
                if (!isNaN(defaultVal)) {
                    defaultLabel = defaultVal.toFixed(0) + '%';
                }
                return formatted == null ? defaultLabel : formatted;
            }

            var textRectOption = {
                z2: 10,
                shape: {
                    x: left,
                    y: top,
                    width: (isFillContainer ? radius[0] : radius) * 2,
                    height: (isFillContainer ? radius[1] : radius) * 2
                },
                style: {
                    fill: 'transparent'
                },
                textConfig: {
                    position: labelModel.get('position') || 'inside'
                },
                silent: true
            };
            var textOption = {
                style: {
                    text: formatLabel(),
                    textAlign: labelModel.get('align'),
                    textVerticalAlign: labelModel.get('baseline')
                }
            };
            Object.assign(textOption.style, external_echarts_.helper.createTextStyle(labelModel));

            var outsideTextRect = new external_echarts_.graphic.Rect(textRectOption);
            var insideTextRect = new external_echarts_.graphic.Rect(textRectOption);
            insideTextRect.disableLabelAnimation = true;
            outsideTextRect.disableLabelAnimation = true;

            var outsideText = new external_echarts_.graphic.Text(textOption);
            var insideText = new external_echarts_.graphic.Text(textOption);
            outsideTextRect.setTextContent(outsideText);

            insideTextRect.setTextContent(insideText);
            var insColor = labelModel.get('insideColor');
            insideText.style.fill = insColor;

            var group = new external_echarts_.graphic.Group();
            group.add(outsideTextRect);
            group.add(insideTextRect);

            // clip out waves for insideText
            var boundingCircle = getPath(radius, true);

            wavePath = new external_echarts_.graphic.CompoundPath({
                shape: {
                    paths: waves
                },
                x: cx,
                y: cy
            });

            wavePath.setClipPath(boundingCircle);
            insideTextRect.setClipPath(wavePath);

            return group;
        }
    },

    dispose: function () {
        // dispose nothing here
    }
});

;// ./src/liquidFill.js


;// ./index.js


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=echarts-liquidfill.js.map