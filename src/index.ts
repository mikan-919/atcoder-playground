import { input, inputs, num, str } from './stdin'
import { No, print, Yes } from './stdout'
import { memorize } from './utils'
import './extends'
import { exit } from 'node:process'
function isIndexOutOfBounds(index: number, len: number): boolean {
  return index < 0 || index >= len;
}
async function main() {
  const lines = input()
  const [H, W, X, Y] = lines[0].terms(num)
  const S = lines.slice(1, H).map(e => [...e])
  const T: ('U' | 'D' | 'L' | 'R')[] = [...lines[H + 1]]
  let house = 0
  const cord = [X - 1, Y - 1]
  for (const t of T) {
    if (t === 'U') {
      if (isIndexOutOfBounds(cord[0] - 1, H) || isIndexOutOfBounds(cord[1], W)) continue
      if (S[cord[0] - 1][cord[1]] !== '#') {

        cord[0]--
        if (S[cord[0]][cord[1]] === '@') {
          S[cord[0]][cord[1]] = '.'
          house++
        }
      }
    } else if (t === 'D') {
      if (isIndexOutOfBounds(cord[0] + 1, H) || isIndexOutOfBounds(cord[1], W)) continue
      if (S[cord[0] + 1][cord[1]] !== '#') {

        cord[0]++
        if (S[cord[0]][cord[1]] === '@') {
          S[cord[0]][cord[1]] = '.'
          house++
        }
      }
    } else if (t === 'L') {
      if (isIndexOutOfBounds(cord[0], H) || isIndexOutOfBounds(cord[1] - 1, W)) continue
      if (S[cord[0]][cord[1] - 1] !== '#') {

        cord[1]--
        if (S[cord[0]][cord[1]] === '@') {
          S[cord[0]][cord[1]] = '.'
          house++
        }
      }
    } else if (t === 'R') {
      if (isIndexOutOfBounds(cord[0], H) || isIndexOutOfBounds(cord[1] + 1, W)) continue
      if (S[cord[0]][cord[1] + 1] !== '#') {

        cord[1]++
        if (S[cord[0]][cord[1]] === '@') {
          S[cord[0]][cord[1]] = '.'
          house++
        }
      }
    }
  }
  print(...cord.map(e => e + 1), house)
}

main()
