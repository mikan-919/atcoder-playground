import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'

const user = process.env.ATCODER_USER ?? 'mikan919'
const target = Number(process.argv[2] ?? 550)
const cache = '.cache/problem-models.json'
const agent = { 'User-Agent': `atcoder-playground (${user})` }

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { headers: agent, ...options })
  if (!response.ok) throw new Error(`${url} が ${response.status} を返しました`)
  return response.json()
}

// difficulty は滅多に変わらないので1日キャッシュする
async function difficulties() {
  const fresh = existsSync(cache) && Date.now() - statSync(cache).mtimeMs < 86_400_000
  if (fresh) return JSON.parse(readFileSync(cache, 'utf8'))
  const models = await fetchJson('https://kenkoooo.com/atcoder/resources/problem-models.json')
  mkdirSync('.cache', { recursive: true })
  writeFileSync(cache, JSON.stringify(models))
  return models
}

async function solved() {
  const submissions = await fetchJson(
    `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${user}&from_second=0`,
  )
  return new Set(submissions.filter((s) => s.result === 'AC').map((s) => s.problem_id))
}

const [models, ac] = await Promise.all([difficulties(), solved()])

const rows = []
for (let n = 250; n < 1000; n++) {
  const diff = (letter) => models[`abc${n}_${letter}`]?.difficulty
  const [a, b, c, d] = ['a', 'b', 'c', 'd'].map(diff)
  if ([a, b, c, d].some((value) => value == null)) continue
  if (d < target - 150 || d > target + 150 || c > 350) continue
  // D まで解き終わっている回と、手元に持ってきてある回は出さない
  if (['a', 'b', 'c', 'd'].every((letter) => ac.has(`abc${n}_${letter}`))) continue
  if (existsSync(`solutions/abc${n}`)) continue
  rows.push({ n, a, b, c, d })
}

rows.sort((x, y) => Math.abs(x.d - target) - Math.abs(y.d - target) || y.n - x.n)

if (rows.length === 0) {
  console.log(`D が ${target}±150 の未着手コンテストが見つかりませんでした。目標値を変えてください。`)
} else {
  console.log(`${user} が未AC、D が ${target}±150、C が 350 以下のコンテスト:\n`)
  console.log('contest        A     B     C     D')
  for (const r of rows.slice(0, 8)) {
    console.log(`abc${r.n}  ${String(r.a).padStart(6)}${String(r.b).padStart(6)}${String(r.c).padStart(6)}${String(r.d).padStart(6)}`)
  }
  console.log(`\n候補 ${rows.length} 件。 bun run contest abc${rows[0].n} で開始できます。`)
}
