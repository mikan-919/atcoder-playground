type RunLengthTuple = [char: string, count: number]

interface String {
  terms<T>(this: string, mapper?: (value: string, index?: number, array?: string[]) => T): T[]
  toNumber(this: string): number
  toArray(this: string): string[]
  toRunLength(): RunLengthTuple[]
}

String.prototype.terms = function <T>(this: string, mapper?: (value: string, index?: number, array?: string[]) => T) {
  if (mapper) return this.split(' ').map(mapper)
  return this.split(' ')
}
String.prototype.toNumber = function (this: string) {
  // `this` を明示的に指定
  return Number(this)
}

String.prototype.toArray = function (this: string) {
  // `this` を明示的に指定
  return [...this]
}

String.prototype.toRunLength = function (this: string) {
  if (this.length === 0) {
    return []
  }

  const result: RunLengthTuple[] = []
  let currentChar = this[0]
  let count = 1

  for (let i = 1; i < this.length; i++) {
    if (this[i] === currentChar) {
      count++
    } else {
      result.push([currentChar, count])
      currentChar = this[i]
      count = 1
    }
  }

  // 最後の文字シーケンスを追加
  result.push([currentChar, count])

  return result
}
