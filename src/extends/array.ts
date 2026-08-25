interface ArrayConstructor {
  /**
   * 英小文字`a`〜`z`の配列を返します。
   * 呼び出すたびに新しい配列を返すので、書き換えても影響しません。
   * 大文字が欲しい場合は`Array.alphabets().map((c) => c.toUpperCase())`とします。
   *
   * @example
   * ```ts
   * Array.alphabets() // ['a', 'b', ..., 'z']
   * ```
   */
  alphabets(): string[]
}

interface Array<T> {
  /**
   * 二次元配列の行と列を入れ替えます。
   *
   * @example
   * ```ts
   * [[1, 2], [3, 4]].transpose() // [[1, 3], [2, 4]]
   * ```
   */
  transpose<U extends T>(this: U[][]): T[][]

  /**
   * 同じ位置にある要素をタプルにまとめます。
   * 結果の長さは短い方の配列に合わせられます。
   *
   * @example
   * ```ts
   * [1, 2, 3].zip(['a', 'b']) // [[1, 'a'], [2, 'b']]
   * ```
   */
  zip<U>(other: U[]): [T, U][]

  /**
   * 指定した位置の要素を除いた新しい配列を返します。
   * 範囲外の位置を指定した場合は、元の配列のコピーを返します。
   *
   * @example
   * ```ts
   * ['a', 'b', 'c'].without(1) // ['a', 'c']
   * ```
   */
  without(index: number): T[]

  /**
   * 重複を取り除いた新しい配列を返します。
   * 最初に現れた順序を保ちます。
   *
   * @example
   * ```ts
   * [3, 1, 3, 2].unique() // [3, 1, 2]
   * ```
   */
  unique(): T[]

  /**
   * 数値として昇順に並べた新しい配列を返します。
   * 比較関数なしの`sort()`は文字列比較になるため、数値配列ではこちらを使います。
   * `descending`にtrueを渡すと降順になります。
   *
   * @example
   * ```ts
   * [100, 99].sort() // [100, 99]（文字列比較）
   * [100, 99].sortNumbers() // [99, 100]
   * [1, 3, 2].sortNumbers(true) // [3, 2, 1]
   * ```
   */
  sortNumbers<U extends number | bigint>(this: U[], descending?: boolean): U[]

  /**
   * 配列の要素から新しいSetを作ります。
   *
   * @example
   * ```ts
   * [1, 1, 2].toSet() // Set { 1, 2 }
   * ```
   */
  toSet(): Set<T>

  /**
   * 各要素の出現回数をMapとして返します。
   *
   * @example
   * ```ts
   * ['a', 'b', 'a'].countOccurrences() // Map { 'a' => 2, 'b' => 1 }
   * ```
   */
  countOccurrences(): Map<T, number>

  /**
   * 隣り合う要素へ評価関数を適用した新しい配列を返します。
   * 要素が2個未満の場合は空配列を返します。
   *
   * @example
   * ```ts
   * [3, 8, 10].toDifferences((current, next) => next - current) // [5, 2]
   * ```
   */
  toDifferences<U>(evaluator: (currentElement: T, nextElement: T) => U): U[]
}

interface Array<T extends number | bigint> {
  /**
   * 数値またはbigintの合計を返します。空配列の場合は`0`を返します。
   *
   * @example
   * ```ts
   * [1, 2, 3].sum() // 6
   * [1n, 2n, 3n].sum() // 6n
   * ```
   */
  sum(): T

  /**
   * 最小値を返します。空配列では`RangeError`を投げます。
   *
   * @example
   * ```ts
   * [3, 1, 4].min() // 1
   * ```
   */
  min(): T

  /**
   * 最小値を返します。空配列の場合は指定したデフォルト値を返します。
   *
   * @example
   * ```ts
   * ([] as number[]).min(Infinity) // Infinity
   * ```
   */
  min(defaultValue: T): T

  /**
   * 最大値を返します。空配列では`RangeError`を投げます。
   *
   * @example
   * ```ts
   * [3, 1, 4].max() // 4
   * ```
   */
  max(): T

  /**
   * 最大値を返します。空配列の場合は指定したデフォルト値を返します。
   *
   * @example
   * ```ts
   * ([] as number[]).max(-Infinity) // -Infinity
   * ```
   */
  max(defaultValue: T): T
}

Object.defineProperty(Array, 'alphabets', {
  value: (): string[] => Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
  writable: true,
  configurable: true,
})

Object.defineProperties(Array.prototype, {
  transpose: {
    value: function <T>(this: T[][]): T[][] {
      if (this.length === 0) return []
      if (this[0].length === 0) return [[]]
      return this[0].map((_, i) => this.map((row) => row[i]))
    },
    writable: true,
    configurable: true,
  },
  zip: {
    value: function <T, U>(this: T[], other: U[]): [T, U][] {
      const minLength = Math.min(this.length, other.length)
      const result: [T, U][] = []
      for (let i = 0; i < minLength; i++) {
        result.push([this[i], other[i]])
      }
      return result
    },
    writable: true,
    configurable: true,
  },
  sum: {
    value: function (this: number[] | bigint[]): number | bigint {
      if (this.length === 0) return 0
      if (typeof this[0] === 'bigint') {
        return (this as bigint[]).reduce((acc, value) => acc + value, 0n)
      }
      return (this as number[]).reduce((acc, value) => acc + value, 0)
    },
    writable: true,
    configurable: true,
  },
  min: {
    value: function <T extends number | bigint>(this: T[], defaultValue?: T): T {
      if (this.length === 0) {
        if (defaultValue !== undefined) return defaultValue
        throw new RangeError('min() cannot be called on an empty array without a default value')
      }
      return this.reduce((result, value) => (value < result ? value : result))
    },
    writable: true,
    configurable: true,
  },
  max: {
    value: function <T extends number | bigint>(this: T[], defaultValue?: T): T {
      if (this.length === 0) {
        if (defaultValue !== undefined) return defaultValue
        throw new RangeError('max() cannot be called on an empty array without a default value')
      }
      return this.reduce((result, value) => (value > result ? value : result))
    },
    writable: true,
    configurable: true,
  },
  without: {
    value: function <T>(this: T[], index: number): T[] {
      if (index < 0 || index >= this.length) return this.slice()
      return this.slice(0, index).concat(this.slice(index + 1))
    },
    writable: true,
    configurable: true,
  },
  unique: {
    value: function <T>(this: T[]): T[] {
      return [...new Set(this)]
    },
    writable: true,
    configurable: true,
  },
  sortNumbers: {
    value: function <T extends number | bigint>(this: T[], descending = false): T[] {
      const sign = descending ? -1 : 1
      return this.slice().sort((a, b) => (a < b ? -sign : a > b ? sign : 0))
    },
    writable: true,
    configurable: true,
  },
  toSet: {
    value: function <T>(this: T[]): Set<T> {
      return new Set(this)
    },
    writable: true,
    configurable: true,
  },
  countOccurrences: {
    value: function <T>(this: T[]): Map<T, number> {
      const counts = new Map<T, number>()
      for (const element of this) {
        counts.set(element, (counts.get(element) ?? 0) + 1)
      }
      return counts
    },
    writable: true,
    configurable: true,
  },
  toDifferences: {
    value: function <T, U>(this: T[], evaluator: (currentElement: T, nextElement: T) => U): U[] {
      const results: U[] = []
      for (let i = 0; i < this.length - 1; i++) {
        results.push(evaluator(this[i], this[i + 1]))
      }
      return results
    },
    writable: true,
    configurable: true,
  },
})
