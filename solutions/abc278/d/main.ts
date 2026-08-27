import '../../../src/extends'
import { readNumberLines, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [n] = readNumbers()
const a = readNumbers()
const [q] = readNumbers()
const queries = readNumberLines(q)
let base = -1
let map = new Map<number, number>()
for (const [t, arg0, arg1] of queries) {
  if (t === 1) {
    base = arg0
    map = new Map<number, number>()
  } else if (t === 2) {
    const value = map.get(arg0)
    if (value !== undefined) map.set(arg0, value + arg1)
    else map.set(arg0, arg1)
  } else {
    if (base !== -1) put((map.get(arg0) ?? 0) + base)
    else put((map.get(arg0) ?? 0) + a[arg0 - 1])
  }
}
