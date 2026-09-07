/**
 * 両端を含む整数範囲 [low, high] で、条件を満たす最小値を返します。
 *
 * 前提:
 * - 判定は値の昇順に false から true へ変わり、逆には戻りません。
 * - high は条件を満たします（範囲内に答えが存在します）。
 * - low <= high で、両端と high - low は安全な整数です。
 *   安全な整数とは、number で誤差なく表せる整数の範囲です。
 *
 * 判定回数は O(log U)。U は範囲内の整数の個数です。
 * 判定が O(N) なら、全体は O(N log U) です。
 *
 * @example
 * findFirstTrue(0, 100, (value) => value >= 37) // 37
 */
export function findFirstTrue(low: number, high: number, predicate: (value: number) => boolean): number {
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2)
    if (predicate(mid)) {
      // mid 自身が答えかもしれないため、候補に残します。
      high = mid
    } else {
      // mid 以下は条件を満たさないため、候補から除きます。
      low = mid + 1
    }
  }
  return low
}
