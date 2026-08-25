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

const paint = (code, text) => `\x1b[${code}m${text}\x1b[0m`
const dim = (t) => paint(2, t)
const bold = (t) => paint(1, t)

const STATUS = {
  blank: { mark: '·', color: 2, label: '--' },
  pending: { mark: '·', color: 2, label: '...' },
  running: { mark: '◌', color: 33, label: 'RUN' },
  AC: { mark: '✓', color: 32, label: 'AC' },
  WA: { mark: '✗', color: 31, label: 'WA' },
  RE: { mark: '!', color: 35, label: 'RE' },
  TLE: { mark: '⏱', color: 33, label: 'TLE' },
  CE: { mark: '!', color: 35, label: 'CE' },
}

// ---------- セットアップ（TUI に入る前に普通のログを出す） ----------

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

const exec = (program, args, options = {}) =>
  new Promise((resolve) => {
    const child = spawn(program, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options })
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr?.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', (error) => resolve({ status: 127, stdout, stderr: error.message }))
    child.on('close', (status) => resolve({ status, stdout, stderr }))
  })

function loadSamples(testsDir) {
  if (!existsSync(testsDir)) return []
  return readdirSync(testsDir)
    .filter((file) => file.endsWith('.in'))
    .sort()
    .map((file) => {
      const name = file.slice(0, -3)
      const expectedPath = join(testsDir, `${name}.out`)
      return {
        name: name.replace(/^sample-/, ''),
        inputPath: join(testsDir, file),
        input: readFileSync(join(testsDir, file), 'utf8'),
        expected: existsSync(expectedPath) ? readFileSync(expectedPath, 'utf8') : null,
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
      const { status, stderr } = await exec('oj', ['download', url, '--directory', testsDir, '--silent'])
      process.stdout.write(status === 0 ? ' ok\n' : ` 失敗 (${stderr.trim().split('\n').pop() ?? status})\n`)
    }
    problems.push({
      letter,
      id,
      source,
      testsDir,
      bundle: join('dist', contest, `${letter}.js`),
      samples: loadSamples(testsDir),
      status: readFileSync(source, 'utf8') === template ? 'blank' : 'pending',
      results: new Map(),
      detail: null,
    })
  }
  return problems
}

// ---------- ビルドと実行 ----------

async function buildProblem(problem) {
  const { status, stderr } = await exec('esbuild-nix', [
    problem.source,
    '--bundle',
    `--outfile=${problem.bundle}`,
    '--platform=node',
    '--format=esm',
    '--target=node22',
    '--tree-shaking=true',
    '--log-level=error',
  ])
  return status === 0 ? null : stderr.trim()
}

const normalize = (text) =>
  text
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trimEnd()

function runSample(problem, sample) {
  return new Promise((resolve) => {
    // 解答は /dev/stdin を読むので、パイプではなくサンプルファイルそのものを fd 0 に渡す
    const input = openSync(sample.inputPath, 'r')
    const child = spawn('node', [problem.bundle], { stdio: [input, 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => child.kill('SIGKILL'), 4000)
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('close', (status, signal) => {
      clearTimeout(timer)
      closeSync(input)
      if (signal === 'SIGKILL') return resolve({ verdict: 'TLE', stdout, stderr })
      if (status !== 0) return resolve({ verdict: 'RE', stdout, stderr })
      if (sample.expected === null) return resolve({ verdict: 'AC', stdout, stderr })
      const ok = normalize(stdout) === normalize(sample.expected)
      resolve({ verdict: ok ? 'AC' : 'WA', stdout, stderr })
    })
  })
}

const isBlank = (problem) => readFileSync(problem.source, 'utf8') === template

async function check(problem) {
  problem.detail = null
  if (isBlank(problem)) {
    problem.status = 'blank'
    problem.results.clear()
    return render()
  }
  problem.status = 'running'
  problem.results.clear()
  for (const sample of problem.samples) problem.results.set(sample.name, 'pending')
  render()

  const error = await buildProblem(problem)
  if (error !== null) {
    problem.status = 'CE'
    problem.detail = { title: 'コンパイルエラー', body: error }
    return render()
  }

  let worst = 'AC'
  for (const sample of problem.samples) {
    problem.results.set(sample.name, 'running')
    render()
    const { verdict, stdout, stderr } = await runSample(problem, sample)
    problem.results.set(sample.name, verdict)
    if (verdict !== 'AC' && worst === 'AC') {
      worst = verdict
      problem.detail = {
        title: `sample-${sample.name}: ${verdict}`,
        body: [
          `${dim('入力')}\n${sample.input.trimEnd()}`,
          `${dim('期待')}\n${(sample.expected ?? '').trimEnd()}`,
          `${dim('出力')}\n${stdout.trimEnd() || dim('(なし)')}`,
          stderr.trim() ? `${dim('stderr')}\n${stderr.trim()}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      }
    }
    render()
  }
  problem.status = problem.samples.length === 0 ? 'pending' : worst
  render()
}

// ---------- 描画 ----------

let problems = []
let selected = 0
let renderQueued = false

function render() {
  if (renderQueued) return
  renderQueued = true
  setTimeout(draw, 16)
}

const pad = (text, width) => (text.length >= width ? text.slice(0, width) : text + ' '.repeat(width - text.length))
const cell = (text, width, color) => paint(color, pad(text, width))

function draw() {
  renderQueued = false
  const columns = process.stdout.columns || 100
  const width = Math.max(8, Math.min(14, Math.floor((columns - 2) / Math.max(problems.length, 1))))
  const lines = []

  const done = problems.filter((problem) => problem.status === 'AC').length
  const active = problems.filter((problem) => problem.status !== 'blank').length
  lines.push(`${bold(contest)}  ${done}/${active} AC   ${dim('a-z: 選択  r: 全再実行  q: 終了')}`)
  lines.push('')

  lines.push(`  ${problems.map((p, i) => cell(p.letter, width, i === selected ? '1;36' : '1')).join('')}`)
  lines.push(`  ${problems.map((p) => cell(STATUS[p.status].label, width, STATUS[p.status].color)).join('')}`)

  const rows = Math.max(0, ...problems.map((problem) => problem.samples.length))
  for (let row = 0; row < rows; row++) {
    const line = problems
      .map((problem) => {
        const sample = problem.samples[row]
        if (!sample) return pad('', width)
        const verdict = problem.results.get(sample.name) ?? 'pending'
        const style = STATUS[verdict] ?? STATUS.pending
        return cell(`${style.mark} ${sample.name}`, width, style.color)
      })
      .join('')
    lines.push(`  ${line}`)
  }

  const current = problems[selected]
  lines.push('')
  lines.push(dim('─'.repeat(Math.min(columns - 1, 60))))
  if (current?.detail) {
    lines.push(`${bold(current.letter)} ${paint(31, current.detail.title)}`)
    lines.push(...current.detail.body.split('\n').slice(0, Math.max(4, (process.stdout.rows || 30) - lines.length - 2)))
  } else if (current) {
    lines.push(
      `${bold(current.letter)} ${dim(current.status === 'blank' ? '未着手' : STATUS[current.status].label)}  ${dim(current.source)}`,
    )
  }

  process.stdout.write(`\x1b[H${lines.map((line) => `${line}\x1b[K`).join('\n')}\n\x1b[J`)
}

// ---------- 監視と入力 ----------

function watchFiles(onSourceChange, onLibraryChange) {
  let timer = null
  const pending = new Set()
  const flush = () => {
    timer = null
    const changed = [...pending]
    pending.clear()
    if (changed.includes('*')) return onLibraryChange()
    for (const letter of changed) onSourceChange(letter)
  }
  const queue = (key) => {
    pending.add(key)
    if (timer) clearTimeout(timer)
    timer = setTimeout(flush, 120)
  }
  watch(contestDir, { recursive: true }, (_event, file) => {
    const letter = file?.split(/[/\\]/)[0]
    if (file?.endsWith('main.ts') && problems.some((problem) => problem.letter === letter)) queue(letter)
  })
  watch('src', { recursive: true }, (_event, file) => {
    if (file?.endsWith('.ts')) queue('*')
  })
}

const checkAll = () => problems.reduce((chain, problem) => chain.then(() => check(problem)), Promise.resolve())

function restore() {
  process.stdout.write('\x1b[?25h\x1b[?1049l')
}

const problemList = await setup()
problems = problemList
selected = 0

process.stdout.write('\x1b[?1049h\x1b[?25l')
process.on('exit', restore)
process.on('SIGINT', () => process.exit(0))
process.stdout.on('resize', render)

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (key) => {
    if (key === 'q' || key === '\x03') process.exit(0)
    else if (key === 'r') checkAll()
    else {
      const index = problems.findIndex((problem) => problem.letter === key)
      if (index >= 0) {
        selected = index
        render()
      }
    }
  })
}

watchFiles(
  (letter) => check(problems.find((problem) => problem.letter === letter)),
  () => checkAll(),
)

await checkAll()
