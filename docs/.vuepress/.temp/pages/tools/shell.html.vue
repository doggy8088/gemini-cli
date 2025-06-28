<template><div><h1 id="shell-工具-run-shell-command" tabindex="-1"><a class="header-anchor" href="#shell-工具-run-shell-command"><span>Shell 工具 (<code v-pre>run_shell_command</code>)</span></a></h1>
<p>本文件說明 Gemini CLI 的 <code v-pre>run_shell_command</code> 工具。</p>
<h2 id="說明" tabindex="-1"><a class="header-anchor" href="#說明"><span>說明</span></a></h2>
<p>使用 <code v-pre>run_shell_command</code> 與底層系統互動、執行腳本或執行命令列操作。<code v-pre>run_shell_command</code> 會執行指定的 shell 指令。在 Windows 上，指令會以 <code v-pre>cmd.exe /c</code> 執行。在其他平台上，指令會以 <code v-pre>bash -c</code> 執行。</p>
<h3 id="參數" tabindex="-1"><a class="header-anchor" href="#參數"><span>參數</span></a></h3>
<p><code v-pre>run_shell_command</code> 接受以下參數：</p>
<ul>
<li><code v-pre>command</code> (字串，必要)：要執行的確切 shell 指令。</li>
<li><code v-pre>description</code> (字串，可選)：指令用途的簡要說明，將會向使用者顯示。</li>
<li><code v-pre>directory</code> (字串，可選)：執行指令的目錄 (相對於專案根目錄)。如果未提供，指令會在專案根目錄中執行。</li>
</ul>
<h2 id="如何搭配-gemini-cli-使用-run-shell-command" tabindex="-1"><a class="header-anchor" href="#如何搭配-gemini-cli-使用-run-shell-command"><span>如何搭配 Gemini CLI 使用 <code v-pre>run_shell_command</code></span></a></h2>
<p>使用 <code v-pre>run_shell_command</code> 時，指令會以子程序的形式執行。<code v-pre>run_shell_command</code> 可以使用 <code v-pre>&amp;</code> 啟動背景程序。該工具会傳回有關執行的詳細資訊，包括：</p>
<ul>
<li><code v-pre>Command</code>：已執行的指令。</li>
<li><code v-pre>Directory</code>：指令執行的目錄。</li>
<li><code v-pre>Stdout</code>：標準輸出串流的輸出。</li>
<li><code v-pre>Stderr</code>：標準錯誤串流的輸出。</li>
<li><code v-pre>Error</code>：子程序回報的任何錯誤訊息。</li>
<li><code v-pre>Exit Code</code>：指令的結束代碼。</li>
<li><code v-pre>Signal</code>：如果指令被信號終止，則為信號編號。</li>
<li><code v-pre>Background PIDs</code>：任何已啟動的背景程序的 PID 清單。</li>
</ul>
<p>用法：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">run_shell_command(command="您的指令。", description="您對指令的描述。", directory="您的執行目錄。")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="run-shell-command-範例" tabindex="-1"><a class="header-anchor" href="#run-shell-command-範例"><span><code v-pre>run_shell_command</code> 範例</span></a></h2>
<p>列出目前目錄中的檔案：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">run_shell_command(command="ls -la")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>在特定目錄中執行腳本：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">run_shell_command(command="./my_script.sh", directory="scripts", description="執行我的自訂腳本")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>啟動背景伺服器：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">run_shell_command(command="npm run dev &amp;", description="在背景啟動開發伺服器")</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="重要注意事項" tabindex="-1"><a class="header-anchor" href="#重要注意事項"><span>重要注意事項</span></a></h2>
<ul>
<li><strong>安全性：</strong> 執行指令時請務必小心，特別是由使用者輸入建構的指令，以防止安全漏洞。</li>
<li><strong>互動式指令：</strong> 避免需要互動式使用者輸入的指令，因為這可能會導致工具掛起。如果可用，請使用非互動式旗標 (例如 <code v-pre>npm init -y</code>)。</li>
<li><strong>錯誤處理：</strong> 檢查 <code v-pre>Stderr</code>、<code v-pre>Error</code> 和 <code v-pre>Exit Code</code> 欄位以判斷指令是否成功執行。</li>
<li><strong>背景程序：</strong> 當指令使用 <code v-pre>&amp;</code> 在背景執行時，工具會立即返回，而程序會繼續在背景執行。<code v-pre>Background PIDs</code> 欄位將包含背景程序的程序 ID。</li>
</ul>
</div></template>


