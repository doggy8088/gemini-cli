<template>
  <div class="global-footer">
    <div class="footer-content">
      <a 
        href="https://www.facebook.com/will.fans/" 
        target="_blank" 
        rel="noopener noreferrer"
        class="footer-link"
      >
        Will 保哥的技術交流中心
      </a>
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
  border-top: 1px solid #e2e8f0;
  text-align: center;
  background-color: white;
  z-index: 100;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
}

.footer-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-link {
  color: #3eaf7c;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.footer-link:hover {
  text-decoration: underline;
}

/* Add padding to body to account for fixed footer */
body {
  padding-bottom: 60px !important;
}

/* Dark mode support */
.dark .global-footer {
  background-color: #1a1a1a;
  border-top: 1px solid #333;
}

.dark .footer-link {
  color: #4ade80;
}

@media (max-width: 768px) {
  .footer-content {
    padding: 0 1rem;
  }
}
</style>
