# GNU对ISO C的扩展

> [C Extensions (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/C-Extensions.html)

GNU的GCC编译器对ISO C语言做了很多扩展，这使得C语言能完成更多复杂的功能。比如半精度浮点数、嵌套函数定义、128位超大整数等等标准C里没有的功能，非常NB。这里只说一些我见过或者用过的一些语法。

但是，如果你的C代码需要在MSVC, GCC, Clang等多个编译器下编译，那么需要做好兼容性处理。

怎么做兼容性处理呢？当然就是按照不同的编译器去编译不同的代码。那么怎么判断编译器呢？答案是条件编译。

在标准C中，会定义`__STDC__`与`__STDC_VERSION__`宏，我们可以通过这两个宏判断C标准：

| 标准   | 宏                           |
| ------ | ---------------------------- |
| C89/90 | `__STDC__`                   |
| C99    | `__STDC_VERSION__ = 199901L` |
| C11    | `__STDC_VERSION__ = 201112L` |

同样的，不同的编译器会自己定义一些特有的宏，比如GCC的`__GNUC__`，clang的`__clang__`等等。下面的代码可以简单判断当前的编译器，通过这种方式可以避免一些编译问题：

``` C
#include <stdio.h>

int main(void) {
#if defined(__GNUC__)
    printf("GCC Compiler\n");
#endif   /* __GNUC__ */

#if defined(_MSC_VER)
    printf("MSVC Compiler\n");
#endif   /* _MSC_VER */

#if defined(__clang__)
    printf("Clang Compiler\n");
#endif   /* __clang__ */
}

```
