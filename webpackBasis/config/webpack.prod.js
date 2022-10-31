const path = require('path')

// 打包html文件，并将打包输出的built.js自动添加到新html中
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint处理js代码格式，提高代码的健壮性
const ESLintPlugin = require('eslint-webpack-plugin');
// 清空上一次打包结果
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
//将CSS提取到单独的文件中，为每个包含CSS的JS文件创建一个CSS文件。通过link标签来引入样式，避免网慢造成的闪屏现象。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 优化和压缩css文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'state/js/main.js',
        // 生产模式下有输出
        path: path.resolve(__dirname, '../dist'),
        // 在打包前，将path整个目录内容清空，再进行打包
        clean: true,
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
                    use: [
                        // babel处理js和ts文件的兼容性，将es6->es5
                        'babel-loader',
                        'ts-loader'
                    ],
                    exclude: /node_modules/
                },
                // 处理less文件
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                        'css-loader',
                        // 设置css的兼容性
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
            context: path.resolve(__dirname, '../src')
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'state/css/main.css'
        }),
        new CssMinimizerPlugin()
    ],
    // 生产模式：代码上线，优化代码运行性能和打包速度
    mode: 'production',
    devtool: "source-map"
}