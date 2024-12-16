# 数组

> C大师 115-126
>
> [The GNU C Reference Manual | 2.5 Arrays](https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html#Arrays)

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

在标准C中，数组长度必须是大于0的正数。既然都提到标准C了，肯定还有GNU的扩展，GNU允许我们定义长度为0的数组，参照：[零长数组](/C/GNUArray#零长数组)。

定义数组长度必须使用常量或者常量表达式，但是GNU允许我们使用变量来定义数组长度，参照：[变长数组](/C/GNUArray#变长数组)。

声明数组的时候方括号内也可以不用写长度。这种情况下编译器会根据元素的数量来创建数组的大小，例如：

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

可以看到，我们初始化数组的时候有几个元素，编译器会自动计算并分配给数组多大的长度。

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

这里有一个班的学生，有5行6列，它这里是先列后行，那么我们可以定义一个6 * 5的数组，由于每个同学的名字需要一个字符串来存储，所以每个元素的类型我们用`char*`，代码我们就可以写出这样：

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

前面我提到了一种定义数组初始值的方法，也就是在花括号里按照顺序依次给元素给值，就像下面这样：

``` C
int arr1[3] = {0, 1, 2};
int arr2[2][3] = {{0, 1, 2},
                  {3, 4, 5}};
```

当然也可以不用给全部元素给值，前面给几个就有几个值：

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

有时候，我不想按照顺序给元素值，我就想只给某几个元素初值，那这时候怎么办呢？C99之后允许我们用下面的方法给初值：

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

可以看到，在初始化`array`的时候，我们给第5个元素给了初值，编译器自动将`array`的长度设为6。

如果你觉得这还不爽，GNU还有范围的扩展，允许我们给一个范围的元素给值，参见：[GNU扩展的数组初始化](/C/GNUArray#数组初始化)。

多维数组与一维数组是一样的，无非就是多几层而已。

## 数组的存储

从内存上看，定义一个数组，其实就是从内存中划分了一片**连续**的区域给我们使用，注意这里的连续。

