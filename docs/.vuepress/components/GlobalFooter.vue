<template>
  <div class="global-footer">
    <div class="footer-content">
      本網站由 <a href="https://blog.miniasp.com/">Will 保哥</a> 翻譯、建置與維護，歡迎追蹤
      <a href="https://www.facebook.com/will.fans/" 
        target="_blank" rel="noopener noreferrer" class="footer-link">
        Will 保哥的技術交流中心
      </a>
      粉絲團。
    </div>
  </div>
</template>

<style>
.global-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 0;
  border-top: 1px solid var(--c-border, #e2e8f0);
  text-align: center;
  background-color: var(--c-bg, white);
  z-index: 100;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.footer-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-link {
  color: var(--c-brand, #3eaf7c);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  text-decoration: underline;
  color: var(--c-brand-light, #4ade80);
}

/* Add padding to body to account for fixed footer */
body {
  padding-bottom: 60px !important;
}

/* Dark mode support using VuePress theme variables */
html.dark .global-footer {
  background-color: var(--c-bg-dark, #1a1a1a);
  border-top: 1px solid var(--c-border-dark, #333);
  box-shadow: 0 -2px 4px rgba(255,255,255,0.1);
}

html.dark .footer-link {
  color: var(--c-brand-dark, #4ade80);
}

html.dark .footer-link:hover {
  color: var(--c-brand-light-dark, #6ee7b7);
}

/* Alternative dark mode selector for different VuePress versions */
[data-theme="dark"] .global-footer {
  background-color: var(--c-bg-dark, #1a1a1a);
  border-top: 1px solid var(--c-border-dark, #333);
  box-shadow: 0 -2px 4px rgba(255,255,255,0.1);
}

[data-theme="dark"] .footer-link {
  color: var(--c-brand-dark, #4ade80);
}

[data-theme="dark"] .footer-link:hover {
  color: var(--c-brand-light-dark, #6ee7b7);
}

@media (max-width: 768px) {
  .footer-content {
    padding: 0 1rem;
  }
}
</style>
