#!/bin/bash

OUTPUT_FILE="./output/index.cjs"


find ./src \( -name "node_modules" -prune \) -o \( -path "./.git" -prune \) -o \( -path "$OUTPUT_FILE" -prune \) -o -type f -print0 | while IFS= read -r -d $'\0' file; do
  # git check-ignore で .gitignore にマッチするか確認
  if git check-ignore "$file" > /dev/null 2>&1; then
    # マッチする場合はスキップ
    continue
  fi

  echo $file

  if [[ "$file" =~ \.ts$ ]] || [[ "$file" =~ \.tsx$ ]]; then
    # ファイル名を出力 (OUTPUT_FILE に追記)
    { echo '// ----- -----'; cat "$OUTPUT_FILE"; } > temp && mv temp "$OUTPUT_FILE"
    { cat $file | awk '{print "// " $0}'; cat "$OUTPUT_FILE"; } > temp && mv temp "$OUTPUT_FILE"
    { echo "// ----- $file"; cat "$OUTPUT_FILE"; } > temp && mv temp "$OUTPUT_FILE"
    
  fi
done

{ echo '// ----- source code -----'; cat "$OUTPUT_FILE"; } > temp && mv temp "$OUTPUT_FILE"