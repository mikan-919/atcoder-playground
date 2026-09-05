import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { no, put, putArray, yes } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

let [N,K]= readNumbers()
const A = readNumbers()

let score=0
let sum = 0
let set= new Set([0])
for (const a of A) {
    sum = (sum + a) % K
    if (set.has(sum)) {
        score++
        sum = 0
        set=new Set([0])
    } else {
        set.add(sum)
    }
}
put(score)
