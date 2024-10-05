# 结构体

> C大师 176-181 184

结构体可谓是在复杂数据类型里最常用的数据类型之一了。在嵌入式开发中函数的句柄就是结构体，如果结构体不熟悉，阅读代码会比较困难。

`struct`的意思是构造，建造，因此结构体又叫构造体。构造，顾名思义是由各个基础数据类型组合而成，构造自己的数据类型。结构体成员也可以是枚举或者其他类型的结构体变量或指针，甚至是指向自身类型的指针，但是唯独不可以是自身类型的结构体变量。显而易见，结构体是一种比较复杂的数据类型，一般是由程序编写者自己定义的用于方便描述特定对象的数据类型。

打个比方，如果我需要描述一位同学的基本信息，那我需要用char类型的数组来存储名字，int类型来存储他的年龄，float类型存储成绩等等等等，那能不能用一个自定义的变量去存储这位同学的所有信息呢？于是便有了以下的结构体

``` C
struct {
    int num;       /*!< 成员1 int类型用于存储学号 */
    char name[20]; /*!< 成员2 char型数组用于存储姓名 */
    char sex;
    int age;
    float score;
    char addr[30];
} student1, student2; /* 定义了student1和student2两个结构体变量 */
```

通过上面的结构体就是通过各个结构体成员，把想要描述的学生信息分条记录下来，这样一个变量就可以包含一个学生的全部信息。

## `typedef`与结构体

上面的方法有个问题，你只能在结构体后声明几个变量或指针，不能在其他地方使用这个结构体类型。那这就很不方便了，哪怕写两个成员一模一样的结构体变量，在编译器看来仍然不是同一种数据类型：

``` C
int main(void) {
    struct {
        int num;
        char name[20];
        char sex;
    } student1;

    struct {
        int num;
        char name[20];
        char sex;
    } *student_ptr;

    student_ptr = &student1;
    
    return 0;
}
```

编译结果：

``` bash
E:/C_Learn/main.cpp: In function 'int main()':
E:/C_Learn/main.cpp:20:20: error: cannot convert 'main()::<unnamed struct>*' to 'main()::<unnamed struct>*' in assignment
     student_ptr = &student1;
                    ^~~~~~~~
```

所以如果我们需要在别的地方使用结构体，必须给结构体起个名字，然后用`struct 结构体名`就可以声明这种类型的变量了。

``` C
struct student {
    int num;       /*!< 成员1 int类型用于存储学号 */
    char name[20]; /*!< 成员2 char型数组用于存储姓名 */
    char sex;
};
struct student student1, *student_ptr;  /* 在结构体声明之后进行，struct是关键字 */
```

但是带`struct`关键字还是很麻烦，可以通过`typedef`给结构体类型起别名的方式来简化，这样声明变量的时候就不需要带`struct`关键字了。

> 虽然有些编译器允许你省略`struct`关键字，但是建议还是写上，省略`struct`是不规范的写法。

``` C
/* typedef给struct student变量类型起了一个student_t的别名 */
typedef struct student {  /* 此处的student名称可以省略 */
    int num;
    char name[20];
    char sex;
} student_t;

student_t student1, *student_ptr; /* 用student_t来表示变量类型 */
```

上面struct后的结构体名称可以省略，省略就是匿名结构体，只使用别名。一般用`typedef`定义结构体类型时结构体名可以省略名，除非必须要引用这个名称，比如链表的`next`指针：

``` C
typedef struct list_node {
    ...
    struct list_node *next;
} list_node_t;
/* 写成下面这样编译会报错 */
typedef struct list_node {
    ...
    list_node_t *next;
} list_node_t;
```

`list_node_t`名称是后面定义的，在这之前`list_node_t`这个标识符不存在，因此编译报错。

## 结构体赋值与函数间传递

结构体变量赋初值可以在声明的时候用大括号依次赋值，括号内的数据会根据结构体声明时成员的排列顺序来依次给成员赋值，也可以以`.成员名称`的方式赋值。

``` C
typedef struct {
    int num;
    char name[20];
    char sex;
    int age;
    char addr[30];
    struct {
        int Chinese;
        int math;
        int English;
    } scores;
} student_t;
/* 依次给num, name, sex, age赋值 */
student_t student1 = student_t student1 = {89031, "Li Lin", 'M', 22};

/* 也可以这样, 更直观 */
student_t student2 = {
    .num = 12300, /* 学号为12300 */
    .age = 22,    /* 年龄为22 */
    /* 嵌套结构体定义初值 */
    .scores.Chinese = 100, /* 语文100分 */
    .scores.math = 90,     /* 数学90分 */
    .scores.English = 98   /* 英语98分 */
};
```

**P.S. 你无法一次性输出整个结构体变量，只能输出结构体变量的成员。**

作为一种数据类型，自定义的结构体和其他数据类型一样，也可以定义该结构体类型的指针和数组，这样定义的数组每一个元素都是一个结构体变量，在上个例子中你就可以通过定义结构体数组来记录一个班的学生的信息。

想要通过结构体指针访问结构体成员，可以用`(*结构体指针).成员`的方式，当然`结构体指针->成员`更为常用。

> `结构体指针->成员`这种方式非常常用，几乎C代码都采用这种方式，因此必须熟悉这种方式。

``` C
typedef struct {
    int num;
    char name[20];
    char sex;
    int age;
    float score;
    char addr[30];
} student_t;

student_t student;
student_t *student_ptr = &student;

student_ptr->num;           /* 访问num成员 */
student_ptr->score = 88;    /* score赋值为88 */

```

结构体同样也可以作为函数参数与返回值。但是建议用**指针**的方式在函数间传递。

- 如果结构体类型作为函数参数，在函数参数压栈时**结构体变量会复制一份**，这不仅意味着会花费更多的时间与空间，还意味着**函数内所有对结构体的修改操作都不会修改调用方的结构体**
- 如果结构体类型作为返回值，相较与返回指针会花费更长的时间（参照调用约定）

举个例子：

``` C
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[10];
    int age;
    char sex;
} student_t;

void modify_name(student_t student);

int main(void) {
    student_t student1 = {.age = 20, .sex = 'M'};
    strcpy(student1.name, "Tom");
    printf("Student 1 name: %s\n", student1.name);
    modify_name(student1);
    printf("Student 1 new name: %s\n", student1.name);
    return 0;
}

void modify_name(student_t student) {
    puts("Enter new name: ");
    scanf("%s", student.name);
}
```

运行结果:

``` bash
Student 1 name: Tom
Enter new name: Jerry
Student 1 new name: Tom
```

~~这代码如果都看不懂可以回炉重造了。~~ 

显然`modify_name`并没有返回我们想要的结果，这就说明在调用这个函数的时候传入的参数`student`被拷贝了一份，函数调用完就被销毁了。所以说`modify_name`函数应该传入的是`student_t *`也就是结构体指针类型的数据。

## 结构体内存对齐

> [【结构体内功修炼】结构体内存对齐（一）](https://xie.infoq.cn/article/99a458efeba148a9299c484f2)
>
> [Storage and Alignment of Structures | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-language/storage-and-alignment-of-structures?view=msvc-170)

为了加快CPU访问速度，结构体成员在内存中并不是连续分布的。内存对齐遵循以下的规则：

- 第一个成员偏移地址为0
- 结构体偏移地址，必须是对齐数的整数倍
- 结构体总大小，必须是最大对齐数的整数倍

可能有点绕，解释几个概念：

- 偏移地址：从结构体的首地址到成员首地址的偏移量（其实很简单，假如排了一个长队，从第一个人算0号，你在5号，那么你相对与第一个人的偏移量就是5，也就是说你前面有5个人）
- 对齐数：「成员自身大小」和「默认对齐数」的较小值
- 最大对齐数：结构体内成员对齐数最大的那个
- 不是所有编译器都有默认对齐数，VS的默认对齐数是8，Linux没有默认对齐数，因此对齐数就是自身成员大小
- **「对齐数」和「默认对齐数」不是一个东西**

开始探究上面的规则之前，我们需要再介绍一个宏和一个关键字：

- `offsetof(TYPE, MEMBER)`：获取结构体TYPE的成员MEMBER的偏移地址，在`stddef.h`中
- `sizeof()`：C语言关键字，获取变量、数据类型的大小

**他们的返回值单位都是字节！**

### 普通结构体内存对齐

先来一段代码：

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
} foo_t;

int main(void) {
    printf("sizeof foo_t: %zu\n", sizeof(foo_t));
    printf("offset of member1: %zu\n", offsetof(foo_t, member1));
    printf("offset of member2: %zu\n", offsetof(foo_t, member2));
    printf("offset of member3: %zu\n", offsetof(foo_t, member3));
    printf("offset of member4: %zu\n", offsetof(foo_t, member4));
    printf("offset of member5: %zu\n", offsetof(foo_t, member5));
}
```

VS编译，运行结果：

``` bash
sizeof foo_t: 24
offset of member1: 0
offset of member2: 1
offset of member3: 4
offset of member4: 8
offset of member5: 16

```

`member1`: 结构体第一个成员，偏移量为0，存在第0个位置：

![struct_align1](/Cpp/struct_align_1.png)

`member2`: `int8_t`类型，自身大小1，默认对齐数8，对齐数取较小值为1。1是1的倍数，偏移量为1，存在第1个位置：

![struct_align2](/Cpp/struct_align_2.png)

`member3`: `uint32_t`类型，自身大小4，默认对齐数8，对齐数取较小值为4。 **3不是4的倍数，往前移动到4，** 偏移量为4，存在第4个位置：

![struct_align3](/Cpp/struct_align_3.png)

`member4`: `uint16_t`类型，自身大小2，默认对齐数8，对齐数取较小值为2。8是2的倍数，偏移量为8，存在第8个位置：

![struct_align4](/Cpp/struct_align_4.png)

`member5`: `uint64_t`类型，自身大小8，默认对齐数8，对齐数取较小值为8。 **10不是8的倍数，往前移动到16，** 偏移量为16，存在第16个位置：

![struct_align5](/Cpp/struct_align_5.png)

最大对齐数是8，因此结构体总大小为24。

强烈建议先研究清楚上面的东西再来看下面的。

### 嵌套结构体内存对齐

对于嵌套结构体，还有一个规则：

- 嵌套结构体对齐在自己**最大对齐数**的整数倍

还记得我们怎么计算结构体的总体大小的吗？

- 结构体总大小，必须是最大对齐数的整数倍
- 最大对齐数：结构体内成员对齐数最大的那个

弄清楚这些规则后，我们来看以下的代码：

``` C
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

typedef struct nest_struct {
    uint32_t member1;
    uint64_t member2;
} nest_struct_t;

typedef struct foo {
    uint8_t member1;
    int8_t member2;
    nest_struct_t member3;
} foo_t;

int main(void) {
    printf("sizeof foo_t: %zu\n", sizeof(foo_t));
    printf("offset of member1: %zu\n", offsetof(foo_t, member1));
    printf("offset of member2: %zu\n", offsetof(foo_t, member2));
    printf("offset of member3: %zu\n", offsetof(foo_t, member3));
    printf("sizeof nest_struct: %zu\n", sizeof(nest_struct_t));
}
```

VS运行结果：

``` bash
sizeof foo_t: 24
offset of member1: 0
offset of member2: 1
offset of member3: 8
sizeof nest_struct: 16

```

我们来看`member3`：`nest_struct_t`的最大对齐数是8，也就是结构体内的`uint64 member2`成员。因此在`foo_t`中它要对齐在8的整数倍。所以`foo_t.member3`的偏移量为8。其他的就和上面一样了，没什么好多说的。

### 指定对齐数

搞清楚上面的内容后，我们再来说最后一个，用`#pragma pack(n)`指定默认对齐数。注意这是预编译指令，不是以分号结尾。

还是刚才的结构体，我在结构体开头加一个`#pragma pack(2)`，看看运行结果有什么变化：

``` C
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

#pragma pack(2)

typedef struct foo {
    uint8_t member1;
    int8_t member2;
    uint32_t member3;
    uint16_t member4;
    uint64_t member5;
} foo_t;

int main(void) {
    printf("sizeof foo_t: %zu\n", sizeof(foo_t));
    printf("offset of member1: %zu\n", offsetof(foo_t, member1));
    printf("offset of member2: %zu\n", offsetof(foo_t, member2));
    printf("offset of member3: %zu\n", offsetof(foo_t, member3));
    printf("offset of member4: %zu\n", offsetof(foo_t, member4));
    printf("offset of member5: %zu\n", offsetof(foo_t, member5));
}
```

VS编译，运行结果：

``` bash
sizeof foo_t: 16
offset of member1: 0
offset of member2: 1
offset of member3: 2
offset of member4: 6
offset of member5: 8

```

我们发现从`member3`开始偏移量就不一样了。由于我们设置了默认对齐数为2，那么他的对齐数就不是4了，而是2。紧接着影响后面的结构体偏移量。这时候结构体的最大对齐数就是2，也会影响结构体的大小。

如果我们写成`#pragma pack()`，也就是括号内不写对齐数，那么就会取消掉前面我们用`#pragma pack(n)`设置的默认对齐数，还原成编译器的默认设置。

除此之外我们还可以用`__attribute__`关键字设置内存对齐，参照[下面的内容](C-basic.md#__attribute__)。注意`__attribute__`关键字是GNU对ISO C的扩展，支持GCC, Clang等编译器，VS默认的MSVC是不支持的。如果你的代码要在不同编译器下编译，需要用宏定义判断编译器做好处理。

为什么要把内存对齐讲的这么细呢？~~因为面试会问~~

我们在设计自己的通信协议时，不同架构设备之间数据传输就可能存在结构体内存对齐的问题。还有一点就是跨平台，如果不考虑内存对齐，那么可能会产生意料之外的问题。

建议自己写几个结构体练习一下。

## 位域(bit field)

> [C Bit Fields | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-language/c-bit-fields?view=msvc-170)
>
> [C++ struct 位域 | 拾荒志](https://murphypei.github.io/blog/2019/06/struct-bit-field)
>
> [【结构体内功修炼】结构体实现位段（二）_C语言_Albert Edison_InfoQ写作社区](https://xie.infoq.cn/article/d63013a03e86ece67f3aedbc9)（这个文章有个小歧义，就是位域成员应该是整形类型，不单是`int`和`unsigned int`，要是说扩充`int`到`char short long`也不是不行）

位域是将数据以位的形式存储成员，并可以按位操作操作成员。好处显而易见，可以节省存储空间。位域的声明格式是：`类型 成员名称 : 位数`。例如下面的结构体：

``` C
struct foo {
    int id : 8;
    int result : 4;
    int temperature : 8;
}
```

上面结构体中`id`占8 bit, `result`占4 bit，`temperature`占8 bit。

访问位域成员与访问普通结构体成员是一样的。那么如果位域成员溢出了会发生什么呢？会影响其他成员吗？多说无用，来段代码：

``` C
#include <stdio.h>

struct foo {
    int id: 8;
    int result: 4;
    int temperature: 8;
};

int main(void) {
    struct foo bit_field_test;
    bit_field_test.id = 125;
    bit_field_test.result = 20;
    bit_field_test.temperature = 78;

    printf("id = %d, result = %d, temperature = %d\n", bit_field_test.id, bit_field_test.result,
           bit_field_test.temperature);

    return 0;
}
```

运行结果：

``` bash
id = 125, result = 4, temperature = 78
```

`result`只占4位，也就是它的范围是-8 ~ +7，显然并不能存下20。其他成员的值并没有发生变化。所以如果一个成员溢出后并不会影响到其他成员。

位域定义的位数不能超过其声明的类型大小，比如：

``` C
struct foo {
    signed char field1: 9;
    signed short field2: 20;
};
```

编译结果：

``` bash
E:/C-Learn/main.c:2:17: error: width of 'field1' exceeds its type
     signed char field1: 9;
                 ^~~~~~
E:/C-Learn/main.c:3:18: error: width of 'field2' exceeds its type
     signed short field2: 20;
                  ^~~~~~
```

`signed char`只有8位，我们定义了`field1`的宽度为9位，显然超过了`signed char`的大小，编译会报错。

在位域中除了数据以外的其他部分都用空白填充。

需要注意的是位域只能用整数，不可以用浮点与指针：

``` C
struct foo {
    float fp8: 8;
    int *ptr4: 4;
    double fp16: 16;
};
```

编译结果：

``` bash
E:/C-Learn/main.c:2:11: error: bit-field 'fp8' has invalid type
     float fp8 : 8;
           ^~~
E:/C-Learn/main.c:3:10: error: bit-field 'ptr4' has invalid type
     int *ptr4 : 4;
          ^~~~
E:/C-Learn/main.c:4:12: error: bit-field 'fp16' has invalid type
     double fp16 : 16;
            ^~~~
```

位域成员可以跨越两个存储空间，也就是说如果第一个空间的位置不够了，可以自动存到下一个空间。比如：

``` C
#include <stdio.h>

struct foo {
    short field1: 10;
    short field2: 12;
};

int main(void) {
    printf("sizeof struct foo: %zu\n", sizeof(struct foo));

    return 0;
}
```

运行结果：

``` bash
sizeof struct foo: 4
```

第一个成员`field1`已经用了10位，`short`只有16位，显然不够`field2`存储，因此需要在开辟一个`short`空间来存储`field2`，因此这个结构体大小是4字节。

虽然位域可以节省存储空间，相比与位操作更直观。但是存在跨平台的问题。整数类型依赖机器和系统，建议搭配`stdint.h`使用。

那么位域的应用有那些呢？下面是nginx的一部分代码片段，可以看到这个结构体用到了位域。这个项目中有非常多地方用到位域。

``` C
/* https://github.com/nginx/nginx/blob/00637cce366f17b78fe1ed5c1ef0e534143045f6/src/http/ngx_http_core_module.h#L234 */
struct ngx_http_addr_conf_s {
    /* the default server configuration for this address:port */
    ngx_http_core_srv_conf_t  *default_server;

    ngx_http_virtual_names_t  *virtual_names;

    unsigned                   ssl:1;
    unsigned                   http2:1;
    unsigned                   quic:1;
    unsigned                   proxy_protocol:1;
};
```
