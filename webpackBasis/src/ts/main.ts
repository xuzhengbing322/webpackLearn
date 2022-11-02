// // 完整引入
// import 'core-js'
// // 按需加载
// import 'core-js/es/promise'
import '../less/index.less'
import {sum} from './math'
import {reduce} from './count'
let result:string = 'tes'
console.log(result)

console.log(1)
console.log(8)
let sumResulTwo:number = sum(2,3)
console.log("sumResulTwo",sumResulTwo)


// 按需加载
document.getElementById("btn")!.onclick = function(){
    // webpack命名规则
    import( /*webpackChunkName:"count"*/  "./count").then((res)=>console.log("success",res.reduce(3,1))).catch((err)=>{console.log("reject",err)})
}