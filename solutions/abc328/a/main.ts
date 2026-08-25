import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [N, X] = readNumbers()
const Sn = readNumbers()

put(Sn.filter((e) => e <= X).sum())
