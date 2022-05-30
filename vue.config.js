'use strict';
const path = require('path');
const envCfg = require(`./config/${process.env.VUE_APP_CFG_FILE}`);

function resolve(dir) {
    return path.join(__dirname, dir);
}

// 端口号
const port = process.env.port || process.env.npm_config_port || 9527;

// 参考地址：https://cli.vuejs.org/config/
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    chainWebpack(config) {
        config
            .plugin('define')
            .tap(args => {
                args[0]['process.env'] = JSON.stringify(envCfg);
                return args;
            });

        // set svg-sprite-loader

        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        config.plugin('html').tap(args => {
            args[0].static = process.env.CDN_URL;
            return args;
        });

        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true;
                return options;
            })
            .end();

        config
            .when(process.env.NODE_ENV === 'development',
                config => config.devtool('cheap-source-map')
            );

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            inline: /runtime\..*\.js$/
                        }])
                        .end();
                    config
                        .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial' // 第三方依赖包
                            },
                            elementUI: {
                                name: 'chunk-elementUI', // elementUI单独打包
                                priority: 20,
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                            },
                            commons: {
                                name: 'chunk-commons',
                                test: resolve('src/components'), // 业务组件打包
                                minChunks: 3,
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    });
                    config.optimization.runtimeChunk('single');
                }
            );
        config.plugins.delete(`preload`);
        config.plugins.delete(`prefetch`);
        // Object.keys(pages).forEach(page => {
        //     config.plugins.delete(`preload-${page}`);
        //     config.plugins.delete(`prefetch-${page}`);
        // });
    },
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/styles/variables.scss";@import "@/assets/styles/mixin.scss";`
            }
        }
    }
};
