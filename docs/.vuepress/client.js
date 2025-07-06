import { defineClientConfig } from '@vuepress/client'
import GlobalFooter from './components/GlobalFooter.vue'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // Register global component
    app.component('GlobalFooter', GlobalFooter)
  },
  setup() {
    // Add footer to every page
  },
  rootComponents: [GlobalFooter],
})
