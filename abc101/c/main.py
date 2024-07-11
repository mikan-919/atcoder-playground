from math import ceil, floor


def input_num()->int:
  return int(input())
def input_nums()->list[str]:
  inputs=list(map(int,input().split()))
  return inputs

def input_str()->str:
  return input()
def input_strs()->list[str]:
  return input().split()

### == == == == == Pre Lib == == == == == ###

N,K=input_nums()
A=input_nums()

print(ceil((N-1)/(K-1)))

#この問題は少し難しかった
#解説を読みました。
#一回の操作でどれくらい進むのか、また初期状態は何なのかということをしっかりと把握することが大事だと思いました。