interface String {
  terms<T>(
    this: string,
    mapper: (value: string, index?: number, array?: string[]) => T,
  ): T[] // `this` を string に限定
  toNumber(this: string): number // `this` を string に限定
  toArray(this: string): string[] // `this` を string に限定
}

String.prototype.terms = function <T>(
  this: string, // `this` を明示的に指定
  mapper: (value: string, index?: number, array?: string[]) => T,
): T[] {
  return this.split(' ').map(mapper)
} as String['terms']

String.prototype.toNumber = function (this: string) {
  // `this` を明示的に指定
  return Number(this)
} as String['toNumber']

String.prototype.toArray = function (this: string) {
  // `this` を明示的に指定
  return [...this]
} as String['toArray']
