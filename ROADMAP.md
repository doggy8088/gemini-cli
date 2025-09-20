# Gemini CLI 路線圖

[官方 Gemini CLI 路線圖](https://github.com/orgs/google-gemini/projects/11/)

Gemini CLI 是一個開源的 AI agent，讓你能直接在終端機中體驗 Gemini 的強大功能。它提供輕量級的 Gemini 存取方式，讓你從命令提示字元到我們的模型有最直接的路徑。

本文件說明我們對於 Gemini CLI 路線圖的規劃方式。在這裡，你可以看到我們的指導原則，以及我們目前專注開發的重點領域分解。我們的路線圖不是一份靜態清單，而是一組會即時在 GitHub Issues 上追蹤的動態優先事項。

作為一個 [Apache 2.0 開源專案](https://github.com/google-gemini/gemini-cli?tab=Apache-2.0-1-ov-file#readme)，我們非常歡迎並感謝[公開貢獻](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)，並會優先處理與我們路線圖相符的貢獻。如果你想提出新功能或對路線圖的變更建議，請先[開啟一個 issue 進行討論](https://github.com/google-gemini/gemini-cli/issues/new/choose)。

## 免責聲明

本路線圖僅反映我們目前的規劃思路，僅供參考。這不是對未來交付的承諾或保證。任何功能的開發、發佈及時程都可能變動，並可能根據社群討論或我們優先順序的調整而更新。

## 指導原則

我們的開發遵循以下原則：

- **強大與簡潔：** 以直觀、易用的輕量級命令列介面 (CLI) 提供最先進的 Gemini 模型存取能力。
- **可擴充性：** 提供可適應多種使用情境與環境的 agent，並具備在各種平台上運行的能力。
- **智慧化：** Gemini CLI 應在 SWE Bench、Terminal Bench、CSAT 等基準測試中，穩定地名列最佳 agent 工具之列。
- **免費且開源：** 促進蓬勃發展的開源社群，讓個人使用不受成本限制，並能快速合併 PR。這意味著能夠迅速解決並關閉 issue、pull request 及討論貼文。

## 路線圖運作方式

我們的路線圖直接透過 GitHub Issues 管理。請參考我們的路線圖入口 issue [這裡](https://github.com/google-gemini/gemini-cli/issues/4191)。這種方式能帶來高度透明度，讓你能直接了解更多細節，或參與任何特定計畫。我們所有的路線圖項目都會標記為 Type:`Feature` 和 Label:`maintainer`（表示我們正在積極開發的功能），或 Type:`Task` 和 Label:`maintainer`（表示更細緻的任務清單）。

Issues 會以便於一目了然的方式組織關鍵資訊：

- **目標季度：** `Milestone` 表示預計交付的時程。
- **功能領域：** 如 `area/model` 或 `area/tooling` 等標籤用於分類工作內容。
- **Issue 類型：** _Workstream_ => _Epics_ => _Features_ => _Tasks|Bugs_

你可以依據這些維度篩選我們的 issues，查看我們正在進行的項目。所有項目請見 [這裡](https://github.com/orgs/google-gemini/projects/11/views/19)

## 重點領域

為了更有效組織我們的工作，我們將任務分為幾個主要功能領域。這些標籤會用於 GitHub Issues，方便你篩選並找到感興趣的計畫。

- **驗證機制 (Authentication)：** 透過 API 金鑰、Gemini Code Assist 登入等方式，確保使用者存取安全。
- **模型 (Model)：** 支援新的 Gemini 模型、多模態能力、本地執行與效能調校。
- **使用者體驗 (User Experience)：** 改善命令列介面 (CLI) 的易用性、效能、互動功能及文件。
- **工具 (Tooling)：** 內建工具與 MCP 生態系統。
- **核心 (Core)：** 命令列介面 (CLI) 的核心功能。
- **可擴充性 (Extensibility)：** 將 Gemini CLI 帶到其他平台，例如 GitHub。
- **貢獻流程 (Contribution)：** 透過測試自動化與 CI/CD 流程優化，提升貢獻體驗。
- **平台 (Platform)：** 管理安裝、作業系統支援及底層 CLI 框架。
- **品質 (Quality)：** 專注於測試、可靠性、效能及整體產品品質。
- **背景 agent (Background Agents)：** 支援長時間運行、自主任務與主動協助。
- **安全與隱私 (Security and Privacy)：** 涵蓋所有與安全及隱私相關的事項。

## 如何貢獻

Gemini CLI 是一個開源專案，歡迎社群成員貢獻！無論你是開發者、設計師，或只是熱情的使用者，都可以參考我們的 [社群規範](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md) 了解如何開始參與。你可以用以下多種方式加入我們：

- **路線圖：** 請檢視我們的 [路線圖](https://github.com/google-gemini/gemini-cli/issues/4191)，尋找你有興趣貢獻的領域。依據此路線圖貢獻會最容易被整合。
- **回報錯誤 (Report Bugs)：** 如果你發現問題，請建立一個 [bug](https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml)，並盡可能提供詳細資訊。如果你認為這是會阻礙 CLI 直接使用的重大問題，請加上 `priority/p0` 標籤。
- **建議新功能 (Suggest Features)：** 有好點子嗎？我們很樂意聽到你的想法！請開啟一個 [feature request](https://github.com/google-gemini/gemini-cli/issues/new?template=feature_request.yml)。
- **貢獻程式碼 (Contribute Code)：** 請參考我們的 [CONTRIBUTING.md](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md) 文件，了解如何提交 pull request。我們也有適合新手的「good first issues」清單。
- **撰寫文件 (Write Documentation)：** 協助我們完善文件、教學與範例。

我們對 Gemini CLI 的未來感到非常興奮，期待與你一起打造這個專案！
