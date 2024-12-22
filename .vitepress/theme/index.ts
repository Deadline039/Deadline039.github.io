// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import ArticleMetadata from "./components/ArticleMetadata.vue"
import backtotop from "./components/backtotop.vue"
import { useData, useRoute } from 'vitepress';
import './styles/index.css'
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import { h } from 'vue'
import MyLayout from './components/MyLayout.vue'
import MNavLinks from './components/MNavLinks.vue'

export default {
    extends: DefaultTheme,

    Layout: () => {
        const props: Record<string, any> = {}
        // 获取 frontmatter
        const { frontmatter } = useData()


        /* 添加自定义 class */
        if (frontmatter.value?.layoutClass) {
            props.class = frontmatter.value.layoutClass
        }

        return h(DefaultTheme.Layout, props, {
            'doc-footer-before': () => h(backtotop), // 使用doc-footer-before插槽
        })
    },

    enhanceApp({ app, router }) {
        app.component('ArticleMetadata', ArticleMetadata);
        app.component('MNavLinks', MNavLinks)
    },


    setup() {
        // Get frontmatter and route
        const { frontmatter } = useData();
        const route = useRoute();

        giscusTalk({
            repo: 'Deadline039/Deadline039.github.io',
            repoId: 'R_kgDOK84jog',
            category: 'Announcements',
            categoryId: 'DIC_kwDOK84jos4CjDk8',
            mapping: 'pathname',
            inputPosition: 'bottom',
        },
            {
                frontmatter, route
            },
            true
        );

        const initZoom = () => {
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
            mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
        };
        onMounted(() => {
            initZoom();
        });
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );

    }
}