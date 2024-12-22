interface String {
  terms<T>(mapper: (value: string, index?: number, array?: string[]) => T): T[]
  toNumber(): number
}

String.prototype.terms = function <T>(
  mapper: (value: string, index?: number, array?: string[]) => T,
): T[] {
  return this.split(' ').map(mapper)
}
String.prototype.toNumber = function () {
  return Number(this)
}
