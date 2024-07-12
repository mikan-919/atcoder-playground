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
inputs=input_nums()
inputs.sort()
cost=0
total=0
for i in inputs:
  if cost==0:
    cost=i
    continue
  total+=abs(i-cost)
  cost=i
print(total)
