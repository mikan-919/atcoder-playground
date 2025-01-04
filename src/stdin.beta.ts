import { createInterface } from "node:readline";

export const useStdin = async <T>(
	processInput: (reader: {
		readLine: () => Promise<string>;
		readLines: (n: number) => Promise<string[]>;
		readNumbers: () => Promise<number[]>;
		readMatrix: (rows: number) => Promise<number[][]>;
	}) => Promise<T>,
) => {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const readLine = (): Promise<string> => {
		return new Promise((resolve) => {
			rl.question("", (input) => {
				resolve(input);
			});
		});
	};

	const readLines = async (n: number): Promise<string[]> => {
		const lines: string[] = [];
		for (let i = 0; i < n; i++) {
			lines.push(await readLine());
		}
		return lines;
	};

	const readNumbers = async (): Promise<number[]> => {
		const line = await readLine();
		return line.split(" ").map(Number);
	};

	const readMatrix = async (rows: number): Promise<number[][]> => {
		const matrix: number[][] = [];
		for await (const _ of Array(rows).keys()) {
			matrix.push(await readNumbers());
		}
		return matrix;
	};

	try {
		await processInput({
			readLine,
			readLines,
			readNumbers,
			readMatrix,
		});
	} catch (error) {
		console.error("エラーが発生しました:", error);
	} finally {
		rl.close();
	}
};
