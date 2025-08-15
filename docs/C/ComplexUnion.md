# 联合体

> C大师 183 184

联合体(`union`)，又叫共用体。联合体不同于结构体，**数据都存储在同一片内存空间**。其实共用体这个词更直白，数据都共用同一片内存区域。其声明方式与结构体类似，同样也可以使用`typedef`关键字定义类型名，使用也可以用`联合体.成员 联合体指针->成员`的形式。

由于数据都共用同一内存区域，那么意味着在某个时刻**只能使用其中的一种类型**，其他类型虽然也可以用，但结果可能并不是我们想要的。说白了，联合体就是**同一种数据的不同类型**，可以用它实现OOP语言的泛型。

明白上面的概念以后，那么联合体的大小就很而易见了，既然成员都共用一片内存区域，那么联合体就要保证每一个成员都能存的下。怎么保证每一个成员都能存的下呢？满足最大的那个成员能存下就行了，既然最大的都能存下了，那比它小的肯定可以存下。所以联合体的大小就是成员里最大的那一个。

那么联合体有什么用呢？下面举几个实际的案例。

## 联合体在通信中的应用

一般在通信中，数据是按字节传输的。如果我们要传输`int, float, double`这种多字节的数据，可以用联合体，发送时将数据拆分成字节发送，接收时将字节组合成数据，下面是一个例子：

``` C
#include <stdio.h>
#include <stdint.h>

typedef union {
    double data;
    uint8_t byte[8];
} fp_data_t;

typedef union {
    int32_t data;
    uint8_t byte[4];
} s32_data_t;

/* In actually program, you can use interrupt to fill the buff. */
fp_data_t recv_fp_buf;
s32_data_t recv_s32_buf;

void send_fp_data(fp_data_t *fp_data);

void send_s32_data(s32_data_t *s32_data);

int main(void) {
    fp_data_t send_fp;
    s32_data_t send_s32;

    send_fp.data = 3.14f;
    send_s32.data = 3321;
    printf("Send data: %lf, %d\n", send_fp.data, send_s32.data);

    send_fp_data(&send_fp);
    send_s32_data(&send_s32);

    printf("Received data: %lf, %d\n", recv_fp_buf.data, recv_s32_buf.data);

    return 0;
}

void send_fp_data(fp_data_t *fp_data) {
    /* Just a demonstration, fill the received buf.
     * If successful, the received data is the same as the sent data. */
    for (int i = 0; i < 8; ++i) {
        recv_fp_buf.byte[i] = fp_data->byte[i];
    }
}

void send_s32_data(s32_data_t *s32_data) {
    /* Just a demonstration, fill the received buf.
     * If successful, the received data is the same as the sent data. */
    for (int i = 0; i < 4; ++i) {
        recv_s32_buf.byte[i] = s32_data->byte[i];
    }
}

```

运行结果：

``` bash
Send data: 3.140000, 3321
Received data: 3.140000, 3321

```

这段代码只是简单的将发送的数据按字节填充到`recv_s32_buf, recv_fp_buf`中。如果成功，发送的数据将会与接收的数据相同。

我们发送的`send_fp`是3.14，接收到的也是3.14；发送的`send_s32`是3321，接收到的也是3321。这就实现了数据的拆分与组合，符合我们的预期。

在实际应用时我们还要考虑大小端的问题。大多数情况下编译器用小端序编译。如果是小端序编译，上面的代码适用于小端通信。如果要用大端通信，这种方法就要变化一下了，网络字节序就是大端模式，一些通信协议为了方便调试阅读，也会用大端模式。

## 联合体判断字节序

字节序是在多字节数据类型中存储数据的顺序。例如一个整数1234567890，十六进制数为0x499602D2：

```
大端序存储在内存的样子: 49 96 02 D2
小端序存储在内存的样子: D2 02 96 49
```

大端序对人类易于阅读，但是对于计算机来说就不太方便，比如要将这个数加1，那么就需要找到最后一位的位置后再加1.。而对于小端序来说只需要在第一个位置加1就行了。第一个字节就是一个数的低位。

更多请参考：[端序 - 维基百科，自由的百科全书](https://zh.wikipedia.org/zh-cn/%E5%AD%97%E8%8A%82%E5%BA%8F#%E5%B0%8F%E7%AB%AF%E5%BA%8F)。

那么我们怎么用联合体判断字节序呢？很简单，只需要把一个数存在联合体内，判断第一个字节是低位还是高位就可以了：

``` C
#include <stdio.h>
#include <stdint.h>

int main(void) {
    union {
        uint32_t u32_data;
        uint8_t byte_array[4];
    } determine_endian;

    determine_endian.u32_data = 0x11223344;

    if (determine_endian.byte_array[0] == 0x11) {
        printf("Big Endian! \n");
    } else {
        printf("Little Endian! \n");
    }

    return 0;
}

```

我在`determine_endian.u32_data`里存了一个数，`0x11223344`。如果是大端序，这个联合体在内存中是`11 22 33 44`，`byte_array`的第一个数是`0x11`；如果是小端序，这个联合体在内存是`44 33 22 11`，`byte_array`第一个数是`0x44`。这样我们就可以判断是大端还是小端了。

## 联合体模拟函数重载

如果你学习过C++, Java, C#, Kotlin等语言，那么你一定很熟悉函数重载。如果你不知道，也没关系，我会解释。

函数重载就是允许程序中存在**同名的函数**，同名函数**可以有不同的参数类型，参数数量和返回值**，当我们使用时编译器（或解释器）会**自动根据上下文来调用相应的函数。** 大多数OOP语言都支持函数重载。

下面是一个简单的Java函数重载例子：

``` Java
public class demo {
    public static void main(String[] args) {
        int intNum1 = 2, intNum2 = 5, intResult;
        float floatNum1 = 23.2f, floatNum2 = 53.2f, floatResult;

        intResult = add(intNum1, intNum2);
        floatResult = add(floatNum1, floatNum2);

        System.out.println("intNum1 + intNum2 = " + intResult);
        System.out.println("floatNum1 + floatNum2 = " + floatResult);
    }

    public static int add(int a, int b) {
        return a + b;
    }

    public static float add(float a, float b) {
        return a + b;
    }
}

```

运行结果：

``` bash
intNum1 + intNum2 = 7
floatNum1 + floatNum2 = 76.4

```

下面我以一个案例来演示如何用C语言实现上面的效果。

``` C
#include <stdio.h>

/**
 * @brief Definition of param and return value type.
 */
typedef union {
    int s32;
    float fp32;
} generic_data_t;

/**
 * @brief Determine the data type.
 */
typedef enum {
    INT_DATA = 0x0U,
    FP_DATA
} generic_type_t;

/**
 * @brief Add two float number.
 *
 * @param a First number
 * @param b Second number
 * @return The sum of two number.
 */
float add_float(float a, float b) {
    return a + b;
}

/**
 * @brief Add two int number.
 *
 * @param a First number
 * @param b Second number
 * @return The sum of two number.
 */
int add_int(int a, int b) {
    return a + b;
}

/**
 * @brief Add two number.
 *
 * @param type The type of the data
 * @param data1 First data
 * @param data2 Second data
 * @return The sum of two number.
 */
generic_data_t add(generic_type_t type, generic_data_t *data1,
                   generic_data_t *data2) {
    generic_data_t result;

    switch (type) {
        case FP_DATA: {
            result.fp32 = add_float(data1->fp32, data2->fp32);
        } break;

        case INT_DATA: {
            result.s32 = add_int(data1->s32, data2->s32);
        } break;

        default: {
        } break;
    }

    return result;
}

int main(void) {
    generic_data_t generic_data1, generic_data2;
    generic_data_t result;

    int s32_num1 = 10, s32_num2 = 16;
    float fp32_num1 = 12.3f, fp32_num2 = 22.1f;

    generic_data1.s32 = s32_num1;
    generic_data2.s32 = s32_num2;
    result = add(INT_DATA, &generic_data1, &generic_data2);
    printf("s32_num1 + s32_num2 = %d\n", result.s32);

    generic_data1.fp32 = fp32_num1;
    generic_data2.fp32 = fp32_num2;
    result = add(FP_DATA, &generic_data1, &generic_data2);
    printf("fp32_num1 + fp32_num2 = %f\n", result.fp32);

    return 0;
}
```

运行结果：

``` bash
s32_num1 + s32_num2 = 26
fp32_num1 + fp32_num2 = 34.400002

```

这样`add`函数就可以处理不同的数据了。可能你会觉得这怎么这么麻烦，其实OOP实现函数重载的原理跟这个是一样的，给同名函数给不同的标识，根据类型和参数数量调用不同的函数。

这个案例不支持不同参数数量。如果要实现不同的参数数量，我们可以借助可变参实现。

还可以通过宏定义模拟函数重载，比如用`__VA_ARGS__`这种更花的玩法。C11添加了`_Generic`关键字，可以通过它实现函数重载。可以参照：[宏定义的黑魔法，C语言模拟函数重载 - 王晨晓的博客 | Chinsyo Blog](https://chinsyo.com/2020/05/06/macro-magic-overload/)
