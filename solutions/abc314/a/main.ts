import '../../../src/extends'
import { readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [n] = readNumbers()
put("3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679".slice(0,n+2))
