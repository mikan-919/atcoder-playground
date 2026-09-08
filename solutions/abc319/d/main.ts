import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [n,m]=readNumbers()
const numbers = readNumbers()
function length(W){
let c = 0
let count=1
for (const n of numbers) {
  if(c==0) c=n
  else if (c + 1 + n > W) {
        count++
        c=n
    }else c+=1+n
}
return count<=m
}

let low=Math.max(...numbers)
let high = numbers.sum()+numbers.length
while (low < high) {
    if (length(Math.floor((low + high) / 2))) high = Math.floor((low + high) / 2)
    else low=Math.floor((low + high) / 2)+1
}
put(low)
