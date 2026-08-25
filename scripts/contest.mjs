import { spawn } from 'node:child_process'
import {
  closeSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  watch,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

const contest = process.argv[2]
if (!/^[a-z0-9_-]+$/.test(contest ?? '')) {
  console.error('usage: bun run contest abc329')
  process.exit(2)
}

const contestDir = join('solutions', contest)
const taskCache = join(contestDir, '.tasks.json')
const template = readFileSync('template/main.ts', 'utf8')
const MIN_PANE = 22
const TIMEOUT_MS = 4000

// ---------- 表示ユーティリティ ----------

const paint = (code, text) => (code === 0 ? text : `\x1b[${code}m${text}\x1b[0m`)
const wide = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹯＀-｠￠-￦]/
const widthOf = (text) => [...text].reduce((total, char) => total + (wide.test(char) ? 2 : 1), 0)

function fit(text, width) {
  let out = ''
  let used = 0
  for (const char of text) {
    const size = wide.test(char) ? 2 : 1
    if (used + size > width) return `${out}…`.padEnd(width - used + out.length + 1)
    out += char
    used += size
  }
  return out + ' '.repeat(width - used)
}

const line = (text, color = 0) => ({ text, color })

const VERDICT = {
  pending: { mark: '·', color: 2 },
  running: { mark: '◌', color: 33 },
  AC: { mark: '✓', color: 32 },
  WA: { mark: '✗', color: 31 },
  RE: { mark: '!', color: 35 },
  TLE: { mark: '⏱', color: 33 },
}
const STATUS_COLOR = { blank: 2, pending: 2, building: 33, running: 33, AC: 32, WA: 31, RE: 35, TLE: 33, CE: 35 }
const STATUS_LABEL = {
  blank: '--',
  pending: '...',
  building: 'BUILD',
  running: 'RUN',
  AC: 'AC',
  WA: 'WA',
  RE: 'RE',
  TLE: 'TLE',
  CE: 'CE',
}

// ---------- セットアップ ----------

async function fetchTaskIds() {
  if (existsSync(taskCache)) return JSON.parse(readFileSync(taskCache, 'utf8'))
  process.stdout.write(`${contest} の問題一覧を取得中...\n`)
  const response = await fetch(`https://atcoder.jp/contests/${contest}/tasks`)
  if (!response.ok) throw new Error(`問題一覧の取得に失敗しました (HTTP ${response.status})`)
  const html = await response.text()
  const pattern = new RegExp(`/contests/${contest}/tasks/([a-zA-Z0-9_]+)`, 'g')
  const ids = [...new Set([...html.matchAll(pattern)].map((match) => match[1]))].sort()
  if (ids.length === 0) throw new Error(`${contest} の問題が見つかりませんでした`)
  mkdirSync(contestDir, { recursive: true })
  writeFileSync(taskCache, JSON.stringify(ids))
  return ids
}

const exec = (program, args, onLine) =>
  new Promise((resolve) => {
    const child = spawn(program, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let rest = ''
    let tail = ''
    const consume = (chunk) => {
      tail += chunk
      if (!onLine) return
      rest += chunk
      const parts = rest.split('\n')
      rest = parts.pop() ?? ''
      for (const part of parts) onLine(part)
    }
    child.stdout.on('data', consume)
    child.stderr.on('data', consume)
    child.on('error', (error) => resolve({ status: 127, output: error.message }))
    child.on('close', (status) => {
      if (rest && onLine) onLine(rest)
      resolve({ status, output: tail })
    })
  })

function loadSamples(testsDir) {
  if (!existsSync(testsDir)) return []
  return readdirSync(testsDir)
    .filter((file) => file.endsWith('.in'))
    .sort()
    .map((file) => {
      const name = file.slice(0, -3)
      const expected = join(testsDir, `${name}.out`)
      return {
        name: name.replace(/^sample-/, ''),
        inputPath: join(testsDir, file),
        input: readFileSync(join(testsDir, file), 'utf8'),
        expected: existsSync(expected) ? readFileSync(expected, 'utf8') : null,
      }
    })
}

async function setup() {
  const ids = await fetchTaskIds()
  const problems = []
  for (const id of ids) {
    const letter = id.startsWith(`${contest}_`) ? id.slice(contest.length + 1) : id
    const directory = join(contestDir, letter)
    const source = join(directory, 'main.ts')
    const testsDir = join(directory, 'test')
    if (!existsSync(source)) {
      mkdirSync(directory, { recursive: true })
      copyFileSync('template/main.ts', source)
    }
    if (!existsSync(testsDir) || !readdirSync(testsDir).some((file) => file.endsWith('.in'))) {
      process.stdout.write(`${letter}: サンプル取得中...`)
      const url = `https://atcoder.jp/contests/${contest}/tasks/${id}`
      const { status, output } = await exec('oj', ['download', url, '--directory', testsDir, '--silent'])
      process.stdout.write(status === 0 ? ' ok\n' : ` 失敗 (${output.trim().split('\n').pop() ?? status})\n`)
    }
    problems.push({
      letter,
      url: `https://atcoder.jp/contests/${contest}/tasks/${id}`,
      source,
      bundle: join('dist', contest, `${letter}.js`),
      samples: loadSamples(testsDir),
      status: readFileSync(source, 'utf8') === template ? 'blank' : 'pending',
      body: [],
      submitting: false,
    })
  }
  return problems
}

// ---------- ビルドとテスト ----------

const normalize = (text) =>
  text
    .replace(/\r/g, '')
    .split('\n')
    .map((row) => row.trimEnd())
    .join('\n')
    .trimEnd()

function runSample(problem, sample) {
  return new Promise((resolve) => {
    // 解答は /dev/stdin を読むので、パイプではなくサンプルファイルそのものを fd 0 に渡す
    const input = openSync(sample.inputPath, 'r')
    const child = spawn('node', [problem.bundle], { stdio: [input, 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    const started = Date.now()
    const timer = setTimeout(() => child.kill('SIGKILL'), TIMEOUT_MS)
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('close', (status, signal) => {
      clearTimeout(timer)
      closeSync(input)
      const ms = Date.now() - started
      if (signal === 'SIGKILL') return resolve({ verdict: 'TLE', stdout, stderr, ms })
      if (status !== 0) return resolve({ verdict: 'RE', stdout, stderr, ms })
      if (sample.expected === null) return resolve({ verdict: 'AC', stdout, stderr, ms })
      resolve({ verdict: normalize(stdout) === normalize(sample.expected) ? 'AC' : 'WA', stdout, stderr, ms })
    })
  })
}

const excerpt = (text, label, color, limit = 3) => {
  const rows = normalize(text).split('\n')
  if (text.trim() === '') return [line(`  ${label} (なし)`, 2)]
  return rows
    .slice(0, limit)
    .map((row, index) => line(`  ${index === 0 ? label : '    '} ${row}`, color))
    .concat(rows.length > limit ? [line(`      … 他 ${rows.length - limit} 行`, 2)] : [])
}

const running = new Map()

async function check(problem) {
  if (problem.submitting) return
  if (readFileSync(problem.source, 'utf8') === template) {
    problem.status = 'blank'
    problem.body = [line('未着手', 2)]
    return render()
  }
  if (running.has(problem.letter)) return running.get(problem.letter).then(() => check(problem))

  const task = (async () => {
    problem.status = 'building'
    problem.body = [line('build...', 33)]
    render()

    const built = await exec('esbuild-nix', [
      problem.source,
      '--bundle',
      `--outfile=${problem.bundle}`,
      '--platform=node',
      '--format=esm',
      '--target=node22',
      '--tree-shaking=true',
      '--log-level=error',
    ])
    if (built.status !== 0) {
      problem.status = 'CE'
      problem.body = [
        line('ビルドエラー', 31),
        ...built.output
          .trim()
          .split('\n')
          .map((row) => line(row, 0)),
      ]
      return render()
    }

    problem.status = 'running'
    problem.body = problem.samples.map((sample) => line(`${VERDICT.pending.mark} sample-${sample.name}`, 2))
    render()

    let worst = 'AC'
    let passed = 0
    const body = []
    for (const [index, sample] of problem.samples.entries()) {
      problem.body = [...body, line(`${VERDICT.running.mark} sample-${sample.name}`, 33)]
      render()
      const { verdict, stdout, stderr, ms } = await runSample(problem, sample)
      const style = VERDICT[verdict]
      body.push(line(`${style.mark} sample-${sample.name}  ${ms}ms`, style.color))
      if (verdict === 'AC') passed++
      else {
        if (worst === 'AC') worst = verdict
        if (verdict === 'WA') {
          body.push(...excerpt(sample.expected ?? '', '期待', 2))
          body.push(...excerpt(stdout, '出力', 31))
        } else if (stderr.trim()) {
          body.push(...excerpt(stderr, verdict === 'TLE' ? '途中' : 'err', 35, 4))
        }
      }
      problem.body = [
        ...body,
        ...problem.samples.slice(index + 1).map((rest) => line(`${VERDICT.pending.mark} sample-${rest.name}`, 2)),
      ]
      render()
    }

    problem.status = problem.samples.length === 0 ? 'pending' : worst
    problem.body = [line(`${passed}/${problem.samples.length} AC`, STATUS_COLOR[problem.status]), ...body]
    render()
  })()

  running.set(problem.letter, task)
  await task
  running.delete(problem.letter)
}

// ---------- 提出 ----------

async function submit(problem) {
  problem.submitting = true
  problem.body = [line('提出中...', 33)]
  render()
  // oj submit は AtCoder のページ変更で壊れているため、提出フォームを直接叩くヘルパーを使う
  const args = ['scripts/submit-atcoder.py', problem.url, problem.bundle]
  const log = []
  const { status } = await exec('python3', args, (row) => {
    const text = row.replace(/^\w+:[\w.]+:/, '').trim()
    if (text) log.push(line(text, /error/i.test(text) ? 31 : 0))
    problem.body = log.slice(-40)
    render()
  })
  if (status !== 0) log.push(line(`提出に失敗しました (exit ${status})`, 31))
  problem.body = log.slice(-40)
  problem.submitting = false
  render()
}

// ---------- 描画 ----------

let problems = []
let selected = 0
let confirming = false
let renderQueued = false

const render = () => {
  if (renderQueued) return
  renderQueued = true
  setTimeout(draw, 16)
}

function draw() {
  renderQueued = false
  const columns = process.stdout.columns || 120
  const rows = process.stdout.rows || 30
  const fits = Math.max(1, Math.floor((columns - 1) / MIN_PANE))
  const shown = Math.min(problems.length, fits)
  const start = Math.min(Math.max(0, selected - (shown - 1)), Math.max(0, problems.length - shown))
  const visible = problems.slice(start, start + shown)
  const width = Math.max(MIN_PANE, Math.floor((columns - 1) / shown))
  const inner = width - 3
  const height = Math.max(4, rows - 5)

  const done = problems.filter((problem) => problem.status === 'AC').length
  const active = problems.filter((problem) => problem.status !== 'blank').length
  const hidden = problems.length - shown
  const out = [
    `${paint(1, contest)}  ${paint(32, `${done}/${active} AC`)}${hidden > 0 ? paint(2, `  (+${hidden}問は画面外)`) : ''}`,
  ]

  const cap = (corners, withLabel) =>
    visible
      .map((problem, index) => {
        const label = withLabel ? ` ${problem.letter} ${STATUS_LABEL[problem.status]} ` : ''
        const fill = Math.max(0, width - 4 - widthOf(label))
        const bar = `${corners[0]}─${label}${'─'.repeat(fill)}${corners[1]}`
        return `${paint(start + index === selected ? '1;36' : 2, bar)} `
      })
      .join('')

  out.push(cap('╭╮', true))
  for (let row = 0; row < height; row++) {
    out.push(
      visible
        .map((problem, index) => {
          const edge = paint(start + index === selected ? '1;36' : 2, '│')
          const content = problem.body[row]
          return `${edge}${content ? paint(content.color, fit(content.text, inner)) : ' '.repeat(inner)}${edge} `
        })
        .join(''),
    )
  }
  out.push(cap('╰╯', false))

  const current = problems[selected]
  out.push('')
  if (confirming && current) {
    const warn = current.status === 'AC' ? 32 : 31
    out.push(
      `${paint(warn, `${current.letter} (${current.status})`)} を提出しますか?  ${paint(1, 'y')} で提出 / ${paint(1, 'n')} で中止  ${paint(2, current.url)}`,
    )
  } else {
    out.push(paint(2, `${problems.map((p) => p.letter).join('')}: 選択   s: 提出   r: 全再実行   q: 終了`))
  }

  process.stdout.write(`\x1b[H${out.map((row) => `${row}\x1b[K`).join('\n')}\n\x1b[J`)
}

// ---------- 監視と入力 ----------

const checkAll = () => problems.reduce((chain, problem) => chain.then(() => check(problem)), Promise.resolve())

function watchFiles() {
  let timer = null
  const pending = new Set()
  const flush = () => {
    timer = null
    const changed = [...pending]
    pending.clear()
    if (changed.includes('*')) return checkAll()
    for (const letter of changed) {
      const problem = problems.find((item) => item.letter === letter)
      if (problem) check(problem)
    }
  }
  const queue = (key) => {
    pending.add(key)
    if (timer) clearTimeout(timer)
    timer = setTimeout(flush, 150)
  }
  watch(contestDir, { recursive: true }, (_event, file) => {
    const letter = file?.split(/[/\\]/)[0]
    if (file?.endsWith('main.ts') && problems.some((problem) => problem.letter === letter)) queue(letter)
  })
  watch('src', { recursive: true }, (_event, file) => {
    if (file?.endsWith('.ts')) queue('*')
  })
}

problems = await setup()

process.stdout.write('\x1b[?1049h\x1b[?25l')
process.on('exit', () => process.stdout.write('\x1b[?25h\x1b[?1049l'))
process.on('SIGINT', () => process.exit(0))
process.stdout.on('resize', render)

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (key) => {
    if (confirming) {
      confirming = false
      if (key === 'y') submit(problems[selected])
      return render()
    }
    if (key === 'q' || key === '\x03') process.exit(0)
    if (key === 'r') return checkAll()
    if (key === 's') {
      const target = problems[selected]
      // 未着手・ビルド失敗・テスト実行中は、bundle が無い/古いので提出させない
      confirming = Boolean(target) && existsSync(target.bundle) && !running.has(target.letter)
      return render()
    }
    if (key === '\x1b[C' || key === '\x1b[B') selected = Math.min(selected + 1, problems.length - 1)
    else if (key === '\x1b[D' || key === '\x1b[A') selected = Math.max(selected - 1, 0)
    else {
      const index = problems.findIndex((problem) => problem.letter === key)
      if (index >= 0) selected = index
    }
    render()
  })
}

watchFiles()
await checkAll()
