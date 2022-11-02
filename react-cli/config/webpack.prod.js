const path = require('path');
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MimiCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");


//返回处理样式loader函数
const getStyleLoaders = (pre) => {
    return [
        MimiCssExtractPlugin.loader,
        "css-loader",
        {
            //处理css兼容性。需要配合package.json中browserslist来指定兼容性做到什么程度
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
                }
            }
        },
        pre,
        //过滤undefiend值，有可能pre参数没有值
    ].filter(Boolean)
}

module.exports = {
    entry: "./src/main.js",

    output: {
        //开发模式下没有输出路径,在内存中输出，devserver不会实际输出。
        path: path.resolve(__dirname,"../dist"),
        //入口文件打包输出的文件名
        filename: "static/js/[name].[contenthash:10].js",
        //打包生成的chunk，如import导入语法，
        chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
        //图片资源命名
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean:true,
    },

    module: {
        rules: [
            //处理css
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader'),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader'),
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader'),
            },

            //处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)/,
                type: "asset",
                //优化图片，将小于10kb的图片转化为base64模式，减少请求数量
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
            },

            //处理其他资源
            {
                test: /\.(woff2?|ttf)/,
                type: "asset/resource",
            },

            //处理js
            {
                test: /\.jsx?$/,
                //指定处理的文件范围
                include: path.resolve(__dirname, '../src'),
                loader: "babel-loader",
                options: {
                    //设置缓存
                    cacheDirectory: true,
                    //不压缩
                    cacheCompression: false,
                }
            }


        ],
    },

    //处理html
    plugins: [
        new EslintWebpackPlugin({
            //指定处理文件范围
            context: path.resolve(__dirname, '../src'),
            exclude: "node_modules",
            //设置缓存
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),

        new MimiCssExtractPlugin({
            filename:'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
        })
    ],

    mode: 'production',
    //让调试更友好，提示错误原因和源代码地址
    devtool: 'source-map',
    //将打包内容分在多个chunk，进行代码分割。主要分割import动态导入的语法。
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`,
        },
        minimizer:[new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()],
    },

    //webpack解析模块加载选项
    resolve: {
        //自动补全文件扩展名。依次用下面的后缀，看文件能不能加载。
        extensions: [".jsx", ".js", ".json"],
    },

    
}