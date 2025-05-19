import './extends'

import { readBigInts, readLine, readLines, readMatrix, readNumberLines, readNumbers } from './stdin'
import { no, put, stop, yes } from './stdout'
import { edgeListToAdjacencyList } from './utils/graph'
import { range } from './utils/utils'

const [N, K] = readNumbers()
const A = readBigInts()
let counter = 1n

for (const ai of A) {
  counter *= ai
  if (counter.toString().length >= K + 1) counter = 1n
}
put(counter.toString())
