import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { hasSampleFiles, replaceSampleDirectory, runnableSampleFiles, samplesAreFrom } from './contest-data.mjs'
import { handoffSubmit } from './handoff.mjs'

const [, , command, argument] = process.argv
const output = 'dist/Main.js'
const currentFile = '.current-problem'

function run(program, args, options = {}) {
  const { allowFailure = false, ...spawnOptions } = options
  const result = spawnSync(program, args, { stdio: 'inherit', ...spawnOptions })
  if (result.error?.code === 'ENOENT') {
    if (allowFailure) return result
    console.error(`エラー: ${program} が見つかりません。README のセットアップ手順を確認してください。`)
    process.exit(127)
  }
  if (result.status !== 0 && !allowFailure) process.exit(result.status ?? 1)
  return result
}

function parseProblem(value) {
  const urlMatch = value?.match(/^https:\/\/atcoder\.jp\/contests\/([^/]+)\/tasks\/([^/?#]+)\/?$/)
  if (urlMatch) {
    const [, contest, taskId] = urlMatch
    const task = taskId.startsWith(`${contest}_`) ? taskId.slice(contest.length + 1) : taskId
    return { contest, task, taskId, url: value.replace(/\/$/, '') }
  }

  const shortMatch = value?.match(/^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/)
  if (!shortMatch) return null
  const [, contest, task] = shortMatch
  const taskId = task.startsWith(`${contest}_`) ? task : `${contest}_${task}`
  return { contest, task, taskId, url: `https://atcoder.jp/contests/${contest}/tasks/${taskId}` }
}

function problemFromArgument() {
  const value = argument ?? (existsSync(currentFile) ? readFileSync(currentFile, 'utf8').trim() : '')
  const problem = parseProblem(value)
  if (!problem) {
    console.error('問題を「abc472/a」またはAtCoderの問題URLで指定してください。')
    console.error(`例: bun run ${command} -- abc472/a`)
    process.exit(2)
  }
  return problem
}

function paths(problem) {
  const directory = join('solutions', problem.contest, problem.task)
  return { directory, source: join(directory, 'main.ts'), tests: join(directory, 'test') }
}

function select(problem) {
  writeFileSync(currentFile, `${problem.url}\n`)
}

function ensureSource(problem) {
  const { source } = paths(problem)
  if (existsSync(source)) return false
  mkdirSync(dirname(source), { recursive: true })
  copyFileSync('template/main.ts', source)
  console.log(`作成: ${source}`)
  return true
}

function downloadSamples(problem) {
  const { directory, tests } = paths(problem)
  mkdirSync(directory, { recursive: true })
  const temporary = mkdtempSync(join(directory, '.test-download-'))
  let failure = null
  try {
    const result = run('oj', ['download', problem.url, '--directory', temporary], { allowFailure: true })
    if (result.error?.code === 'ENOENT') failure = { status: 127, message: 'oj が見つかりません。' }
    else if (result.status !== 0) failure = { status: result.status ?? 1, message: 'サンプル取得に失敗しました。' }
    else if (!hasSampleFiles(temporary)) failure = { status: 1, message: 'サンプルが1件も取得されませんでした。' }
    else replaceSampleDirectory(tests, temporary, problem.url)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }

  if (failure) {
    console.error(`${failure.message} AtCoderへのログインは bun run login で更新できます。`)
    process.exit(failure.status)
  }
}

function build(problem, watch = false) {
  const { source } = paths(problem)
  if (!existsSync(source)) {
    console.error(`${source} がありません。先に bun run new -- ${problem.contest}/${problem.task} を実行してください。`)
    process.exit(2)
  }
  const args = [
    source,
    '--bundle',
    `--outfile=${output}`,
    '--platform=node',
    '--format=esm',
    '--target=node22',
    '--tree-shaking=true',
  ]
  if (watch) args.push('--watch')
  run('esbuild-nix', args)
}

switch (command) {
  case 'new': {
    const problem = problemFromArgument()
    const created = ensureSource(problem)
    select(problem)
    const { tests } = paths(problem)
    if (!samplesAreFrom(tests, problem.url)) downloadSamples(problem)
    console.log(`${problem.contest}/${problem.task} を選択しました${created ? '' : '（既存ファイルは保持）'}。`)
    break
  }
  case 'download': {
    const problem = problemFromArgument()
    ensureSource(problem)
    select(problem)
    downloadSamples(problem)
    break
  }
  case 'dev': {
    const problem = problemFromArgument()
    ensureSource(problem)
    select(problem)
    const { source, tests } = paths(problem)
    if (!samplesAreFrom(tests, problem.url)) downloadSamples(problem)
    console.log(`${problem.contest}/${problem.task} を監視します。終了するには Ctrl-C を押してください。`)
    run('watchexec', [
      '--clear',
      '--restart',
      '--watch',
      source,
      '--watch',
      'src',
      '--exts',
      'ts',
      '--',
      'node',
      'scripts/atcoder.mjs',
      'test',
      problem.url,
    ])
    break
  }
  case 'build': {
    const problem = problemFromArgument()
    select(problem)
    build(problem)
    break
  }
  case 'test': {
    const problem = problemFromArgument()
    select(problem)
    const { tests } = paths(problem)
    if (!samplesAreFrom(tests, problem.url)) downloadSamples(problem)
    const sampleFiles = runnableSampleFiles(tests)
    if (sampleFiles.length === 0) {
      console.log(`${tests} に実行できるサンプルがありません。`)
      break
    }
    build(problem)
    run('oj', [
      'test',
      '--command',
      `node ${output}`,
      '--directory',
      tests,
      '--display-mode',
      'diff',
      ...sampleFiles.map((file) => join(tests, file)),
    ])
    break
  }
  case 'run': {
    const problem = problemFromArgument()
    select(problem)
    build(problem)
    run('node', [output])
    break
  }
  case 'submit': {
    const problem = problemFromArgument()
    select(problem)
    build(problem)
    const { url, copied, opened } = handoffSubmit(problem.url, output)
    console.log(copied ? `${output} をクリップボードにコピーしました。` : 'クリップボードにコピーできませんでした。')
    console.log(opened ? `提出ページを開きました: ${url}` : `提出ページ: ${url}`)
    console.log('貼り付けて提出してください（AtCoderの提出はCloudflare Turnstileで保護されています）。')
    break
  }
  case 'watch': {
    const problem = problemFromArgument()
    select(problem)
    build(problem, true)
    break
  }
  default:
    console.error('usage: node scripts/atcoder.mjs <new|download|dev|build|test|run|submit|watch> [abc472/a|URL]')
    process.exit(2)
}
