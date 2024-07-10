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

def summer(x):
  str_x=str(x)
  res=0
  for s in str_x:
    res+=int(s)
  return res

def snuke(x):
  if summer(x) == 0:
     return 0
  return x/summer(x)

def search_m(n):
    sn=snuke(n)
    m=n+1
    sm=snuke(m)
    while sn < sm:
        m+=1
        sm=snuke(m)
    return m

K=input_num()
n=0
for i in range(K):
    n=search_m(n)
    print(n)
    
