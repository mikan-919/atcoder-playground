export const Yes = (): void => console.log('Yes')
export const No = (): void => console.log('No')
export const print = (...args: unknown[]): void => console.log(...args)

export function printArray(array: unknown[], separator = ' '): void {
  console.log(array.join(separator))
}
