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

::: tip
这里的静态变量区是我自己定义的名称，下面的静态变量泛指`static`修饰的局部变量可能在其他书籍、博客不会这么叫。静态变量区域不仅包括`static`修饰的变量，还包括全局变量。全局变量也有静态的意义，无法改变大小。所以我认为这一部分可以叫做静态变量区域。

`const`修饰的静态变量不属于这一部分。
:::

程序可以管理三类内存：静态、自动和动态。静态内存的地址在程序运行前就固定好的。自动内存是程序运行时自动分配、清理，例如函数里的局部变量，它是分配在栈当中的。动态内存是运行是动态的分配、清理，它与自动内存的区别是需要在代码中管理内存；自动内存不需要我们在代码中关心分配与释放。

## 内存的申请与释放

申请内存使用`malloc/calloc`，释放使用`free`。我们看一个案例：

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

这里的`buf`长度是由用户输入的，也就是程序运行时**动态分配**内存。这样也实现了可变长数组的需求，不像VLA，所有编译器通用。因此，这种方式也叫做动态内存分配。

除了用它分配数组，也可以分配其他数据类型，`malloc/calloc`返回值的类型是`void *`，也就是说，它可以转换成任何你想要的数据类型：

``` C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char name[20];
    int age;
} student_t;

int main() {
    student_t *stu1;
    stu1 = (student_t *)malloc(sizeof(student_t));

    strcpy(stu1->name, "John");
    stu1->age = 18;

    printf("Name: %s, age: %d\n", stu1->name, stu1->age);

    free(stu1);

    return 0;
}

```

运行结果：

``` bash
Name: John, age: 18

```

除了`malloc`，`calloc`也可以申请内存。`calloc`在申请内存的时候会将分配的内存清零：

``` C
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *buf;

    buf = (int *)malloc(10 * sizeof(int));

    puts("First alloc: ");
    for (int i = 0; i < 10; i++) {
        printf("%d\t", buf[i]);
    }
    putchar('\n');
    free(buf);

    buf = (int *)calloc(10, sizeof(int));
    puts("Second alloc (Use calloc): ");
    for (int i = 0; i < 10; i++) {
        printf("%d\t", buf[i]);
    }
    putchar('\n');
    free(buf);

    return 0;
}

```

运行结果：

``` bash
First alloc:
-1942658960     571     -1942683312     571     1952534528      977550696       1986348124      1886350437      1952795228      1767993922
Second alloc (Use calloc):
0       0       0       0       0       0       0       0       0       0
```

可以看到，如果使用`malloc`分配内存，内存区域的数据是随机的；而使用`calloc`会帮我们把内存区域清零。

需要注意的是，`malloc`的参数是传入要分配的内存大小（以字节为单位），而`calloc`有两个参数：第一个参数是要分配成员的个数（单位不是字节！）；第二个参数是单个成员的大小，也就是，总共分配的内存大小(字节) = 成员个数(参数1) * 单个成员大小(参数2)。

`calloc`实际上就是先`malloc`，然后在`memset`成零。下面是FreeRTOS中的`calloc`代码：

``` C
/* https://github.com/FreeRTOS/FreeRTOS-Kernel/blob/dbf70559b27d39c1fdb68dfb9a32140b6a6777a0/portable/MemMang/heap_4.c#L424C1-L441C2 */
void * pvPortCalloc( size_t xNum,
                     size_t xSize )
{
    void * pv = NULL;

    if( heapMULTIPLY_WILL_OVERFLOW( xNum, xSize ) == 0 )
    {
        pv = pvPortMalloc( xNum * xSize );

        if( pv != NULL )
        {
            ( void ) memset( pv, 0, xNum * xSize );
        }
    }

    return pv;
}
```

如果`malloc/calloc`返回`NULL`，则代表没有足够的内存可以分配。当然返回`NULL`可能不是简单地内存不足，还有可能是内存泄漏。

## 申请长度为零的内存

占位

## 常见问题

虽然上面的用法看起来很简单，先分配，用完释放。但在实际的程序中，尤其是复杂项目中，很容易产生问题。下面是一些非常容易犯的错误：

### 不检查是否分配失败

上面讲了，内存空间不足会返回`NULL`，因此我们在分配完后需要检查有没有分配成功。如果不检查直接操作，就是直接操作空指针，操作空指针是不允许的：

``` C
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main() {
    int *buf = (int *)malloc(INTPTR_MAX);

    printf("buf = %p\n", buf);
    buf[0] = 1;

    return 0;
}

```

运行结果：

``` bash
buf = (nil)
Segmentation fault
```

::: tip
`INTPTR_MAX`是平台指针的最大值，在 32 位机上它是0xFFFFFFFF（32位无符号整数最大值）；在 64 位机上它是0xFFFFFFFFFFFFFFFF（64位无符号整数最大值）。
:::