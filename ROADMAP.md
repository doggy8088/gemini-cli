# Gemini CLI 路線圖

[官方 Gemini CLI 路線圖](https://github.com/orgs/google-gemini/projects/11/)

Gemini CLI 是一個開源的 AI agent（AI 代理人），將 Gemini 的強大能力直接帶入你的終端機。它提供對 Gemini 的輕量級存取，讓你能以最直接的方式，從命令提示字元連接到我們的模型。

本文件說明我們對 Gemini CLI 路線圖的規劃方式。你可以在這裡找到我們的指導原則，以及我們目前專注開發的重點領域細分。我們的路線圖並非靜態清單，而是一組動態優先事項，會在 GitHub Issues 上即時追蹤。

作為 [Apache 2.0 開源專案](https://github.com/google-gemini/gemini-cli?tab=Apache-2.0-1-ov-file#readme)，我們非常感謝並歡迎[公開貢獻](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)，並會優先處理與我們路線圖一致的貢獻。如果你想提出新功能或修改我們的路線圖，請先[開啟一個 issue 進行討論](https://github.com/google-gemini/gemini-cli/issues/new/choose)。

## 免責聲明

本路線圖僅代表我們目前的規劃，僅供參考。這不是對未來交付的承諾或保證。任何功能的開發、發布及時程都可能變動，且我們會根據社群討論及優先事項的調整，隨時更新路線圖。

## 指導原則

我們的開發遵循以下原則：

- **強大與簡單：** 以直覺且易用的輕量級命令列介面 (Command Line Interface)，提供最先進 Gemini 模型的存取。
- **可擴充性：** 提供可適應多種使用情境與環境的 agent，並且能在任何地方執行這些 agent。
- **智慧化：** Gemini CLI 應在 SWE Bench、Terminal Bench、CSAT 等基準測試中，穩定名列最佳 agent 工具之一。
- **免費且開源：** 促進蓬勃的開源社群，讓成本不成為個人使用的障礙，並能快速合併 PR。這也意味著能快速解決與關閉 issue、pull request 及討論貼文。

## 路線圖運作方式

我們的路線圖直接透過 GitHub Issues 管理。請參閱我們的路線圖入口 [這裡](https://github.com/google-gemini/gemini-cli/issues/4191)。這種方式能確保透明度，讓你能直接了解或參與任何特定計畫。我們所有的路線圖項目都會標記為 Type:`Feature` 和 Label:`maintainer`（表示我們正在積極開發的功能），或 Type:`Task` 和 Label:`maintainer`（表示更細分的任務清單）。

Issues 組織方式可讓你一目了然獲得關鍵資訊：

- **目標季度：** `Milestone` 表示預計交付的時程。
- **功能領域：** 如 `area/model` 或 `area/tooling` 等標籤，用於分類工作內容。
- **Issue 類型：** _Workstream_ => _Epics_ => _Features_ => _Tasks|Bugs_

你可以依這些維度篩選我們的 issues，查看我們正在進行的內容。所有項目請見[這裡](https://github.com/orgs/google-gemini/projects/11/views/19)

## 重點領域

為了更好地組織我們的工作，我們將工作分為幾個主要功能領域。這些標籤會用於 GitHub Issues，協助你篩選並找到你感興趣的計畫。

- **Authentication（驗證）：** 透過 API 金鑰、Gemini Code Assist 登入等方式，確保使用者安全存取。
- **Model（模型）：** 支援新的 Gemini 模型、多模態、本地執行及效能調校。
- **User Experience（使用者體驗）：** 改善 CLI 的可用性、效能、互動功能及文件。
- **Tooling（工具）：** 內建工具及 MCP 生態系統。
- **Core（核心）：** CLI 的核心功能。
- **Extensibility（可擴充性）：** 將 Gemini CLI 擴展到其他平台，例如 GitHub。
- **Contribution（貢獻）：** 透過測試自動化及 CI/CD 流程優化，改善貢獻流程。
- **Platform（平台）：** 管理安裝、作業系統支援及底層 CLI 框架。
- **Quality（品質）：** 專注於測試、可靠性、效能及整體產品品質。
- **Background Agents（背景 agent）：** 支援長時間執行、自主任務與主動協助。
- **Security and Privacy（安全與隱私）：** 涵蓋所有與安全與隱私相關的事項。

## 如何貢獻

Gemini CLI 是一個開源專案，歡迎社群成員貢獻！無論你是開發者、設計師，或只是熱情的使用者，都可以參閱我們的 [社群指南](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md) 了解如何開始。有多種方式可以參與：

- **路線圖：** 請檢視我們的 [路線圖](https://github.com/google-gemini/gemini-cli/issues/4191)，找出你想貢獻的領域。根據路線圖貢獻會最容易整合。
- **回報錯誤：** 如果你發現問題，請建立一個 [bug](https://github.com/google-gemini/gemini-cli/issues/new?template=bug_report.yml)，並盡可能提供詳細資訊。如果你認為這是阻礙 CLI 直接使用的重大錯誤，請標記為 `priority/p0`。
- **建議功能：** 有好點子嗎？我們很樂意聽到你的想法！請開啟 [功能請求](https://github.com/google-gemini/gemini-cli/issues/new?template=feature_request.yml)。
- **貢獻程式碼：** 請參閱我們的 [CONTRIBUTING.md](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md) 文件，了解如何提交 pull request。我們也有「good first issues」清單，適合新手貢獻者。
- **撰寫文件：** 協助我們完善文件、教學與範例。

我們對 Gemini CLI 的未來充滿期待，也期待與你一同打造這個專案！
