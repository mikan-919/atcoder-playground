import '../../../src/extends'
import { readLine, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const S = readLine().toArray()
const stack = []
for (const char of S) {
  stack.push(char)
  if (stack.at(-3) === 'A' && stack.at(-2) === 'B' && stack.at(-1) === 'C') {
    stack.pop()
    stack.pop()
    stack.pop()
  }
}
put(stack.join(''))
