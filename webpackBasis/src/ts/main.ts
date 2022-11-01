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
    import("./count").then((res)=>console.log("success",res.reduce(3,1))).catch((err)=>{console.log("reject",err)})
}