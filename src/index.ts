import './extends'

import { readLine, readLines, readNumberLines, readNumbers } from './stdin'
import { put } from './stdout'
import { range } from './utils'

const [N, M] = readNumbers()
const AB = readNumberLines(M)
const sumed = AB.map((ab) => ab.sum() % N)
const lines = new Map<number, number>()

for (const num of sumed) {
  const currentCount = lines.get(num) ?? 0
  lines.set(num, currentCount + 1)
}
const defaultSum = Array.from(lines.values()).sum()
let summer = 0
for (const i of lines) {
  summer += i[1] * (defaultSum - i[1])
}
put(summer / 2)
