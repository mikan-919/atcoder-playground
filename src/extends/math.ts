interface Math {
  /**
   * 常に`0`以上`m`未満となる剰余を返します。
   * JavaScriptの`%`と異なり、負数も正の剰余へ正規化されます。
   *
   * @example
   * ```ts
   * Math.mod(-1, 5) // 4
   * Math.mod(7, 5) // 2
   * ```
   */
  mod(n: number, m: number): number
}

/**
 * 常に`0`以上`m`未満となる剰余を返します。
 *
 * @example
 * ```ts
 * mod(-1, 5) // 4
 * ```
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

Object.defineProperty(Math, 'mod', {
  value: mod,
  writable: true,
  configurable: true,
})
