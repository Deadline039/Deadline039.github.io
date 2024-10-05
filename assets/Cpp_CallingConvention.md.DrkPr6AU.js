import{_ as l,c as n,j as a,a as o,G as r,a4 as i,B as c,o as s}from"./chunks/framework.CBloPXIQ.js";const u=JSON.parse('{"title":"函数调用约定","description":"","frontmatter":{},"headers":[],"relativePath":"Cpp/CallingConvention.md","filePath":"Cpp/CallingConvention.md","lastUpdated":1728129090000}'),p={name:"Cpp/CallingConvention.md"};function d(f,e,h,m,C,g){const t=c("ArticleMetadata");return s(),n("div",null,[e[0]||(e[0]=a("h1",{id:"函数调用约定",tabindex:"-1"},[o("函数调用约定 "),a("a",{class:"header-anchor",href:"#函数调用约定","aria-label":'Permalink to "函数调用约定"'},"​")],-1)),r(t),e[1]||(e[1]=i('<blockquote><p><a href="https://www.laruence.com/2008/04/01/116.html" target="_blank" rel="noreferrer">关于调用约定 (cdecl、fastcall、stcall、thiscall) 的一点知识 - 风雪之隅</a></p><p><a href="https://en.wikipedia.org/wiki/Calling_convention" target="_blank" rel="noreferrer">Calling convention - Wikipedia</a></p><p><a href="https://learn.microsoft.com/en-us/cpp/cpp/calling-conventions?view=msvc-170" target="_blank" rel="noreferrer">Calling Conventions | Microsoft Learn</a></p></blockquote><p>函数调用约定是指一个函数调用另一个函数参数传递方式以及返回结果方式的约定。他主要规定：</p><ul><li>参数如何压栈</li><li>调用前谁来压栈，调用后谁来清栈</li><li>返回值如何返回</li></ul><p>常见的调用约定有:</p><ul><li><code>stdcall</code></li><li><code>cdecl</code></li><li><code>fastcall</code></li><li><code>thiscall</code></li><li><code>nakedcall</code></li></ul><p>下面的内容需要一点 x86 和 ARM 汇编的知识。可参照：<a href="https://hackeyes.github.io/2021/04/22/X86%E6%B1%87%E7%BC%96%E5%9F%BA%E7%A1%80/" target="_blank" rel="noreferrer">X86 汇编基础 - Hackeyes | Hackeye</a>, <a href="https://chan-shaw.github.io/2020/03/20/arm%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/" target="_blank" rel="noreferrer">arm 汇编语言学习笔记 | 安和桥南丶的博客</a></p>',6))])}const _=l(p,[["render",d]]);export{u as __pageData,_ as default};
