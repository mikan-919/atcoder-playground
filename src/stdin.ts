import { readFileSync } from 'node:fs'

export const useStdin = <T>(
  processInput: (reader: {
    readLine: () => string
    readLines: (n: number) => string[]
    readNumbers: () => number[]
    readNumberLines: (n: number) => number[][]
    readMatrix: (rows: number) => number[][]
  }) => Promise<T>,
) => {
  const input = readFileSync('/dev/stdin', 'utf8').split('\n')
  input.reverse()
  const readLine = () => {
    return input.pop() ?? ''
  }

  const readLines = (n: number) => {
    return Array(n)
      .fill(0)
      .map(() => readLine())
  }

  const readNumbers = () => {
    const line = readLine()
    return line.split(' ').map(Number)
  }
  const readNumberLines = (n: number) => {
    const lines = readLines(n)
    return lines.map((e) => e.split(' ').map(Number))
  }

  const readMatrix = (rows: number) => {
    return Array(rows)
      .fill(0)
      .map(() => readNumbers())
  }

  processInput({
    readLine,
    readLines,
    readNumbers,
    readMatrix,
    readNumberLines,
  })
}
