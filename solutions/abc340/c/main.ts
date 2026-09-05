import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'
import { memorize } from '../../../src/utils/utils'

const n = BigInt(readLine())

const count=memorize(
    function (x: bigint) {
        if(x<2)return 0n
        let cost = x
        const lower = x / 2n
        const upper = x - lower
        cost += count(lower)
        cost += count(upper)
        return cost
  }
)

put(count(n).toString())
