import{_ as e,c as n,j as i,a as l,G as p,a4 as t,B as d,o as h}from"./chunks/framework.CBloPXIQ.js";const c="/Cpp/include_header.png",y=JSON.parse('{"title":"#include","description":"","frontmatter":{},"headers":[],"relativePath":"Cpp/PPinclude.md","filePath":"Cpp/PPinclude.md","lastUpdated":1728129090000}'),o={name:"Cpp/PPinclude.md"};function k(r,s,F,g,u,E){const a=d("ArticleMetadata");return h(),n("div",null,[s[0]||(s[0]=i("h1",{id:"include",tabindex:"-1"},[i("code",null,"#include"),l(),i("a",{class:"header-anchor",href:"#include","aria-label":'Permalink to "`#include`"'},"​")],-1)),p(a),s[1]||(s[1]=t(`<blockquote><p>C 大师 184 249 250</p></blockquote><p>我想大部分人的第一个 C 语言程序都是输出 <code>Hello, world! </code> 吧，总是固定的 <code>#include &lt;stdio.h&gt;</code> ，仿佛就像英语的固定搭配一样贯穿整个 C 语言的学习过程。其实如果要深入 <code>#include</code> ，非常复杂，涉及多文件编程、项目架构设计等知识，需要一些 CMake 的知识，这里只是简单提一下，如果不理解没关系，隔段时间再来看看。</p><p>我们来看这个命令本身，include 中文意思就是包含的意思，为什么要包含？举个例子，假如你现在想组装一台电脑，那你肯定是买好主板、CPU、内存、显卡等硬件以后再组装，不可能说我从零开始造 CPU、主板，虽然理论上我们可以自己制作 CPU、主板，但是成本是巨大的，而且非常麻烦。C 语言也是一样，从调用 <code>printf</code> 到屏幕上显示的流程其实非常复杂，例如用 gcc 编译的流程： <code>printf --&gt; _write --&gt; _syscall --&gt; 系统绘图 --&gt; GPU驱动渲染 --&gt; 到屏幕显示</code> ，显然这也非常复杂，我们不可能自己写每个流程中的代码。但好消息是编译器和操作系统会帮我们处理好调用 <code>printf</code> 后的所有事，如果我们要用，就必须 <code>#include &lt;stdio.h&gt;</code> ，告诉编译器我要用的是 <code>stdio.h</code> 里声明的 <code>printf</code> 函数，编译器看到以后说 OK，我现在就把这个函数的声明加到你的源文件里。然后我们就可以调用 <code>printf</code> 打印了。</p><p>有些人发现好像不写 <code>#include &lt;stdio.h&gt;</code> 好像也可以用，编译通过没报错，其实这是编译器已经给你做好处理了，如果没有包含这个头文件，编译器看到后觉得你是不是忘加了，然后给你抛出 Warnings：</p><div class="language-C vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">C</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Hello, world! </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>MinGW64 编译结果：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">E:/C-Learn/main.c:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> In</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> function</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;main&#39;:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">E:/C-Learn/main.c:2:5:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> warning:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> implicit</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> declaration</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> of</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> function</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;printf&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [-Wimplicit-function-declaration]</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;Hello, world! \\n&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     ^~~~~~</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">E:/C-Learn/main.c:2:5:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> warning:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> incompatible</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> implicit</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> declaration</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> of</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> built-in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> function</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;printf&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">E:/C-Learn/main.c:2:5:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> note:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> include</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&lt;stdio.h&gt;&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> or</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> provide</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> a</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> declaration</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> of</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;printf&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">+#include</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">stdio.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> int</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     printf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&quot;Hello, world! \\n&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">     ^~~~~~</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>其实这也算是隐式函数声明，将会有一节专门讲定义与声明。由于隐式函数声明会造成一些非常严重的问题，因此从 C99 开始就不允许隐式函数声明了。</p><p>好了废话这么多，也该进入正题了。 <code>#include</code> 命令就是用来包含一些文件的，就是<strong>把包含文件的内容全部放到我这个文件来</strong>，这样我就可以直接用这个文件的内容了，不需要我复制粘贴一遍。理清楚这一点非常重要，编译器就是这样干的。下面用一个图简单的说一下，左边在 <code>main.c</code> 中包含后编译完的结果跟右边是一样的：</p><p><img src="`+c+`" alt="include_header" loading="lazy"></p><p><code>#include</code> 也可以包含 <code>.c</code> 文件，但是我并不推荐你这么做。用 <code>#include</code> 包含的文件编译器会在包含列表中寻找的，源文件会添加到编译列表中编译。假如有两个文件， <code>file1.c, file2.c</code> ，如果你<strong>既在 <code>file1.c</code> 中 <code>#include &quot;file2.c&quot;</code> ，又把 <code>file2.c</code> 添加到编译列表</strong>，那么 <code>file2.c</code> 会被编译两次。编译 <code>file1.c</code> 的时候编译器一看，哦有个 <code>#include &lt;file2.c&gt;</code> ，我把 <code>file2.c</code> 编译一下加到 <code>file1.o</code> 里面；编译完 <code>file2.c</code> 生成 <code>file2.o</code> ；然后链接器链接这两个 <code>.o</code> 文件的时候一看，诶怎么 <code>file1.o</code> 的东西 <code>file2.o</code> 也有？你这里有两个我到底链接那一个？然后抛出错误说重复定义了。如果能明白我上面说的想必这个也非常好理解。</p><h2 id="头文件是干什么的" tabindex="-1">头文件是干什么的 <a class="header-anchor" href="#头文件是干什么的" aria-label="Permalink to &quot;头文件是干什么的&quot;">​</a></h2><p>头文件里放一些<strong>公开的</strong>函数声明、变量声明、宏定义、类型等，只要直接或间接地 <code>#include</code> 了这个头文件，它就可以被源文件访问到。头文件也是可定义函数、变量的，但是不建议这么做，如果有很多文件都包含了这个头文件，会导致里面的函数、变量编译多次，编译时间变长。</p><p>其实 <code>.h</code> 和 <code>.c</code> 在编译器看来没有多大的区别，都是要编译的东西，只是为了方便管理人为定义的文件类型。头文件就像索引一样，把函数、变量都列出来，可以让包含它的文件去使用；源文件一般就是函数的具体实现、变量的具体定义等内容。</p><blockquote><p>头文件就像是图书馆的书籍索引，调用的时候就是记录一下我要用某本书；源文件就是具体的数，链接的时候去把这本书找到然后放在你调用的地方。</p></blockquote><h2 id="头文件保护" tabindex="-1">头文件保护 <a class="header-anchor" href="#头文件保护" aria-label="Permalink to &quot;头文件保护&quot;">​</a></h2><p>为什么需要对头文件保护？在一个程序中一个头文件不可能只被包含一次，但这会有一个问题，每个源文件每包含一次就需要编译一次（），当编译完成链接的时候就出问题了，这么多文件都有一模一样的宏定义等东西，到底该链接那个？然后就抛出错误说重复定义。所以我们应该控制链接器只链接一个。因此我们在头文件中常常会这样写：</p><div class="language-C vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">C</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#ifndef</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> __XXX_H</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> __XXX_H</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* ... */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#endif</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> /* __XXX_H */</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>这段代码的意思是如果没有定义 <code>__XXX_H</code> ，就定义 <code>__XXX_H</code> ，换句话说如果定义了那么下面的东西就不需要了。链接器去链接的时候：第一个 <code>.o</code> 没定义 <code>__XXX_H</code> ，定义一下，把这里面的东西都保留下来；第二个 <code>.o</code> 已经定义了 <code>__XXX_H</code> ，直接跳过这部分到 <code>#endif /* __XXX_H */</code> 。这样就避免了链接器发现重复定义，也就是保护了头文件。</p><p>如果你觉得上面的方法不优雅，费键盘，也可以在头文件开头写上一句： <code>#pragma once</code> ，这也是保护头文件的一种方法。效果更上面是一样的。但需要注意的是一些老的编译器可能不支持这一指令。</p><blockquote><p>这里要注意编译器是按源文件编译列表去<strong>逐个编译</strong>，并不是把所有文件全部放到一起去编译。如果把所有文件都放在一起，只修改了一个源文件，而去编译所有源文件，这显然会增加编译时间，而且也不合理。尤其是一些例如 Chrome, Linux 之类大型项目，光编译就要几个小时，根本等不起。</p></blockquote><h2 id="include-next" tabindex="-1"><code>#include_next</code> <a class="header-anchor" href="#include-next" aria-label="Permalink to &quot;\`#include_next\`&quot;">​</a></h2><blockquote><p><a href="https://gcc.gnu.org/onlinedocs/cpp/Wrapper-Headers.html" target="_blank" rel="noreferrer">Wrapper Headers (The C Preprocessor)</a></p></blockquote><p>如果你阅读过 GCC 头文件源码，应该还会发现 <code>#include_next</code> 这样一个指令。这个指令是来自 GNU 的扩展，VS 默认的 MSVC 不支持。那这个指令是干什么的呢？其实上面 GNU 的文档已经说的比较明白了。下面我只是简单的翻译一下。</p><p>假如你的项目中已经有一个头文件 <code>A.h</code> 了，但是 <code>A.h</code> 不能满足需求，我想修改 <code>A.h</code> 的内容。我没有权限直接修改或删除 <code>A.h</code> 。最主要的问题是还必须得用 <code>A.h</code> 这个文件名，而且还得用旧的 <code>A.h</code> 里的内容。那这怎么办呢？先不管其他的创建一个 <code>A.h</code> 再说。创建后怎么处理旧的 <code>A.h</code> ？有下面几个问题：</p><ul><li>在新的头文件中直接包含旧的 <code>A.h</code> ，即 <code>#include &quot;A.h&quot;</code> 。但这有个问题，头文件一般都会做编译保护，引入旧的 <code>A.h</code> 可能不会被编译；如果删除了编译保护，两个文件将会无限 <code>#include</code> 循环导致编译错误</li><li>在新的头文件中用绝对路径包含旧的 <code>A.h</code> ，这不会产生上面的问题，但是如果文件被移动，或者其他系统没有这个文件也不能编译</li></ul><p>在 ISO C 中无法解决这个问题，但是可以用 GNU 的扩展指令， <code>#include_next &quot;filename&quot;</code> 。意思是去包含目录里找下一个叫 <code>filename</code> 的文件。它跟 <code>#include</code> 很像，但是不同的一点是不会有上面所说的编译保护问题。</p><p>虽然可以用这个方法修改一些只读头文件的内容，但是 GNU 并不推荐你这么做，这会造成很大的混乱。我现在引用的这个东西，是来自新的 <code>A.h</code> ？还是旧的 <code>A.h</code> 。除非你的别无它法的时候才能用这个指令。</p>`,28))])}const b=e(o,[["render",k]]);export{y as __pageData,b as default};
