import { readLines, readNumbers } from '../../../src/stdin'
import { put } from '../../../src/stdout'

const [h, w, k] = readNumbers()
const grid = readLines(h)

// 行・列ごとの爆弾の有無
const rowBomb = new Uint8Array(h)
const colBomb = new Uint8Array(w)
for (let i = 0; i < h; i++) {
  const s = grid[i]
  for (let j = 0; j < w; j++) {
    if (s.charCodeAt(j) === 35) {
      rowBomb[i] = 1
      colBomb[j] = 1
    }
  }
}

// 安全な空マスを始点とする多始点BFS
const dist = new Int32Array(h * w).fill(-1)
const queue = new Int32Array(h * w)
let head = 0
let tail = 0
for (let i = 0; i < h; i++) {
  if (rowBomb[i]) continue
  for (let j = 0; j < w; j++) {
    if (colBomb[j]) continue
    dist[i * w + j] = 0
    queue[tail++] = i * w + j
  }
}

let answer = tail
while (head < tail) {
  const v = queue[head++]
  if (dist[v] === k) continue
  const i = (v / w) | 0
  const j = v - i * w
  if (i > 0 && dist[v - w] === -1 && grid[i - 1].charCodeAt(j) !== 35) {
    dist[v - w] = dist[v] + 1
    queue[tail++] = v - w
    answer++
  }
  if (i + 1 < h && dist[v + w] === -1 && grid[i + 1].charCodeAt(j) !== 35) {
    dist[v + w] = dist[v] + 1
    queue[tail++] = v + w
    answer++
  }
  if (j > 0 && dist[v - 1] === -1 && grid[i].charCodeAt(j - 1) !== 35) {
    dist[v - 1] = dist[v] + 1
    queue[tail++] = v - 1
    answer++
  }
  if (j + 1 < w && dist[v + 1] === -1 && grid[i].charCodeAt(j + 1) !== 35) {
    dist[v + 1] = dist[v] + 1
    queue[tail++] = v + 1
    answer++
  }
}

put(answer)
