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
N=input_str()
S=0
for n in N:
  S+=float(n)
N=float(N)

if N%S == 0:
  print("Yes")
else:
  # print(f"{S%N:3f}")
  print("No")