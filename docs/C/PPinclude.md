# `#include`

> C大师 184 249 250
>
> [Header Files (The C Preprocessor)](https://gcc.gnu.org/onlinedocs/cpp/Header-Files.html)

我想大部分人的第一个C语言程序都是输出`Hello, world! `吧，总是固定的`#include <stdio.h>`，仿佛就像英语的固定搭配一样贯穿整个C语言的学习过程。其实如果要深入`#include`，非常复杂，涉及多文件编程、项目架构设计等知识，需要一些CMake的知识，这里只是简单提一下，如果不理解没关系，隔段时间再来看看。

我们来看这个命令本身，include中文意思就是包含的意思，为什么要包含？举个例子，假如你现在想组装一台电脑，那你肯定是买好主板、CPU、内存、显卡等硬件以后再组装，不可能说我从零开始造CPU、主板，虽然理论上我们可以自己制作CPU、主板，但是成本是巨大的，而且非常麻烦。C语言也是一样，从调用`printf`到屏幕上显示的流程其实非常复杂，例如用gcc编译的流程：`printf --> _write --> _syscall --> 系统绘图 --> GPU驱动渲染 --> 到屏幕显示`，显然这也非常复杂，我们不可能自己写每个流程中的代码。但好消息是编译器和操作系统会帮我们处理好调用`printf`后的所有事，如果我们要用，就必须`#include <stdio.h>`，告诉编译器我要用的是`stdio.h`里声明的`printf`函数，编译器看到以后说OK，我现在就把这个函数的声明加到你的源文件里。然后我们就可以调用`printf`打印了。

有些人发现好像不写`#include <stdio.h>`好像也可以用，编译通过没报错，其实这是编译器已经给你做好处理了，如果没有包含这个头文件，编译器看到后觉得你是不是忘加了，然后给你抛出Warnings：

``` C
int main(void) {
    printf("Hello, world! \n");
    
    return 0;
}
```

MinGW64编译结果：

``` bash
E:/C-Learn/main.c: In function 'main':
E:/C-Learn/main.c:2:5: warning: implicit declaration of function 'printf' [-Wimplicit-function-declaration]
     printf("Hello, world! \n");
     ^~~~~~
E:/C-Learn/main.c:2:5: warning: incompatible implicit declaration of built-in function 'printf'
E:/C-Learn/main.c:2:5: note: include '<stdio.h>' or provide a declaration of 'printf'
+#include <stdio.h>
 int main(void) {
     printf("Hello, world! \n");
     ^~~~~~
```

其实这是隐式函数声明，将会有一节专门讲定义与声明。由于隐式函数声明会造成一些非常严重的问题，因此从C99开始就不允许隐式函数声明了。

好了废话这么多，也该进入正题了。`#include`命令就是用来包含一些文件的，就是**把包含文件的内容全部放到我这个文件来**，这样我就可以直接用这个文件的内容了，不需要我复制粘贴一遍。理清楚这一点非常重要，编译器就是这样干的。下面用一个图简单的说一下，左边在`main.c`中包含后编译完的结果跟右边是一样的：

![include_header](/C/include_header.png)

`#include`也可以包含`.c`文件，但是我并不推荐你这么做。用`#include`包含的文件编译器会在包含列表中寻找的，源文件会添加到编译列表中编译。假如有两个文件，`file1.c, file2.c`，如果你**既在`file1.c`中`#include "file2.c"`，又把`file2.c`添加到编译列表**，那么`file2.c`会被编译两次。编译`file1.c`的时候编译器一看，哦有个`#include <file2.c>`，我把`file2.c`编译一下加到`file1.o`里面；编译完`file2.c`生成`file2.o`；然后链接器链接这两个`.o`文件的时候一看，诶怎么`file1.o`的东西`file2.o`也有？你这里有两个我到底链接那一个？然后抛出错误说重复定义了。如果能明白我上面说的想必这个也非常好理解。

## 头文件是干什么的

头文件里放一些**公开的**函数声明、变量声明、宏定义、类型等，只要直接或间接地`#include`了这个头文件，它就可以被源文件访问到。头文件也是可定义函数、变量的，但是不建议这么做，如果有很多文件都包含了这个头文件，会导致里面的函数、变量编译多次，编译时间变长。

其实`.h`和`.c`在编译器看来没有多大的区别，都是要编译的东西，只是为了方便管理人为定义的文件类型。头文件就像索引一样，把函数、变量都列出来，可以让包含它的文件去使用；源文件一般就是函数的具体实现、变量的具体定义等内容。

> 头文件就像是图书馆的书籍索引，调用的时候就是记录一下我要用某本书；源文件就是具体的书，链接的时候去把这本书找到然后放在你调用的地方。

## 头文件保护

为什么需要对头文件保护？在一个程序中一个头文件不可能只被包含一次，但这会有一个问题，每个源文件每包含一次就需要编译一次，当编译完成链接的时候就出问题了，这么多文件都有一模一样的宏定义等东西，到底该链接那个？然后就抛出错误说重复定义。所以我们应该控制链接器只链接一个。因此我们在头文件中常常会这样写：

``` C
#ifndef __XXX_H
#define __XXX_H
/* ... */
#endif /* __XXX_H */
```

这段代码的意思是如果没有定义`__XXX_H`，就定义`__XXX_H`，换句话说如果定义了那么下面的东西就不需要了。链接器去链接的时候：第一个`.o`没定义`__XXX_H`，定义一下，把这里面的东西都保留下来；第二个`.o`已经定义了`__XXX_H`，直接跳过这部分到`#endif /* __XXX_H */`。这样就避免了链接器发现重复定义，也就是保护了头文件。

如果你觉得上面的方法不优雅，费键盘，也可以在头文件开头写上一句：`#pragma once`，这也是保护头文件的一种方法。效果更上面是一样的。但需要注意的是一些老的编译器可能不支持这一指令。

> 这里要注意编译器是按源文件编译列表去**逐个编译**，并不是把所有文件全部放到一起去编译。如果把所有文件都放在一起，只修改了一个源文件，而去编译所有源文件，这显然会增加编译时间，而且也不合理。尤其是一些例如Chrome, Linux之类大型项目，光编译就要几个小时，根本等不起。

## 头文件路径

> [Include Syntax (The C Preprocessor)](https://gcc.gnu.org/onlinedocs/cpp/Include-Syntax.html)
>
> [Search Path (The C Preprocessor)](https://gcc.gnu.org/onlinedocs/cpp/Search-Path.html)

我们知道，`#include`可以用尖括号与引号两种方式。在我以前的的印象中，尖括号是用来包含诸如`stdio.h`这类的C库文件的，引号用来包括我们自己的头文件。但尖括号真的只能用来包括C库文件吗？当然不是。

使用双引号的头文件，查找头文件的顺序为：

1. 在源文件所在目录里查找

2. 编译器设置的头文件查找路径，编译器默认的头文件查找路径（也就是`stdio.h`这类编译器自带的头文件路径）

3. 环境变量`CPLUS_INCLUDE_PATH`与`C_INCLUDE_PATH`指定的头文件路径

使用尖括号的头文件，查找头文件顺序为：

1. 编译器设置的头文件查找路径，编译器默认的头文件查找路径（也就是`stdio.h`这类编译器自带的头文件路径）

2. 环境变量`CPLUS_INCLUDE_PATH`与`C_INCLUDE_PATH`指定的头文件路径

我们看到，尖括号相比与引号少了第一条，那估计你看了还是有一点懵，这到底有什么区别？多说无用，上代码。

先看看我们文件结构：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ tree
.
├── build
├── CMakeLists.txt
├── main.c
├── moduleA
│   ├── moduleA.c
│   └── moduleA.h
└── moduleB
    ├── moduleB.c
    └── moduleB.h

3 directories, 6 files
```

`CMakeList.txt`：

```
cmake_minimum_required(VERSION 3.0)
project(C_Learn C)

set(CMAKE_C_STANDARD 11)

include_directories(
    "moduleA"
)

add_executable(C_Learn
    main.c
    moduleA/moduleA.c
    moduleB/moduleB.c
)
```

大概解释一下这个文件的意思，`include_directories`是指定编译器的`-I`参数，也就是上面所说的编译器设置的头文件查找路径，注意这里**我们只添加了`moduleA`文件夹，而`moduleB`文件没有添加进去。** `add_executable`指的是要编译的文件，以相对路径的形式添加，当然也可以用绝对路径，但是我并不推荐你这样做。

`moduleA.c`文件：

``` C
/**
 * @file    moduleA.c
 * @author  Deadline039
 * @brief   Module A.
 * @version 1.0
 * @date    2024-12-13
 */

#include <moduleA.h>
#include <stdio.h>

void moduleA(void) {
    printf("moduleA\n");
}

```

`moduleB.c`文件：

``` C
/**
 * @file    moduleB.c
 * @author  Deadline039
 * @brief   Module B.
 * @version 1.0
 * @date    2024-12-13
 */

#include <moduleB.h>
#include <stdio.h>

void moduleB(void) {
    printf("moduleB\n");
}
```

`main.c`就一个`main`函数，而且只有一个`return 0`，这里我们主要看编译结果。

``` bash
ubuntu@hi3798mv100:~/C-Learn/build$ cmake ..
-- The C compiler identification is GNU 9.4.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/ubuntu/C-Learn/build
ubuntu@hi3798mv100:~/C-Learn/build$ make
Scanning dependencies of target C_Learn
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
[ 50%] Building C object CMakeFiles/C_Learn.dir/moduleA/moduleA.c.o
[ 75%] Building C object CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o
/home/ubuntu/C-Learn/moduleB/moduleB.c:9:10: fatal error: moduleB.h: No such file or directory
    9 | #include <moduleB.h>
      |          ^~~~~~~~~~~
compilation terminated.
make[2]: *** [CMakeFiles/C_Learn.dir/build.make:89: CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o] Error 1
make[1]: *** [CMakeFiles/Makefile2:76: CMakeFiles/C_Learn.dir/all] Error 2
make: *** [Makefile:84: all] Error 2
ubuntu@hi3798mv100:~/C-Learn/build$
```

我们看到，他在编译`moduleB.c`时候报错了，说找不到`moduleB.h`这个头文件，但是在`moduleA.c`中编译没有报错，这是由于我们把`moduleA`这个目录已经添加到了`CMakeLists.txt`的`include_directories`当中，我们用尖括号来引用他当然是可以的。这里有三种解决办法：

1. 把尖括号换成引号

2. 把`moduleB`文件夹添加到`CMakeLists.txt`中的`include_directories`中。

3. 添加`C_INCLUDE_PATH`环境变量：

``` bash
ubuntu@hi3798mv100:~/C-Learn/build$ export C_INCLUDE_PATH="/home/ubuntu/C-Learn/moduleB"
ubuntu@hi3798mv100:~/C-Learn/build$ echo $C_INCLUDE_PATH
/home/ubuntu/C-Learn/moduleB
ubuntu@hi3798mv100:~/C-Learn/build$ make
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
[ 50%] Building C object CMakeFiles/C_Learn.dir/moduleA/moduleA.c.o
[ 75%] Building C object CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o
[100%] Linking C executable C_Learn
[100%] Built target C_Learn
ubuntu@hi3798mv100:~/C-Learn/build$
```

还是这个文件结构，这里我不把`moduleB`添加到`include_directories`或者环境变量中。如何在`main.c`中包括`moduleB.h`这个头文件呢？这里可以使用相对路径和绝对路径包含。

`moduleB.c`

``` C
/**
 * @file    moduleB.c
 * @author  Deadline039
 * @brief   Module B.
 * @version 1.0
 * @date    2024-12-13
 */

#include "moduleB.h"
#include <stdio.h>

void moduleB(void) {
    printf("moduleB\n");
}
```

在`main.c`中使用相对路径：

``` C
/**
 * @file    main.c
 * @author  Deadline039
 * @brief   Main function.
 * @version 1.0
 * @date    2024-12-13
 */

#include "./moduleB/moduleB.h"

int main(void) {
    moduleB();
    return 0;
}
```

编译结果：

``` Bash
ubuntu@hi3798mv100:~/C-Learn/build$ make clean
ubuntu@hi3798mv100:~/C-Learn/build$ make
Scanning dependencies of target C_Learn
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
[ 50%] Building C object CMakeFiles/C_Learn.dir/moduleA/moduleA.c.o
[ 75%] Building C object CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o
[100%] Linking C executable C_Learn
[100%] Built target C_Learn
ubuntu@hi3798mv100:~/C-Learn/build$ ./C_Learn
moduleB
ubuntu@hi3798mv100:~/C-Learn/build$
```

> 这里的`./`代表的是当前目录下

使用绝对路径：

``` C
/**
 * @file    main.c
 * @author  Deadline039
 * @brief   Main function.
 * @version 1.0
 * @date    2024-12-13
 */

/* 这里 moduleB.h 的绝对路径将会在下面展示 */
#include "/home/ubuntu/C-Learn/moduleB/moduleB.h"

int main(void) {
    moduleB();
    return 0;
}
```

编译结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ ls -l $PWD/moduleB/moduleB.h
-rw-rw-r-- 1 ubuntu ubuntu 229 Dec 13 23:07 /home/ubuntu/C-Learn/moduleB/moduleB.h
ubuntu@hi3798mv100:~/C-Learn$ vim main.c
ubuntu@hi3798mv100:~/C-Learn$ cd build && make clean && make
Scanning dependencies of target C_Learn
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
[ 50%] Building C object CMakeFiles/C_Learn.dir/moduleA/moduleA.c.o
[ 75%] Building C object CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o
[100%] Linking C executable C_Learn
[100%] Built target C_Learn
ubuntu@hi3798mv100:~/C-Learn/build$
```

这里并不推荐使用绝对路径，绝对路径的位置会随着操作系统的环境不同而改变，除非是别无他法，否则不要使用绝对路径。

当然了，使用相对路径也遵守上面所说的查找顺序，用引号先找源文件目录下的，再找`include_directories`下的，最后找环境变量下的。还是最开始的`CMakeLists.txt`，没有添加`moduleB`文件夹。看看下面两种情况：

1. 使用尖括号的相对路径：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ vim main.c
ubuntu@hi3798mv100:~/C-Learn$ cd build && make clean && make
Scanning dependencies of target C_Learn
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
/home/ubuntu/C-Learn/main.c:9:10: fatal error: ./moduleB/moduleB.h: No such file or directory
    9 | #include <./moduleB/moduleB.h>
      |          ^~~~~~~~~~~~~~~~~~~~~
compilation terminated.
make[2]: *** [CMakeFiles/C_Learn.dir/build.make:63: CMakeFiles/C_Learn.dir/main.c.o] Error 1
make[1]: *** [CMakeFiles/Makefile2:76: CMakeFiles/C_Learn.dir/all] Error 2
make: *** [Makefile:84: all] Error 2
ubuntu@hi3798mv100:~/C-Learn/build$
```

尖括号不会在源文件目录下查找文件，所以编译报错。

2. 在`include_directories`的`moduleA`文件夹下使用相对路径：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ vim main.c
ubuntu@hi3798mv100:~/C-Learn$ cat main.c
/**
 * @file    main.c
 * @author  Deadline039
 * @brief   Main function.
 * @version 1.0
 * @date    2024-12-13
 */

#include <../moduleB/moduleB.h>

int main(void) {
    moduleB();
    return 0;
}
ubuntu@hi3798mv100:~/C-Learn$ cd build && make clean && make
Scanning dependencies of target C_Learn
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
[ 50%] Building C object CMakeFiles/C_Learn.dir/moduleA/moduleA.c.o
[ 75%] Building C object CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o
[100%] Linking C executable C_Learn
[100%] Built target C_Learn
ubuntu@hi3798mv100:~/C-Learn/build$ ./C_Learn
moduleB
ubuntu@hi3798mv100:~/C-Learn/build$
```

> 这里稍微说明一下，两个点代表上一级目录。`include_directories`下只有`moduleA`文件夹，根据上面的文件树结构，要想在`moduleA`文件夹下访问`moduleB.h`，就需要回退到上一级目录，进入`moduleB`文件夹，因此就是`../moduleB/moduleB.h`

## 判断头文件是否存在

> [__has_include (The C Preprocessor)](https://gcc.gnu.org/onlinedocs/cpp/_005f_005fhas_005finclude.html)

怎么判断头文件是否存在？我们可以用`__has_include`这个预处理命令来判断，注意这个命令的意思是**头文件是否可以被访问到**，而不是头文件有没有被包含。使用这个命令可以避免一些编译错误，以处理头文件丢失的情况。

还是上一节的文件结构，我们在`main.c`里这样写：

``` C
/**
 * @file    main.c
 * @author  Deadline039
 * @brief   Main function.
 * @version 1.0
 * @date    2024-12-13
 */

#ifdef __has_include

#if __has_include(<moduleA.h>)
#pragma message "Found moduleA.h! "
#include <moduleA.h>
#endif /* __has_include(<moduleA.h>) */

#if __has_include(<moduleB.h>)
#pragma message "Found moduleB.h! "
#else  /* __has_include(<moduleB.h>) */
#warning "Can not found moudleB.h, use balabala instead. "
#endif /* __has_include(<moduleB.h>) */

#endif /* __has_include */

int main(void) {

    return 0;
}
```

编译结果：

``` bash
ubuntu@hi3798mv100:~/C-Learn$ cd build && make clean && make
Scanning dependencies of target C_Learn
[ 25%] Building C object CMakeFiles/C_Learn.dir/main.c.o
/home/ubuntu/C-Learn/main.c:12:9: note: #pragma message: Found moduleA.h!
   12 | #pragma message "Found moduleA.h! "
      |         ^~~~~~~
/home/ubuntu/C-Learn/main.c:18:2: warning: #warning "Can not found moudleB.h, use balabala instead. " [-Wcpp]
   18 | #warning "Can not found moudleB.h, use balabala instead. "
      |  ^~~~~~~
[ 50%] Building C object CMakeFiles/C_Learn.dir/moduleA/moduleA.c.o
[ 75%] Building C object CMakeFiles/C_Learn.dir/moduleB/moduleB.c.o
[100%] Linking C executable C_Learn
[100%] Built target C_Learn
```

在代码中，我们如果能找到`moduleA.h`，我们就让编译器提示可以找到，并且将它包含。由于`moduleB.h`并不可以通过尖括号直接访问到，因此我们这里抛出一个警告，提示用户`moduleB.h`无法访问，需要用其他头文件替代，并且编译也不会报错。
