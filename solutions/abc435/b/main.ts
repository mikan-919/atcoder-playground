import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put, putArray } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'
const n=readNumbers()[0]
const A = readNumbers()
let counter = 0
for (const l of range(n - 1)) {
    for (const r of range(n+1, l + 1)) {
      let slice=A.slice(l,r)
      let sum = slice.sum()
      if(slice.every(e=>sum%e!==0))counter++
  }
}
put(counter)
