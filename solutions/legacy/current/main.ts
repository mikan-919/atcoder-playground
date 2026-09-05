import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { no, put, putArray, yes } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

let [N,K]= readNumbers()
const A = readNumbers()

let S = []
let score=0
let state=0
for (const a of A) {
    S.push(a)
    let count=0
    for (const i of range(S.length)) {
      count+=(S[S.length-i-1])
      if (count % K === 0) {
          score++
          S = []
          break
    }
    }
}
put(score)
