import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { range } from '../../../src/utils/utils'

const [N] = readNumbers()
const Dn = readNumbers()

let zorome = 0
for (const i of range(N)) {
  if (
    !(i + 1)
      .toString()
      .toArray()
      .every((e) => e === (i + 1).toString()[0])
  )
    continue
  const Di = Dn[i]
  for (const j of range(Di + 1, 0))
    if (
      j
        .toString()
        .toArray()
        .every((e) => e == (i + 1).toString()[0])
    )
      zorome++
}
put(zorome)
