import{_ as p,c as e,j as n,a as l,G as i,a4 as c,B as r,o as t}from"./chunks/framework.CBloPXIQ.js";const y=JSON.parse('{"title":"表驱动法","description":"","frontmatter":{},"headers":[],"relativePath":"SoftwareSkill/TableDriven.md","filePath":"SoftwareSkill/TableDriven.md","lastUpdated":1728129090000}'),b={name:"SoftwareSkill/TableDriven.md"};function d(o,s,m,u,h,k){const a=r("ArticleMetadata");return t(),e("div",null,[s[0]||(s[0]=n("h1",{id:"表驱动法",tabindex:"-1"},[l("表驱动法 "),n("a",{class:"header-anchor",href:"#表驱动法","aria-label":'Permalink to "表驱动法"'},"​")],-1)),i(a),s[1]||(s[1]=c(`<blockquote><p>参照：<a href="https://cchroot.github.io/2020/05/23/%E8%A1%A8%E9%A9%B1%E5%8A%A8%E6%B3%95/" target="_blank" rel="noreferrer">表驱动法 | cchroot&#39;s blog</a></p></blockquote><p>表驱动法可以简化判断逻辑，并且速度快，易于维护。</p><p>表驱动法的核心是表，所以也叫查表法。</p><p>举个例子，我们虽然可以通过泰勒展开计算 sin 1 这类非特殊角度的三角函数，但显然非常费事费力。但如果我们事先将 0 ~ 90 度的所有三角函数值写在一张纸上，那么得到 sin 1 的值就非常简单，直接查表就可以了。ARM DSP 库的三角函数就是用这个方法实现的。</p><p>再举个例子，假如我有一个遥控器，有 6 个按键，编号 <code>KEY0 ~ KEY5</code> ，对应数字 0~5，每个按键对应不同的功能，而且更复杂的是 <code>KEY1, KEY2, KEY3</code> 还作为模式切换，不同模式下某些按键的功能还不一样。假设功能表是下面的：</p><table tabindex="0"><thead><tr><th>Key</th><th>mode1</th><th>mode2</th><th>mode3</th></tr></thead><tbody><tr><td>KEY0</td><td>shutdown</td><td>shutdown</td><td>shutdown</td></tr><tr><td>KEY1</td><td>switch_mode1</td><td>switch_mode1</td><td>switch_mode1</td></tr><tr><td>KEY2</td><td>switch_mode2</td><td>switch_mode2</td><td>switch_mode2</td></tr><tr><td>KEY3</td><td>switch_mode3</td><td>switch_mode3</td><td>switch_mode3</td></tr><tr><td>KEY4</td><td>Play Music</td><td>Play Radio</td><td>Increase volume</td></tr><tr><td>KEY5</td><td>Stop Music</td><td>Stop Radio</td><td>Decrease volume</td></tr></tbody></table><p>假如不用表驱动，就用 <code>if-else, switch-case</code> ，那么代码将会是这样：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void key_scan() {</span></span>
<span class="line"><span>    // scan the key ...</span></span>
<span class="line"><span>    switch (key) {</span></span>
<span class="line"><span>        case KEY0: {</span></span>
<span class="line"><span>            shutdown();</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case KEY1: {</span></span>
<span class="line"><span>            mode = 1;</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case KEY2: {</span></span>
<span class="line"><span>            mode = 2;</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case KEY3: {</span></span>
<span class="line"><span>            mode = 3;</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case KEY4: {</span></span>
<span class="line"><span>            if (mode == 1) {</span></span>
<span class="line"><span>                play_music();</span></span>
<span class="line"><span>            } else if (mode == 2) {</span></span>
<span class="line"><span>                play_radio();</span></span>
<span class="line"><span>            } else if (mode == 3) {</span></span>
<span class="line"><span>                increase_volume();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        case KEY5: {</span></span>
<span class="line"><span>            if (mode == 1) {</span></span>
<span class="line"><span>                stop_music();</span></span>
<span class="line"><span>            } else if (mode == 2) {</span></span>
<span class="line"><span>                stop_radio();</span></span>
<span class="line"><span>            } else if (mode == 3) {</span></span>
<span class="line"><span>                decrease_volume();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        default: {</span></span>
<span class="line"><span>        } break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br></div></div><p>虽然用了 <code>switch-case</code> ，看着也不是太复杂，假如有非常多的按键，这里的判断逻辑将会变得非常复杂。可以用数组 + 函数指针来简化代码：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void (*key_callback)(int /* key */)[5] = {shutdown,    switch_mode, switch_mode,</span></span>
<span class="line"><span>                                          switch_mode, play_music,  stop_music};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void switch_mode(int key) {</span></span>
<span class="line"><span>    if (key == KEY1) {</span></span>
<span class="line"><span>        key_callback[KEY4] = play_music;</span></span>
<span class="line"><span>        key_callback[KEY5] = stop_music;</span></span>
<span class="line"><span>    } else if (key == KEY2) {</span></span>
<span class="line"><span>        key_callback[KEY4] = play_radio;</span></span>
<span class="line"><span>        key_callback[KEY5] = stop_radio;</span></span>
<span class="line"><span>    } else if (key == KEY3) {</span></span>
<span class="line"><span>        key_callback[KEY4] = increase_volume;</span></span>
<span class="line"><span>        key_callback[KEY5] = decrease_volume;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void key_scan() {</span></span>
<span class="line"><span>    // scan the key ...</span></span>
<span class="line"><span>    key_callback[key_press](key_press);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>如果我们要切换模式，只需要修改表中的函数指针就可以了，不需要多余的判断，而且扩展非常方便。</p><blockquote><p>如果你对函数指针不熟悉，请复习 C 语言基础。</p></blockquote><p>如果使用 Python，那么用字典就可以了，非常方便。</p><p>其他应用参照上面的链接。</p>`,14))])}const v=p(b,[["render",d]]);export{y as __pageData,v as default};
