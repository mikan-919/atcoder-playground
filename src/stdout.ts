export const yes = (): void => console.log('Yes')
export const no = (): void => console.log('No')
export const print = (...args: unknown[]): void => console.log(...args)
export const stop = () => process.exit(0)

export function putArray(array: unknown[], separator = ' '): void {
  console.log(array.join(separator))
}
