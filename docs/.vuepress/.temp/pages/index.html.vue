<template><div><h1 id="歡迎使用-gemini-cli-文件" tabindex="-1"><a class="header-anchor" href="#歡迎使用-gemini-cli-文件"><span>歡迎使用 Gemini CLI 文件</span></a></h1>
<p>此文件提供安裝、使用及開發 Gemini CLI 的完整指南。此工具可讓您透過命令列介面與 Gemini 模型互動。</p>
<h2 id="總覽" tabindex="-1"><a class="header-anchor" href="#總覽"><span>總覽</span></a></h2>
<p>Gemini CLI 將 Gemini 模型的功能帶到您的終端機，提供互動式的讀取-求值-輸出迴圈 (REPL) 環境。Gemini CLI 包含一個客戶端應用程式 (<code v-pre>packages/cli</code>)，它會與本地伺服器 (<code v-pre>packages/core</code>) 通訊，而後者會管理對 Gemini API 及其 AI 模型的請求。Gemini CLI 也包含多種工具，用於執行檔案系統操作、執行 shell 和擷取網頁等任務，這些工具由 <code v-pre>packages/core</code> 管理。</p>
<h2 id="瀏覽文件" tabindex="-1"><a class="header-anchor" href="#瀏覽文件"><span>瀏覽文件</span></a></h2>
<p>此文件分為以下幾個部分：</p>
<ul>
<li><strong><RouteLink to="/deployment.html">執行與部署</RouteLink>:</strong> 執行 Gemini CLI 的相關資訊。</li>
<li><strong><RouteLink to="/architecture.html">架構總覽</RouteLink>:</strong> 了解 Gemini CLI 的高階設計，包含其元件以及它們如何互動。</li>
<li><strong>CLI 用法：</strong> <code v-pre>packages/cli</code> 的文件。
<ul>
<li><strong><RouteLink to="/cli/">CLI 簡介</RouteLink>:</strong> 命令列介面總覽。</li>
<li><strong><RouteLink to="/cli/commands.html">指令</RouteLink>:</strong> 可用 CLI 指令的說明。</li>
<li><strong><RouteLink to="/cli/configuration.html">組態</RouteLink>:</strong> 設定 CLI 的相關資訊。</li>
<li><strong><RouteLink to="/checkpointing.html">檢查點</RouteLink>:</strong> 檢查點功能的文件。</li>
<li><strong><RouteLink to="/extension.html">擴充功能</RouteLink>:</strong> 如何為 CLI 擴充新功能。</li>
<li><strong><RouteLink to="/telemetry.html">遙測</RouteLink>:</strong> CLI 中的遙測總覽。</li>
</ul>
</li>
<li><strong>核心詳細資訊：</strong> <code v-pre>packages/core</code> 的文件。
<ul>
<li><strong><RouteLink to="/core/">核心簡介</RouteLink>:</strong> 核心元件總覽。</li>
<li><strong><RouteLink to="/core/tools-api.html">工具 API</RouteLink>:</strong> 關於核心如何管理及公開工具的資訊。</li>
</ul>
</li>
<li><strong>工具：</strong>
<ul>
<li><strong><RouteLink to="/tools/">工具總覽</RouteLink>:</strong> 可用工具總覽。</li>
<li><strong><RouteLink to="/tools/file-system.html">檔案系統工具</RouteLink>:</strong> <code v-pre>read_file</code> 和 <code v-pre>write_file</code> 工具的文件。</li>
<li><strong><RouteLink to="/tools/multi-file.html">多檔案讀取工具</RouteLink>:</strong> <code v-pre>read_many_files</code> 工具的文件。</li>
<li><strong><RouteLink to="/tools/shell.html">Shell 工具</RouteLink>:</strong> <code v-pre>run_shell_command</code> 工具的文件。</li>
<li><strong><RouteLink to="/tools/web-fetch.html">網頁擷取工具</RouteLink>:</strong> <code v-pre>web_fetch</code> 工具的文件。</li>
<li><strong><RouteLink to="/tools/web-search.html">網頁搜尋工具</RouteLink>:</strong> <code v-pre>google_web_search</code> 工具的文件。</li>
<li><strong><RouteLink to="/tools/memory.html">記憶體工具</RouteLink>:</strong> <code v-pre>save_memory</code> 工具的文件。</li>
</ul>
</li>
<li><strong><RouteLink to="/CONTRIBUTING.html">貢獻與開發指南</RouteLink>:</strong> 提供給貢獻者與開發者的資訊，包含設定、建構、測試與程式設計慣例。</li>
<li><strong><RouteLink to="/troubleshooting.html">疑難排解指南</RouteLink>:</strong> 尋找常見問題的解決方案與常見問答。</li>
<li><strong><RouteLink to="/tos-privacy.html">服務條款與隱私權聲明</RouteLink>:</strong> 適用於您使用 Gemini CLI 的服務條款與隱私權聲明資訊。</li>
</ul>
<p>我們希望這份文件能幫助您充分利用 Gemini CLI！</p>
</div></template>


