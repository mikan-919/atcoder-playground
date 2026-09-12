import '../../../src/extends'
import { readLine, readNumberLines, readNumbers } from '../../../src/stdin'
import { put, putArray, stop } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

let [N, S, L] = readNumbers()
const A=readNumbers()

let moves = 0
let left=Math.max(S-1,-1)
let right = Math.min(S - 1, N)
let count = 0
S--
while (left > 0 || right < N - 1) {
  let leftdiff=Math.abs((A[left]??-Infinity)-A[S])
    let rightdiff = Math.abs((A[right]??Infinity) - A[S])
    put(leftdiff,rightdiff)
    if (moves <= L) {
        if (leftdiff <= rightdiff) {
            S=left
            left--
            moves+=leftdiff
        } else {
            S=right
            right++
            moves+=leftdiff
        }
        count++
    } else break
}
put(count-1)
