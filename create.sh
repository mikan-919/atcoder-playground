#!/bin/bash

# src/ ディレクトリ配下のすべてのファイルを処理
echo "\`\`\`\`\`"
find src/ -type f -print0 | while IFS= read -r -d $'\0' file; do
  # ファイル名を出力
  echo "$file"
  echo "\`\`\`"

  # ファイルの内容を出力
  cat "$file"

  # 区切りを出力
  echo
done
echo "\`\`\`\`\`"