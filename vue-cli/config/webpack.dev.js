const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin")
const {
    VueLoaderPlugin
} = require('vue-loader')
const {DefinePlugin} = require("webpack")


module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/images/[name]_[hash:4][ext][query]',
        path: undefined
    },
    module: {
        rules: [
            //处理js
            {
                test: /\.js$/,
                //指定处理的文件范围
                include: path.resolve(__dirname, '../src'),
                loader: "babel-loader",
                options: {
                    //设置缓存
                    cacheDirectory: true,
                    //不压缩
                    cacheCompression: false,
                    //激活js的HMP
                }
            },
            //处理vue组件
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 处理ts文件
            {
                test: /\.ts$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            },
            // 处理less文件
            {
                test: /\.less$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env',
                                ],
                            },
                        },
                    },
                    'less-loader',
                ],
            },
            // 处理css中的图片
            {
                test: /\.(jpe?g|png|gif)$/,
                type: "asset",
                // perser: {
                //     dataUrlCondition: {
                //         maxSize: 10 * 1024
                //     },
                // },
            },
            // 处理html中的图片资源
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src')
        }),
        // new MiniCssExtractPlugin({
        //     filename: 'static/css/[name].css',
        //     chunkFilename: 'static/css/[name].chunk.css'
        // }),
        new CssMinimizerPlugin(),
        new PreloadWebpackPlugin({
            rel: "prefetch"
        }),
        new VueLoaderPlugin(),
        // cross-env定义的环境变量给打包工具使用。DefinePlugin定义环境变量给源代码使用，从而解决vue3页面报错的问题。
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false
        })
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        }
    },
    mode: 'development',
    devServer: {
        host: 'localhost',
        port: '3003',
        open: true,
        hot: true,
        historyApiFallback: true,
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.vue', 'json', '.js']
    },
}