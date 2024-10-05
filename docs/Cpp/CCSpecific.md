# 如何指定调用约定

在函数名前加`__callName`。例如:
``` C
int __stdcall function(int param1, int param2)
int __cdecl function(int param1, int param2)
int __thiscall function(int param1, int param2)
```