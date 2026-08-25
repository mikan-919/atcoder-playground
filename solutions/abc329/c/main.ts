import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [_N] = readNumbers()
const S = readLine()

// 文字 c の連続が長さ L なら c, cc, ..., c*L の L 種類が作れる。
// 重複は種類として数えないので、答えは「文字ごとの最長の連続」の合計。
const best = new Map<string, number>()
for (const [char, count] of S.toRunLength()) {
  best.set(char, Math.max(best.get(char) ?? 0, count))
}

put([...best.values()].sum())
