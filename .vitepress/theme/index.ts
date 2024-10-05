// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import ArticleMetadata from "./components/ArticleMetadata.vue"
import { useData, useRoute } from 'vitepress';

export default {
    extends: DefaultTheme,

    enhanceApp({ app, router }) {
        app.component('ArticleMetadata', ArticleMetadata)
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

    }
}