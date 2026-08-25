import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

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
const OPENER = [['wslview'], ['explorer.exe'], ['xdg-open'], ['open']]

export function copyToClipboard(text) {
  for (const [program, ...args] of CLIPBOARD) {
    const result = spawnSync(program, args, { input: text, stdio: ['pipe', 'ignore', 'ignore'] })
    if (!result.error && result.status === 0) return program
  }
  return null
}

export function openUrl(url) {
  for (const [program, ...args] of OPENER) {
    // explorer.exe は成功しても終了コード1を返すため、起動できたかどうかだけ見る
    const result = spawnSync(program, [...args, url], { stdio: 'ignore' })
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
