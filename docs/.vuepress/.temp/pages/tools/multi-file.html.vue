<template><div><h1 id="多檔案讀取工具-read-many-files" tabindex="-1"><a class="header-anchor" href="#多檔案讀取工具-read-many-files"><span>多檔案讀取工具 (<code v-pre>read_many_files</code>)</span></a></h1>
<p>本文件說明 Gemini CLI 的 <code v-pre>read_many_files</code> 工具。</p>
<h2 id="說明" tabindex="-1"><a class="header-anchor" href="#說明"><span>說明</span></a></h2>
<p>使用 <code v-pre>read_many_files</code> 可根據路徑或 glob 模式讀取多個檔案的內容。此工具的行為取決於提供的檔案：</p>
<ul>
<li>對於文字檔，此工具會將其內容串連成單一字串。</li>
<li>對於圖片 (例如 PNG、JPEG) 和 PDF 檔案，如果透過名稱或副檔名明確指定，工具會將其讀取並以 base64 編碼資料的形式傳回。</li>
</ul>
<p><code v-pre>read_many_files</code> 可用於執行以下任務：取得程式碼庫的概覽、尋找特定功能的實作位置、檢閱文件，或從多個設定檔收集上下文。</p>
<h3 id="引數" tabindex="-1"><a class="header-anchor" href="#引數"><span>引數</span></a></h3>
<p><code v-pre>read_many_files</code> 接受下列引數：</p>
<ul>
<li>
<p><code v-pre>paths</code> (list[string]，必要)：相對於工具目標目錄的 glob 模式或路徑陣列 (例如 <code v-pre>[&quot;src/**/*.ts&quot;]</code>、<code v-pre>[&quot;README.md&quot;, &quot;docs/&quot;, &quot;assets/logo.png&quot;]</code>)。</p>
</li>
<li>
<p><code v-pre>exclude</code> (list[string]，選用)：要排除的檔案/目錄的 glob 模式 (例如 <code v-pre>[&quot;**/*.log&quot;, &quot;temp/&quot;]</code>)。如果 <code v-pre>useDefaultExcludes</code> 為 true，這些模式會新增至預設排除項目中。</p>
</li>
<li>
<p><code v-pre>include</code> (list[string]，選用)：要納入的其他 glob 模式。這些模式會與 <code v-pre>paths</code> 合併 (例如，若測試檔案先前被廣泛排除，可使用 <code v-pre>[&quot;*.test.ts&quot;]</code> 將其特別加入，或使用 <code v-pre>[&quot;images/*.jpg&quot;]</code> 納入特定圖片類型)。</p>
</li>
<li>
<p><code v-pre>recursive</code> (boolean，選用)：是否要遞迴搜尋。這主要由 glob 模式中的 <code v-pre>**</code> 控制。預設值為 <code v-pre>true</code>。</p>
</li>
<li>
<p><code v-pre>useDefaultExcludes</code> (boolean，選用)：是否套用預設排除模式清單 (例如 <code v-pre>node_modules</code>、<code v-pre>.git</code>、非圖片/PDF 的二進位檔)。預設值為 <code v-pre>true</code>。</p>
</li>
<li>
<p><code v-pre>respect_git_ignore</code> (boolean，選用)：在尋找檔案時是否遵循 .gitignore 模式。預設值為 true。</p>
</li>
</ul>
<h2 id="如何搭配-gemini-cli-使用-read-many-files" tabindex="-1"><a class="header-anchor" href="#如何搭配-gemini-cli-使用-read-many-files"><span>如何搭配 Gemini CLI 使用 <code v-pre>read_many_files</code></span></a></h2>
<p><code v-pre>read_many_files</code> 會搜尋符合所提供 <code v-pre>paths</code> 和 <code v-pre>include</code> 模式的檔案，同時遵循 <code v-pre>exclude</code> 模式和預設排除項目 (若啟用)。</p>
<ul>
<li>
<p>對於文字檔：它會讀取每個相符檔案的內容 (嘗試跳過未明確指定為圖片/PDF 的二進位檔)，並將其串連成單一字串，每個檔案內容之間以 <code v-pre>--- {filePath} ---</code> 分隔。預設使用 UTF-8 編碼。</p>
</li>
<li>
<p>對於圖片和 PDF 檔案：如果透過名稱或副檔名明確指定 (例如 <code v-pre>paths: [&quot;logo.png&quot;]</code> 或 <code v-pre>include: [&quot;*.pdf&quot;]</code>)，工具會讀取檔案並将其內容以 base64 編碼字串的形式傳回。</p>
</li>
<li>
<p>工具會透過檢查檔案初始內容中的 null 位元組，嘗試偵測並跳過其他二進位檔 (那些不符合常見圖片/PDF 類型或未明確指定的檔案)。</p>
</li>
</ul>
<p>使用方式：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">read_many_files(paths=["在此輸入您的檔案或路徑。"], include=["要額外納入的檔案。"], exclude=["要排除的檔案。"], recursive=False, useDefaultExcludes=false, respect_git_ignore=true)</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="read-many-files-範例" tabindex="-1"><a class="header-anchor" href="#read-many-files-範例"><span><code v-pre>read_many_files</code> 範例</span></a></h2>
<p>讀取 <code v-pre>src</code> 目錄中的所有 TypeScript 檔案：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">read_many_files(paths=["src/**/*.ts"])</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>讀取主要的 README、<code v-pre>docs</code> 目錄中的所有 Markdown 檔案，以及一個特定的標誌圖片，並排除一個特定檔案：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">read_many_files(paths=["README.md", "docs/**/*.md", "assets/logo.png"], exclude=["docs/OLD_README.md"])</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>讀取所有 JavaScript 檔案，但明確納入測試檔案和 <code v-pre>images</code> 資料夾中的所有 JPEG 檔案：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">read_many_files(paths=["**/*.js"], include=["**/*.test.js", "images/**/*.jpg"], useDefaultExcludes=False)</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="重要注意事項" tabindex="-1"><a class="header-anchor" href="#重要注意事項"><span>重要注意事項</span></a></h2>
<ul>
<li><strong>二進位檔處理：</strong>
<ul>
<li><strong>圖片/PDF 檔案：</strong> 工具可以讀取常見的圖片類型 (PNG、JPEG 等) 和 PDF 檔案，並以 base64 編碼資料的形式傳回。這些檔案「必須」透過 <code v-pre>paths</code> 或 <code v-pre>include</code> 模式明確指定 (例如，指定確切的檔名如 <code v-pre>image.png</code> 或模式如 <code v-pre>*.jpeg</code>)。</li>
<li><strong>其他二進位檔：</strong> 工具會透過檢查其初始內容中的 null 位元組，嘗試偵測並跳過其他類型的二進位檔。工具會從其輸出中排除這些檔案。</li>
</ul>
</li>
<li><strong>效能：</strong> 讀取大量檔案或非常大的單一檔案可能會耗用大量資源。</li>
<li><strong>路徑明確性：</strong> 請確保路徑和 glob 模式是相對於工具的目標目錄正確指定。對於圖片/PDF 檔案，請確保模式足夠明確以將其包含在內。</li>
<li><strong>預設排除：</strong> 請注意預設的排除模式（例如 <code v-pre>node_modules</code>、<code v-pre>.git</code>），如果您需要覆寫它們，請使用 <code v-pre>useDefaultExcludes=False</code>，但請謹慎操作。</li>
</ul>
</div></template>


