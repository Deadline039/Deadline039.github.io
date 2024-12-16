# GNU扩展的数组语法

## 零长数组

> [Zero Length (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Zero-Length.html)
>
> [零长度数组 - 零长度数组，结构体中的零长度数组 - 嵌入式C语言自我修养 | 宅学部落](https://www.zhaixue.cc/c-arm/c-arm-array.html)

在标准C中，定义数组必须使用正整数，不允许使用0。但是GNU允许我们定义零长数组。那么长度为0的数组有什么用呢？答案是可变长的对象。一般情况下零长数组搭配结构体来使用，我们来看一个代码：

``` C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int len;
    char str[0];
} string_t;

string_t *new_string(int len) {
    string_t *s = malloc(sizeof(string_t) + (len * sizeof(char)));
    s->len = len;
    return s;
}

void delete_string(string_t *s) {
    free(s);
}

void print_string(string_t *s) {
    puts(s->str);
}

void set_string(string_t *s, char *str) {
    strcpy(s->str, str);
}

int main(void) {
    string_t *str = new_string(12);
    set_string(str, "Hello World");
    print_string(str);
    delete_string(str);

    str = new_string(9);
    set_string(str, "So cool!");
    print_string(str);
    delete_string(str);

    return 0;
}

```

运行结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main && ./main
Hello World
So cool!
ubuntu@hi3798mv100:~/C-Learn$
```

是不是有点C++的`new`的那味了？当然这不是我们的正题。我们使用了一个叫做`string`的结构体，然后我们用`malloc`动态的调整其中的`str`成员大小，就像一个`String`类一样，可以构造，销毁。

这里注意用`malloc`分配的空间是结构体的大小+缓冲区的大小。 

那你可能会说，这个结构体跟我用下面的结构体有什么区别吗？

``` C
struct foo{
    int len;
    char* str;
};
```

用起来确实没有什么区别，但是这个结构体有两个成员，`char*`在32位机上的占用空间是4字节，也就是说这个结构体总共占用8字节空间，而如果用零长数组，不仅可以少4字节空间，最重要的是你可以少一次分配内存。如果这里的结构体用的也是动态创建的方式，那么就需要分配两次内存：结构体一次，结构体里的`str`又是一次。这样无形中会增加内存碎片，如果疏忽，少释放了一次内存，会造成内存泄漏。`new`和`delete`函数就会像下面那样：

``` C
typedef struct {
    int len;
    char *str;
} string_t;

string_t *new_string(int len) {
    string_t *s = malloc(sizeof(string_t));
    s->str = malloc(sizeof(char) * len);
    s->len = len;

    return s;
}

void delete_string(string_t *s) {
    /* 少一个 free 你试试 */
    free(s->str);
    free(s);
}
```

这里用一张简单的图来表示这两者的区别：

![零长数组 VS 指针](/C/zero-length-array.svg)

那么零长数组占用空间真的是0吗？我们用代码来看一下：

``` C
#include <stdio.h>

int array[0];

int main(void) {
    printf("size of array: %zu\n", sizeof(array));
    printf("length of array: %zu\n", sizeof(array) / sizeof(array[0]));
    return 0;
}
```

运行结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main && ./main
size of array: 0
length of array: 0
ubuntu@hi3798mv100:~/C-Learn$
```

可以看到，如果我们单独定义个零长数组，那么编译器给他分配的空间是0，也就是不分配空间。所以相较于指针，会更省空间，使用也会更方便。

需要注意，零长数组成员必须放在结构体的最后一个成员，因为如果按照上面的方法分配，最后一个成员就相当于是数组的首地址，它后面紧挨着的就是缓冲区内容，如果不放到最后，会造成缓冲区的内容写到结构体其他成员的位置，造成不可预料的后果。

至于有什么用，上面的参考链接已经给了，我想我解释的也算清楚。这里就不多赘述。

## 变长数组

> [Variable-length array - Wikipedia](https://en.wikipedia.org/wiki/Variable-length_array)

定义数组长度必须使用常量或者常量表达式，但是GNU允许我们使用变量来定义数组长度，这种数组就叫做变长数组(Variable-length array, VLA)。

其实从C99就引入了VLA，允许我们使用变量定义数组长度，但是这容易造成栈溢出，因此不是所有编译器都支持VLA。万一定义了一个超长数组，如果没有错误处理，就会栈溢出。

``` C
#include <stdio.h>

int main(void) {
    int length;
    puts("input length: ");
    scanf("%d", &length);
    int array[length];
    printf("length of array: %zu\n", sizeof(array) / sizeof(array[0]));
    return 0;
}
```

Ubuntu 20.04下GCC 9.4.0编译运行结果：

``` C
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main
ubuntu@hi3798mv100:~/C-Learn$ ./main
input length:
10
length of array: 10
ubuntu@hi3798mv100:~/C-Learn$
```

Windows下Clang 18.1.6编译结果：

``` bash
Deadline039@LAPTOP-83FQRJF MINGW64 /e/C-Learn
$ clang main.c -o main.exe -D_CRT_SECURE_NO_WARNINGS

Deadline039@LAPTOP-83FQRJF MINGW64 /e/C-Learn
$ ./main.exe
input length:
10
length of array: 10

Deadline039@LAPTOP-83FQRJF MINGW64 /e/C-Learn
$
```

Windows下MSVC编译结果：

``` bash
Rebuild started at 5:18 PM...
1>------ Rebuild All started: Project: Project1, Configuration: Debug x64 ------
1>Source1.c
1>E:\Users\Deadline039\Desktop\VS_C\Source1.c(7,15): error C2057: expected constant expression
1>E:\Users\Deadline039\Desktop\VS_C\Source1.c(7,15): error C2466: cannot allocate an array of constant size 0
1>E:\Users\Deadline039\Desktop\VS_C\Source1.c(7,9): error C2133: 'array': unknown size
1>E:\Users\Deadline039\Desktop\VS_C\Source1.c(8,38): warning C4034: sizeof returns 0
1>Done building project "Project1.vcxproj" -- FAILED.
========== Rebuild All: 0 succeeded, 1 failed, 0 skipped ==========
========== Rebuild completed at 5:18 PM and took 01.145 seconds ==========
```

我们看到，不论是GCC还是Clang，都允许我们使用变量来定义数组长度。但是MSVC不允许我们使用变量定义数组长度。

那么这个变长数组定义的位置在哪里呢？用下面的代码测试一下：

``` C
#include <stdio.h>

int main(void) {
    int length;
    puts("input length: ");
    scanf("%d", &length);
    int array[length];

    printf("length of array: %zu\n", sizeof(array) / sizeof(array[0]));
    printf("Address of length: %p, array: %p\n", &length, array);

    return 0;
}
```

运行结果

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main && ./main
input length:
2
length of array: 2
Address of length: 0xbea6d4f0, array: 0xbea6d4e8
ubuntu@hi3798mv100:~/C-Learn$
```

我们查看一下内存空间：

```
0xbe6d4e4 |              |
          +--------------+
0xbe6d4e8 |  array[0]    |
          +--------------+
0xbe6d4ec |  array[1]    |
          +--------------+
0xbe6d4f0 |  length      |
          +--------------+
0xbe6d4f4 |              |
```

从上图可以看出，数组是分配在栈上的，而不是使用堆里。因此变长数组可以由编译器来进行分配与释放，相比与`malloc`也会较为安全，不会有内存泄漏的问题。

顺带一提，全局变量不可以用变量来定义长度，哪怕是用`const`修饰的全局变量也不可以：

``` C
#include <stdio.h>

const int length = 10;
int array[length];

int main(void) {
    printf("length of array: %zu\n", sizeof(array) / sizeof(array[0]));
    return 0;
}
```

编译结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main && ./main
main.c:4:5: error: variably modified ‘array’ at file scope
    4 | int array[length];
      |     ^~~~~
ubuntu@hi3798mv100:~/C-Learn$
```

## 数组初始化

GNU允许我们给一定范围的元素给初值：

``` C
#include <stdio.h>

int array[] = {[0 ... 2] = 1, [4 ... 6] = 2};

int main(void) {
    printf("length of array: %d\n", sizeof(array) / sizeof(array[0]));
    for (int i = 0; i < sizeof(array) / sizeof(array[0]); i++) {
        printf("array[%d] = %d\t", i, array[i]);
    }
    printf("\n");
    return 0;
}

```

运行结果：

``` bash
length of array: 7
array[0] = 1	array[1] = 1	array[2] = 1	array[3] = 0	array[4] = 2	array[5] = 2	array[6] = 2
```

需要注意，三个点前后必须有空格，否则会导致编译错误。
