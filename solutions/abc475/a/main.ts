import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const S = readLine()
put(S.toArray().zip(Array(S.length).fill("o")).flat().slice(0,S.length-1).join(""))
