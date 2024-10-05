# 整数

> [Storage of basic types | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-language/storage-of-basic-types?view=msvc-170)
> 
> C大师 022-031

整数可谓是在程序中最常用的一种数据类型。但是，整数是有范围的，如果超出了其存储范围就会溢出。

为什么整数会溢出，举个例子。下面这种机械计数的跳绳用过吧。当我们跳了999下后，再跳一下就会变成000，千位的1丢失了。

![跳绳](/Cpp/overflow-1.png)

在计算机里也一样，`uint8_t`占用8个二进制位，当到255即二进制`1111 1111`时，继续加1会变成`1 0000 0000`，但是`uint8_t`只有8个二进制位。最高位的1会被舍弃，变成0。

关于整数范围与CPU架构那点破事，参见：「C大师 023.long,long long与CPU架构的那些事儿」

## `stdint.h`

如果要确定一个整数的范围，可以使用`stdint.h`中定义的类型。这个头文件会根据系统平台与CPU架构来确定整数的范围。下面是ARM Clang编译器的`stdint.h`头文件简单介绍：

``` C
/* Copyright (C) ARM Ltd., 1999,2014 */
/* All rights reserved */

/* 省略部分代码注释。。。 */

/* 定义有符号固定宽度整数 */
typedef   signed          char int8_t;
typedef   signed short     int int16_t;
typedef   signed           int int32_t;
typedef   signed       __INT64 int64_t;

/* 定义无符号固定宽度整数 */
typedef unsigned          char uint8_t;
typedef unsigned short     int uint16_t;
typedef unsigned           int uint32_t;
typedef unsigned       __INT64 uint64_t;

/* 定义有符号最小宽度整数 */
typedef   signed          char int_least8_t;
typedef   signed short     int int_least16_t;
typedef   signed           int int_least32_t;
typedef   signed       __INT64 int_least64_t;

/* 定义无符号最小宽度整数 */
typedef unsigned          char uint_least8_t;
typedef unsigned short     int uint_least16_t;
typedef unsigned           int uint_least32_t;
typedef unsigned       __INT64 uint_least64_t;

/* 定义有符号快速整数 */
typedef   signed           int int_fast8_t;
typedef   signed           int int_fast16_t;
typedef   signed           int int_fast32_t;
typedef   signed       __INT64 int_fast64_t;

/* 定义无符号快速整数 */
typedef unsigned           int uint_fast8_t;
typedef unsigned           int uint_fast16_t;
typedef unsigned           int uint_fast32_t;
typedef unsigned       __INT64 uint_fast64_t;

/* 定义int指针 */
#if __sizeof_ptr == 8
typedef   signed       __INT64 intptr_t;
typedef unsigned       __INT64 uintptr_t;
#else
typedef   signed           int intptr_t;
typedef unsigned           int uintptr_t;
#endif

/* 定义平台支持的最大整数类型 */
typedef   signed     __LONGLONG intmax_t;
typedef unsigned     __LONGLONG uintmax_t;

/* 定义有符号数最小值 */
#define INT8_MIN                   -128
#define INT16_MIN                -32768
#define INT32_MIN          (~0x7fffffff)   /* -2147483648 is unsigned */
#define INT64_MIN  __INT64_C(~0x7fffffffffffffff) /* -9223372036854775808 is unsigned */

/* 定义有符号数最大值 */
#define INT8_MAX                    127
#define INT16_MAX                 32767
#define INT32_MAX            2147483647
#define INT64_MAX  __INT64_C(9223372036854775807)

/* 定义无符号数最大值 */
#define UINT8_MAX                   255
#define UINT16_MAX                65535
#define UINT32_MAX           4294967295u
#define UINT64_MAX __UINT64_C(18446744073709551615)

/* 省略fast, least, 指针和最大整数类型的最大值和最小值 */

/* 省略常量整数定义 */

/* end of stdint.h */
```

这个头文件包含了各种条件编译来判断编译器、编译平台、编译C标准以及C++等。

## `inttypes.h`

我们在用`scanf, printf`这类带格式控制符的函数时，`int`类型的整数可以用`%d`，`unsigned int`类型的整数可以用`%u`，那么`int16_t`类型，`int8_t`类型的整数用什么呢？你可能会想，我全用`%d`不就行了？其实还真不行。请看下面代码：

``` C
#include <stdint.h>
#include <stdio.h>

int main(void) {
    int32_t i32_num = 123456789;
    uint8_t i8_num;

    scanf("%d", &i8_num);
    printf("i32_num = %d, i8_num = %d", i32_num, i8_num);

    return 0;
}
```

输入1, 运行结果:

``` bash
>>> 1
i32_num = 117440512, i8_num = 1
```

`scanf`只给`i8_num`赋值了，没有给`i32_num`赋值。但是我们输出`i32_num`却发现值变了，这是为什么呢？那么这其中究竟发送了什么？我们用Debug来探究一下：

我们在内存中定位到的`i8_num`和`i32_num`的位置如下，由于是小端序，所以`i32_num`的十六进制值实际是`0x075bcd15`，也就是我们初始定义的123456789。

![int-overwrite-1.png](/Cpp/int-overwrite-1.png)

接着，`scanf`输入1，继续。

![int-overwrite-2.png](/Cpp/int-overwrite-2.png)

发现什么了？`i32_num`前三字节全部变成0了，这时候`i32_num = 0x07000000 = 117440512(10)`。在64位机上，`int`类型占4字节，也就是说，`%d`输入整数的时候一次会填充四个字节。但是i8_num只占一字节，那么剩下三个字节就会覆盖其他变量的位置，造成上面的问题。

你可能会问，为什么`i32_num`在`i8_num`的后面呢？这是由于栈是向下生长的，也就是从高地址往低地址生长。当`main`函数入栈后按照顺序将局部变量依次进栈，先是`i32_num`，再是`i8_num`，`i32_num`在高地址，`i8_num`在低地址。而我们看内存一般从左往右是低地址到高地址，所以`i32_num`在`i8_num`的后面。

> 地址实际上就是对内存位置的编号。就像你家的门牌号一样，低地址就是编号小的，高地址就是编号大的。我们假如要统计一个社区各家的人口，那么做表的时候自然也会按照门牌号从小到大依次排列。这就跟内存一样的。

因此如果要用格式控制符输入或者输出整数，最好用`inttypes.h`中定义的头文件。`inttypes.h`定义了各种不同宽度整数的格式控制符，因此我们可以安全的输入和输出变量。上面的代码就可以改写成：
``` C
#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>

int main(void) {
    int32_t i32_num = 123456789;
    uint8_t i8_num;

    scanf("%" SCNd8, &i8_num);
    printf("i32_num = %" PRId32 ", i8_num = %" PRId8, i32_num, i8_num);

    return 0;
}
```

可以自行跳转到`inttypes.h`中看看，不算难这里就不多赘述了。

## 整数的隐式类型转换

> [Assignment conversions | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-language/assignment-conversions?view=msvc-170)
>
> C大师 028


首先想一下下面的代码运行结果是什么：
``` C
#include <stdint.h>
#include <stdio.h>
#include <inttypes.h>

int main(void) {
    /* 无符号到有符号 */
    uint16_t u16num_1 = 45024;
    int16_t s16num_1 = u16num_1;
    printf("u16num = %" PRIu16 ", s16num = %" PRId16 "\n", u16num_1, s16num_1);

    /* 大范围到小范围 */
    int32_t s32num_2 = 40328;
    int16_t s16num_2 = s32num_2;
    printf("s32num = %" PRId32 ", s16num = %" PRId16 "\n", s32num_2, s16num_2);

    /* 小范围到无符号大范围 */
    int16_t s16num_3 = -1;
    uint32_t u32num_3 = s16num_3;
    printf("s16num = %" PRId16 ", s32num = %" PRIu32 "\n", s16num_3, u32num_3);

    return 0;
}

```

运行结果

``` bash
u16num = 45024, s16num = -20512
s32num = 40328, s16num = -25208
s16num = -1, s32num = 4294967295
```

没什么多说的，如果理解了上面所说的整数溢出，那么应该很容易理解为什么结果是这样。

除了上述直接赋值的情况，还有一种情况就是两个不同类型的数运算。请看以下代码：

``` C
#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint32_t u32_num = 10;
    int32_t s32_num = -1;

    if (s32_num > u32_num) {
        printf("%d > %u\n", s32_num, u32_num);
    }

    if ((s32_num - u32_num) > 0) {
        printf("signed:     %d - %u = %d\n", s32_num, u32_num,
               (s32_num - u32_num));
        printf("unsigned:   %d - %u = %u\n", s32_num, u32_num,
               (s32_num - u32_num));
    }

    return 0;
}
```

运行结果：
``` bash
-1 > 10
signed:     -1 - 10 = -11
unsigned:   -1 - 10 = 4294967285
```

显然`-1 > 10`在数学上是不成立的，而且第二个if虽然`-1 - 10 = -11 > 0`在数学上也不成立。那这是为什么呢？

这是由于`uint32_t`与`int32_t`运算时，结果会自动变成`uint32_t`，也就是说，第一个`if`虽然在数学上`s32_num > u32_num`，但是计算机在比较的时候第二个数隐式转换成了`uint32_t`，按照二进制补码，-1就是`0xFFFF FFFF`，转换成十进制就是4,294,967,295，显然这么大的数比10大的多，因此计算机认为第一个`if`条件为真。

同样的`uint32_t`与`int32_t`相减的结果也是无符号数，因此第二个`if`在计算机看来是`4294967285 > 0`，而非`-11 > 0`。

上面的类型如果换成`uint16_t, int16_t`，你会发现结果又对了。这是由于隐式类型转换是有顺序的，`char, short`等低类型会被转换成`int`高类型，优先级如下：

```
char, short --> int --> unsigned --> long --> double <-- float
```

具体可参考：[混合运算中不同数据类型之间的隐式转换原则（C语言） - 箐茗 - 博客园](https://www.cnblogs.com/MinPage/p/14117237.html)。
