import fs from "node:fs";

// ================================ ================================ ================================
// ================================ ===== ここからセットアップ ===== ================================
// ================================ ================================ ================================


function inputs(): string[] {
	const input: string = fs.readFileSync("/dev/stdin", "utf8");
	const lines: string[] = input.split("\n");
	return lines;
}

const Yes = (): void => console.log("Yes");
const No = (): void => console.log("No");
const print = (...args: unknown[]): void => console.log(...args);

function printArray(array: unknown[], { join }: { join: boolean } = { join: false }): void {
	if (join) print(array.join(""));
	else print(array.join(" "));
}

// ================================ ================================ ================================
// ================================ ===== ここまでセットアップ ===== ================================
// ================================ ================================ ================================

function main(): void {
	const lines: string[] = inputs();
	print(lines[0].slice(0,-1))
}

main();