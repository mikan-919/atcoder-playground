type BaseFunc<T extends unknown[], U> = (...args: T) => U

export function memorize<T extends unknown[], U>(fn: BaseFunc<T, U>): BaseFunc<T, U> {
  const cache = new Map<string, U>()

  // ラップされた関数
  const wrapped: BaseFunc<T, U> = (...args: T): U => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key) as U

    const result = fn(...args)
    cache.set(key, result)
    return result
  }

  return wrapped
}

/**
 * 指定範囲の数値配列を生成する関数
 * @param end 終点 (exclusive)
 * @param start 始点 (inclusive, default: 0)
 * @returns 数値配列
 */
export function range(end: number, start = 0): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i)
}

/**
 * 最大公約数 (Greatest Common Divisor) を計算する関数
 * @param a
 * @param b
 * @returns 最大公約数
 */
export function gcd(a: number, b: number): number {
  let tempA = a
  let tempB = b
  while (tempB) {
    const remainder = tempA % tempB
    tempA = tempB
    tempB = remainder
  }
  return tempA
}

/**
 * 最小公倍数 (Least Common Multiple) を計算する関数
 * @param a
 * @param b
 * @returns 最小公倍数
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

