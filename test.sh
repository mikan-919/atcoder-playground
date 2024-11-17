#!/bin/zsh

# ファイル名の定義
INPUT_FILE="input.txt"
EXPECTED_OUTPUT_FILE="output.txt"
SCRIPT="output/index.js"

# 枠の表示関数
function print_box() {
  local text=$1
  local color=$2
  echo "\e[${color}m├ ◯ \e[0m $text"
  echo "\e[${color}m│\e[0m"
}

# ビルドパート
print_box "Building project with pnpm..." "36" # 青色
BUILD_OUTPUT=$(pnpm build 2>&1)
if [[ $? -eq 0 ]]; then
  print_box "Build completed successfully." "32" # 緑色
else
  print_box "Build failed. Check the logs below." "31" # 赤色
  echo "\e[33m$BUILD_OUTPUT\e[0m"
  exit 1
fi

# ファイルの存在確認
if [[ ! -f $INPUT_FILE || ! -f $EXPECTED_OUTPUT_FILE || ! -f $SCRIPT ]]; then
  print_box "Error: Required files (input.txt, output.txt, $SCRIPT) are missing." "31"
  exit 1
fi

# テストパート
print_box "Running tests..." "36" # 青色
ACTUAL_OUTPUT=$(node $SCRIPT < $INPUT_FILE)

# 比較処理
EXPECTED_OUTPUT=$(cat $EXPECTED_OUTPUT_FILE)
if [[ "$ACTUAL_OUTPUT" == "$EXPECTED_OUTPUT" ]]; then
  print_box "[PASS] Output matches expected result." "32" # 緑色
else
  print_box "[FAIL] Output does not match expected result." "31" # 赤色
  echo "\e[1;34mExpected Output:\e[0m"
  echo "\e[33m$EXPECTED_OUTPUT\e[0m"
  echo "\e[1;34mActual Output:\e[0m"
  echo "\e[33m$ACTUAL_OUTPUT\e[0m"
fi
