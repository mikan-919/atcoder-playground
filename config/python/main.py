def input_num()->int:
  return int(input())
def input_nums()->list[int]:
  inputs=list(map(int,input().split()))
  return inputs

def input_str()->str:
  return input()
def input_strs()->list[str]:
  return input().split()

### == == == == == Pre Lib == == == == == ###