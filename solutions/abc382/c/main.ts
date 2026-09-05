import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put, putArray } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n, m] = readNumbers()
const An= readNumbers().zip(range(n)).sort((a,b)=>a[0]-b[0])
const Bm= readNumbers().zip(range(m)).sort((a,b)=>a[0]-b[0])
const Ans = Array(m)

let j= 0
let min=Infinity
for (const [b,i] of Bm) {
    while ( j < n&&An[j][0] <= b) {
      min = Math.min(min, An[j][1])
      j++
    }
    Ans[i] = min === Infinity ? -2 : min
}

put(Ans.map(e=>e+1).join('\n'))
