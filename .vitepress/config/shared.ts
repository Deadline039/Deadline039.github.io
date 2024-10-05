import { defineConfig } from 'vitepress'
import { search as zhSearch } from './zh'
import PanguPlugin from 'markdown-it-pangu'

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
    },

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