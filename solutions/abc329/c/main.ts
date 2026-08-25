import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [N] = readNumbers()
const S = readLine()

// 同じ文字 c の連続 run が長さ L なら、c を 1..L 個並べた文字列が作れる。
// 文字列としての重複は排除されるので、答えは「文字ごとの最長 run」の合計。
const best = new Map<string, number>()
let run = 0
for (let i = 0; i < N; i++) {
  run = i > 0 && S[i] === S[i - 1] ? run + 1 : 1
  best.set(S[i], Math.max(best.get(S[i]) ?? 0, run))
}

put([...best.values()].reduce((a, b) => a + b, 0))
