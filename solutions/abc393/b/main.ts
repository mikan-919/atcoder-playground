import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const S = readLine()
let count=0
for (const i of range(S.length - 2)) {
    for (const j of range(S.length - 1,i + 1 )) {
        const k = j * 2 - i
        if(S[i]==="A" && S[j]==="B" && S[k]==="C") count++
    }
}

put(count)
