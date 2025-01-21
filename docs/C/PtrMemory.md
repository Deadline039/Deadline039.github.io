# 内存管理

> C大师 233-238
>
> [Memory Allocation | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-runtime-library/memory-allocation?view=msvc-170)
>
> [C dynamic memory allocation - Wikipedia](https://en.wikipedia.org/wiki/C_dynamic_memory_allocation)
>
> [Memory Layout of C Programs - GeeksforGeeks](https://www.geeksforgeeks.org/memory-layout-of-c-program/)

数组是静态的，它不可以自由的改变大小。在使用数组的时候需要预先估计它的大小，否则可能会造成空间太大浪费，或者空间不够。所以，单纯依靠数组是无法满足日益复杂的程序的。要解决这个问题，就需要用到动态内存分配。

## 内存布局

一个典型的C语言程序内存布局如下：

![内存布局](/C/memory-layout.svg)

可以看到，一个C程序内存大概可以分为五个部分：

- 程序段
- 初始化的数据段
- 未初始化的数据段
- 栈
- 堆

一个程序在运行之前，需要操作系统将程序文件加载在内存中，然后设置命令行参数和环境变量。

运行时，程序先会将全局变量初始化（初始化数据段），未初始化的变量（bss）将会清零。

::: note
这里的静态变量区是我自己定义的名称，下面的静态变量泛指`static`修饰的局部变量可能在其他书籍、博客不会这么叫。静态变量区域不仅包括`static`修饰的变量，还包括全局变量。全局变量也有静态的意义，无法改变大小。所以我认为这一部分可以叫做静态变量区域。

`const`修饰的静态变量不属于这一部分。
:::

## 内存的申请与释放

申请内存使用`malloc`，释放使用`free`。我们看一个案例：

``` C
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int length;
    int *buf;
    printf("Please enter the length of the buf: \n");
    scanf("%d", &length);
    buf = (int *)malloc(length * sizeof(int));
    if (buf == NULL) {
        printf("Memory allocation error! \n");
        exit(1);
    }

    printf("Successfully allocated memory! Address: %p \n", buf);
    for (int i = 0; i < length; i++) {
        buf[i] = i + 1;
    }
    for (int i = 0; i < length; i++) {
        printf("buf[%d] = %d\t", i, buf[i]);
    }
    free(buf);

    return 0;
}
```

MinGW-w64编译，运行结果：

``` bash
Please enter the length of the buf:
4
Successfully allocated memory! Address: 000001e9486a14d0
buf[0] = 1      buf[1] = 2      buf[2] = 3      buf[3] = 4
```

这里用户需要输入长度，然后分配`length * sizeof(int)`字节的内存，然后将内存的首地址赋给`buf`指针。这样，`buf`所指向的内存区域就可以给我们使用了。

这样看似
