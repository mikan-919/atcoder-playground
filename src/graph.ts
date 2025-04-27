import { range } from './utils'

class UnionFindTree {
  parents: number[]
  ranks: number[]
  n: number
  constructor(n: number) {
    this.n = n
    this.parents = range(n)
    this.ranks = new Array(n).fill(0)
    // console.log(this.parents)
  }

  find(this:this,x: number) {
    if (this.parents[x] === x) return x
    // 経路圧縮: 親をたどる途中で、通ったノードの親を直接根につなぎ替える
    this.parents[x] = this.find(this.parents[x])
    return this.parents[x]
  }

  union(x: number, y: number) {
    const rootX = this.find(x)
    const rootY = this.find(y)

    if (rootX !== rootY) {
      if (this.ranks[rootX] < this.ranks[rootY]) {
        this.parents[rootX] = rootY
      } else if (this.ranks[rootX] > this.ranks[rootY]) {
        this.parents[rootY] = rootX
      } else {
        this.parents[rootY] = rootX
        this.ranks[rootX]++
      }
    }
    return this
  }

  same(x: number, y: number) {
    return this.find(x) === this.find(y)
  }

  get groupCount() {
    const roots = new Set()
    for (const i of range(this.n)) {
      roots.add(this.find(i))
    }
    return roots.size
  }

  unionPairs(this: this, pairs: [number, number][]) {
    for (const [x, y] of pairs) {
      this.union(x, y)
    }
    return this
  }
}

export function UFT(n: number) {
  return new UnionFindTree(n)
}
