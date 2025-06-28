<template><div><h1 id="gemini-cli-中的沙箱-sandboxing-功能" tabindex="-1"><a class="header-anchor" href="#gemini-cli-中的沙箱-sandboxing-功能"><span>Gemini CLI 中的沙箱（Sandboxing）功能</span></a></h1>
<p>本文件提供 Gemini CLI 中沙箱功能的指南，內容包含先決條件、快速入門與設定。</p>
<h2 id="先決條件" tabindex="-1"><a class="header-anchor" href="#先決條件"><span>先決條件</span></a></h2>
<p>在使用沙箱功能之前，您需要安裝並設定 Gemini CLI：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># install gemini-cli with npm</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> @google/gemini-cli</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Verify installation</span></span>
<span class="line">gemini <span class="token parameter variable">--version</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="沙箱功能總覽" tabindex="-1"><a class="header-anchor" href="#沙箱功能總覽"><span>沙箱功能總覽</span></a></h2>
<p>沙箱功能可將潛在的危險操作（例如 shell 指令或檔案修改）與您的主機系統隔離，在 AI 操作與您的環境之間提供一道安全屏障。</p>
<p>沙箱功能的優點包括：</p>
<ul>
<li><strong>安全性</strong>：防止意外的系統損壞或資料遺失。</li>
<li><strong>隔離性</strong>：將檔案系統的存取權限限制在專案目錄內。</li>
<li><strong>一致性</strong>：確保在不同系統上都能有一致且可重現的環境。</li>
<li><strong>安全</strong>：在處理不受信任的程式碼或實驗性指令時降低風險。</li>
</ul>
<h2 id="沙箱方法" tabindex="-1"><a class="header-anchor" href="#沙箱方法"><span>沙箱方法</span></a></h2>
<p>您理想的沙箱方法可能會因您的平台和偏好的容器解決方案而異。</p>
<h3 id="_1-macos-seatbelt-僅限-macos" tabindex="-1"><a class="header-anchor" href="#_1-macos-seatbelt-僅限-macos"><span>1. macOS Seatbelt（僅限 macOS）</span></a></h3>
<p>使用 <code v-pre>sandbox-exec</code> 的輕量級內建沙箱功能。</p>
<p><strong>預設設定檔</strong>：<code v-pre>permissive-open</code> - 限制在專案目錄外的寫入，但允許大多數其他操作。</p>
<h3 id="_2-基於容器-docker-podman" tabindex="-1"><a class="header-anchor" href="#_2-基於容器-docker-podman"><span>2. 基於容器（Docker/Podman）</span></a></h3>
<p>具有完整程序隔離的跨平台沙箱功能。</p>
<p><strong>注意</strong>：需要於本機建構沙箱映像檔，或使用您組織註冊中心發布的映像檔。</p>
<h2 id="快速入門" tabindex="-1"><a class="header-anchor" href="#快速入門"><span>快速入門</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 使用指令旗標啟用沙箱功能</span></span>
<span class="line">gemini <span class="token parameter variable">-s</span> <span class="token parameter variable">-p</span> <span class="token string">"analyze the code structure"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用環境變數</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GEMINI_SANDBOX</span><span class="token operator">=</span>true</span>
<span class="line">gemini <span class="token parameter variable">-p</span> <span class="token string">"run the test suite"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 settings.json 中設定</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">"sandbox"</span><span class="token builtin class-name">:</span> <span class="token string">"docker"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="設定" tabindex="-1"><a class="header-anchor" href="#設定"><span>設定</span></a></h2>
<h3 id="啟用沙箱功能-依優先順序" tabindex="-1"><a class="header-anchor" href="#啟用沙箱功能-依優先順序"><span>啟用沙箱功能（依優先順序）</span></a></h3>
<ol>
<li><strong>指令旗標</strong>：<code v-pre>-s</code> 或 <code v-pre>--sandbox</code></li>
<li><strong>環境變數</strong>：<code v-pre>GEMINI_SANDBOX=true|docker|podman|sandbox-exec</code></li>
<li><strong>設定檔</strong>：在 <code v-pre>settings.json</code> 中設定 <code v-pre>&quot;sandbox&quot;: true</code></li>
</ol>
<h3 id="macos-seatbelt-設定檔" tabindex="-1"><a class="header-anchor" href="#macos-seatbelt-設定檔"><span>macOS Seatbelt 設定檔</span></a></h3>
<p>內建設定檔（透過 <code v-pre>SEATBELT_PROFILE</code> 環境變數設定）：</p>
<ul>
<li><code v-pre>permissive-open</code> (預設)：寫入限制，允許網路連線</li>
<li><code v-pre>permissive-closed</code>：寫入限制，無網路連線</li>
<li><code v-pre>permissive-proxied</code>：寫入限制，透過代理伺服器連線網路</li>
<li><code v-pre>restrictive-open</code>：嚴格限制，允許網路連線</li>
<li><code v-pre>restrictive-closed</code>：最大程度限制</li>
</ul>
<h2 id="linux-uid-gid-處理" tabindex="-1"><a class="header-anchor" href="#linux-uid-gid-處理"><span>Linux UID/GID 處理</span></a></h2>
<p>沙箱會自動處理 Linux 上的使用者權限。若要覆寫這些權限，請使用：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">SANDBOX_SET_UID_GID</span><span class="token operator">=</span>true   <span class="token comment"># 強制使用主機 UID/GID</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">SANDBOX_SET_UID_GID</span><span class="token operator">=</span>false  <span class="token comment"># 停用 UID/GID 對應</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="疑難排解" tabindex="-1"><a class="header-anchor" href="#疑難排解"><span>疑難排解</span></a></h2>
<h3 id="常見問題" tabindex="-1"><a class="header-anchor" href="#常見問題"><span>常見問題</span></a></h3>
<p><strong>「操作不允許」（Operation not permitted）</strong></p>
<ul>
<li>操作需要沙箱外的存取權限。</li>
<li>嘗試使用更寬鬆的設定檔或新增掛載點。</li>
</ul>
<p><strong>缺少指令</strong></p>
<ul>
<li>新增至自訂的 Dockerfile。</li>
<li>透過 <code v-pre>sandbox.bashrc</code> 安 zentral。</li>
</ul>
<p><strong>網路問題</strong></p>
<ul>
<li>檢查沙箱設定檔是否允許網路連線。</li>
<li>驗證代理伺服器設定。</li>
</ul>
<h3 id="偵錯模式" tabindex="-1"><a class="header-anchor" href="#偵錯模式"><span>偵錯模式</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">DEBUG</span><span class="token operator">=</span><span class="token number">1</span> gemini <span class="token parameter variable">-s</span> <span class="token parameter variable">-p</span> <span class="token string">"debug command"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="檢查沙箱" tabindex="-1"><a class="header-anchor" href="#檢查沙箱"><span>檢查沙箱</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 檢查環境</span></span>
<span class="line">gemini <span class="token parameter variable">-s</span> <span class="token parameter variable">-p</span> <span class="token string">"run shell command: env | grep SANDBOX"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 列出掛載點</span></span>
<span class="line">gemini <span class="token parameter variable">-s</span> <span class="token parameter variable">-p</span> <span class="token string">"run shell command: mount | grep workspace"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安全性注意事項" tabindex="-1"><a class="header-anchor" href="#安全性注意事項"><span>安全性注意事項</span></a></h2>
<ul>
<li>沙箱功能可降低但無法完全消除所有風險。</li>
<li>使用可完成工作中最嚴格的設定檔。</li>
<li>首次建構後，容器的額外負擔極小。</li>
<li>GUI 應用程式可能無法在沙箱中運作。</li>
</ul>
<h2 id="相關文件" tabindex="-1"><a class="header-anchor" href="#相關文件"><span>相關文件</span></a></h2>
<ul>
<li><RouteLink to="/cli/configuration.html">設定</RouteLink>：完整的設定選項。</li>
<li><RouteLink to="/cli/commands.html">指令</RouteLink>：可用的指令。</li>
<li><RouteLink to="/troubleshooting.html">疑難排解</RouteLink>：一般疑難排解。</li>
</ul>
</div></template>


