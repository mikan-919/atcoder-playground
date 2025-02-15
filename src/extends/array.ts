interface Array<T> {
  transpose<U extends T>(this: U[][]): T[][]
  zip<U>(other: U[]): [T, U][]
  sum(this: number[]): number
}

Array.prototype.transpose = function <T>(this: T[][]) {
  if (this.length === 0) return []
  if (this[0].length === 0) return [[]]
  return this[0].map((_, i) => this.map((row) => row[i]))
} as Array<unknown>['transpose']

Array.prototype.zip = function <T, U>(this: T[], other: U[]): [T, U][] {
  const minLength = Math.min(this.length, other.length)
  const result: [T, U][] = []
  for (let i = 0; i < minLength; i++) {
    result.push([this[i], other[i]])
  }
  return result
} as Array<unknown>['zip']

Array.prototype.sum = function (this: number[]) {
  if (this.length === 0) return 0
  return this.reduce((acc, x) => acc + x, 0)
} as Array<number>['sum']
