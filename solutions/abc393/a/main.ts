import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [S1,S2]= readLine().terms().map(e=>e==="fine")
if(S1&&S2)put(4)
else if (S1 && !S2) put(3)
else if (!S1 && S2) put(2)
  else put(1)
