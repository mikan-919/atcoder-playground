type RunLengthTuple = [char: string, count: number]

interface String {
  /**
   * 空白区切りの文字列を配列へ分割します。
   *
   * @example
   * ```ts
   * '10 20 30'.terms() // ['10', '20', '30']
   * ```
   */
  terms(this: string): string[]

  /**
   * 空白区切りで分割し、各要素へ変換関数を適用します。
   *
   * @example
   * ```ts
   * '10 20 30'.terms(Number) // [10, 20, 30]
   * ```
   */
  terms<T>(this: string, mapper: (value: string, index: number, array: string[]) => T): T[]

  /**
   * 文字列をnumberへ変換します。
   *
   * @example
   * ```ts
   * '42'.toNumber() // 42
   * ```
   */
  toNumber(this: string): number

  /**
   * 文字列をUnicode文字単位の配列へ変換します。
   *
   * @example
   * ```ts
   * 'abc'.toArray() // ['a', 'b', 'c']
   * ```
   */
  toArray(this: string): string[]

  /**
   * 連続する同じ文字を`[文字, 個数]`へランレングス圧縮します。
   *
   * @example
   * ```ts
   * 'aaabbc'.toRunLength() // [['a', 3], ['b', 2], ['c', 1]]
   * ```
   */
  toRunLength(this: string): RunLengthTuple[]
}

Object.defineProperties(String.prototype, {
  terms: {
    value: function <T>(
      this: string,
      mapper?: (value: string, index: number, array: string[]) => T,
    ): string[] | T[] {
      const values = this.split(' ')
      return mapper ? values.map(mapper) : values
    },
    writable: true,
    configurable: true,
  },
  toNumber: {
    value: function (this: string): number {
      return Number(this)
    },
    writable: true,
    configurable: true,
  },
  toArray: {
    value: function (this: string): string[] {
      return [...this]
    },
    writable: true,
    configurable: true,
  },
  toRunLength: {
    value: function (this: string): RunLengthTuple[] {
      if (this.length === 0) return []

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

      result.push([currentChar, count])
      return result
    },
    writable: true,
    configurable: true,
  },
})
