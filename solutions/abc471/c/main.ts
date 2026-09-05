import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'
import {} from "data-structure-typed"
const [n] = readNumbers()
let a = readNumbers()

a.push(0)
a=a.sortNumbers()
let left  = a.findLastIndex(e=>e<0)!==-1?a.findLastIndex(e=>e<0):-1
let right = a.findIndex(e=>e>0)!==-1?a.findIndex(e=>e>0):a.length
let x = 0
let movements=0
for (const i of range(n)) {
  let leftDis = x - a[left]
  let rightDis= a[right] -x
    if (left === -1) {
        move(a[right])
        right++
    }
  else if (right === a.length) {
      move(a[left])
      left--
  }
    else if (leftDis <= rightDis) {
        move(a[left])
        left--
    }
    else {
        move(a[right])
     right++}
}
function move(nx:number) {
    movements += Math.abs(x - nx)
    x=nx
}

put (movements)
