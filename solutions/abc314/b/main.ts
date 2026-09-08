import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n] = readNumbers()

const arr = new Map<number,Map<number,number>>()
for (const i of range(n)) {
    const _ = readNumbers()
    const A = readNumbers().countOccurrences()
    arr.set(i+1, A)
}
const [x] = readNumbers()
const find=arr.entries().filter(e=>e[1].has(x)).toArray().toSorted((a,b)=>a[1].size!-b[1].size!)
const lower=find?.[0]?.[1]?.size
put(find.filter(e => e[1].size == lower).length)
put(find.filter(e=>e[1].size==lower).map(e=>e[0]).join(" "))
