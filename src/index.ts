import './extends'

import { readLine, readLines, readMatrix, readNumberLines, readNumbers } from './stdin'
import { no, put, putArray, yes } from './stdout'
import { range } from './utils/utils'

const Q = readNumbers()
const queries = readNumberLines(Q[0])
const A: [number, number][] = []
for (const query of queries) {
  const [type, c, x] = query
  if (type === 1) {
    A.push([x, c])
  } else {
    let k = 0
    let i = 0
    let ans = 0
    while (k !== c) {
      put(k)
      if (A[i][1] === 0) {
        i++

        continue
      }
      if (A[i][1] >= c - k) {
        k += A[i][1]
        ans += A[i][1] * A[i][0]
        A[i][1] = 0
      } else {
        A[i][1] -= c - k
        ans += A[i][0] * (c - k)
        k = c
      }
      i++
    }
  }
}
