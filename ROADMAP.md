# Gemini CLI 路線圖

[官方 Gemini CLI 路線圖](https://github.com/orgs/google-gemini/projects/11/)

Gemini CLI 是一個開源的 AI agent（AI 代理人），可將 Gemini 的強大功能直接帶入你的終端機。它提供對 Gemini 的輕量級存取，讓你能以最直接的方式，從命令提示到我們的模型。

本文件說明我們對 Gemini CLI 路線圖的規劃方式。你可以在這裡找到我們的指導原則，以及我們開發重點領域的細項說明。我們的路線圖並非靜態清單，而是一組動態優先事項，會即時在 GitHub Issues 上追蹤。

作為一個 [Apache 2.0 開源專案](https://github.com/google-gemini/gemini-cli?tab=Apache-2.0-1-ov-file#readme)，我們非常歡迎並感謝[公開貢獻](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)，並會優先處理與我們路線圖一致的貢獻。如果你想提出新功能或對我們的路線圖進行更動，請先[開啟一個 issue 進行討論](https://github.com/google-gemini/gemini-cli/issues/new/choose)。

## 免責聲明

本路線圖僅代表我們目前的規劃思路，僅供參考。這不是對未來交付的承諾或保證。任何功能的開發、發佈與時程皆可能變動，我們也可能根據社群討論或優先順序的調整來更新路線圖。

## 指導原則

我們的開發遵循以下原則：

- **強大與簡單：** 以直覺且易於使用的輕量級命令列介面 (Command Line Interface)，提供最先進 Gemini 模型的存取。
- **可擴充性：** 提供可適應多種使用情境與環境的 agent，並能在各種平台上運行這些 agent。
- **智慧：** Gemini CLI 應在 SWE Bench、Terminal Bench 和 CSAT 等基準測試中，穩定地名列最佳 agent 工具之列。
- **免費且開源：** 培養蓬勃發展的開源社群，讓成本不成為個人使用的障礙，並能快速合併 PR。這也代表我們會迅速處理並關閉 issue、pull request 和討論貼文。

## 路線圖運作方式

我們的路線圖直接透過 GitHub Issues 管理。請參考我們的路線圖入口 Issue [這裡](https://github.com/google-gemini/gemini-cli/issues/4191)。這種方式能確保透明度，讓你能直接了解或參與任何特定計畫。我們所有路線圖項目都會標記為 Type:`Feature` 和 Label:`maintainer`（代表我們正在積極開發的功能），或 Type:`Task` 和 Label:`maintainer`（代表更詳細的任務清單）。

Issues 會以便於一目了然的方式組織關鍵資訊：

- **目標季度：** `Milestone` 代表預計交付的時程。
- **功能領域：** 例如 `area/model` 或 `area/tooling` 等標籤，用於分類工作內容。
- **Issue 類型：** _Workstream_ => _Epics_ => _Features_ => _Tasks|Bugs_

你可以依據這些維度篩選我們的 issues，查看我們目前的進度。所有項目請見 [這裡](https://github.com/orgs/google-gemini/projects/11/views/19)

## 重點領域

為了更有組織地推動開發，我們將工作分為幾個主要功能領域。這些標籤也會用在 GitHub Issues 上，方便你篩選並找到你感興趣的計畫。

- **驗證（Authentication）：** 透過 API 金鑰、Gemini Code Assist 登入等方式，確保用戶存取安全。
- **模型（Model）：** 支援新的 Gemini 模型、多模態、本地執行與效能調校。
- **使用者體驗（User Experience）：** 改善 CLI 的易用性、效能、互動功能與文件。
- **工具（Tooling）：** 內建工具與 MCP 生態系統。
- **核心（Core）：** CLI 的核心功能。
- **可擴充性（Extensibility）：** 將 Gemini CLI 帶到其他平台，例如 GitHub。
- **貢獻（Contribution）：** 透過測試自動化與 CI/CD 流程優化，提升貢獻流程。
- **平台（Platform）：** 管理安裝、作業系統支援與底層 CLI 架構。
- **品質（Quality）：** 著重於測試、穩定性、效能與整體產品品質。
- **背景 agent（Background Agents）：** 支援長時間運作、自主任務與主動協助。
- **安全與隱私（Security and Privacy）：** 涵蓋所有安全與隱私相關事項

## 如何貢獻

Gemini CLI 是一個開源專案，歡迎社群成員貢獻！無論你是開發者、設計師，或只是熱情的使用者，都可以參考我們的[社群指南](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)，了解如何開始參與。有多種方式可以加入我們：

- **路線圖：** 請參考我們的[路線圖](https://github.com/google-gemini/gemini-cli/issues/4191)，尋找你想貢獻的領域。根據路線圖貢獻會最容易被整合。
- **回報錯誤：** 如果你發現問題，請建立一個 [bug](https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml)，並盡可能提供詳細資訊。如果你認為這是會阻礙 CLI 直接使用的重大問題，請加上 `priority/p0` 標籤。
- **建議功能：** 有好點子嗎？我們很樂意聽到你的想法！請開啟 [功能請求](https://github.com/google-gemini/gemini-cli/issues/new?template=feature_request.yml)。
- **貢獻程式碼：** 請參閱我們的 [CONTRIBUTING.md](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)，了解如何提交 pull request。我們也有「good first issues」清單，適合新手貢獻者。
- **撰寫文件：** 協助我們完善文件、教學與範例。
  我們對 Gemini CLI 的未來感到非常興奮，期待與你一同打造它！
