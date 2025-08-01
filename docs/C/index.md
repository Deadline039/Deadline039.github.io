# C语言

这里主要讲一些C语言的知识。

<h1> <b>最吊C语言，没有之一：<br>
<a href="https://www.bilibili.com/video/av238869905/">C语言大师：编得狂，骂得响[前篇]</a><br>
<a href="https://www.bilibili.com/video/av1250963900/">C语言大师：编得狂，骂得响[后篇]</a></b><br>
</h1>

---

这里很少讲基础的语法，会有大量的代码，如果你对语法不熟练（比如搞不清楚`for`循环），自行根据上面两个链接的视频学习。

我会标注这部分知识在视频中的位置（以标题的标号为主，比如`P17 011-2.小学数学0-二进制`，我会标注011，而非P17。175小节前的都在前篇），以及添加部分文档、博客供参考。

没有顺序，想到什么写什么。

出现的编译环境：

- Windows 10 22H2 x86-64: MinGW-W64 gcc 8.1.0

- Windows 10 22H2 x86-64: Clang 18.1.6

- Windows 10 22H2 x86-64: MSVC(v143) VS2022 C++ x64/x86

- Ubuntu 20.04 armv7l aarch32 (hi3798mv100): gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.2)

- macOS Sequoia 15.4 arm64-apple-darwin24.4.0 Apple M4: Clang Apple clang version 17.0.0 (clang-1700.0.13.3)

除去非标准C的部分，大部分情况下这些编译环境的结果没有太大的差别，如果有差别我会指出。
