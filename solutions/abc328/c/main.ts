import '../../../src/extends'
import { readLine, readNumberLines, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [N, Q] = readNumbers()
const S = readLine()
  .toArray()
  .map((e) => e.charCodeAt(0))
  .toDifferences((current, next) => next - current)
  .map((e) => Number(e === 0))
for (const i of range(N - 2)) {
  S[i + 1] += S[i]
}
const lr = readNumberLines(Q)
for (const [l, r] of lr) {
  if (l == r) put(0)
  else put((S[r - 2] ?? 0) - (S[l - 2] ?? 0))
}
