module.exports = {
    root:true,
    // 启用node的环境变量
    env:{
        node:true,
        "es6": true
    },
    // 继承vue3的官方规则和eslint的官方规则
    extends:['plugin:vue/vue3-essential',"eslint:recommended"],
    // 解析选项是babel
    parserOptions:{
        parser:"@babel/eslint-parser"
    }
}