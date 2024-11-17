import { inputs } from "./stdin";
import { print } from "./stdout";

function main(): void {
	const lines: string[] = inputs();
	print(lines[0].slice(0, -1));
}

main();
