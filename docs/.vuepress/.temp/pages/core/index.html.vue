<template><div><h1 id="gemini-cli-核心" tabindex="-1"><a class="header-anchor" href="#gemini-cli-核心"><span>Gemini CLI 核心</span></a></h1>
<p>Gemini CLI 的核心套件 (<code v-pre>packages/core</code>) 是 Gemini CLI 的後端部分，負責處理與 Gemini API 的通訊、管理工具，以及處理來自 <code v-pre>packages/cli</code> 的請求。有關 Gemini CLI 的總覽，請參閱 <RouteLink to="/">主要文件頁面</RouteLink>。</p>
<h2 id="導覽本節" tabindex="-1"><a class="header-anchor" href="#導覽本節"><span>導覽本節</span></a></h2>
<ul>
<li><strong><RouteLink to="/core/tools-api.html">核心工具 API</RouteLink>:</strong> 關於工具如何被核心定義、註冊和使用的資訊。</li>
</ul>
<h2 id="核心的角色" tabindex="-1"><a class="header-anchor" href="#核心的角色"><span>核心的角色</span></a></h2>
<p>Gemini CLI 的 <code v-pre>packages/cli</code> 部分提供使用者介面，而 <code v-pre>packages/core</code> 則負責：</p>
<ul>
<li><strong>Gemini API 互動：</strong> 安全地與 Google Gemini API 通訊、傳送使用者提示，並接收模型回應。</li>
<li><strong>提示工程：</strong> 為 Gemini 模型建構有效的提示，可能包含對話歷史記錄、工具定義，以及來自 <code v-pre>GEMINI.md</code> 檔案的指令性情境。</li>
<li><strong>工具管理與調度：</strong>
<ul>
<li>註冊可用的工具 (例如：檔案系統工具、shell 指令執行)。</li>
<li>解譯來自 Gemini 模型的工具使用請求。</li>
<li>使用提供的參數執行請求的工具。</li>
<li>將工具執行結果回傳給 Gemini 模型以進行進一步處理。</li>
</ul>
</li>
<li><strong>對話階段與狀態管理：</strong> 追蹤對話狀態，包括歷史記錄以及連貫互動所需的任何相關情境。</li>
<li><strong>設定：</strong> 管理核心特定的設定，例如 API 金鑰存取、模型選擇和工具設定。</li>
</ul>
<h2 id="安全性考量" tabindex="-1"><a class="header-anchor" href="#安全性考量"><span>安全性考量</span></a></h2>
<p>核心在安全性方面扮演著至關重要的角色：</p>
<ul>
<li><strong>API 金鑰管理：</strong> 它處理 <code v-pre>GEMINI_API_KEY</code> 並確保在與 Gemini API 通訊時安全地使用它。</li>
<li><strong>工具執行：</strong> 當工具與本機系統互動時 (例如 <code v-pre>run_shell_command</code>)，核心 (及其底層的工具實作) 必須謹慎操作，通常會採用沙盒機制來防止意外的修改。</li>
</ul>
<h2 id="對話歷史壓縮" tabindex="-1"><a class="header-anchor" href="#對話歷史壓縮"><span>對話歷史壓縮</span></a></h2>
<p>為確保長對話不會超過 Gemini 模型的 token 限制，核心包含一個對話歷史壓縮功能。</p>
<p>當對話接近所設定模型的 token 限制時，核心會在將對話歷史傳送給模型之前自動進行壓縮。這種壓縮的設計旨在不損失傳達的資訊，但會減少使用的 token 總數。</p>
<p>您可以在 <a href="https://ai.google.dev/gemini-api/docs/models" target="_blank" rel="noopener noreferrer">Google AI 文件</a> 中找到每個模型的 token 限制。</p>
<h2 id="模型備援機制" tabindex="-1"><a class="header-anchor" href="#模型備援機制"><span>模型備援機制</span></a></h2>
<p>Gemini CLI 包含一個模型備援機制，以確保即使預設的「pro」模型受到速率限制，您仍然可以繼續使用 CLI。</p>
<p>如果您正在使用預設的「pro」模型，且 CLI 偵測到您受到速率限制，它會在本機的對話階段中自動切換到「flash」模型。這讓您可以不間斷地繼續工作。</p>
<h2 id="檔案探索服務" tabindex="-1"><a class="header-anchor" href="#檔案探索服務"><span>檔案探索服務</span></a></h2>
<p>檔案探索服務負責在專案中尋找與當前情境相關的檔案。它被 <code v-pre>@</code> 指令以及其他需要存取檔案的工具所使用。</p>
<h2 id="記憶體探索服務" tabindex="-1"><a class="header-anchor" href="#記憶體探索服務"><span>記憶體探索服務</span></a></h2>
<p>記憶體探索服務負責尋找並載入為模型提供情境的 <code v-pre>GEMINI.md</code> 檔案。它以階層式的方式搜尋這些檔案，從目前的工作目錄開始，向上移動到專案根目錄和使用者的家目錄。它也會搜尋子目錄。</p>
<p>這讓您可以擁有全域、專案層級和元件層級的情境檔案，這些檔案會被結合起來，為模型提供最相關的資訊。</p>
<p>您可以使用 <RouteLink to="/cli/commands.html"><code v-pre>/memory</code> 指令</RouteLink> 來 <code v-pre>show</code>、<code v-pre>add</code> 和 <code v-pre>refresh</code> 已載入的 <code v-pre>GEMINI.md</code> 檔案內容。</p>
</div></template>


