interface Array<T> {
  transpose(): T[][]
  zip<U>(other: U[]): [T, U][]
}

Array.prototype.transpose = function () {
  if (this.length === 0) return []
  return this[0].map((_: unknown, i: number) => this.map((row) => row[i]))
}

Array.prototype.zip = function <T, U>(this: T[], other: U[]): [T, U][] {
  const minLength = Math.min(this.length, other.length)
  const result: [T, U][] = []
  for (let i = 0; i < minLength; i++) {
    result.push([this[i], other[i]])
  }
  return result
}
