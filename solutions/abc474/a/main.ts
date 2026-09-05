import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [x] = readNumbers()

if (x == 1) {
    put(2)
} else put(1)
