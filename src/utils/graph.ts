import { range } from './utils'

/**
 * ### 辺リスト (Edge List) を隣接リスト (Adjacency List) に変換する関数 (無向グラフ用).
 * @complexity O(N + M)
 */
export function edgeListToAdjacencyList(
  n: number,
  edgeList: ReadonlyArray<readonly [number, number]>,
  isOneIndexed = false,
): number[][] {
  const arraySize = isOneIndexed ? n + 1 : n
  const result: number[][] = Array(arraySize)
    .fill(0)
    .map(() => [])
  for (const [u, v] of edgeList) {
    if (u >= 0 && u < arraySize && v >= 0 && v < arraySize) {
      result[u].push(v)
      result[v].push(u)
    } else {
      console.warn(
        `Edge [${u}, ${v}] contains out-of-bounds vertex for size ${arraySize} (isOneIndexed: ${isOneIndexed})`,
      )
    }
  }
  return result
}
