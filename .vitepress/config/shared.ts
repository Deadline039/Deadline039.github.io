import { defineConfig } from 'vitepress'
import { search as zhSearch } from './zh'
import PanguPlugin from 'markdown-it-pangu'
import implicitFigures from 'markdown-it-implicit-figures'

export const shared = defineConfig({

    title: 'Deadline039',
    description: "My Knowledge base",
    srcDir: "docs",

    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,
    themeConfig: {
        search: {
            provider: 'local'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/Deadline039/' }
        ],
        footer: {
            message: 'Powered by VitePress, deployed by Github & Vercel. ',
        }
    },

    head: [
        ["script", { src: "/_vercel/insights/script.js", defer: true }],
        ['link', { rel: 'icon', href: '/logo.ico' }],
    ],

    markdown: {
        math: true,
        lineNumbers: true,
        config: (md) => {
            md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
                let htmlResult = slf.renderToken(tokens, idx, options);
                if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
                return htmlResult;
            };
            md.use(PanguPlugin);
            md.use(implicitFigures, {
                figcaption: true,
                copyAttrs: '^class$'
            });
        },

        codeTransformers: [
            // We use `[!!code` in demo to prevent transformation, here we revert it back.
            {
                postprocess(code) {
                    return code.replace(/\[\!\!code/g, '[!code')
                }
            }
        ],
        image: {
            lazyLoading: true
        }
    },
})