# 设置变量属性

## 设置内存对齐

> [Arm Compiler for Embedded Reference Guide - __attribute__((packed)) variable attribute](https://developer.arm.com/documentation/101754/0622/armclang-Reference/Compiler-specific-Function--Variable--and-Type-Attributes/--attribute----packed---variable-attribute)
>
> [Arm Compiler for Embedded Reference Guide - __attribute__((aligned)) variable attribute](https://developer.arm.com/documentation/101754/0622/armclang-Reference/Compiler-specific-Function--Variable--and-Type-Attributes/--attribute----aligned---variable-attribute)

`__attribute((packed))`可以取消对齐，按照实际的成员大小对齐内存地址。阅读以下的代码：

``` C
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

typedef struct foo {
    uint8_t member1;
    int8_t member2;
    uint32_t member3;
    uint16_t member4;
    uint64_t member5;
}  __attribute__((packed)) foo_t;

int main(void) {
    printf("sizeof foo_t: %zu\n", sizeof(foo_t));
    printf("offset of member1: %zu\n", offsetof(foo_t, member1));
    printf("offset of member2: %zu\n", offsetof(foo_t, member2));
    printf("offset of member3: %zu\n", offsetof(foo_t, member3));
    printf("offset of member4: %zu\n", offsetof(foo_t, member4));
    printf("offset of member5: %zu\n", offsetof(foo_t, member5));
}
```

运行结果：

``` C
sizeof foo_t: 16
offset of member1: 0
offset of member2: 1
offset of member3: 2
offset of member4: 6
offset of member5: 8

```

我们可以看到结构体后加`__attribute((packed))`后取消了内存对齐，所有成员在内存里都是连续的，偏移量不是对齐数的整数倍。

`__attribute__((align(n)))`是设置内存对齐，也就是说变量或类型大小必须是n的整数倍，如果作用在结构体上，**它只会扩大结构体的大小**，不像`#pramga pack(n)`会缩小结构体大小。注意这里的n只能是2的幂次方。请看以下代码：

``` C
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

typedef struct struct1 {
    int8_t member1;
    int16_t member2 __attribute__((aligned(4)));
} struct1_t;

int main(void) {
    printf("sizeof struct1: %zu\n", sizeof(struct1_t));
    printf("offset of member 1 in struct 1: %zu\n",
           offsetof(struct1_t, member1));
    printf("offset of member 2 in struct 2: %zu\n",
           offsetof(struct1_t, member2));

    return 0;
}

```

运行结果：

``` bash
sizeof struct1: 8
offset of member 1 in struct 1: 0
offset of member 2 in struct 2: 4

```

我们给`member2`设置了内存对齐为4，所以它要对齐在4的整数倍，如果不设置那么`member2`的偏移量将会是2。

除了设置结构体成员对齐，也可以整个设置结构体对齐，设置后结构体大小会发生变化。这里就不细说了，可以自己试试。

除了设置结构体，我们也可以设置变量对齐：

``` C
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

void align_test(void);
void no_align_test(void);

int main(void) {
    align_test();
    no_align_test();
    return 0;
}

void align_test(void) {
    int16_t s16_num;
    int16_t s16_aligned __attribute__((aligned(16)));
    uint8_t u8_num;
    printf("Align variable address: \n");
    printf("s16_num address: 0x%p, align: %zu\n", &s16_num, alignof(s16_num));
    printf("s16_aligned address: 0x%p, align: %zu\n", &s16_aligned,
           alignof(s16_aligned));
    printf("u8_num address 0x%p, align: %zu\n", &u8_num, alignof(u8_num));
}

void no_align_test(void) {
    int16_t s16_num;
    int16_t s16_no_aligned;
    uint8_t u8_num;

    printf("\nNo align variable address: \n");
    printf("s16_num address: 0x%p, align: %zu\n", &s16_num, alignof(s16_num));
    printf("s16_no_aligned address: 0x%p, align: %zu\n",
           &s16_no_aligned, alignof(s16_no_aligned));
    printf("u8_num address 0x%p, align: %zu\n", &u8_num, alignof(u8_num));
}
```

运行结果：

``` bash
Align variable address:
s16_num address: 0x000000000061FDEE, align: 2
s16_aligned address: 0x000000000061FDE0, align: 16
u8_num address 0x000000000061FDDF, align: 1

No align variable address:
s16_num address: 0x000000000061FDEE, align: 2
s16_no_aligned address: 0x000000000061FDEC, align: 2
u8_num address 0x000000000061FDEB, align: 1

```

`alignof()`宏用来获取对齐数。可以看到，如果不指定对齐，那么将会按照变量自身大小对齐。下面来分析下变量在内存里是怎么存的（省略前面的一堆0）：

![attribute_variable_aligned](/C/attribute_variable_aligned.png)

两个函数的局部变量的类型、数量、顺序都是一样的。区别在于`aalign_test`函数会对`s16_aligned`变量进行对齐，而`no_align_test`不会对`s16_no_aligned`变量对齐。根据输出的地址，可以看到如果不指定对齐，那么三个局部变量是紧挨在一起的。如果指定对齐，`s16_aligned`变量的地址就会在`0x61FDE0`上，**`0x61FDEC`不能被16也就是`0x10`整除，而`0x61FDE0`可以被16整除。**

> 你可能会问，`s16_num`是先声明的，为什么地址在下面？这是因为栈一般是向下生长的，也就是从高地址往低地址生长。那么按照顺序分配空间的话`s16_num`就在高地址了。而我们一般看内存是从低地址往高地址看的。（会有一节详细讲这个问题）
> 