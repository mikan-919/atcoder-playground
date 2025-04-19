import { readFileSync } from 'node:fs'

const input = readFileSync('/dev/stdin', 'utf8').split('\n')
export const readLine = () => {
  return input.shift() ?? ''
}

export const readLines = (n: number) => {
  return Array(n)
    .fill(0)
    .map(() => readLine())
}

export const readNumbers = <U extends number = number>() => {
  const line = readLine()
  return line.split(' ').map(Number) as U[]
}

export const readNumberLines = <U extends number = number>(n: number) => {
  const lines = readLines(n)
  return lines.map((e) => e.split(' ').map(Number)) as U[][]
}

export const readMatrix = <U extends number = number>(rows: number) => {
  return Array(rows)
    .fill(0)
    .map(() => readNumbers<U>())
}
