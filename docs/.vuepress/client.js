import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // Footer will be added via setup function
  },
  setup() {
    // Add footer to page on mount
    if (typeof window !== 'undefined') {
      import('vue').then(({ nextTick }) => {
        nextTick(() => {
          const addFooter = () => {
            if (document.querySelector('.global-footer')) return // Already added
            
            const footer = document.createElement('div')
            footer.innerHTML = '<footer class="global-footer"><div class="footer-content"><a href="https://learn.duotify.com/go/ai-coding-agent" target="_blank">AI 程式設計代理人開發全攻略：從入門到實戰</a></div></footer>'
            
            // Add some basic styling
            const style = document.createElement('style')
            style.textContent = `
              .global-footer {
                background-color: var(--c-bg-light);
                border-top: 1px solid var(--c-border);
                padding: 1rem 0;
                text-align: center;
                margin-top: 2rem;
              }
              .footer-content {
                max-width: 1140px;
                margin: 0 auto;
                padding: 0 1.5rem;
              }
              .footer-content a {
                color: var(--c-brand);
                text-decoration: none;
                font-weight: 500;
              }
              .footer-content a:hover {
                text-decoration: underline;
              }
              html.dark .global-footer {
                background-color: var(--c-bg-dark);
              }
            `
            document.head.appendChild(style)
            
            // Find the main content area and append footer
            const main = document.querySelector('.theme-default-content') || document.querySelector('main')
            if (main) {
              main.appendChild(footer)
            }
          }
          
          // Add footer initially
          addFooter()
          
          // Re-add footer on route changes
          router.afterEach(() => {
            nextTick(addFooter)
          })
        })
      })
    }
  }
})