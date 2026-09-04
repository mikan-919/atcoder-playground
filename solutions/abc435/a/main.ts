import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const numbers = readNumbers()
put(numbers[0]*(numbers[0]+1)/2)
