import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n]= readNumbers()
const dominos = readNumbers()
let iti = 0
let i=0
while (i<=iti) {
        iti=Math.min(Math.max(i+dominos[i]-1,iti),n-1)
    i++
}
put(iti+1)
