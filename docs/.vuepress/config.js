import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  title: 'Gemini CLI 使用手冊',
  description: '安裝、使用和開發 Gemini CLI 的完整指南',
  base: '/',
  bundler: viteBundler(),
  theme: defaultTheme({
    // Configure the prismjs plugin to support syntax highlighting for batch/cmd files
    themePlugins: {
      prismjs: {
        preloadLanguages: ['markdown', 'jsdoc', 'yaml', 'batch'],
      },
    },
    navbar: [
      { text: '首頁', link: '/' },
      { text: '命令列介面', link: '/cli/' },
      { text: '核心概念', link: '/core/' },
      { text: '工具執行', link: '/tools/' },
      { text: '開源貢獻', link: '/CONTRIBUTING.html' },
      { text: '報名課程', link: 'https://learn.duotify.com/go/ai-coding-agent' }
    ],
    sidebar: {
      '/': [
        '',
        'deployment',
        'architecture',
        'checkpointing',
        'extension',
        'telemetry',
        'troubleshooting',
        'tos-privacy',
        'npm',
        'integration-tests',
        'quota-and-pricing',
        'sandbox',
        'Uninstall'
      ],
      '/cli/': [
        '',
        'commands',
        'configuration',
        'authentication',
        'themes',
        'token-caching',
        'tutorials'
      ],
      '/core/': [
        '',
        'tools-api',
        'memport'
      ],
      '/tools/': [
        '',
        'file-system',
        'multi-file',
        'shell',
        'web-fetch',
        'web-search',
        'memory',
        'mcp-server'
      ]
    },
    // Add footer configuration using editLink and lastUpdated
    editLink: false,
    lastUpdated: true,
    contributors: true,
    // Custom footer using slots
    slots: {
      // This will add footer content
    }
  })
})