import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.ts",
	output: {
		dir: "output",
		format: "es",
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
