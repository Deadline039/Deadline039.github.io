# 位运算

## 位运算与逻辑运算

位运算有与或非，逻辑也有与或非。位运算是按二进制位操作的，比如`10 & 5 = 0b0110 & 0b0010 = 2`。逻辑运算是指的逻辑条件，0是假，非0为真，例如`10 && 2 = 1`。

## 位运算与写入

> C大师 011, 055-063

在嵌入式和算法中，位运算符非常常见。一般寄存器都是以bit为单位来操作的。因此，掌握位运算的方法，非常重要。至于位运算符什么原理，怎么用，看上面的视频。下面总结一下：

- 读取位用「与」
- 位置0用「与」`&=`，置1用「或」`|=`
- 位取反用「异或」`^=`
- 操作某个位用移位操作，例如操作`bit3`: `(1U << 3)`

下面举个例子：

``` C
#include <stdint.h>
#include <stdio.h>

/**
 * 状态寄存器
 * bit[31:16] 保留
 * bit[15] TXNE(R)   发送为空
 * bit[14] BASY(RW)  是否被占用
 */
uint32_t status_reg = 0;

#define TXNE (1U << 15)
#define BASY (1U << 14)

int main(void) {
    /* 写入数据到发送区 ... */

    /* 是否被占用置1 */
    status_reg |= BASY;

    /* 等待直至发送完成为空 */
    while (status &TXNE)
        ;

    /* 是否被占用置0 */
    status &= ~(BASY);
}
```

如果你看不懂，不知道是怎么读取写入的，说明还是不够熟练，继续练习。

从x位到y位一般表示成`bit[y:x]`，y在x前面是因为低位在后面。而我们说从x到y一般是从低位到高位。而说从x到y个字节可以表示成`byte[x:y]`。

其实借助结构体位域也可以实现位操作，参照：[位域](/C/ComplexStruct#%E4%BD%8D%E5%9F%9F-bit-field)。但是位域不具有可移植性。如果你的代码在不同平台与不同编译器下编译，那么位域的大小和地址不一定是固定的。

## 取余与位运算

在编程中，我们常常会遇到取余数的运算。取余数就是指的一个数不能整除的情况下的余数，也叫取模，例如：`5 / 3 = 1 ... 2`，5除以3的余数是2。但是，如果取余的数是2的倍数，那么编译器会自动优化为位运算。你可能会感到迷惑，位运算与取余又有什么关系呢？我们先用十进制来看看：

随机给你一个数，例如1546156，这个数的10的余数一眼看出来就是6。如果求100的余数，我相信你也能看出来余数是56。那这是什么原理呢？我们擅长做10进制运算，如果是10的倍数，那么我们只需要**取后面几位数字**就可以了。

那么对于二进制数，如果求`0x234SAF2D`对于`0x10`的余数，也就是2的4次方的余数，计算机只需要取最后4位数字就可以，也就是与`0xF`做与运算。怎么取数字的？做与运算就可以了。CPU内部有非常多的逻辑运算单元（也就是与、或、非门电路），相比与算数运算，逻辑运算的速度非常快。因此，对2的倍数的取余运算，编译器会直接优化为按位与运算。

我们来一段代码看一下：

``` C
#include <stdio.h>
#include <sys/time.h>

int main(void) {
    struct timeval tv1, tv2;

    int result;

    puts("Start 1 to 10000000 % 15\n");

    gettimeofday(&tv1, NULL);
    for (int i = 0; i < 10000000; ++i) {
        result = i % 15;
        (void)result;
    }

    gettimeofday(&tv2, NULL);
    printf("Usage: %lld us.\n", tv2.tv_usec - tv1.tv_usec);

    puts("Start 1 to 10000000 % 16\n");

    gettimeofday(&tv1, NULL);
    for (int i = 0; i < 10000000; ++i) {
        result = i % 16;
        (void)result;
    }

    gettimeofday(&tv2, NULL);

    printf("Usage: %lld us.\n", tv2.tv_usec - tv1.tv_usec);

    return 0;
}
```

运行结果：

``` bash
Start 1 to 10000000 % 15
Usage: 14567 us.

Start 1 to 10000000 % 16
Usage: 6040 us.
```

可以看到，从1 ~ 10000000取余数的话，15取余相比与16取余时间多了一倍多。那这是为什么呢？我们来看看上面的代码反汇编的内容：

``` bash
Deadline039@LAPTOP-CUCD2Q7 MINGW64 /e/C-Learn
$ gcc -o main.exe -g main.c
Deadline039@LAPTOP-CUCD2Q7 MINGW64 /e/C-Learn
$  objdump -S main.exe
main.exe:    file format pei-x86-64

    puts("Start 1 to 10000000 % 15\n");

    ; 省略大部分内容 
    for (int i = 0; i < 10000000; ++i) {
        ; 循环开始

        ; 15取余运算
        result = i % 15;
  401583:	8b 45 fc             	mov    -0x4(%rbp),%eax
  401586:	48 63 d0             	movslq %eax,%rdx
  401589:	48 69 d2 89 88 88 88 	imul   $0xffffffff88888889,%rdx,%rdx
  401590:	48 c1 ea 20          	shr    $0x20,%rdx
  401594:	01 c2                	add    %eax,%edx
  401596:	89 d1                	mov    %edx,%ecx
  401598:	c1 f9 03             	sar    $0x3,%ecx
  40159b:	99                   	cltd   
  40159c:	29 d1                	sub    %edx,%ecx
  40159e:	89 ca                	mov    %ecx,%edx
  4015a0:	c1 e2 04             	shl    $0x4,%edx
  4015a3:	29 ca                	sub    %ecx,%edx
  4015a5:	29 d0                	sub    %edx,%eax
  4015a7:	89 45 f4             	mov    %eax,-0xc(%rbp)
    
    ; 下一次循环
    for (int i = 0; i < 10000000; ++i) {
  4015aa:	83 45 fc 01          	addl   $0x1,-0x4(%rbp)
  4015ae:	81 7d fc 7f 96 98 00 	cmpl   $0x98967f,-0x4(%rbp)
  4015b5:	7e cc                	jle    401583 <main+0x33>
        (void)result;
    }

    puts("Start 1 to 10000000 % 16\n");

    ; 省略大部分内容 
    for (int i = 0; i < 10000000; ++i) {
        ; 循环开始

        ; 16取余运算
        result = i % 16;
  401606:	8b 55 f8             	mov    -0x8(%rbp),%edx
  401609:	89 d0                	mov    %edx,%eax
  40160b:	c1 f8 1f             	sar    $0x1f,%eax
  40160e:	c1 e8 1c             	shr    $0x1c,%eax
  401611:	01 c2                	add    %eax,%edx
  401613:	83 e2 0f             	and    $0xf,%edx ; 与0xF做按位与运算
  401616:	29 c2                	sub    %eax,%edx
  401618:	89 d0                	mov    %edx,%eax
  40161a:	89 45 f4             	mov    %eax,-0xc(%rbp)

    ; 下一次循环
    for (int i = 0; i < 10000000; ++i) {
  40161d:	83 45 f8 01          	addl   $0x1,-0x8(%rbp)
  401621:	81 7d f8 7f 96 98 00 	cmpl   $0x98967f,-0x8(%rbp)
  401628:	7e dc                	jle    401606 <main+0xb6>
        (void)result;
    }
```

可以看到，15取余相比与16取余，运算过程多了非常多。如果不是2的倍数取余，计算机只能去做除法计算余数；如果是2的倍数，计算机就可以做与运算，计算的就非常快。

## 乘除运算与位运算

加减乘除是非常常见的运算了。跟取余运算类似，乘除运算如果是2的倍数也会简化为位运算。

随机给你一个数，例如1546156，乘除10的结果我相信你一眼就可以看出来结果是15461560和154615.6。那这是什么原理呢？我们擅长做10进制运算，如果是10的倍数，那么我们只需要**移小数点**就可以了。小数点左移一位就是除以10，右移一位就是乘以10。

那么对于二进制数，如果求`0x234SAF2D`对于`0x10`的乘除结果，也就是2的4次方的余数，计算机只需要移位，也就是左移或者右移4位。CPU内部有非常多的逻辑运算单元（也就是与、或、非门电路），相比与算数运算，逻辑运算的速度非常快。因此，对2的倍数的c乘除运算，编译器会直接优化为移位运算。

我们来一段代码看一下：

``` C
#include <stdio.h>
#include <sys/time.h>

int main(void) {
    struct timeval tv1, tv2;

    int result;

    puts("Start 1 to 10000000 * 15");

    gettimeofday(&tv1, NULL);
    for (int i = 0; i < 10000000; ++i) {
        result = i * 15;
        (void)result;
    }

    gettimeofday(&tv2, NULL);
    printf("Usage: %lld us.\n", tv2.tv_usec - tv1.tv_usec);

    puts("Start 1 to 10000000 * 16");

    gettimeofday(&tv1, NULL);
    for (int i = 0; i < 10000000; ++i) {
        result = i * 16;
        (void)result;
    }

    gettimeofday(&tv2, NULL);

    printf("Usage: %lld us.\n", tv2.tv_usec - tv1.tv_usec);

    return 0;
}
```

运行结果

``` bash
Start 1 to 10000000 / 15
Usage: 10913 us.

Start 1 to 10000000 / 16
Usage: 7220 us.
```

可以看到，从1 ~ 10000000做除法的话，15相比16时间会多一点。我们来看看上面的代码反汇编的内容：

``` bash
Deadline039@LAPTOP-CUCD2Q7 MINGW64 /e/C-Learn
$ gcc -o main.exe -g main.c
Deadline039@LAPTOP-CUCD2Q7 MINGW64 /e/C-Learn
$  objdump -S main.exe
main.exe:    file format pei-x86-64
    for (int i = 0; i < 10000000; ++i) {
   1400015ae:	c7 45 fc 00 00 00 00 	movl   $0x0,-0x4(%rbp)
   1400015b5:	eb 11                	jmp    1400015c8 <main+0x47>
        result = i * 15;
   1400015b7:	8b 55 fc             	mov    -0x4(%rbp),%edx
   1400015ba:	89 d0                	mov    %edx,%eax
   1400015bc:	c1 e0 04             	shl    $0x4,%eax
   1400015bf:	29 d0                	sub    %edx,%eax
   1400015c1:	89 45 f4             	mov    %eax,-0xc(%rbp)
    for (int i = 0; i < 10000000; ++i) {
   1400015c4:	83 45 fc 01          	addl   $0x1,-0x4(%rbp)
   1400015c8:	81 7d fc 7f 96 98 00 	cmpl   $0x98967f,-0x4(%rbp)
   1400015cf:	7e e6                	jle    1400015b7 <main+0x36>
        (void)result;
    }

    for (int i = 0; i < 10000000; ++i) {
   14000161b:	c7 45 f8 00 00 00 00 	movl   $0x0,-0x8(%rbp)
   140001622:	eb 0d                	jmp    140001631 <main+0xb0>
        result = i * 16;
   140001624:	8b 45 f8             	mov    -0x8(%rbp),%eax
   140001627:	c1 e0 04             	shl    $0x4,%eax
   14000162a:	89 45 f4             	mov    %eax,-0xc(%rbp)
    for (int i = 0; i < 10000000; ++i) {
   14000162d:	83 45 f8 01          	addl   $0x1,-0x8(%rbp)
   140001631:	81 7d f8 7f 96 98 00 	cmpl   $0x98967f,-0x8(%rbp)
   140001638:	7e ea                	jle    140001624 <main+0xa3>
        (void)result;
    }
```

乘15需要5步操作，乘16只需要3步操作，乘16的运算在汇编中就是左移4位。
