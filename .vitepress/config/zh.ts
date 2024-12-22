import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export const zh = defineConfig({
    lang: 'zh-Hans',

    themeConfig: {
        nav: nav(),

        sidebar: {
            '/C/': { base: '/C/', items: sidebarC() },
            '/SoftwareSkill': { base: '/SoftwareSkill/', items: sidebarSoftwareSkill() },
            '/Embedded/': { base: '/Embedded/', items: sidebarEmbedded() },
            '/Linux/': { base: '/Linux/', items: sidebarLinux() },
        },

        editLink: {
            pattern: 'https://github.com/Deadline039/Deadline039.github.io/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页面'
        },

        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        outline: {
            level: 'deep',
            label: '页面导航'
        },

        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'long',
                timeStyle: 'medium'
            }
        },

        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
    }
})

function nav(): DefaultTheme.NavItem[] {
    return [
        { text: 'C语言', link: '/C' },
        { text: '软件开发技巧', link: '/SoftwareSkill' },
        { text: '嵌入式', link: '/Embedded' },
        { text: 'Linux', link: '/Linux' },
    ]
}

function sidebarC(): DefaultTheme.SidebarItem[] {
    return [
        { text: '这里有什么？', link: 'index.md' },
        {
            text: '运算符',
            items: [
                { text: '位运算', link: 'bit-calc.md' },
                { text: '运算优先级', link: 'priority-calc.md' },
            ]
        },
        {
            text: '变量',
            link: 'VariableRoom.md',
            items: [
                { text: '变量的初值', link: 'VariableInit.md' },
                { text: '整形变量', link: 'VariableInt.md' },
            ]
        },
        {
            text: '复杂数据类型',
            link: 'ComplexDataType.md',
            items: [
                { text: '枚举', link: 'ComplexEnum.md' },
                { text: '结构体', link: 'ComplexStruct.md' },
                { text: '联合体', link: 'ComplexUnion.md' },
            ]
        },
        {
            text: '数组与指针',
            link: 'Pointer.md',
            items: [
                { text: '数组', link: 'Array.md' },
                { text: '指针', link: 'PtrBasic.md' },
            ]
        },
        {
            text: '预处理命令',
            link: 'PreProcess.md',
            items: [
                { text: '#include', link: 'PPinclude.md' },
                { text: '#define与条件编译', link: 'PPdefine.md' },
            ]
        },
        { text: '函数调用约定', link: 'CallingConvention.md' },
        {
            text: 'GNU扩展',
            link: 'GNUCExtension.md',
            items: [
                {
                    text: '__attribute__关键字', link: 'GNUattribute.md',
                    items: [
                        { text: '设置变量属性', link: 'GNUattributeVariable.md' },
                        { text: '设置函数属性', link: 'GNUattributeFunction.md' },
                    ]
                },
                { text: 'switch标签范围', link: 'GNUswitchRange.md' },
                { text: '包装头文件', link: 'GNUWrapperHeaders.md' },
                { text: '数组', link: 'GNUArray.md' },
            ]
        }
    ]
}

function sidebarSoftwareSkill(): DefaultTheme.SidebarItem[] {
    return [
        { text: '这里有什么？', link: 'index.md' },
        { text: '表驱动法', link: 'TableDriven.md' },
    ]
}

function sidebarEmbedded(): DefaultTheme.SidebarItem[] {
    return [
        { text: '这里有什么？', link: 'index.md' },
        { text: 'CMSIS配置向导标注', link: 'cmsis_config_wizard.md' },
    ]
}

function sidebarLinux(): DefaultTheme.SidebarItem[] {
    return [
        { text: '这里有什么？', link: 'index.md' },
        { text: '终端光标移动技巧', link: 'CursorMove.md' },
        { text: 'VIM', link: 'vim.md' },
    ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
    zh: {
        placeholder: '搜索文档',
        translations: {
            button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
            },
            modal: {
                searchBox: {
                    resetButtonTitle: '清除查询条件',
                    resetButtonAriaLabel: '清除查询条件',
                    cancelButtonText: '取消',
                    cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                    recentSearchesTitle: '搜索历史',
                    noRecentSearchesText: '没有搜索历史',
                    saveRecentSearchButtonTitle: '保存至搜索历史',
                    removeRecentSearchButtonTitle: '从搜索历史中移除',
                    favoriteSearchesTitle: '收藏',
                    removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                    titleText: '无法获取结果',
                    helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                    searchByText: '搜索提供者'
                },
                noResultsScreen: {
                    noResultsText: '无法找到相关结果',
                    suggestedQueryText: '你可以尝试查询',
                    reportMissingResultsText: '你认为该查询应该有结果？',
                    reportMissingResultsLinkText: '点击反馈'
                }
            }
        }
    }
}