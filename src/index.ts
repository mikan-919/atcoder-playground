import './extends'

import { readLine, readLines, readNumberLines, readNumbers } from './stdin'
import { put } from './stdout'
import { range } from './utils'

const [N, M] = readNumbers()
const KA = readNumberLines(M).map((ka) => new Set(ka.slice(1)))
const B = readNumbers()
for (const i of range(N)) {
  KA.map((ka) => ka.delete(B[i]))
  put(
    KA.map((ka, i2) => (ka.size === 0 ? i2 : -1)).filter((e) => e !== -1)
      .length,
  )
}
