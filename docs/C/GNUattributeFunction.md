# 设置函数属性

> [GCCによる関数の属性(__attribute__)について調べてみた](https://blueeyes.sakura.ne.jp/2018/01/10/761/)
>
> [compiler errors - Is __attribute__((nonnull)) standardized in C - Stack Overflow](https://stackoverflow.com/questions/45237148/is-attribute-nonnull-standardized-in-c)
>
> [Arm Compiler for Embedded Reference Guide](https://developer.arm.com/documentation/101754/0622/armclang-Reference/Compiler-specific-Function--Variable--and-Type-Attributes?lang=en)


## 设置弱定义函数

声明格式为`__attribute__((weak))`。弱定义函数是指的函数可以被重定义，如果函数没有重定义，使用默认的弱函数；如果重定义，使用重定义的函数。

那这有什么用呢？假如我现在写的程序中需要一个`void data_printf(data_t *data)`的一个输出数据函数，客户说他们可能需要自己定义输出格式。这有个问题，我不知道客户会不会写他们的输出函数，我必须有一个默认的输出函数来保证程序可以正常编译不报错。这个问题的解决方法有很多，比如用函数指针等。如果用弱定义，那就非常简单了，我在我的文件中用弱函数定义一个输出函数。客户如果要重定义，直接自己写就可以了，重定义的函数会覆盖掉弱函数，这样即避免了编译问题，又可以让客户自定义：

::: code-group

``` C [MySrc.c]
/* My source file: */
__attribute__((weak)) void data_printf(data_t *data) {
    /* ... */
}
```

``` C [CustomSrc.c]
/* Custom source file: */
extern void data_printf(data_t *data);

/* if Custom want use their format, redefine data_printf function. */
void data_printf(data_t *data) {
    /* Custom format ... */
}
```

:::

需要注意，弱函数和重定义函数需要在不同文件中，在同一个文件中如果同时存在弱函数和同名的重定义函数会报错。从这里可以看出，弱函数是在链接时被移除的。

## 设置非空参数

声明格式为`__attribute__((nonnull)))`。`non null`的意思是非空，那什么会是`NULL`呢？答案是指针。这个属性是用来限制函数传入空指针的，当设置`nonnull`后，某些参数不允许传入空指针，否则会给出警告。

这个属性在一些操作内存的函数中非常有效，比如自定义的`memcpy, memset`等。如果这些函数传入`NULL`指针将会产生非常严重的问题。

``` C
#include <stdio.h>

__attribute__((nonnull(1, 2))) void my_memcpy(void *dst, const void *src,
                                              size_t size) {
    while (size--) {
        *(unsigned char *)dst = *(unsigned char *)src;
        ++dst;
        ++src;
    }
}

int main(void) {
    my_memcpy(NULL, NULL, 10);

    return 0;
}

```

clang编译结果：

``` bash
clang main.c
main.c:13:15: warning: null passed to a callee that requires a non-null argument [-Wnonnull]
   13 |     my_memcpy(NULL, NULL, 10);
      |               ^~~~
D:\Develop\Microsoft Visual Studio\VC\Tools\MSVC\14.38.33130\include\vcruntime.h:235:22: note: expanded from macro 'NULL'
  235 |         #define NULL ((void *)0)
      |                      ^~~~~~~~~~~
main.c:13:21: warning: null passed to a callee that requires a non-null argument [-Wnonnull]
   13 |     my_memcpy(NULL, NULL, 10);
      |                     ^~~~
D:\Develop\Microsoft Visual Studio\VC\Tools\MSVC\14.38.33130\include\vcruntime.h:235:22: note: expanded from macro 'NULL'
  235 |         #define NULL ((void *)0)
      |                      ^~~~~~~~~~~
2 warnings generated.
```

它只能检查编译时代码中传入的空指针，无法检查运行时变量是否为空指针。代码在运行时变量的值是不确定的，所以没办法检查运行时的空指针。

## 设置不返回函数

声明格式为`__attribute__((noreturn))`。在某些情况下，函数是不可以返回的。比如发送错误以后需要在错误处理函数中卡死，不能继续执行，否则会发生不可预料的结果。例如内存分配失败返回空指针后就不可以继续执行了，需要用户去手动排查为什么内存分配失败。这时候错误处理函数就可以设置不返回，错误处理函数时如果返回则编译会抛出警告：

``` C
#include <stdio.h>

__attribute__((noreturn)) void error_handle(void) {
    printf("Error occurred! \r\n");
}

int main(int argc, const char *argv[]) {
    error_handle();

    return 0;
}
```
clang编译结果：

``` bash
clang main.c
main.c:5:5: warning: function 'error_handle' declared 'noreturn' should not return [-Winvalid-noreturn]
    5 | }
      | ^
1 warning generated.
```

假如我们把`error_handle()`函数写个死循环，那么它就不会报警告了：

``` C
__attribute__((noreturn)) void error_handle(void) {
    printf("Error occurred");
    while (1)
        ;
}
```

加一个`while (1)`后，它会卡死在这里，不会返回。