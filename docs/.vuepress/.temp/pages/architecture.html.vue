<template><div><h1 id="gemini-cli-架構概覽" tabindex="-1"><a class="header-anchor" href="#gemini-cli-架構概覽"><span>Gemini CLI 架構概覽</span></a></h1>
<p>本文件提供 Gemini CLI 架構的高階概覽。</p>
<h2 id="核心元件" tabindex="-1"><a class="header-anchor" href="#核心元件"><span>核心元件</span></a></h2>
<p>Gemini CLI 主要由兩個主要套件組成，以及一套可在處理指令行輸入過程中供系統使用的工具：</p>
<ol>
<li>
<p><strong>CLI 套件 (<code v-pre>packages/cli</code>):</strong></p>
<ul>
<li><strong>用途：</strong> 此套件包含 Gemini CLI 面向使用者的部分，例如處理初始使用者輸入、呈現最終輸出以及管理整體使用者體驗。</li>
<li><strong>套件中包含的主要函式：</strong>
<ul>
<li><RouteLink to="/cli/commands.html">輸入處理</RouteLink></li>
<li>歷史記錄管理</li>
<li>顯示渲染</li>
<li><RouteLink to="/cli/themes.html">主題與 UI 自訂</RouteLink></li>
<li><RouteLink to="/cli/configuration.html">CLI 組態設定</RouteLink></li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>Core 套件 (<code v-pre>packages/core</code>):</strong></p>
<ul>
<li><strong>用途：</strong> 此套件作為 Gemini CLI 的後端。它接收來自 <code v-pre>packages/cli</code> 的請求，協調與 Gemini API 的互動，並管理可用工具的執行。</li>
<li><strong>套件中包含的主要函式：</strong>
<ul>
<li>用於與 Google Gemini API 通訊的 API 用戶端</li>
<li>提示建構與管理</li>
<li>工具註冊與執行邏輯</li>
<li>對話或工作階段的狀態管理</li>
<li>伺服器端組態</li>
</ul>
</li>
</ul>
</li>
<li>
<p><strong>工具 (<code v-pre>packages/core/src/tools/</code>):</strong></p>
<ul>
<li><strong>用途：</strong> 這些是獨立的模組，可擴充 Gemini 模型的功能，使其能與本機環境（例如檔案系統、shell 指令、網頁擷取）互動。</li>
<li><strong>互動：</strong> <code v-pre>packages/core</code> 根據 Gemini 模型的請求呼叫這些工具。</li>
</ul>
</li>
</ol>
<h2 id="互動流程" tabindex="-1"><a class="header-anchor" href="#互動流程"><span>互動流程</span></a></h2>
<p>與 Gemini CLI 的典型互動遵循以下流程：</p>
<ol>
<li><strong>使用者輸入：</strong> 使用者在終端機中輸入提示或指令，由 <code v-pre>packages/cli</code> 管理。</li>
<li><strong>向核心發出請求：</strong> <code v-pre>packages/cli</code> 將使用者輸入傳送至 <code v-pre>packages/core</code>。</li>
<li><strong>處理請求：</strong> Core 套件：
<ul>
<li>為 Gemini API 建構適當的提示，可能包含對話歷史記錄和可用的工具定義。</li>
<li>將提示傳送至 Gemini API。</li>
</ul>
</li>
<li><strong>Gemini API 回應：</strong> Gemini API 處理提示並傳回回應。此回應可能是直接的答案，或是使用其中一個可用工具的請求。</li>
<li><strong>工具執行（若適用）：</strong>
<ul>
<li>當 Gemini API 請求使用工具時，Core 套件會準備執行該工具。</li>
<li>如果請求的工具會修改檔案系統或執行 shell 指令，系統會先向使用者提供該工具及其引數的詳細資訊，且使用者必須核准執行。</li>
<li>唯讀操作（例如讀取檔案）可能不需要使用者明確確認即可繼續。</li>
<li>一旦確認，或在不需要確認的情況下，Core 套件會在相關工具中執行相應的動作，並由 Core 套件將結果傳回 Gemini API。</li>
<li>Gemini API 處理工具結果並產生最終回應。</li>
</ul>
</li>
<li><strong>回應至 CLI：</strong> Core 套件將最終回應傳回 CLI 套件。</li>
<li><strong>向使用者顯示：</strong> CLI 套件將回應格式化並顯示在終端機中給使用者。</li>
</ol>
<h2 id="主要設計原則" tabindex="-1"><a class="header-anchor" href="#主要設計原則"><span>主要設計原則</span></a></h2>
<ul>
<li><strong>模組化：</strong> 將 CLI（前端）與 Core（後端）分離，可實現獨立開發和未來的潛在擴充（例如，為同一個後端提供不同的前端）。</li>
<li><strong>可擴充性：</strong> 工具系統的設計使其具有可擴充性，能夠加入新功能。</li>
<li><strong>使用者體驗：</strong> CLI 專注於提供豐富且具互動性的終端機體驗。</li>
</ul>
</div></template>


