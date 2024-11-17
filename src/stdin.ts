import fs from "node:fs";

export function inputs(): string[] {
	const input: string = fs.readFileSync("/dev/stdin", "utf8");
	const lines: string[] = input.split("\n");
	return lines;
}
