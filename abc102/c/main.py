from math import ceil, floor


def input_num() -> int:
    return int(input())


def input_nums() -> list[int]:
    inputs = list(map(int, input().split()))
    return inputs


def input_str() -> str:
    return input()


def input_strs() -> list[str]:
    return input().split()


### == == == == == Pre Lib == == == == == ###
N = input_num()
A = input_nums()
for i in range(len(A)):
    A[i] -= i + 1

A.sort()

if N % 2 == 1:
    b = A[floor(N / 2)]
else:
    halfN = int(N / 2)
    b = int((A[halfN - 1] + A[halfN]) / 2)

for i in range(len(A)):
    A[i] = abs(A[i] - b)

print(sum(A))
