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

def main(S,T):
  length=len(S)
  S=list(S)
  for i in range(length):
    if "".join(S) ==T:
      return "Yes"
    S.insert(0,S[-1]) 
    S.pop(-1)
  return "No"

result=main(input_str(),input_str())
print(result)