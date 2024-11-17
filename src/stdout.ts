export const Yes = (): void => console.log("Yes");
export const No = (): void => console.log("No");
export const print = (...args: unknown[]): void => console.log(...args);

export function printArray(
	array: unknown[],
	{ join }: { join: boolean } = { join: false },
): void {
	if (join) print(array.join(""));
	else print(array.join(" "));
}
