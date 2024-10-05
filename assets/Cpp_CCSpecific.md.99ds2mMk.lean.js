import{_ as n,c as t,j as i,a as e,G as p,a4 as l,B as h,o as k}from"./chunks/framework.CBloPXIQ.js";const F=JSON.parse('{"title":"如何指定调用约定","description":"","frontmatter":{},"headers":[],"relativePath":"Cpp/CCSpecific.md","filePath":"Cpp/CCSpecific.md","lastUpdated":1728129090000}'),r={name:"Cpp/CCSpecific.md"};function d(E,s,c,o,g,y){const a=h("ArticleMetadata");return k(),t("div",null,[s[0]||(s[0]=i("h1",{id:"如何指定调用约定",tabindex:"-1"},[e("如何指定调用约定 "),i("a",{class:"header-anchor",href:"#如何指定调用约定","aria-label":'Permalink to "如何指定调用约定"'},"​")],-1)),p(a),s[1]||(s[1]=l(`<p>在函数名前加 <code>__callName</code> 。例如:</p><div class="language-C vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">C</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> __stdcall </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> param1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> param2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> __cdecl </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> param1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> param2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> __thiscall </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> param1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> param2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>`,2))])}const u=n(r,[["render",d]]);export{F as __pageData,u as default};
