# AtCoder Playground

TypeScriptで解き、問題ごとのコードを保存しながら、AtCoderのNode.js環境向け`dist/Main.js`を生成するワークスペースです。

## 初回セットアップ

```bash
direnv allow
bun install
bun run login
```

`.envrc`が`use flake`を実行するため、以後はこのディレクトリへ入るだけで、現在のシェルを維持したままBun、Node.js 22、`online-judge-tools`（`oj`）、Biome、esbuildが利用できます。依存バージョンは`flake.lock`で固定されます。手動で`nix develop`を実行した場合はZshが起動します。

Zedでは`.zed/settings.json`によりdirenv環境のNixネイティブBiomeを使用し、このプロジェクトで使っていないESLintを無効化します。設定変更後に開いていた場合は、Zedで`language server: restart all language servers`を実行してください。

### AtCoderへのログイン

AtCoderではCloudflare Turnstileが使われているため、`oj login`へユーザー名とパスワードを入力する方式は利用できません。

1. ブラウザで[AtCoder](https://atcoder.jp/login)へログインする
2. 開発者ツールのApplication（FirefoxではStorage）→ Cookies → `https://atcoder.jp`を開く
3. `REVEL_SESSION`の値をコピーする
4. `bun run login`を実行し、非表示の入力欄へ貼り付ける

値は`~/.local/share/online-judge-tools/cookie.jar`へ権限`0600`で保存されます。秘密情報なので共有・コミットしないでください。

## 普段の流れ

コンテストを丸ごと開くと、全問題のテンプレート作成とサンプル取得をまとめて行い、`dev`のようなペインを問題ごとに横に並べて監視します。

```bash
bun run contest abc329
```

```
abc329  3/4 AC  (+2問は画面外)
╭─ a WA ─────────────╮ ╭─ b AC ─────────────╮ ╭─ c AC ─────────────╮ ╭─ d -- ─────────────╮
│1/3 AC              │ │3/3 AC              │ │3/3 AC              │ │未着手              │
│✗ sample-1  29ms    │ │✓ sample-1  29ms    │ │✓ sample-1  30ms    │ │                    │
│  期待 A......      │ │✓ sample-2  32ms    │ │✓ sample-2  30ms    │ │                    │
│  出力 .......      │ │✓ sample-3  29ms    │ │✓ sample-3  32ms    │ │                    │
│✓ sample-2  31ms    │ │                    │ │                    │ │                    │
╰────────────────────╯ ╰────────────────────╯ ╰────────────────────╯ ╰────────────────────╯

abcdefg: 選択   s: 提出   r: 全再実行   q: 終了
```

`solutions/abc329/<問題>/main.ts`か`src/`を保存すると、その問題だけ自動で再ビルド・再テストされます。落ちたサンプルは期待と出力がそのペインに並びます。

| キー | 動作 |
| --- | --- |
| `a`〜`g`、`←` `→` | ペインを選択 |
| `s` | 選択中の問題を提出（`y`で実行、`n`で中止） |
| `r` | 全問を再テスト |
| `q` | 終了 |

提出言語は既定で`JavaScript (Bun)`です。変えたい場合は`ATCODER_LANGUAGE`に言語名の一部（`Node.js`など）か言語IDを設定してください。画面幅が足りないときはペインが1問22桁まで詰められ、入りきらない問題は選択に応じてスクロールします。

1問だけ扱う場合は、短い問題IDで解答ファイルを作り、サンプルを取得します。

```bash
bun run new -- abc472/a
```

`solutions/abc472/a/main.ts`を編集します。サンプルの実行と提出では、直前に選択した問題を省略できます。

```bash
bun run test
bun run submit
```

保存するたびにサンプルテストを自動実行したい場合は、`dev`を起動したままにします。解答ファイルと`src/`の共通ライブラリが監視対象です。

```bash
bun run dev -- abc472/a
```

問題がまだ作成されていない場合は、テンプレートのコピーとサンプル取得も自動で行います。停止は`Ctrl-C`です。

手入力で試す場合は次を実行し、標準入力を貼り付けます。

```bash
bun run run
```

問題を明示する場合は、短縮形とURLのどちらも利用できます。

```bash
bun run test -- abc472/a
bun run submit -- abc472/a
bun run submit -- https://atcoder.jp/contests/abc472/tasks/abc472_a
```

## ディレクトリ構成

```text
src/                         共通ライブラリ
template/main.ts             新しい解答のテンプレート
solutions/<contest>/<task>/
  main.ts                    問題ごとの解答（Gitで保存）
  test/                      ダウンロードしたサンプル（Git対象外）
dist/Main.js                 bundle済み提出ファイル（Git対象外）
```

共通処理は`src/`へ追加し、解答から相対importします。`new`は既存の`main.ts`を上書きしないため、同じ問題を再度指定しても解答は保持されます。以前の`src/index.ts`は`solutions/legacy/current/main.ts`へ移動済みです。

### 提出について

`oj submit`はAtCoderのページ変更（`Memory Limit: 1024 MiB` — ojは`MB`/`KB`しか解釈できない）で、提出前にAssertionErrorで落ちます。`bun run submit`と`contest`のTUIは、代わりに`scripts/submit-atcoder.py`が提出フォームを直接POSTします。cookieは`oj`と同じ`~/.local/share/online-judge-tools/cookie.jar`を読みます。

提出せずに言語の解決だけ確認できます。

```bash
python3 scripts/submit-atcoder.py https://atcoder.jp/contests/abc472/tasks/abc472_a dist/Main.js --dry-run
```


## コマンド

| コマンド | 内容 |
| --- | --- |
| `bun run contest abc329` | コンテスト全問をペインで並べ、監視・提出 |
| `bun run new -- abc472/a` | 解答を作成し、サンプルを取得して選択 |
| `bun run download -- abc472/a` | 解答を用意し、サンプルを再取得 |
| `bun run dev -- abc472/a` | 問題をロードし、保存ごとにサンプルテスト |
| `bun run check` | 全ライブラリ・保存済み解答の型検査とlint |
| `bun run fmt` | format、import整理、lintの安全な修正 |
| `bun run login` | ブラウザのAtCoderセッションを`oj`へ登録 |
| `bun run build -- [問題]` | 選択した問題から`dist/Main.js`を生成 |
| `bun run test -- [問題]` | build後、その問題の全サンプルを検証 |
| `bun run run -- [問題]` | build後、標準入力で実行 |
| `bun run submit -- [問題]` | check/build後、`oj`で提出 |
| `bun run watch -- [問題]` | 選択した問題を継続build |

外部パッケージもesbuildが提出ファイルへbundleします。ただしソースサイズと実行時間を考え、必要なものだけをimportしてください。
