import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [N] = readNumbers()
const A= readNumbers()
put(A.countOccurrences().entries().filter(e=>e[1]%2===1).map(e=>e[0]).toArray().sum())
