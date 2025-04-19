import './extends'

import { readLine, readLines, readNumberLines, readNumbers } from './stdin'
import { put } from './stdout'
import { range } from './utils'

const [N, M] = readNumbers()
const KA = readNumberLines(M).map((ka) => new Set(ka.slice(1)))
const B = readNumbers()
const remaining = KA.map((ka) => ka.size)
const indices = new Map<number, number[]>()
for (const kaset of KA.entries()) {
  for (const elm of kaset[1]) {
    if (!indices.has(elm)) indices.set(elm, [])
    indices.get(elm)!.push(kaset[0])
  }
}
let emptySetCount = 0

for (let i = 0; i < N; i++) {
  const b = B[i]

  const affectedSetIndices = indices.get(b) ?? []

  for (const j of affectedSetIndices) {
    if (remaining[j] > 0) {
      remaining[j]--

      if (remaining[j] === 0) {
        emptySetCount++
      }
    }
  }
  put(emptySetCount)
}
