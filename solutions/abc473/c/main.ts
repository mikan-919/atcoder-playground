import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { no, put, yes } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n, k] = readNumbers()
const A = readNumbers()
const map = A.countOccurrences()
let max= 0
map.forEach(e=>max=Math.max(max,e))
put(map.values().filter(e=>e===max||e===max-1).toArray().length)
