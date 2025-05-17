import './extends'

import { readLine, readLines, readMatrix, readNumberLines, readNumbers } from './stdin'
import { no, put, stop, yes } from './stdout'
import { edgeListToAdjacencyList } from './utils/graph'
import { range } from './utils/utils'

const [N, K] = readNumbers()
const A = readNumbers()
let counter = 1
for (const ai of A) {
  counter *= ai
  if (counter.toString().length>=K+1) counter = 1
}
put(counter)
