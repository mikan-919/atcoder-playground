import '../../../src/extends'
import { readLine, readNumberLines, readNumbers } from '../../../src/stdin'
import { put, putArray, stop } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [t] = readNumbers()

for (const i of range(t)) {
  const [n] = readNumbers()
  const ab = readNumberLines(n)
  const costSort =
      ab.toSorted((a, b) => a[0] - b[0])
  const diffSort =
      ab.toSorted((a, b) => (a[0] - a[1]) - (b[0] - b[1]))

}
