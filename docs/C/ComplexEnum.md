# 枚举

> C大师 182 184

其实枚举不算是太复杂的数据类型，但是很多人对枚举并不了解。你可能觉得枚举没什么用，但其实枚举非常强大。枚举说白了就是列举一组常量，方便阅读与调试。

枚举相比与直接用`#define`，会更方便。要注意的是枚举的成员是以逗号结尾，这一点与结构体和联合体不同。

如果不定义成员初值，默认从0开始递增。如果中间有个成员定义初值，后面的成员会从这个成员的值开始递增。

``` C
enum {
    MEMBER1, /* = 0 */
    MEMBER2, /* = 1 */
    MEMBER3, /* = 2 */
};

enum {
    MEMBER1 = 1,
    MEMBER2, /* = 2 */
    MEMBER3, /* = 3 */
};

enum {
    MEMBER1, /* = 0 */
    MEMBER2, /* = 1 */
    MEMBER3, /* = 2 */
    MEMBER4 = 1,
    MEMBER5, /* = 2 */
    MEMBER6  /* = 3 */
};
```

**枚举也是一种数据类型**，用枚举可以定义变量。那你可能会问枚举这种类型有什么用呢？枚举就是把变量所有可能取的值列出来，并用标识符标记。主要定义一些有限的事物，比如星期、月份、状态码、错误码等。

当一个变量只有几种取值的时候，就可以考虑用枚举。枚举在调试时显示当前枚举所定义的标识符，而宏定义只有一个数字。

枚举常常与`switch-case`搭配使用。`switch-case`的意思是根据不同的情况做不同的事情，那么我们就可以用枚举来定义不同的情况，然后用`switch-case`处理。下面举一个案例：

``` C
#include <stdio.h>
#include <string.h>

typedef enum {
    ROOT = 0U,
    ADMIN,
    USER,
    GUEST
} identity_t;

typedef struct {
    char name[10];
    char password[30];
    identity_t identity;
} user_t;

void delete_root_file(user_t *user) {
    char password[30];
    printf("User name: %s\n", user->name);

    puts("Please Input password: ");
    gets(password);
    if (strcmp(password, user->password)) {
        puts("Password error! \n");
        return;
    }

    switch (user->identity) {
        case ROOT:
        case ADMIN: {
            puts("Deleted root file. \n");
        } break;

        case USER:
        case GUEST: {
            puts("Permission Denied. \n");
        } break;

        default: {
            puts("Unknown User. \n");
        } break;
    }
}

int main(void) {
    user_t root = {"root", "123456", ROOT};
    user_t user = {"user", "123456", USER};
    user_t guest = {"guest", "123456", GUEST};

    delete_root_file(&root);
    delete_root_file(&user);
    delete_root_file(&guest);

    return 0;
}

```

运行结果：
``` bash
User name: root
Please Input password:
123456
Deleted root file.

User name: user
Please Input password:
123456
Permission Denied.

User name: guest
Please Input password:
123456
Permission Denied.

```

这里用枚举简单定义了几个用户权限级别，只有`ROOT, ADMIN`级别的用户才可以删除`root`文件，其他用户操作提示`Permission Denied.`，当然这个案例比较简单，你可以带到实际的程序中去思考怎么使用枚举。

既然枚举可以定义情况，那么我们就可以用枚举定义状态实现状态机。参照软件工程常用方法。

如果你还是觉得枚举没什么用，多说无用，我们来看看freemodbus的源码：

``` C
/* https://github.com/cwalter-at/freemodbus/blob/f16701094ca64df3a0366dde1c186a55976d61e4/modbus/rtu/mbrtu.c#L61 */
typedef enum
{
    STATE_TX_IDLE,              /*!< Transmitter is in idle state. */
    STATE_TX_XMIT               /*!< Transmitter is in transfer state. */
} eMBSndState;

static volatile eMBSndState eSndState;

/* https://github.com/cwalter-at/freemodbus/blob/f16701094ca64df3a0366dde1c186a55976d61e4/modbus/rtu/mbrtu.c#L284 */
BOOL
xMBRTUTransmitFSM( void )
{
    BOOL            xNeedPoll = FALSE;

    assert( eRcvState == STATE_RX_IDLE );

    switch ( eSndState )
    {
        /* We should not get a transmitter event if the transmitter is in
         * idle state.  */
    case STATE_TX_IDLE:
        /* enable receiver/disable transmitter. */
        vMBPortSerialEnable( TRUE, FALSE );
        break;

    case STATE_TX_XMIT:
        /* check if we are finished. */
        if( usSndBufferCount != 0 )
        {
            xMBPortSerialPutByte( ( CHAR )*pucSndBufferCur );
            pucSndBufferCur++;  /* next byte in sendbuffer. */
            usSndBufferCount--;
        }
        else
        {
            xNeedPoll = xMBPortEventPost( EV_FRAME_SENT );
            /* Disable transmitter. This prevents another transmit buffer
             * empty interrupt. */
            vMBPortSerialEnable( TRUE, FALSE );
            eSndState = STATE_TX_IDLE;
        }
        break;
    }

    return xNeedPoll;
}

```

这里用枚举定义了发送状态，然后用`switch-case`来进行处理。枚举用来处理状态、错误时非常有用，而且非常容易扩展，多用就知道它的好处了。