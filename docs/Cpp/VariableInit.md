# 变量的初值

全局变量和`static`变量的初始值必须在**编译时**就确定的，如果变量不是在编译时确定的，那么就会报错。例如：

``` C
int a_demo_function(void) {
    return 1;
}

int global_variable = a_demo_function();

int main(void) {
    static int local_static_variable = a_demo_function();

    return 0;
}
```

编译结果：

```bash
E:/C_Learn/main.c:6:23: error: initializer element is not constant
    6 | int global_variable = a_demo_function();
      |                       ^~~~~~~~~~~~~~~
E:/C_Learn/main.c: In function 'main':
E:/C_Learn/main.c:9:40: error: initializer element is not constant
    9 |     static int local_static_variable = a_demo_function();
      |                                        ^~~~~~~~~~~~~~~
```

如果给全局变量初始值，它的初值必须在运行前就确定，如果运行前初值不确定，必然报错。

虽然`a_demo_function()`的返回值永远是1，但是在编译器看来这个函数需要执行才可以得到返回值，`global_value`的初始值不确定，因此编译报错。

而对于局部变量，初始值可以在运行时才确定，因此下面的代码不会报错：

``` C
int a_demo_function(void) {
    return 1;
}

int main(void) {
    int local_static_variable = a_demo_function();

    return 0;
}
```

其实这里涉及到两个概念：编译时(Compile Time)和运行时(RunTime)。

顾名思义，编译时就是编译时候的动作，编译时的操作对象是源代码文件，生成可执行文件。其中会涉及到语法检查、类型检查、优化、链接等操作。

运行时就是指运行时的动作，比如动态内存分配、动态链接等操作。