import '../../../src/extends'
import { readLine, readNumberLines, readNumbers } from '../../../src/stdin'
import { put, stop } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n,q] = readNumbers()
const p = readNumbers()
const a = readNumberLines(q).map(e=>e[0])
const hasMap = p.toSet() //n

const lastArray = []
const useMap = new Map()
const useSet = new Set()
for (const [ai,i] of a.zip(range(q))) {
    if (hasMap.has(ai)) {
        lastArray.push(ai)
        useSet.add(ai)
        useMap.set(ai,i)
    }
}
put(`${p.filter(e => !useSet.has(e)).join(" ")} ${useMap.entries().toArray().sort((a,b)=>a[1]-b[1]).map(e=>e[0]).join(" ")}`)
