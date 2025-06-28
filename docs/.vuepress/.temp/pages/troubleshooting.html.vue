<template><div><h1 id="故障排除指南" tabindex="-1"><a class="header-anchor" href="#故障排除指南"><span>故障排除指南</span></a></h1>
<p>本指南提供常見問題的解決方案與除錯技巧。</p>
<h2 id="認證" tabindex="-1"><a class="header-anchor" href="#認證"><span>認證</span></a></h2>
<ul>
<li>
<p><strong>錯誤：<code v-pre>Failed to login. Message: Request contains an invalid argument</code></strong></p>
<ul>
<li>擁有 Google Workspace 帳戶的使用者，或其 Gmail 帳戶已關聯 Google Cloud 帳戶的使用者，可能無法啟用 Google Code Assist 方案的免費層級。</li>
<li>對於 Google Cloud 帳戶，您可以透過設定
<code v-pre>GOOGLE_CLOUD_PROJECT</code> 為您的專案 ID 來解決此問題。</li>
<li>您也可以從 <a href="http://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">AI Studio</a> 取得 API 金鑰，該金鑰也包含一個獨立的免費層級。</li>
</ul>
</li>
</ul>
<h2 id="常見問題-faqs" tabindex="-1"><a class="header-anchor" href="#常見問題-faqs"><span>常見問題 (FAQs)</span></a></h2>
<ul>
<li>
<p><strong>問：如何將 Gemini CLI 更新至最新版本？</strong></p>
<ul>
<li>答：若透過 npm 全域安裝，請使用指令 <code v-pre>npm install -g @google/gemini-cli@latest</code> 更新 Gemini CLI。若從原始碼執行，請從儲存庫拉取最新變更，並使用 <code v-pre>npm run build</code> 重新建構。</li>
</ul>
</li>
<li>
<p><strong>問：Gemini CLI 的設定檔儲存在哪裡？</strong></p>
<ul>
<li>答：CLI 設定儲存在兩個 <code v-pre>settings.json</code> 檔案中：一個位於您的家目錄，另一個位於您專案的根目錄。在這兩個位置，<code v-pre>settings.json</code> 都位於 <code v-pre>.gemini/</code> 資料夾內。更多詳細資訊請參考 <RouteLink to="/cli/configuration.html">CLI 設定</RouteLink>。</li>
</ul>
</li>
<li>
<p><strong>問：為什麼我在統計資料輸出中看不到快取權杖的數量？</strong></p>
<ul>
<li>答：快取權杖的資訊只有在使用快取權杖時才會顯示。此功能目前適用於 API 金鑰使用者 (Gemini API 金鑰或 Vertex AI)，但不適用於 OAuth 使用者 (Google 個人/企業帳戶)，因為 Code Assist API 不支援快取內容的建立。您仍然可以使用 <code v-pre>/stats</code> 指令查看您的總權杖用量。</li>
</ul>
</li>
</ul>
<h2 id="常見錯誤訊息與解決方案" tabindex="-1"><a class="header-anchor" href="#常見錯誤訊息與解決方案"><span>常見錯誤訊息與解決方案</span></a></h2>
<ul>
<li>
<p><strong>錯誤：啟動 MCP 伺服器時出現 <code v-pre>EADDRINUSE</code> (Address already in use)。</strong></p>
<ul>
<li><strong>原因：</strong> 有另一個程序已在使用 MCP 伺服器嘗試綁定的連接埠。</li>
<li><strong>解決方案：</strong>
停止正在使用該連接埠的其他程序，或將 MCP 伺服器設定為使用不同的連接埠。</li>
</ul>
</li>
<li>
<p><strong>錯誤：找不到指令 (嘗試執行 Gemini CLI 時)。</strong></p>
<ul>
<li><strong>原因：</strong> Gemini CLI 未正確安裝或未在您系統的 PATH 中。</li>
<li><strong>解決方案：</strong>
<ol>
<li>確保 Gemini CLI 安裝成功。</li>
<li>若為全域安裝，請檢查您的 npm 全域二進位檔目錄是否在您的 PATH 中。</li>
<li>若從原始碼執行，請確保您使用正確的指令來呼叫它 (例如 <code v-pre>node packages/cli/dist/index.js ...</code>)。</li>
</ol>
</li>
</ul>
</li>
<li>
<p><strong>錯誤：<code v-pre>MODULE_NOT_FOUND</code> 或匯入錯誤。</strong></p>
<ul>
<li><strong>原因：</strong> 相依套件未正確安裝，或專案尚未建構。</li>
<li><strong>解決方案：</strong>
<ol>
<li>執行 <code v-pre>npm install</code> 以確保所有相依套件都已存在。</li>
<li>執行 <code v-pre>npm run build</code> 來編譯專案。</li>
</ol>
</li>
</ul>
</li>
<li>
<p><strong>錯誤：「Operation not permitted」、「Permission denied」或類似錯誤。</strong></p>
<ul>
<li><strong>原因：</strong> 如果啟用了沙箱模式，應用程式很可能正在嘗試執行受沙箱限制的操作，例如寫入專案目錄或系統暫存目錄之外的位置。</li>
<li><strong>解決方案：</strong> 關於更多資訊，包括如何自訂您的沙箱設定，請參閱 <RouteLink to="/cli/configuration.html#sandboxing">沙箱模式</RouteLink>。</li>
</ul>
</li>
</ul>
<h2 id="除錯技巧" tabindex="-1"><a class="header-anchor" href="#除錯技巧"><span>除錯技巧</span></a></h2>
<ul>
<li>
<p><strong>CLI 除錯：</strong></p>
<ul>
<li>使用 CLI 指令的 <code v-pre>--verbose</code> 旗標 (如果可用) 以取得更詳細的輸出。</li>
<li>檢查 CLI 日誌，通常位於使用者特定的設定或快取目錄中。</li>
</ul>
</li>
<li>
<p><strong>核心除錯：</strong></p>
<ul>
<li>檢查伺服器主控台輸出中的錯誤訊息或堆疊追蹤。</li>
<li>如果可設定，請提高日誌的詳細程度。</li>
<li>如果需要逐步執行伺服器端程式碼，請使用 Node.js 除錯工具 (例如 <code v-pre>node --inspect</code>)。</li>
</ul>
</li>
<li>
<p><strong>工具問題：</strong></p>
<ul>
<li>如果某個特定工具失敗，請嘗試執行該工具最簡單版本的指令或操作，以隔離問題。</li>
<li>對於 <code v-pre>run_shell_command</code>，請先檢查該指令是否能直接在您的 shell 中運作。</li>
<li>對於檔案系統工具，請再次檢查路徑和權限。</li>
</ul>
</li>
<li>
<p><strong>飛行前檢查：</strong></p>
<ul>
<li>在提交程式碼之前，務必執行 <code v-pre>npm run preflight</code>。這可以捕捉到許多與格式化、程式碼風格檢查和類型錯誤相關的常見問題。</li>
</ul>
</li>
</ul>
<p>如果您遇到此處未涵蓋的問題，請考慮在 GitHub 上搜尋專案的問題追蹤器，或回報一個包含詳細資訊的新問題。</p>
</div></template>


