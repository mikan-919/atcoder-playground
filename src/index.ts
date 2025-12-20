import './extends'
import { Deque, Matrix } from 'data-structure-typed'
import { readLines, readNumberLines, readNumbers } from './stdin'
import { put, stop } from './stdout'
import { range } from './utils/utils'
const INF = Number.POSITIVE_INFINITY

const [T] = readNumbers()
const cases = []
for (const i of range(T)) {
  const [N] = readNumbers()
  cases.push(readNumberLines(N) as [number, number][])
}

for (const ca of cases) {
  put(Math.max(min(ca), max(ca)))
}
function min(ca: [number, number][]) {
  const costs = ca.toSorted((a, b) => a[1] - b[1])
  let weight = ca.map((t) => t[0]).sum()
  let count = 0
  let power = 0
  for (const i of range(costs.length)) {
    count++
    const tonakai = costs.pop()!
    power += tonakai[1] || 0
    weight -= tonakai[0] || 0
    if (power >= weight) {
      break
    }
  }
  return ca.length - count
}
function max(ca: [number, number][]) {
  const costs = ca.toSorted((a, b) => a[0] - b[0])
  let weight = ca.map((t) => t[0]).sum()
  let count = 0
  let power = 0
  for (const i of range(costs.length)) {
    count++
    const tonakai = costs.pop()!
    power += tonakai[1] || 0
    weight -= tonakai[0] || 0
    if (power >= weight) {
      break
    }
  }
  return ca.length - count
}
