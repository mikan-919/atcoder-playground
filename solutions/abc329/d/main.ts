import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n, m] = readNumbers()
const a = readNumbers()

const touhyou = Array(n + 1).fill(0)
let winner = 1
let max = 0
for (const e of a) {
  touhyou[e]++
  if (touhyou[e] > max || (touhyou[e] == max && e < winner)) {
    winner = e
    if (touhyou[e] > max) max++
  }
  put(winner)
}
