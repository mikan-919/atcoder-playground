interface Array<T> {
  transpose<U extends T>(this: U[][]): T[][]
  zip<U>(other: U[]): [T, U][]
  sum(this: number[]): number
  without(index: number): T[]
  toSet(): Set<T>
  countOccurrences(): Map<T, number>
}

Array.prototype.transpose = function <T>(this: T[][]) {
  if (this.length === 0) return []
  if (this[0].length === 0) return [[]]
  return this[0].map((_, i) => this.map((row) => row[i]))
}

Array.prototype.zip = function <T, U>(this: T[], other: U[]) {
  const minLength = Math.min(this.length, other.length)
  const result: [T, U][] = []
  for (let i = 0; i < minLength; i++) {
    result.push([this[i], other[i]])
  }
  return result
}

Array.prototype.sum = function (this: number[]) {
  if (this.length === 0) return 0
  return this.reduce((acc, x) => acc + x, 0)
}

Array.prototype.without = function <T>(this: T[], index: number) {
  if (index < 0 || index >= this.length) {
    return this.slice()
  }
  return this.slice(0, index).concat(this.slice(index + 1))
}

Array.prototype.toSet = function <T>(this: T[]): Set<T> {
  return new Set(this)
}
Array.prototype.countOccurrences=function<T>(this:T[]) {
  const counts = new Map<T, number>()
  for (const element of this) {
    // Mapから現在のカウント取得(なければ0)し、+1してセットする短縮形！
    counts.set(element, (counts.get(element) ?? 0) + 1)
  }
  return counts
}
