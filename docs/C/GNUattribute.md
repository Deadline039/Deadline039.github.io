# `__attribute__`关键字

> [Attribute Syntax (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html)

`attribute`的意思是属性，那它可以设置什么属性呢？什么都可以设置属性，变量、函数、结构体、`switch`标签，等等都可以。它是作为关键字存在在编译器中，也就是说，它跟`if, for, while`的地位是一样的。

`__attribute__`的语法是`__attribute__((attribute-list))`，没错，需要两层括号。这里只是简单讲一下设置变量和函数的属性，更多内容可以参考[GNU官方文档](https://gcc.gnu.org/onlinedocs/gcc/C-Extensions.html)。
