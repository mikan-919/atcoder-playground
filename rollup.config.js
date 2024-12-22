import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.ts",
	output: {
		file: "output/index.cjs",
		format: "cjs",
	},
	external: ["node:fs"],
	plugins: [
		typescript({
			tslib: "typescript",
		}),
	],
	watch: {
		clearScreen: false, // ビルド時に画面をクリアしない
	},
};
