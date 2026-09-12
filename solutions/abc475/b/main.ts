import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [n] = readNumbers()
const A = readNumbers()
let count1=0
let count10=0
let count100=0
for (const a of A) {
    const b = a % 1000
    count1+=(10-b%10)%10
    count10+=Math.floor(((100-b%100)%100/10))
    count100+=Math.floor(((1000-b%1000)%1000/100))
}
put(count1,count10,count100)
