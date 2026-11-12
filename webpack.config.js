const path = require('path');

const entry = __dirname + '/index.js';

function umdConfig(mode) {
    return {
        mode: mode,
        entry: {
            'echarts-liquidfill': entry
        },
        output: {
            libraryTarget: 'umd',
            library: ['echarts-liquidfill'],
            // Use `this` instead of `self`, so that the UMD bundle can also be
            // loaded in Node.js (SSR) where `self` is not defined.
            globalObject: 'this',
            path: __dirname + '/dist',
            filename: mode === 'production' ? '[name].min.js' : '[name].js'
        },
        optimization: {
            concatenateModules: true
        },
        // Only `echarts/core` is used, so that renderers / dataset / labelLayout
        // are not pulled into the bundles of the consumers.
        externals: {
            'echarts/core': 'echarts'
        },
        devtool: 'source-map'
    };
}

// ESM bundle for Node.js ESM (`import 'echarts-liquidfill'`), so that it shares
// the same echarts module instance as the application and can be tree-shaken.
const esmConfig = {
    mode: 'production',
    entry: {
        'echarts-liquidfill.esm': entry
    },
    experiments: {
        outputModule: true
    },
    output: {
        library: {
            type: 'module'
        },
        module: true,
        path: __dirname + '/dist',
        filename: '[name].mjs'
    },
    externalsType: 'module',
    externals: {
        'echarts/core': 'echarts/core'
    },
    optimization: {
        concatenateModules: true
    },
    devtool: 'source-map'
};

module.exports = (env, options) => {
    if (options.mode === 'production') {
        return [umdConfig('production'), esmConfig];
    }
    return umdConfig('development');
};
