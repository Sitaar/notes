//arr = [1,2,3,4]
//目标：arr[-1]//4

const createArr = (...elements)=> {
    const target = [...elements]
    return new Proxy(target,{
        get:function(target,key,receiver){
            let index = Number(key)
            if(key<0){
                key=String(index+target.length) 
            }
            return Reflect.get(target,key,receiver)
        }
    })
}
const arr = createArr(1,2,3,4)
console.log(arr[-1]);//4
arr.push(5)
console.log(arr[-1]);//5