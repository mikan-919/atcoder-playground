import { readFileSync } from 'node:fs'

type InputMapping = (((arg: string) => string) | NumberConstructor)[][]
// type InputMapping = (StringConstructor | NumberConstructor)[][]
// type InputMapping = (string | number)[][]
type ConstructorToType<T extends InputMapping> = {
  [K in keyof T]: T[K] extends infer U
    ? { [L in keyof U]: U[L] extends NumberConstructor ? number : string }
    : never
}

/**
 * 標準入力全体を読み取る関数
 * mappingによって文字列と数値に変換します
 */
export function inputs<T extends InputMapping>(
  mapping: T,
): ConstructorToType<T> {
  return readFileSync('/dev/stdin', 'utf-8')
    .split('\n')
    .filter((e) => e !== '')
    .map((e, i) =>
      e.split(' ').map((e, j) => mapping[i][j](e)),
    ) as ConstructorToType<T>
}
/**
 * 標準入力全体を読み取る関数
 * 何もマッピングはしません
 */
export function input() {
  return readFileSync('/dev/stdin', 'utf-8').split('\n')
}

const str = (arg: string) => arg
const num = Number
export { str, num }
