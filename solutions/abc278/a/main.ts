import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put, putArray } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [N, K] = readNumbers()
const A = readNumbers()
for (const i of range(K)) {
  A.shift()
  A.push(0)
}

putArray(A)
