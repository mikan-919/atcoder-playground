import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const S = readLine()
put(S.replace(/[^A]/g, '.'))
