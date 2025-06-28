<template><div><h1 id="權杖快取與成本優化" tabindex="-1"><a class="header-anchor" href="#權杖快取與成本優化"><span>權杖快取與成本優化</span></a></h1>
<p>當使用 API 金鑰驗證 (Gemini API 金鑰或 Vertex AI) 時，Gemini CLI 會透過權杖快取自動優化 API 成本。此功能會重複使用先前的系統指令與上下文，以減少後續請求中處理的權杖數量。</p>
<p><strong>權杖快取適用於：</strong></p>
<ul>
<li>API 金鑰使用者 (Gemini API 金鑰)</li>
<li>Vertex AI 使用者 (已設定專案和地區)</li>
</ul>
<p><strong>權杖快取不適用於：</strong></p>
<ul>
<li>OAuth 使用者 (Google 個人/企業帳戶) - Code Assist API 目前不支援建立快取內容</li>
</ul>
<p>您可以使用 <code v-pre>/stats</code> 指令來檢視您的權杖用量和因快取而節省的權杖。當有可用的快取權杖時，它們將會顯示在統計資料輸出中。</p>
</div></template>


