import '../../../src/extends'
import { readNumbers,readLine } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const S = readLine()
put(S.replace(/[^A]/g,"."))
