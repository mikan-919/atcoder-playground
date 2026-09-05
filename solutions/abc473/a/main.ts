import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [N] = readNumbers()
const A= readNumbers()
put(A.slice(N/2).sum())
