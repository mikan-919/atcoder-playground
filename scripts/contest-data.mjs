import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const SAMPLE_SOURCE_FILE = '.source-url'

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function parseTaskIds(contest, html) {
  const escapedContest = escapeRegExp(contest)
  const pattern = new RegExp(`/contests/${escapedContest}/tasks/([a-zA-Z0-9_]+)`, 'g')
  return [...new Set([...html.matchAll(pattern)].map((match) => match[1]))].sort()
}

export async function waitForTaskIds({ contest, fetchPage, waitMs, retryMs, onRetry = () => {} }) {
  const started = Date.now()
  let lastFailure = '問題がまだ公開されていません'

  while (Date.now() - started <= waitMs) {
    try {
      const response = await fetchPage()
      if (!response.ok) lastFailure = `HTTP ${response.status}`
      else {
        const ids = parseTaskIds(contest, await response.text())
        if (ids.length > 0) return ids
        lastFailure = '問題がまだ公開されていません'
      }
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error)
    }

    const elapsed = Date.now() - started
    if (elapsed >= waitMs) break
    onRetry(elapsed)
    await new Promise((resolve) => setTimeout(resolve, retryMs))
  }

  throw new Error(`${contest} の問題一覧を${waitMs / 1000}秒以内に取得できませんでした（${lastFailure}）。`)
}

const validIds = (ids) =>
  Array.isArray(ids) && ids.length > 0 && ids.every((id) => typeof id === 'string' && /^[a-zA-Z0-9_]+$/.test(id))

export function parseTaskCache(contest, text) {
  let cache
  try {
    cache = JSON.parse(text)
  } catch {
    return null
  }

  if (cache?.contest === contest && validIds(cache.ids)) return cache.ids

  // 旧形式にはコンテスト名がない。通常の問題IDで所属を確認できる場合だけ利用する。
  if (validIds(cache) && cache.every((id) => id.startsWith(`${contest}_`))) return cache
  return null
}

export function readTaskCache(path, contest) {
  if (!existsSync(path)) return null
  return parseTaskCache(contest, readFileSync(path, 'utf8'))
}

export function writeTaskCache(path, contest, ids) {
  writeFileSync(path, `${JSON.stringify({ contest, ids })}\n`)
}

function cookiePath() {
  const dataHome = process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share')
  return join(dataHome, 'online-judge-tools', 'cookie.jar')
}

function unquoteCookieValue(value) {
  if (!value.startsWith('"') || !value.endsWith('"')) return value
  try {
    return JSON.parse(value)
  } catch {
    return value.slice(1, -1)
  }
}

export function readAtCoderCookieHeader(path = cookiePath()) {
  if (!existsSync(path)) return null
  const cookies = new Map()
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^Set-Cookie3:\s*([^=;]+)=((?:"(?:\\.|[^"])*")|[^;]*);/)
    if (!match) continue
    const [, name, rawValue] = match
    if (name === 'REVEL_SESSION') cookies.set(name, unquoteCookieValue(rawValue))
  }
  if (cookies.size === 0) return null
  return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ')
}

export function hasSampleFiles(directory) {
  return existsSync(directory) && readdirSync(directory).some((file) => file.endsWith('.in'))
}

export function samplesAreFrom(directory, problemUrl) {
  if (!hasSampleFiles(directory)) return false
  const source = join(directory, SAMPLE_SOURCE_FILE)
  return existsSync(source) && readFileSync(source, 'utf8').trim() === problemUrl
}

export function markSampleSource(directory, problemUrl) {
  writeFileSync(join(directory, SAMPLE_SOURCE_FILE), `${problemUrl}\n`)
}

export function replaceSampleDirectory(current, downloaded, problemUrl) {
  markSampleSource(downloaded, problemUrl)
  if (existsSync(current)) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === SAMPLE_SOURCE_FILE || /^sample-\d+\.(?:in|out)$/.test(entry.name)) continue
      cpSync(join(current, entry.name), join(downloaded, entry.name), {
        recursive: entry.isDirectory(),
        errorOnExist: false,
        force: false,
      })
    }
  }
  rmSync(current, { recursive: true, force: true })
  renameSync(downloaded, current)
}
