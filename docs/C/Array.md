# 数组

> C大师 115-126
>
> [The GNU C Reference Manual | 2.5 Arrays](https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html#Arrays)

下面的内容会牵扯到指针，如果你对指针不熟悉，可以先跳过。

数组，就是同一种类数据的集合。假如现在我需要一个程序来记录全班人的身高，然后求平均值，不可能说我一个人定义一个变量，然后求平均值，就像下面这样：

```

float 学生 1 的身高
float 学生 2 的身高
float 学生 3 的身高
...
float 学生 100 的身高

float 平均值 = (学生 1 的身高 + 学生 2 的身高 + ... + 学生 100 的身高) / 100

```

这显然很蠢，如果要统计1000个人，10000个人，这样写是不可能的。那么我们就可以用一个数组来存储每个学生的身高，如果要添加，只需要增加数组的大小就可以了：

```
float 学生身高[学生数量]

总身高 = 0;

for (int i = 0; i < 学生数量; ++i) {
    总身高 += 学生身高[i];
}

float 平均值 = 总身高 / 学生数量
```

这是不是比第一种方法好多了？数组就是用来解决这个问题的。

## 数组的声明与使用

声明一个数组非常简单，我们只需要：

``` C
int array[10];
```

这就声明了一个长度为10，类型为`int`，名称为`array`的数组。那么也就是说，我有10个`int`类型变量可以使用。

在标准C中，数组长度必须是大于0的正整数。既然都提到标准C了，肯定还有GNU的扩展，GNU允许我们定义长度为0的数组，参照：[零长数组](/C/GNUArray#零长数组)。

定义数组长度必须使用常量或者常量表达式，但是GNU允许我们使用变量来定义数组长度，参照：[变长数组](/C/GNUArray#变长数组)。

声明数组的时候方括号内也可以不用写长度。这种情况下编译器会根据成员的数量来创建数组的大小，例如：

``` C
#include <stdio.h>

int g_array[] = {0, 1, 2, 3};

int main(void) {
    int array[] = {1, 2, 3, 4, 5}
    printf("length of g_array: %zu\n", sizeof(g_array) / sizeof(g_array[0]));
    printf("length of array: %zu\n", sizeof(array) / sizeof(array[0]));

    return 0;
}
```

运行结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main && ./main
length of g_array: 4
length of array: 5
ubuntu@hi3798mv100:~/C-Learn$
```

可以看到，我们初始化数组的时候有几个成员，编译器会自动计算并分配给数组多大的长度。

如果不给初始值，并且我们也不指定长度，会发生什么事情呢？

``` C
int g_array[];

int main(void) {
    int array[];

    return 0;
}
```

编译结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main
main.c: In function ‘main’:
main.c:4:9: error: array size missing in ‘array’
    4 |     int array[];
      |         ^~~~~
main.c: At top level:
main.c:1:5: warning: array ‘g_array’ assumed to have one element
    1 | int g_array[];
      |     ^~~~~~~
ubuntu@hi3798mv100:~/C-Learn$
```

`array`是定义在局部变量里的，编译器提示我们定义数组需要显式定义大小或者初始化，而全局数组`g_array`，编译器不知道它的长度究竟应该多大，默认给它的长度为1。

使用数组也非常简单，`数组名[下标]`的形式就可以访问，这里注意数组下标是从0开始的，至于为什么是从0开始，这与下面所讲的数组的存储有关，这里的下标实质上就是相较于首地址的偏移量。

声明多维数组也非常简单，只需要：

``` C
int array[2][3];
```

这就创建了一个 2 * 3 的数组，长度为6。不要把多维数组想象的太难，我们就用小学五年级就学过的坐标就可以解决多维数组的问题。

> [义务教育教科书 数学 五年级 上册](https://book.pep.com.cn/1221001501141/)

我们把课本翻到第19页：

![](/C/array_1.png)

这里有一个班的学生，有5行6列，它这里是先列后行，那么我们可以定义一个6 * 5的数组，由于每个同学的名字需要一个字符串来存储，所以每个成员的类型我们用`char*`，代码我们就可以写出这样：

``` C
#include <stdio.h>

char *stu[6][5];

void init(void) {
    stu[1][2] = "张亮";
    stu[0][2] = "周明";
    stu[1][0] = "李小冬";
    stu[1][1] = "孙芳";
    stu[2][3] = "王艳";
    stu[3][2] = "赵雪";
    stu[5][2] = "王乐";
}

void print_all(void) {
    for (int j = 4; j >= 0; --j) {
        for (int i = 0; i < 6; ++i) {
            if (stu[i][j] != NULL) {
                printf("%s", stu[i][j]);
            } else {
                printf("未知");
            }
            putchar('\t');
        }
        putchar('\n');
    }
}

void print_stu(int col, int row) {
    printf("第 %d 列 %d 行的学生是：", col, row);
    --col;
    --row;
    if (stu[col][row] != NULL) {
        printf("%s", stu[col][row]);
    } else {
        printf("未知");
    }
    putchar('\n');
}

int main(void) {
    init();

    print_stu(2, 3);
    print_stu(3, 4);
    print_stu(4, 3);
    print_stu(6, 3);

    print_all();
    return 0;
}
```

运行结果：

``` bash
第 2 列 3 行的学生是：张亮
第 3 列 4 行的学生是：王艳
第 4 列 3 行的学生是：赵雪
第 6 列 3 行的学生是：王乐
未知    未知    未知    未知    未知    未知
未知    未知    王艳    未知    未知    未知
周明    张亮    未知    赵雪    未知    王乐
未知    孙芳    未知    未知    未知    未知
未知    李小冬  未知    未知    未知    未知
```

由于数组下标是从0开始的，所以我们访问数组成员的时候需要把下标减1。`stu`是一个二维数组，`stu[i]`就是一个一维数组，`stu[i][j]`就是实际的一个数组成员，就像平面直角坐标系一样，三维数组就像一个空间直角坐标系。

## 数组的初始化

有时候我们需要在声明数组的时候就给数组初值，尤其是使用`const`修饰的全局数组，常常作为常量如字库、表使用，这时候就必须给它初值了。

前面我提到了一种定义数组初始值的方法，也就是在花括号里按照顺序依次给成员给值，就像下面这样：

``` C
int arr1[3] = {0, 1, 2};
int arr2[2][3] = {{0, 1, 2},
                  {3, 4, 5}};
```

当然也可以不用给全部成员给值，有几个就给几个初值：

``` C
#include <stdio.h>

int arr1[4] = {1, 2};
int arr2[2][4] = {{1, 2}, {3, 4}};

int main(void) {
    for (int i = 0; i < 4; i++) {
        printf("arr1[%d] = %d\t", i, arr1[i]);
    }

    printf("\n");

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 4; j++) {
            printf("arr2[%d][%d] = %d\t", i, j, arr2[i][j]);
        }
        printf("\n");
    }

    return 0;
}

```

运行结果：

``` bash
arr1[0] = 1     arr1[1] = 2     arr1[2] = 0     arr1[3] = 0
arr2[0][0] = 1  arr2[0][1] = 2  arr2[0][2] = 0  arr2[0][3] = 0
arr2[1][0] = 3  arr2[1][1] = 4  arr2[1][2] = 0  arr2[1][3] = 0
```

有时候，我不想按照顺序给成员值，我就想只给某几个成员初值，那这时候怎么办呢？C99之后允许我们用下面的方法给初值：

``` C
#include <stdio.h>

int arr1[4] = {[1] 4, [3] 8};
int arr2[5] = {[2] = 5, [4] = 9};

int main(void) {
    for (int i = 0; i < 4; i++) {
        printf("arr2[%d] = %d\t", i, arr1[i]);
    }

    printf("\n");
    for (int i = 0; i < 5; i++) {
        printf("arr2[%d] = %d\t", i, arr2[i]);
    }

    return 0;
}

```

运行结果：

``` bash
arr2[0] = 0     arr2[1] = 4     arr2[2] = 0     arr2[3] = 8
arr2[0] = 0     arr2[1] = 0     arr2[2] = 5     arr2[3] = 0     arr2[4] = 9
```

注意花括号里的是数组下标，从0开始。

假如我们在声明数组的时候不定义长度，那么按照上面的方法，编译器也会根据下标来判断数组长度：

``` C
#include <stdio.h>

int array[] = {1, 2, 3, [5] = 6};

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
length of array: 6
array[0] = 1    array[1] = 2    array[2] = 3    array[3] = 0    array[4] = 0    array[5] = 6
```

可以看到，在初始化`array`的时候，我们给第5个成员给了初值，编译器自动将`array`的长度设为6。

如果你觉得这还不爽，GNU还有范围的扩展，允许我们给一个范围的成员给值，参见：[GNU扩展的数组初始化](/C/GNUArray#数组初始化)。

多维数组与一维数组是一样的，无非就是多几层而已。

## 数组的存储

从内存上看，声明一个数组，其实就是从内存中划分了一片**连续**的区域给我们使用，注意这里的连续。也就是说，数组中的每一个成员都是紧挨着的，这样做的好处是CPU可以快速访问到某个成员的位置，只需要根据首地址加上偏移量就可以了。

数组的总大小就是数组成员的个数乘以数组长度，其实这也好理解，既然要存储若干个相同数据类型的数据，就需要分配足够大的空间来存储每个成员：

``` C
#include <stdio.h>

int main(void) {
    int array[10];
    printf("Member size: %zu\n", sizeof(array[0]));
    printf("Array size: %zu\n", sizeof(array));
    printf("Array length: %zu\n", sizeof(array) / sizeof(array[0]));

    return 0;
}
```

运行结果：

``` bash
Member size: 4
Array size: 40
Array length: 10
```

`int`在32位机上占用是4字节，所以每个成员的大小是4字节，数组的长度为10，所以总共占用4 * 10 = 40字节。

::: tip
我们说大小，一般是指的它占用的内存大小，比如`int arrray[10]`我们说它大小是40字节；而长度指的是数组总共能存储多少个成员，比如上面的`array`我们说它的长度是10。

相信你也看到了，我们获取数组长度的方式就是用数组的大小除以数组成员的大小，也就是`sizeof(array) / sizeof(array[0])`。
:::

数组名就是数组成员的首地址，这是什么意思呢？上面提到了，数组其实就是一片连续的内存。那么我们访问数组的成员，就相当于访问某一块内存区域。而数组名字就相当于是一个头，它表示第一个成员的位置，我们从这里出发就可以访问我们想要的内存区域。

``` C
#include <stdio.h>

int main(void) {
    int array[10];
    printf("Address of array: %p\n", array);
    printf("Address of array[0]: %p\n", &array[0]);

    return 0;
}
```

运行结果：

``` bash
Address of array: 0xbeb8d4dc
Address of array[0]: 0xbeb8d4dc
```

下标的实际意义就是首地址加上一定的偏移量：

``` C
#include <stdio.h>

int array[5];

int main(void) {
    array[3] = 10;
    int *ptr = array + 3;
    printf("array[3] = %d\n", array[3]);
    printf("array + 3: %d\n", *ptr);

    return 0;
}
```

运行结果：

``` bash
array[3] = 10
array + 3: 10
```

我们给下标为3的成员给了10，也就是第四个成员。可以看到，用`array[3]`与`array + 3`的结果是一样的。所以，下标实际上就是一种语法糖，它的目的就是为了简化代码，提高代码的可读性。

声明一个数组，它的大小和位置就固定下来了，也就是说，它是静态的，并不是动态的。就像我们去定制一个柜子一样，做了几个格子，就只能有这么多个格子，如果要增加就只能重新定做。

如果需要一个能动态调整大小的数组，就需要用到后面的动态内存分配了。

## 数组在函数间传递

像`int, char`这类简单数据类型，在函数间传递的时候编译器会自动帮我们复制一遍他们的值，以确保返回值或者参数不会丢失。但是数组就不一样了，它是一片连续的空间，不能简单地作为传参、返回。我们前面提到过，数组的名字就是首地址，所以需要借助指针来帮我们处理这个问题。

### 数组作为返回值

来看下面代码：

``` C
#include <stdio.h>

int *new_array(void) {
    int arr[5] = {1, 2, 3, 4, 5};
    return arr;
}

int main(void) {
    int *arr = new_array();
    printf("arr = %p\n", arr);

    for (int i = 0; i < 5; ++i) {
        printf("arr[%d] = %d\t", i, arr[i]);
    }

    putchar('\n');

    return 0;
}
```

运行结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main
main.c: In function ‘new_array’:
main.c:5:12: warning: function returns address of local variable [-Wreturn-local-addr]
    5 |     return arr;
      |            ^~~
ubuntu@hi3798mv100:~/C-Learn$ ./main
arr = (nil)
Segmentation fault
ubuntu@hi3798mv100:~/C-Learn$
```

我们看到，直接发生段错误返回，`new_array`给我们返回了一个`NULL`指针，访问空指针是不允许的。你可能会疑惑，在`new_array`不是创建了一个数组吗？为什么会返回空指针？

C语言不允许我们返回局部变量的数组，如果返回一个局部变量的数组，为了安全，编译器会让这个函数返回空指针。为什么是空指针呢？一般在程序中我们都会对空指针做处理，如果返回数组的地址（即使这个数组不存在）程序一般不会处理，它属于野指针而不是空指针。相较于野指针，空指针更容易捕获。

但是如果我们将数组设为`static`，那返回这个数组的地址是可以的：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ cat main.c
#include <stdio.h>

int *new_array(void) {
    static int arr[5] = {1, 2, 3, 4, 5};
    return arr;
}

int main(void) {
    int *arr;
    arr = new_array();
    printf("arr = %p\n", arr);

    for (int i = 0; i < 5; ++i) {
        printf("arr[%d] = %d\t", i, arr[i]);
    }

    putchar('\n');

    return 0;
}
ubuntu@hi3798mv100:~/C-Learn$ gcc main.c -o main && ./main
arr = 0x4d3008
arr[0] = 1      arr[1] = 2      arr[2] = 3      arr[3] = 4      arr[4] = 5
ubuntu@hi3798mv100:~/C-Learn$
```

`static`修饰的局部变量地址是固定的。不被`static`修饰的变量，每次调用的时候都需要入栈，而调用堆栈是动态变化的，所以局部变量地址是不确定的，即使想办法把这个数组的地址返回也属于野指针。

::: tip
`static`的意思是静态，为什么是静态呢？我们刚提到过，静态的含义是指它是相对固定的，很难做扩展。`static`还有另一个含义是私有，被`static`修饰的变量只能被这个函数显式调用，虽然可以通过指针给其他函数使用，但是一般需要经过`getter setter`间接访问，相比与直接公开也更加安全。这就是OOP四大特点之一的封装。
:::

那假如说我就想返回一个数组怎么办？那就需要用到后面所说的动态内存分配了。

### 数组作为参数

怎么把一个数组作为传入一个函数呢？很简单，参数用指针或者数组：

``` C
#include <stdio.h>

#define ARRAY_LENGTH(X) (sizeof(X) / sizeof((X)[0]))

void print_array(int *arr, int size) {
    for (int i = 0; i < size; ++i) {
        printf("arr[%d] = %d\t", i, arr[i]);
    }
    putchar('\n');
}

void invert_print_array(int arr[], int size) {
    for (int i = size - 1; i >= 0; --i) {
        printf("arr[%d] = %d\t", i, arr[i]);
    }
    putchar('\n');
}

int main(void) {
    int arr[5] = {1, 2, 3, 4, 5};
    print_array(arr, ARRAY_LENGTH(arr));
    invert_print_array(arr, ARRAY_LENGTH(arr));

    return 0;
}
```

运行结果

``` bash
arr[0] = 1      arr[1] = 2      arr[2] = 3      arr[3] = 4      arr[4] = 5
arr[4] = 5      arr[3] = 4      arr[2] = 3      arr[1] = 2      arr[0] = 1
```

前面讲了，下表访问实际上就是指针偏移，所以我们把数组名也就是首地址传入就可以了，剩下的成员可以通过数组首地址来访问。

这里函数参数使用`int *arr`或者`int arr[]`是一样的，传入函数都会变成指针，就算在方括号里填入数字（`int arr[5]`）也是指针，所以我在参数处要求填入数组长度。这种数组变成指针的情况就是下面要将的数组退化指针。

### 数组退化指针

> [从C语言的数组参数退化为指针谈起 | Cugtyt](https://cugtyt.github.io/blog/2018/02211209.html)

数组和指针虽然都可以用下标的方式使用，看起来好像没有什么区别，其实是有一点区别的，我们来看下面的代码：

``` C
#include <stdio.h>

int main(void) {
    int arr[5] = {1, 2, 3, 4, 5};

    int *ptr = arr;
    printf("sizeof(arr) = %zu\n", sizeof(arr));
    printf("sizeof(ptr) = %zu\n", sizeof(ptr));

    return 0;
}
```

运行结果：

``` bash
sizeof(arr) = 20
sizeof(ptr) = 8
```

可以看到，`arr`的大小是4 * 5 = 20字节（`int`在64位机上占用4字节），而将`arr`的地址赋值给`ptr`指针后，它的大小变成了8，也就是64位机上的指针大小。

为什么呢？`sizeof`它的作用就是获取变量或者类型能最多存储多少字节的数据，数组当然是长度乘以成员大小，而指针变量的大小在64位平台上就是8字节，我们把数组的地址传给指针以后，**数组的长度丢失了！**

这种情况同样存在在函数参数里，我们来看看：

``` C
#include <stdio.h>

int arr_func1(int *arr) {
    printf("size of int *arr = %zu\n", sizeof(arr));
}

int arr_func2(int arr[]) {
    printf("size of int arr[] = %zu\n", sizeof(arr));
}

int arr_func3(int arr[5]) {
    printf("size of int arr[5] = %zu\n", sizeof(arr));
}

int main(void) {
    int arr[5] = {1, 2, 3, 4, 5};
    arr_func1(arr);
    arr_func2(arr);
    arr_func3(arr);

    return 0;
}
```

编译&运行结果：

``` bash
Deadline039@LAPTOP-83FQRJF MINGW64 /e/C-Learn
$ gcc main.c -o main.exe
main.c: In function 'arr_func2':
main.c:8:47: warning: 'sizeof' on array function parameter 'arr' will return size of 'int *' [-Wsizeof-array-argument]
     printf("size of int arr[] = %zu\n", sizeof(arr));
                                               ^
main.c:7:19: note: declared here
 int arr_func2(int arr[]) {
               ~~~~^~~~~
main.c: In function 'arr_func3':
main.c:12:48: warning: 'sizeof' on array function parameter 'arr' will return size of 'int *' [-Wsizeof-array-argument]
     printf("size of int arr[5] = %zu\n", sizeof(arr));
                                                ^
main.c:11:19: note: declared here
 int arr_func3(int arr[5]) {
               ~~~~^~~~~~

Deadline039@LAPTOP-83FQRJF MINGW64 /e/C-Learn
$ ./main.exe
size of int *arr = 8
size of int arr[] = 8
size of int arr[5] = 8

Deadline039@LAPTOP-83FQRJF MINGW64 /e/C-Learn
$
```

可以看到，编译的时候已经给我们警告了，提示我们我们用`sizeof`获取`arr`的容量将会返回`int *`的大小，运行获取的长度都是8，也就是`int *`的大小。原因上面已经说过了，将数组传递给函数参数，就相当于是把数组的首地址赋值给指针变量，会丢失长度信息。因此我们用`sizeof`获取的长度都是`int *`的大小。所以在参数中写`int arr[]`与`int arr[5]`没有区别，都是指针不会有指针信息，参数中填入的长度会被忽略。
