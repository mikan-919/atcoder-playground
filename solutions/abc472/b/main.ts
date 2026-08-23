import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [N] = readNumbers()
const L = readNumbers()
const len=L.sum()
put(L.map((e,i)=>Math.abs(len/2-(L.slice(i).sum()))).min()*2)
