import { readFileSync } from 'node:fs'

export const useStdin = async <T>(
  processInput: (reader: {
    readLine: () => string
    readLines: (n: number) => string[]
    readNumbers: <U extends number = number>() => U[]
    readNumberLines: <U extends number = number>(n: number) => U[][]
    readMatrix: <U extends number = number>(rows: number) => U[][]
  }) => Promise<T>,
) => {
  try {
    const input = readFileSync('/dev/stdin', 'utf8').split('\n')

    const readLine = () => {
      return input.shift() ?? ''
    }

    const readLines = (n: number) => {
      return Array(n)
        .fill(0)
        .map(() => readLine())
    }

    const readNumbers = <U extends number = number>() => {
      const line = readLine()
      return line.split(' ').map(Number) as U[]
    }

    const readNumberLines = <U extends number = number>(n: number) => {
      const lines = readLines(n)
      return lines.map((e) => e.split(' ').map(Number)) as U[][]
    }

    const readMatrix = <U extends number = number>(rows: number) => {
      return Array(rows)
        .fill(0)
        .map(() => readNumbers<U>())
    }

    await processInput({
      readLine,
      readLines,
      readNumbers,
      readMatrix,
      readNumberLines,
    })
  } catch (error) {
    console.error('Error reading input:', error)
  }
}
