# 位运算

> C大师 011, 055-063

在嵌入式和算法中，位运算符非常常见。一般寄存器都是以bit为单位来操作的。因此，掌握位运算的方法，非常重要。至于位运算符什么原理，怎么用，看上面的视频。下面总结一下：

- 读取位用「与」
- 位置0用「与」`&=`，置1用「或」`|=`
- 位取反用「异或」`^=`
- 操作某个位用移位操作，例如操作`bit3`: `(1U << 3)`

下面举个例子：

``` C
#include <stdint.h>
#include <stdio.h>

/**
 * 状态寄存器
 * bit[0]:   保留
 * bit[4:1]: 要操作的步骤
 * bit[5]:   是否就绪
 * bit[6:7]: 操作结果
 */
uint8_t status_reg = 0;

#define READY_POS     5

#define OPERATE_START (1 << 1U)
#define OPERATE_STOP  (3 << 1U)
#define OPERATE_RESET (7 << 1U)
#define OPERATE_ABORT (12 << 1U)

#define RESULT_MASK   (0b11 << 6)
#define RESULT_NONE   (0 << 6U)
#define RESULT_OK     (1 << 6U)
#define RESULT_ERR    (2 << 6U)

int main(void) {
    /* 开始操作 */
    status_reg |= OPERATE_START;

    if ((status_reg & RESULT_MASK) == RESULT_OK) {
        /* 如果操作结果成功, 将就绪位置1 */
        status_reg |= (1 << READY_POS);
    } else {
        /* 否则就绪位置0 */
        status_reg &= ~(1 << READY_POS);
    }
}
```

如果你看不懂，不知道是怎么读取写入的，说明还是不够熟练，继续练习。

从x位到y位一般表示成`bit[y:x]`，y在x前面是因为低位在后面。而我们说从x到y一般是从低位到高位。而说从x到y个字节可以表示成`byte[x:y]`。

其实借助结构体位域也可以实现位操作，参照：[位域](/Cpp/ComplexStruct#%E4%BD%8D%E5%9F%9F-bit-field)