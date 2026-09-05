import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { no, put, putArray, yes } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

let [N,K]= readNumbers()
function fn(array:Array<number>,sum:number) {
    array.push(0)
    if (array.length === N) {
      array[array.length-1]=Math.floor((K-sum)/array.length)
        if (sum + (array.at(-1) ?? 0) * array.length === K) {
            putArray(array)
        }
        return
    }
    for (let i = 0; i < (K - sum) / array.length+1;i++) {
      fn(array, sum + (array.at(-1) ?? 0) * array.length)
      array.pop()
      array[array.length-1]=(array.at(-1)??0)+1
  }
}
fn([],0)
