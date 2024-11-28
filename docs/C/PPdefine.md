# `#define`与条件编译

`#define`的意思是定义，也叫宏定义。用它可以定义一些常数、运算，相比与直接用数字，`#define`的可读性更高，也更好维护。宏（Macro），意思是宏观的，能做用到整个文件甚至整个程序。

## 运算优先级问题

`#define`最简单的用法就是定义数字，比如`#define PI 3.14`。但是要注意，`#define`只是简单的替换，他不会检查运算顺序，因此可能产生我们预料之外的结果：

``` C
#include <stdio.h>

#define A_MARCO_NUMBER 2 + 2

int main(void) {
    printf("3 * A_MARCO_NUMBER = %d. ", 3 * A_MARCO_NUMBER);

    return 0;
}
```

运行结果：

``` bash
3 * A_MARCO_NUMBER = 8.
```

按照直觉我们觉得结果应该是12，即`A_MACRO_NUMBER = 2 + 2 = 4, 3 * 4 = 12`。但别忘了，宏定义只是简单的替换，实际是：`3 * A_MACRO_NUMBER = 3 * 2 + 2 = 6 + 2 = 8`。这种情况我们就需要用括号把数字括起来，即`#define A_MACRO_NUMBER (2 * 2)`。

宏定义除了可以定义数字，还可以定义运算，比如`#define SQUARE(X) (X * X)`，它的作用是求一个数的平方，如果代码中有大量求平方的运算，用它可以简化代码，提升可读性。但别忘了，宏定义是简单的替换：

``` C
#include <stdio.h>

#define SQUARE(X) (X * X)

int main(void) {
    printf("Square of 4: %d\n", SQUARE(4));
    printf("Square of 2 + 2: %d\n", SQUARE(2 + 2));
    
    return 0;
}
```

运行结果：

``` bash
Square of 4: 16
Square of 2 + 2: 8

```

第一个结果，4的平方是16，没问题；第二个结果，不应该是`2 + 2 = 4, 4 * 4 = 16`吗？别忘了，宏定义只是简单的替换，`SQUARE(2 + 2) = 2 + 2 * 2 + 2 = 8`。如果要用宏定义运算，需要**把操作数和结果用括号小心地括起来**，以避免运算优先级的问题。上述宏定义应该写成：`#define SQUARE(X) ((X) * (X))`
