#!/bin/bash

OUTPUT_FILE="./output.txt"

# OUTPUT_FILE を空にする (ファイルが存在しなければ作成)
> "$OUTPUT_FILE"

cat << EOF > "$OUTPUT_FILE"
# コードブロックを使用する際の注意点
コードブロックにコードを出力する際にコード内に解説のためのコメントを含める必要はありません。
実務の範囲で必要なコメントは記述してよいですが、解説や説明のためにコメントを記述しないで下さい。
悪い例:
\`\`\`typescript
const float32Array = new Float32Array([1.0, 2.0, 3.0]); // 変換したい配列を使用してください
const normalArray = Array.from(float32Array); // Float32Arrayから通常の配列（number[]）に変換
console.log(normalArray); // 出力: [1, 2, 3]
\`\`\`
良い例:
\`\`\`typescript
/**
 * フィボナッチ数列のn番目の数を計算します。
 *
 * @param {number} n 求めたいフィボナッチ数のインデックス（非負の整数）。
 * @returns {number} n番目のフィボナッチ数。
 * @throws {Error} nが負の数の場合。
 */
function fibonacci(n: number): number {
  if (n < 0) {
    throw new Error("入力は非負の整数である必要があります。");
  }
  let a = 0;
  let b = 1;
  while (n > 0) {
    [a, b] = [b, a + b];
    n--;
  }
  return a;
}
\`\`\`

# 指示のない暗黙的な設定を以下に記述します
- フォーマットは
  - export default function
  - interface Props type
  - singleQuote
  - no semicolons
  - line width 120

# コードを書く際に注意するべきこと
If you will run \`npm\` command, you must use \`pnpm\` instead \`npm\`.
If you will write React component, you must use \`export default function ComponentName() {}\` and not write \`import * as React from 'react'\`.
If you will create component file, you must use CamelCase.
If you will add style to component, you must use \`className\` for Tailwind CSS instead \`class\`.
If you will use hooks in the component, you must write \`'use client'\`.
If you will import components from shadcn/ui, import them from '@/components/ui/'.
When using TypeScript, always provide explicit type annotations for function parameters and return types.
Use destructuring for props in functional components.
Prefer arrow functions for event handlers and callbacks.
Use the \`useState\` hook for managing local component state.
Utilize the \`useEffect\` hook for side effects and lifecycle management.
Implement proper error handling and input validation where necessary.
Follow the existing indentation and formatting style of the surrounding code.
Use meaningful and descriptive variable and function names.
Avoid using \`any\` type in TypeScript; prefer more specific types or interfaces.
Use async/await for handling asynchronous operations instead of raw promises.

# Workspaceの内容
EOF

echo "\`\`\`\`\`" >> "$OUTPUT_FILE"
find . \( -name "node_modules" -prune \) -o \( -path "./.git" -prune \) -o \( -path "$OUTPUT_FILE" -prune \) -o -type f -print0 | while IFS= read -r -d $'\0' file; do
  # git check-ignore で .gitignore にマッチするか確認
  if git check-ignore "$file" > /dev/null 2>&1; then
    # マッチする場合はスキップ
    continue
  fi

  echo $file

  # ファイル拡張子で Typescript ファイルを判定 (例としてファイル拡張子判定版を提示)
  if [[ "$file" =~ \.ts$ ]] || [[ "$file" =~ \.tsx$ ]]; then
    # ファイル名を出力 (OUTPUT_FILE に追記)
    echo "\`\`\`$file" >> "$OUTPUT_FILE"

    # ファイルの内容を出力 (OUTPUT_FILE に追記)
    cat "$file" >> "$OUTPUT_FILE"

    # 区切りを出力 (OUTPUT_FILE に追記)
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo >> "$OUTPUT_FILE" # 空行を出力
  fi
done
echo "\`\`\`\`\`" >> "$OUTPUT_FILE"