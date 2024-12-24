# 地址与内存

> C大师 154-163

在变量的开篇我提到了，变量就是一片内存。内存里的东西就是变量的值。既然是内存，那么就需要编号来记录内存的位置。就像一栋楼一样，楼里的每个房间都会有它**唯一的**编号，这样快递员就可以按照地址找到房间，然后把快递送到我们手上。假如房间编号不是唯一的，或者一个编号对应多个房间，那么快递员找房间就会非常麻烦，甚至找不到。

对于计算机也是一样，如果我们想要操作某一块内存，那么就需要知道它的地址，而且要保证地址是唯一的。

## 取地址

> C大师 155

前面提到，变量就是一片内存区域，或者可以比喻成房间，那么我们怎么获取到这个房间的编号呢？答案就是使用取地址运算符：

``` C
#include <stdio.h>

int main(void) {
    int number;
    printf("Address of number: %p\n", &number);
    return 0;
}
```

GCC9.4.0 32位机编译，运行结果：

``` bash
Address of number: 0xbed1c500
```

这里打印了`number`变量的地址，32位机上的变量地址大小是4字节，所以这里输出了一个32位的整数。我们用`&`运算符可以获取到一个变量的地址。

::: tip
`%p`是用来输出地址的格式控制符。
:::

## 指针变量

> C大师 156-158

我们获得了一个变量的地址，还需要解决如何存储的问题。如果不存下来，每次操作都需要取一次变量的地址，就会显得特别麻烦。而存储地址的数据类型我们就叫做指针，也就是说，指针变量存储的就是地址。指针存储的是变量的地址，指针变量就像一个箭头，它指向的就是一块内存区域，我们随时可以通过指针所存储的地址去访问到我们要操作的内存。

我们知道，变量是有类型的。那取地址得到的数据类型是什么呢？就是它变量类型对应的指针类型。也就是说，所有数据类型都会有它的指针类型。怎么声明它所对应的指针类型变量？很简单，变量名前加一个星号（`*`），代表这个变量是这种类型的指针变量。例如，声明一个指针变量，并获取另一个变量的地址，并把它打印出来：

``` C
#include <stdio.h>

int main(void) {
    int number;
    int *ptr = &number;
    printf("Address of number : %p\n", ptr);

    return 0;
}
```

GCC9.4.0 32位机编译，运行结果：

``` bash
Address of number: 0xbe9144fc
```

这里先声明了一个`int`型的变量`number`，还声明了一个`int*`型的指针变量`ptr`，然后把`number`的地址赋给`ptr`，并把它打印出来，可以看到，`number`的地址是`0xbe9144fc`。

不知道你有没有注意到，这里的`printf`输出`ptr`的值的时候我们没有加`&`取地址符，而上一节用`printf`输出`number`的地址的时候加了取地址符，也就是`&number`，那输出`ptr`的时候为什么不加呢？

`ptr`已经是一个指针变量了，也就是说它存储的内容本身就是一个地址，我们要输出`ptr`的内容，`ptr`本身就是一个变量，如果再加一个取地址符号`&ptr`，它代表的是`ptr`变量的地址。*这里我们要输出的是`ptr`的内容，而不是`ptr`的地址。*

单纯得到这一个地址可能没有多大的用处，稍后我们会详细讲解它的强大。

::: warning
有些代码风格会把星号放在类型一边，也就是`int* ptr`，但是我不推荐这样做。你可能想问，这与`int *ptr`有什么区别呢？先别着急，看看这行代码的两个变量分别是什么类型：

``` C
int* ptr1, ptr2;
```

`ptr1`与`ptr2`都是`int`指针变量？错误，`ptr1`是`int*`型的指针变量，但是`ptr2`是 **`int`型的变量，它不是指针！**

所以我们要求把星号放在变量一侧，也就是`int *ptr1, ptr2`， **强调`ptr1`是一个指针**；而`int* ptr1, ptr2`的写法更像是强调这两个变量是`int*`类型的变量，也就是指针类型。
:::

知道了一个变量的地址，怎么获取地址所存储的内容呢？答案是使用取内容运算符`*`：

``` C
#include <stdio.h>

int main(void) {
    int number = 10;
    int *ptr = &number;

    printf("number is %d, ptr content: %d\n", number, *ptr);

    *ptr = 20;
    printf("number is %d, ptr content: %d\n", number, *ptr);
    return 0;
}
```

GCC9.4.0 32位机编译，运行结果：

``` bash
number is 10, ptr content: 10
number is 20, ptr content: 20
```

这里我将`number`变量的地址赋给了`ptr`，然后通过`printf`输出`ptr`的内容。可以看到，`*ptr`输出的内容与`number`一致。后面我通过`ptr`指针把`ptr`所指向的内容修改为了20，同样的我们可以看到`number`的值也被修改为了20。也就是说，`*`不仅可以用来访问变量，而且也可以用来修改地址所对应变量的内容。

`&`与`*`是一对互逆的运算，`&`是取地址，`*`是取地址里的内容。

## 指针有什么用？

> C大师 159

讲了一大堆，那你可能会问，这指针究竟有什么用呢？这里Frank举了一个例子：快捷方式。

大家在Windows上安装软件，或多或少都会见到过说是否要在桌面、开始菜单等地方创建快捷方式吧，就像下面这样：

![安装时询问是否创建快捷方式](/C/ptrBasic_1.png)

为什么要有快捷方式呢？废话，快捷方式的意思就是让你用**快捷、方便**的方式去打开它。这里我们随便找一个快捷方式打开属性看一下：

![快捷方式属性](/C/ptrBasic_2.png)

你说快捷方式左下角的箭头是什么意思？是不是指针的意思？它是不是指向一个程序？快捷方式就像一种指针，它指向的目标是一个文件：

> 文件路径的意义就是文件的地址，所以快捷方式存储的就是文件的地址。这跟我们前面将的指针像不像？

![实际指向的文件](/C/ptrBasic_3.png)

如果让你打开一个程序，需要从这么长的路径里去找，那你估计会疯掉。Windows的开发人员显然也意识到了这个问题，因此他们设计了快捷方式这么一个东西。

> 当然快捷方式不止指向文件，还可以指向文件夹、网站等。不过大多数快捷方式还是指向文件。

不知道有多少人小时候去网吧偷偷拷游戏，拷了桌面的一大堆快捷方式，然后到自己家的电脑上发现一个都打不开，这是因为快捷方式它只是指向文件，当目标文件丢失了自然也就打不开：

![快捷方式目标丢失](/C/ptrBasic_4.png)

翻译：快捷方式所**指向**的项目`ffmpeg.exe`已经被删除，但是可以从回收站里恢复。你要恢复这个文件，还是删除这个快捷方式？

仔细理解一下，然后再开始下面的内容。