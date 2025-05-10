import './extends'

import { readLine, readLines, readMatrix, readNumberLines, readNumbers } from './stdin'
import { no, put, stop, yes } from './stdout'
import { edgeListToAdjacencyList } from './utils/graph'
import { range } from './utils/utils'

const [N] = readNumbers()
const A = readNumbers().map(BigInt)

A.reverse()

let cumulativeSum = 0n
const C = A.map((num) => (cumulativeSum += num)).reverse()

A.reverse()

let sum = 0n
for (const i of range(N)) {
  sum += (A[i - 1] ?? 0n) * C[i]
}

put(sum.toString())
