# 函数调用约定

> [关于调用约定(cdecl、fastcall、stcall、thiscall) 的一点知识 - 风雪之隅](https://www.laruence.com/2008/04/01/116.html)
>
> [Calling convention - Wikipedia](https://en.wikipedia.org/wiki/Calling_convention)
>
> [Calling Conventions | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/cpp/calling-conventions?view=msvc-170) 

函数调用约定是指一个函数调用另一个函数参数传递方式以及返回结果方式的约定。他主要规定：

- 参数如何压栈
- 调用前谁来压栈，调用后谁来清栈
- 返回值如何返回

常见的调用约定有:

- `stdcall`
- `cdecl`
- `fastcall`
- `thiscall`
- `nakedcall`

下面的内容需要一点x86和ARM汇编的知识。可参照：[X86汇编基础 - Hackeyes | Hackeye](https://hackeyes.github.io/2021/04/22/X86%E6%B1%87%E7%BC%96%E5%9F%BA%E7%A1%80/), [arm汇编语言学习笔记 | 安和桥南丶的博客](https://chan-shaw.github.io/2020/03/20/arm%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)