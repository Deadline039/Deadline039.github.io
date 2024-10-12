# GNU扩展的`switch`标签语法

在使用`switch-case`时，怎么判断范围？比如判断字符`A-Z`，你可能会用`if (ch >= 'A' && ch <= 'Z') {}`，这也不是不行。~~但是`switch-case`看上去就比`if-else`更优雅。~~

GNU允许我们可以`case`范围，这样就实现了优雅的范围判断：

``` C
#include <stdio.h>

int main(void) {
    char ch;
    ch = getchar();

    switch (ch) {
        case '0' ... '9': {
            puts("Number\n");
        } break;

        case 'a' ... 'z': {
            puts("Lowercase");
        } break;

        case 'A' ... 'Z': {
            puts("Uppercase\n");
        } break;
    }

    return 0;
}
```