import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  title: 'Gemini CLI Documentation',
  description: 'Comprehensive guide to installing, using, and developing Gemini CLI',
  base: '/',
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Core', link: '/core/' },
      { text: 'Tools', link: '/tools/' },
      { text: 'Contributing', link: '/CONTRIBUTING.html' }
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
        'tos-privacy'
      ],
      '/cli/': [
        'cli/',
        'cli/commands',
        'cli/configuration',
        'cli/authentication',
        'cli/themes',
        'cli/token-caching',
        'cli/tutorials'
      ],
      '/core/': [
        'core/',
        'core/tools-api'
      ],
      '/tools/': [
        'tools/',
        'tools/file-system',
        'tools/multi-file',
        'tools/shell',
        'tools/web-fetch',
        'tools/web-search',
        'tools/memory',
        'tools/mcp-server'
      ]
    }
  })
})