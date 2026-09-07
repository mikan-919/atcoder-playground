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

コンテストを丸ごと開くと、問題ごとのテンプレートを作成してすぐにペインを表示します。サンプル取得は画面表示後に行い、取得できた問題からテストします。

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

abcdefg: 選択   d: サンプル再取得   s: コピーして提出ページへ   r: 全再実行   q: 終了
```

`solutions/abc329/<問題>/main.ts`か`src/`を保存すると、その問題だけ自動で再ビルド・再テストされます。落ちたサンプルは期待と出力がそのペインに並びます。

コンテスト開始直後に問題一覧やサンプルがまだ返らなくても、画面表示は待ちません。ABCでは問題一覧が取れない間はA〜Gを仮定してテンプレートを作り、問題一覧の取得を画面裏で再試行しながらサンプル取得を進めます。問題一覧の取得には`bun run login`で保存したAtCoderのセッションも使います。

各`test/`には取得元の問題URLを記録します。別コンテストからディレクトリをコピーした場合、取得元が一致しないサンプルは再取得されます。取得中は一時ディレクトリを使い、成功後にだけ既存のサンプルと入れ替えるため、通信失敗で手元のファイルは失われません。未取得または入出力が空のサンプルは実行しません。

| キー | 動作 |
| --- | --- |
| `a`〜`g`、`←` `→` | ペインを選択 |
| `d` | 選択中の問題のサンプルを再取得してテスト |
| `s` | 選択中の問題のコードをコピーし、提出ページをブラウザで開く |
| `r` | 全問を再テスト |
| `q` | 終了 |

提出はブラウザへ受け渡します（下の「提出について」を参照）。画面幅が足りないときはペインが1問22桁まで詰められ、入りきらない問題は選択に応じてスクロールします。

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

AtCoderの提出フォームはCloudflare Turnstileで保護されているため、スクリプトからPOSTしても`Error.`で弾かれます（`oj submit`も同様に失敗します。ojはさらに、問題ページの`Memory Limit: 1024 MiB`を解釈できず提出前にAssertionErrorで落ちます）。

そこで`bun run submit`と`contest`の`s`キーは、**バンドル済みのコードをクリップボードへコピーし、その問題の提出ページをブラウザで開く**ところまでを行います。あとは貼り付けて提出してください。言語はブラウザが前回の選択（`JavaScript (Bun 1.2.21)`）を憶えています。

クリップボードは`clip.exe`（WSL）、`wl-copy`、`xclip`、`xsel`、`pbcopy`の順に、ブラウザは`wslview`、`explorer.exe`、`xdg-open`、`open`の順に、使えるものを探します。


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
| `bun run test -- [問題]` | build後、その問題の実行可能なサンプルを検証 |
| `bun run run -- [問題]` | build後、標準入力で実行 |
| `bun run submit -- [問題]` | check/build後、`oj`で提出 |
| `bun run watch -- [問題]` | 選択した問題を継続build |

外部パッケージもesbuildが提出ファイルへbundleします。ただしソースサイズと実行時間を考え、必要なものだけをimportしてください。
