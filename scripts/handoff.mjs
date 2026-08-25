import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

// AtCoderの提出フォームはCloudflare Turnstileで保護されており、
// スクリプトからのPOSTは受け付けられない。コードをクリップボードへ入れて
// 提出ページをブラウザで開くところまでを担当する。

const CLIPBOARD = [
  ['clip.exe'],
  ['wl-copy'],
  ['xclip', '-selection', 'clipboard'],
  ['xsel', '--clipboard', '--input'],
  ['pbcopy'],
]
// WSLではカレントディレクトリがUNCパスになり、Windows実行ファイルが引数を処理する前に
// 「フォルダを開く」動作へフォールバックする。/mnt/c から起動して回避する。
const WINDOWS_CWD = existsSync('/mnt/c') ? '/mnt/c' : undefined
const escapeForPowerShell = (url) => url.replace(/'/g, "''")

const OPENER = [
  (url) => ['wslview', [url]],
  (url) => [
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', `Start-Process '${escapeForPowerShell(url)}'`],
  ],
  (url) => ['explorer.exe', [url]],
  (url) => ['xdg-open', [url]],
  (url) => ['open', [url]],
]

export function copyToClipboard(text) {
  for (const [program, ...args] of CLIPBOARD) {
    const result = spawnSync(program, args, { input: text, stdio: ['pipe', 'ignore', 'ignore'] })
    if (!result.error && result.status === 0) return program
  }
  return null
}

export function openUrl(url) {
  for (const build of OPENER) {
    const [program, args] = build(url)
    const isWindows = program.endsWith('.exe')
    // explorer.exe は成功しても終了コード1を返すため、起動できたかどうかだけ見る
    const result = spawnSync(program, args, { stdio: 'ignore', cwd: isWindows ? WINDOWS_CWD : undefined })
    if (!result.error) return program
  }
  return null
}

export function submitUrlOf(problemUrl) {
  const matched = problemUrl.match(/contests\/([^/]+)\/tasks\/([^/?#]+)/)
  if (!matched) throw new Error(`問題URLとして解釈できません: ${problemUrl}`)
  return `https://atcoder.jp/contests/${matched[1]}/submit?taskScreenName=${matched[2]}`
}

export function handoffSubmit(problemUrl, file) {
  const url = submitUrlOf(problemUrl)
  const copied = copyToClipboard(readFileSync(file, 'utf8'))
  const opened = openUrl(url)
  return { url, copied, opened }
}
