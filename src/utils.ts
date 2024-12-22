type BaseFunc<T extends unknown[], U> = (...args: T) => U

export function memorize<T extends unknown[], U>(
  fn: BaseFunc<T, U>,
): BaseFunc<T, U> {
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
