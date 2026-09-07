import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  fallbackTaskIds,
  isEmptySample,
  markSampleSource,
  parseTaskCache,
  parseTaskIds,
  readAtCoderCookieHeader,
  replaceSampleDirectory,
  runnableSampleFiles,
  samplesAreFrom,
  waitForTaskIds,
} from './contest-data.mjs'

test('対象コンテストの問題だけをHTMLから読む', () => {
  const html = `
    <a href="/contests/abc474/tasks/abc474_b">B</a>
    <a href="/contests/abc473/tasks/abc473_a">別コンテスト</a>
    <a href="/contests/abc474/tasks/abc474_a">A</a>
    <a href="/contests/abc474/tasks/abc474_a">A duplicate</a>
  `
  assert.deepEqual(parseTaskIds('abc474', html), ['abc474_a', 'abc474_b'])
})

test('問題一覧を取得できないABCはAからGを仮定する', () => {
  assert.deepEqual(fallbackTaskIds('abc474'), [
    'abc474_a',
    'abc474_b',
    'abc474_c',
    'abc474_d',
    'abc474_e',
    'abc474_f',
    'abc474_g',
  ])
  assert.equal(fallbackTaskIds('arc200'), null)
})

test('別コンテストからコピーされた旧形式キャッシュを拒否する', () => {
  assert.equal(parseTaskCache('abc474', '["abc473_a","abc473_b"]'), null)
  assert.deepEqual(parseTaskCache('abc474', '["abc474_a","abc474_b"]'), ['abc474_a', 'abc474_b'])
})

test('新形式キャッシュはコンテスト名を照合する', () => {
  const text = JSON.stringify({ contest: 'abc474', ids: ['abc474_a'] })
  assert.deepEqual(parseTaskCache('abc474', text), ['abc474_a'])
  assert.equal(parseTaskCache('abc475', text), null)
})

test('サンプルの取得元URLを照合する', () => {
  const directory = mkdtempSync(join(tmpdir(), 'atcoder-samples-'))
  writeFileSync(join(directory, 'sample-1.in'), '1\n')
  assert.equal(samplesAreFrom(directory, 'https://atcoder.jp/contests/abc474/tasks/abc474_a'), false)
  markSampleSource(directory, 'https://atcoder.jp/contests/abc474/tasks/abc474_a')
  assert.equal(samplesAreFrom(directory, 'https://atcoder.jp/contests/abc474/tasks/abc474_a'), true)
  assert.equal(samplesAreFrom(directory, 'https://atcoder.jp/contests/abc473/tasks/abc473_a'), false)
})

test('ojのCookieファイルからREVEL_SESSIONだけを読む', () => {
  const directory = mkdtempSync(join(tmpdir(), 'atcoder-cookie-'))
  const path = join(directory, 'cookie.jar')
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    path,
    '#LWP-Cookies-2.0\nSet-Cookie3: REVEL_SESSION="session-value"; path="/"; domain=.atcoder.jp; secure\nSet-Cookie3: OTHER="secret"; path="/"; domain=.atcoder.jp\n',
  )
  assert.equal(readAtCoderCookieHeader(path), 'REVEL_SESSION=session-value')
})

test('取得済みサンプルだけを入れ替えて手作りケースを残す', () => {
  const parent = mkdtempSync(join(tmpdir(), 'atcoder-replace-'))
  const current = join(parent, 'test')
  const downloaded = join(parent, '.test-download')
  mkdirSync(current)
  mkdirSync(downloaded)
  writeFileSync(join(current, 'sample-1.in'), 'old sample\n')
  writeFileSync(join(current, 'corner.in'), 'custom case\n')
  writeFileSync(join(downloaded, 'sample-1.in'), 'new sample\n')

  const url = 'https://atcoder.jp/contests/abc474/tasks/abc474_a'
  replaceSampleDirectory(current, downloaded, url)

  assert.equal(readFileSync(join(current, 'sample-1.in'), 'utf8'), 'new sample\n')
  assert.equal(readFileSync(join(current, 'corner.in'), 'utf8'), 'custom case\n')
  assert.equal(samplesAreFrom(current, url), true)
})

test('空の入出力は実行対象から除外する', () => {
  const directory = mkdtempSync(join(tmpdir(), 'atcoder-empty-sample-'))
  writeFileSync(join(directory, 'sample-1.in'), '')
  writeFileSync(join(directory, 'sample-1.out'), '')
  writeFileSync(join(directory, 'sample-2.in'), '1\n')
  writeFileSync(join(directory, 'sample-2.out'), '2\n')

  assert.equal(isEmptySample('', ''), true)
  assert.equal(isEmptySample('1\n', ''), false)
  assert.deepEqual(runnableSampleFiles(directory), ['sample-2.in'])
})

test('問題が未公開なら取得を再試行する', async () => {
  let requests = 0
  const ids = await waitForTaskIds({
    contest: 'abc474',
    waitMs: 100,
    retryMs: 0,
    fetchPage: async () => {
      requests++
      const html = requests === 1 ? '<p>Contest is not started</p>' : '<a href="/contests/abc474/tasks/abc474_a">A</a>'
      return { ok: true, status: 200, text: async () => html }
    },
  })

  assert.equal(requests, 2)
  assert.deepEqual(ids, ['abc474_a'])
})
