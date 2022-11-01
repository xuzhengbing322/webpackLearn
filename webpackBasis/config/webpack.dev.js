const path = require('path')
const os = require("os")

// 打包html文件，并将打包输出的built.js自动添加到新html中
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint处理js代码格式，提高代码的健壮性
const ESLintPlugin = require('eslint-webpack-plugin');
// 清空上一次打包结果
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const threads = os.cpus().length //cup核数
const TerserWebpackPlugin = require("terser-webpack-plugin")

module.exports = {
    entry: {
        // 多个文件入口打包
        main:'./src/ts/main.ts',
        app:'./src/ts/app.ts'
    },
    output: {
        filename: 'state/js/[name].js',
        // 开发模式没有输出，热更新
        path: undefined
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            // 每个文件只能被其中一个loader配置处理
            oneOf: [
                // 处理ts文件
                {
                    test: /\.ts$/,
                    // 只处理src中的ts文件
                    include: path.resolve(__dirname, '../src'),
                    use: [
                        // babel处理js和ts文件的兼容性，将es6->es5
                        'babel-loader',
                        'ts-loader'
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    use: [
                        // 开启多进程，处理babel
                        {          
                            loader:'thread-loader',
                            options:{
                                works:threads  //进程数量
                            }
                        },
                        {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, //开启babel缓存
                            cacheCompression: false, //关闭缓存的压缩
                            plugins:['@babel/plugin-transform-runtime'], //减少代码体积
                        }

                    }]
                },
                // 处理less文件
                {
                    test: /\.less$/,
                    use: [
                        // 创建style标签，将js中的样式资源插入进行，添加到head中生效
                        'style-loader',
                        // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                        'css-loader',
                        // 将less文件编译成css文件
                        'less-loader'
                    ]
                },
                //处理css中的图片，无法处理html中的图片
                {
                    test: /\.(jpe?g|png|gif)$/,
                    type: "asset",
                    /*优化图片。base64:将图片转化为字符串，然后将字符串当作src地址，浏览器就会将字符串识别成图片。
                    优势：图片变成字符串不需要额外发请求，减少请求次数。缺点：体积会变大，导致页面加载缓慢.
                    小于10kb的图片转化成base64字符串，可以在built.js中查看
                    */
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024
                        }
                    },
                    generator: {
                        // 输出图片名字，并放在images文件夹中。
                        filename: 'state/images/[name]_[hash:4][ext]'
                    },
                },
                // 处理html文件的img图片
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                // 处理其他文件
                {
                    test: /\.(ttf|woff2?|map3)$/,
                    // 按原文件输出
                    type: "asset/resource",
                    generator: {
                        filename: "static/media/[hash:4][ext][query]"
                    }
                }
            ]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            // 模版：以./src/index.html文件创建新的html文件。新文件和旧文件的DOM结构一致，并且会自动引入打包输出的资源。
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new ESLintPlugin({
            // 指定被检查的文件
            context: path.resolve(__dirname, '../src'),
            cache: true, //开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintCache'), //缓存存放的地址
            threads,  //开启多进程处理eslint
        }),
        new CleanWebpackPlugin(),

    ],
    // 压缩的插件统一放这里。
    optimization:{
        minimizer:[
            //压缩js
            new TerserWebpackPlugin({
                parallel: threads   //开启多进程和设置进程数量
            }) 
        ]
    },

    // 开发服务器，实现src热更新
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", //启动服务器端口号
        open: true, //是否自动打开浏览器
        hot: true //开启HMR.(默认开启)
    },
    // 开发模式：写代码时处理文件
    mode: 'development',
    devtool: "cheap-module-source-map"
}

// 将webpack.dev.js放入config后，该文件依旧是在整个项目的环境下运行，只是绝对路径需要回退一层，相对路径不用修改