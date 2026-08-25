import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const N = readNumbers()[0]
const A= readNumbers()

put(A.unique().sortNumbers().at(-2))
