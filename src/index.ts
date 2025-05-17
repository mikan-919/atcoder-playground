import './extends'

import { readLine, readLines, readMatrix, readNumberLines, readNumbers } from './stdin'
import { no, put, stop, yes } from './stdout'
import { edgeListToAdjacencyList } from './utils/graph'
import { range } from './utils/utils'

const [N] = readNumbers()
const P = readNumbers()

const j4 = P.map((e, i) => (i === 0 ? false : P[i - 1] < e && e > P[i + 1])) // O(n)
const j5 = P.map((e, i) => (i === 0 ? false : P[i - 1] > e && e < P[i + 1])) // O(n)
let j4imosc = 0
let j5imosc = 0
const j4imos = j4.map((num) => (j4imosc += num)) // O(n)
const j5imos = j4.map((num) => (j5imosc += num)) // O(n)

let counter = 0
// O(n*k)
for (const i of range(N - 4)) {
  if (!(P[i] < P[i + 1])) continue
  let scope = 4
  while (j4imos[i + scope] - j4imos[i] === 1 && j5imos[i + scope] - j5imos[i] === 1 && i + scope < P.length) {
    counter++
    scope++
  }
}
put(counter)
