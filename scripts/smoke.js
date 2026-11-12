'use strict';

const echarts = require('echarts');
require('../dist/echarts-liquidfill.js');

const chart = echarts.init(null, null, {
  renderer: 'svg',
  ssr: true,
  width: 200,
  height: 200
});

try {
  chart.setOption({
    series: [
      {
        type: 'liquidFill',
        data: [-0.5, 1.5]
      }
    ]
  });

  const svg = chart.renderToSVGString();
  const checks = {
    registered: chart.getOption().series[0].type === 'liquidFill',
    svg: svg.includes('<svg'),
    waves: (svg.match(/<path/g) || []).length >= 3,
    clamp: svg.includes('0%') && svg.includes('100%')
  };

  const failed = Object.keys(checks).filter(function (key) {
    return !checks[key];
  });

  if (failed.length) {
    console.error('FAIL ' + failed.join(', '));
    process.exitCode = 1;
  } else {
    console.log('PASS ' + JSON.stringify(checks));
  }
} finally {
  chart.dispose();
}
