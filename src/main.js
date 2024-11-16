import fs from "node:fs";

function inputs() {
	const input = fs.readFileSync("/dev/stdin", "utf8");
	const lines = input.split("\n");
	return lines;
}

const Yes = () => console.log("Yes");
const No = () => console.log("No");
const print = (...args) => console.log(...args);

function printArray(array, { join } = { join: false }) {
	if (join) print(array.join(""));
	else print(array.join(" "));
}

function main() {
	const lines = inputs();
}

main();
