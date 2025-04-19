import { readFileSync } from 'node:fs'

const input = readFileSync('/dev/stdin', 'utf8').split('\n')

let currentLineIndex = 0
export const readLine = (): string => {
  const line = input[currentLineIndex]
  currentLineIndex++
  return line ?? ''
}
export const readLines = (n: number) => {
  const lines = input.slice(currentLineIndex, currentLineIndex + n)
  currentLineIndex += n
  return lines
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
