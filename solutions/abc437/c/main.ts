import '../../../src/extends'
import { readNumberLines, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [t] = readNumbers()
for (const i of range(t)) {
    const [n] = readNumbers()
    const WP = readNumberLines(n)
    const cost = WP.map(e => e.sum()).sortNumbers(true)
    let power = WP.map(e=>e[1]).sum()
    let count=0
    while (power - (cost.at(-1) ?? 0) >= 0 && WP.length !== 0) {
      const poped= cost.pop()?? 0
        power -= poped
        count++
    }
    put(count)
}
