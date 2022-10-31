module.exports = {
    // 继承 Eslint 官方默认规则
    extends:["eslint:recommended"],
    env:{
        node:true, //启用node中全局变量
        browser:true //启用浏览器中全局变量
    },
    // 解析选项
    parserOptions:{
        // ES 语法版本
        ecmaVersion:6,
        // ES模块化
        sourceType:"module",
        // ES 其他特性
        ecmaFeatures:{}
    },
    // 具体检查规则，它的优先级高于extends
    rules:{
        // off-0,warn-1,error-2。具体规则细节见官网
        "no-var" : 2, //不能使用var定义变量
    }
}