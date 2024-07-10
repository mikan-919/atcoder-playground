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

S=input_str()
i=0
for s in S:
  if s=="+":
    i+=1
  else:
    i-=1

print(i)