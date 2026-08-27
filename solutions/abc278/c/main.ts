import '../../../src/extends'
import { readNumberLines, readNumbers } from '../../../src/stdin'
import { no, put, yes } from '../../../src/stdout'

const [n, q] = readNumbers()
const tabs = readNumberLines(q)

const follow = new Map<number, Set<number>>()
for (const [t, a, b] of tabs) {
  if (t === 1) {
    const ally = follow.get(a) ?? new Set()
    ally.add(b)
    follow.set(a, ally)
  } else if (t === 2) {
    const ally = follow.get(a) ?? new Set()
    ally.delete(b)
    follow.set(a, ally)
  } else {
    if (follow.get(a)?.has(b) && follow.get(b)?.has(a)) yes()
    else no()
  }
}
