import './extends'

import { readLine, readLines, readMatrix, readNumberLines, readNumbers } from './stdin'
import { no, put, putArray, yes } from './stdout'
import { range } from './utils/utils'

const [N]=readNumbers()
const A=readNumbers()
const [X]=readNumbers()

A.includes(X)?yes():no()