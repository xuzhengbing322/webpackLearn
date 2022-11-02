module.exports = {
    // 预设就是一组babel插件，扩充babel功能。能后编译es6语法，以及ts语法。
    presets: [
        // 指定环境的插件
        ["@babel/preset-env", {
            useBuiltIns: 'usage', //实现core-js的自动按需加载
            corejs: 3
        }],
        "@babel/preset-typescript",
    ],
    // cacheDirectory:true,  //开启babel缓存
    // // 要兼容的目标浏览器即版本
    // targets: {
    //     "chrome": "58",
    //     "ie": "11"
    // },
    // // 指定corejs版本
    // "corejs": "3",
    // //使用corejs的方式 "usage"  表示按需加载
    // "useBuiltIns": "usage"
}