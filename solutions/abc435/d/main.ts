import '../../../src/extends'
import { readNumberLines, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [n,m] = readNumbers()

const xy = readNumberLines(m)
const [q] = readNumbers()
const queries = readNumberLines(q)

const map = new Map()
for (const [x, y] of xy) {
(map.get(y-1)??(map.set(y-1,[x-1])&&[])
  ).push(x-1)
}

const colors=Array(n).fill(false)
function check(v: number,gone:number[]) {
    const stack = [v]
      while (stack.length > 0) {
        const current = stack.pop()!
        if (colors[current]) continue
        colors[current] = true

        for (const previous of map.get(current) ?? []) {
          if (!colors[previous]) stack.push(previous)
        }
      }
}

for (const query of queries) {
    if (query[0] === 1) {
        check(query[1]-1,[])
    } else {
        put(colors[query[1]-1] ? 'Yes' : 'No')
    }
}
