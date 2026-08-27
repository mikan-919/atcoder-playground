import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

let [H, M] = readNumbers()

const check = (h: number, m: number) => {
  const nh = h.toString().padStart(2, '0')[0] + m.toString().padStart(2, '0')[0]
  const nm = h.toString().padStart(2, '0')[1] + m.toString().padStart(2, '0')[1]
  return Number(nh) < 24 && Number(nm) < 60
}

while (!check(H, M)) {
  if (M === 59) {
    M = 0
    if (H === 23) H = 0
    else H++
  } else M++
}
put(H, M)
