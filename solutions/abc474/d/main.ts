import '../../../src/extends'
import { readLine, readNumberLines, readNumbers } from '../../../src/stdin'
import { put, putArray, stop } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [n] = readNumbers()
const an= readNumbers()
const bn= readNumbers()
const sorted=an.zip(bn.zip(range(n))).map(e=>e.flat()).sort((a,b)=>(a[0]-a[1])-(b[0]-b[1]))
const arr=Array(n).fill(1)
if (sorted.filter(a => a[0] > a[1]).length > 0) {
    put("Yes")
    const sum = range(n).map(i=>arr[i]*bn[i]-arr[i]*an[i]).sum()
    const top = sorted.findLast(a => a[0] > a[1])!
    arr[top[2]]+=Math.ceil(Math.max(0,sum / (top[0]-top[1])+1))
    putArray(arr)
}
else put("No")
