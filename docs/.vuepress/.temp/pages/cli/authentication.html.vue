<template><div><h2 id="驗證設定" tabindex="-1"><a class="header-anchor" href="#驗證設定"><span>驗證設定</span></a></h2>
<p>Gemini CLI 需要您向 Google 的 AI 服務進行驗證。首次啟動時，您需要設定<strong>一種</strong>下列驗證方法：</p>
<ol>
<li>
<p><strong>以 Google 帳戶登入 (Gemini Code Assist)：</strong></p>
<ul>
<li>
<p>使用此選項以您的 Google 帳戶登入。</p>
</li>
<li>
<p>首次啟動期間，Gemini CLI 會將您導向一個網頁進行驗證。驗證完成後，您的憑證將會快取在本機，因此後續執行時可跳過網頁登入。</p>
</li>
<li>
<p>請注意，網頁登入必須在能夠與執行 Gemini CLI 的機器通訊的瀏覽器中完成。（具體來說，瀏覽器將被重新導向到 Gemini CLI 正在監聽的 localhost url）。</p>
</li>
<li>
<p><a id="workspace-gca">在下列情況下，使用者可能需要指定 GOOGLE_CLOUD_PROJECT：</a></p>
<ol>
<li>您擁有 Google Workspace 帳戶。Google Workspace 是為企業和組織提供的付費服務，提供一套生產力工具，包括自訂電子郵件網域 (例如 your-name@your-company.com)、增強的安全功能和管理控制項。這些帳戶通常由雇主或學校管理。</li>
<li>您已透過 <a href="https://developers.google.com/program/plans-and-pricing" target="_blank" rel="noopener noreferrer">Google 開發者計畫</a> 取得免費的 Code Assist 授權 (包括符合資格的 Google 開發者專家)</li>
<li>您已被指派現行 Gemini Code Assist 標準版或企業版訂閱的授權。</li>
<li>您在免費個人使用的 <a href="https://developers.google.com/gemini-code-assist/resources/available-locations" target="_blank" rel="noopener noreferrer">支援地區</a> 之外使用本產品。&gt;</li>
<li>您是未滿 18 歲的 Google 帳戶持有人</li>
</ol>
<ul>
<li>如果您屬於上述任一類別，則必須先設定要使用的 Google Cloud 專案 ID、<a href="https://cloud.google.com/gemini/docs/discover/set-up-gemini#enable-api" target="_blank" rel="noopener noreferrer">啟用 Gemini for Cloud API</a> 並 <a href="https://cloud.google.com/gemini/docs/discover/set-up-gemini#grant-iam" target="_blank" rel="noopener noreferrer">設定存取權限</a>。</li>
</ul>
<p>您可以使用下列指令在目前的 shell 工作階段中暫時設定環境變數：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_CLOUD_PROJECT</span><span class="token operator">=</span><span class="token string">"YOUR_PROJECT_ID"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>若要重複使用，您可以將環境變數新增至您的 <code v-pre>.env</code> 檔案 (位於專案目錄或使用者主目錄中) 或 shell 的設定檔 (例如 <code v-pre>~/.bashrc</code>、<code v-pre>~/.zshrc</code> 或 <code v-pre>~/.profile</code>)。例如，下列指令會將環境變數新增至 <code v-pre>~/.bashrc</code> 檔案：</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p><strong><a id="gemini-api-key"></a>Gemini API 金鑰：</strong></p>
<ul>
<li>從 Google AI Studio 取得您的 API 金鑰：<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">https://aistudio.google.com/app/apikey</a></li>
<li>設定 <code v-pre>GEMINI_API_KEY</code> 環境變數。在下列方法中，請將 <code v-pre>YOUR_GEMINI_API_KEY</code> 替換為您從 Google AI Studio 取得的 API 金鑰：
<ul>
<li>您可以使用下列指令在目前的 shell 工作階段中暫時設定環境變數：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GEMINI_API_KEY</span><span class="token operator">=</span><span class="token string">"YOUR_GEMINI_API_KEY"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>若要重複使用，您可以將環境變數新增至您的 <code v-pre>.env</code> 檔案 (位於專案目錄或使用者主目錄中) 或 shell 的設定檔 (例如 <code v-pre>~/.bashrc</code>、<code v-pre>~/.zshrc</code> 或 <code v-pre>~/.profile</code>)。例如，下列指令會將環境變數新增至 <code v-pre>~/.bashrc</code> 檔案：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>Vertex AI：</strong></p>
<ul>
<li>若未使用快速模式：
<ul>
<li>確保您擁有 Google Cloud 專案並已啟用 Vertex AI API。</li>
<li>使用下列指令設定應用程式預設憑證 (ADC)：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">gcloud auth application-default login</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>如需詳細資訊，請參閱 <a href="https://cloud.google.com/docs/authentication/provide-credentials-adc" target="_blank" rel="noopener noreferrer">為 Google Cloud 設定應用程式預設憑證</a>。</li>
<li>設定 <code v-pre>GOOGLE_CLOUD_PROJECT</code>、<code v-pre>GOOGLE_CLOUD_LOCATION</code> 和 <code v-pre>GOOGLE_GENAI_USE_VERTEXAI</code> 環境變數。在下列方法中，請將 <code v-pre>YOUR_PROJECT_ID</code> 和 <code v-pre>YOUR_PROJECT_LOCATION</code> 替換為您專案的相關值：
<ul>
<li>您可以使用下列指令在目前的 shell 工作階段中暫時設定這些環境變數：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_CLOUD_PROJECT</span><span class="token operator">=</span><span class="token string">"YOUR_PROJECT_ID"</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_CLOUD_LOCATION</span><span class="token operator">=</span><span class="token string">"YOUR_PROJECT_LOCATION"</span> <span class="token comment"># 例如 us-central1</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_GENAI_USE_VERTEXAI</span><span class="token operator">=</span>true</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>若要重複使用，您可以將環境變數新增至您的 <code v-pre>.env</code> 檔案 (位於專案目錄或使用者主目錄) 或您的 shell 設定檔 (例如 <code v-pre>~/.bashrc</code>、<code v-pre>~/.zshrc</code> 或 <code v-pre>~/.profile</code>)。例如，下列指令會將環境變數新增至 <code v-pre>~/.bashrc</code> 檔案：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GOOGLE_GENAI_USE_VERTEXAI=true'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
</li>
<li>若使用 express 模式：
<ul>
<li>設定 <code v-pre>GOOGLE_API_KEY</code> 環境變數。在下列方法中，請將 <code v-pre>YOUR_GOOGLE_API_KEY</code> 替換為 express 模式提供的 Vertex AI API 金鑰：
<ul>
<li>您可以在目前的 shell 工作階段中暫時設定這些環境變數，方法是使用下列指令：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_API_KEY</span><span class="token operator">=</span><span class="token string">"YOUR_GOOGLE_API_KEY"</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_GENAI_USE_VERTEXAI</span><span class="token operator">=</span>true</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>若要重複使用，您可以將環境變數新增至您的 <code v-pre>.env</code> 檔案 (位於專案目錄或使用者主目錄) 或您的 shell 設定檔 (例如 <code v-pre>~/.bashrc</code>、<code v-pre>~/.zshrc</code> 或 <code v-pre>~/.profile</code>)。例如，下列指令會將環境變數新增至 <code v-pre>~/.bashrc</code> 檔案：<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">'export GOOGLE_GENAI_USE_VERTEXAI=true'</span> <span class="token operator">>></span> ~/.bashrc</span>
<span class="line"><span class="token builtin class-name">source</span> ~/.bashrc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ol>
</div></template>


