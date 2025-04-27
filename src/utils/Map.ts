/**
 * 配列内の各要素の出現回数をカウントして Map<要素, 回数> を返す。
 * @template T - 配列の要素の型 (string, number など Mapのキーにできるもの)
 * @param {T[]} array - カウント対象の配列
 * @returns {Map<T, number>} 要素をキー、出現回数を値とする Map
 *
 * @example
 * const nums = [1, 2, 5, 2, 1, 8, 5, 2, 9];
 * const counts = countOccurrences(nums);
 * console.log(counts); // Map(5) { 1 => 2, 2 => 3, 5 => 2, 8 => 1, 9 => 1 }
 * console.log(counts.get(2)); // 3
 *
 * const strs = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
 * const strCounts = countOccurrences(strs);
 * console.log(strCounts); // Map(3) { 'apple' => 3, 'banana' => 2, 'orange' => 1 }
 */
export function countOccurrences<T>(array: ReadonlyArray<T>): Map<T, number> {
  const counts = new Map<T, number>()
  for (const element of array) {
    // Mapから現在のカウント取得(なければ0)し、+1してセットする短縮形！
    counts.set(element, (counts.get(element) ?? 0) + 1)
  }
  return counts
}
