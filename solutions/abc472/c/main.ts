import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { no, put, yes } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n, m, k] = readNumbers()
const A= readNumbers()

const cost = Array(n).fill(0)

for (const i of range(n)) {
}
// put(cost)
for (const i of range(n)) {
  const imamade =  cost[i - 1]?? 0
    if (imamade + cost[i]+A[i] <= k) {
      yes()
      cost[i] += A[i]
    cost[i + m] -= A[i]
    } else no()
    cost[i]+=cost[i-1]??0
}
