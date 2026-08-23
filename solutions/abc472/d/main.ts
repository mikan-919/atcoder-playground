import '../../../src/extends'
import { readLines, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [h, w, k] = readNumbers()
const GRID = readLines(h)
const tateIndex=Array(w).fill(0).map((_,i)=>GRID.map(f=>f[i]==="#"?1:0).sum()>0)
const yokoIndex = GRID.map(e => e.toArray().map(e => e === "#" ? 1 : 0).sum() > 0)

const moves = [[0, 1], [1, 0], [0, -1], [-1, 0]]
const checkborder= (x,y)=>x>=0&&x<w&&y>=0&&y<h
