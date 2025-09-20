# Gemini CLI Core

Gemini CLI 的核心套件（`packages/core`）是 Gemini CLI 的後端部分，負責與 Gemini API 溝通、管理工具，以及處理來自 `packages/cli` 發送的請求。若需 Gemini CLI 的總覽，請參閱[主文件頁面](../index.md)。

## 本節導覽

- **[核心工具 API](./tools-api.md)：** 關於工具如何被核心定義、註冊與使用的資訊。
- **[記憶匯入處理器](./memport.md)：** 介紹使用 @file.md 語法進行模組化 GEMINI.md 匯入功能的文件。

## 核心的角色

雖然 Gemini CLI 的 `packages/cli` 部分提供使用者介面，`packages/core` 則負責：

- **Gemini API 互動：** 與 Google Gemini API 進行安全通訊，傳送使用者提示（prompt），並接收模型回應。
- **提示工程（Prompt engineering）：** 為 Gemini 模型構建有效的提示，可能會結合對話歷史、工具定義，以及來自 `GEMINI.md` 檔案的指令性 context。
- **工具管理與協調：**
  - 註冊可用工具（例如：檔案系統工具、shell 指令執行）。
  - 解讀來自 Gemini 模型的工具使用請求。
  - 以提供的參數執行被請求的工具。
  - 將工具執行結果回傳給 Gemini 模型以便進一步處理。
- **工作階段與狀態管理：** 追蹤對話狀態，包括歷史紀錄及任何維持連貫互動所需的相關 context。
- **設定管理：** 管理核心專屬的設定，例如 API 金鑰存取、模型選擇與工具設定。

## 安全性考量

核心在安全性上扮演關鍵角色：

- **API 金鑰管理：** 處理 `GEMINI_API_KEY`，並確保與 Gemini API 通訊時安全使用。
- **工具執行：** 當工具與本地系統互動（例如 `run_shell_command`）時，核心（及其底層工具實作）必須謹慎操作，通常會採用沙箱機制以防止非預期的修改。

## 對話歷史壓縮

為避免長對話超過 Gemini 模型的 token 限制，核心內建對話歷史壓縮功能。

當對話接近所設定模型的 token 上限時，核心會自動壓縮對話歷史再傳送給模型。這種壓縮設計為資訊無損，但可減少整體 token 使用量。

各模型的 token 限制可參考 [Google AI 文件](https://ai.google.dev/gemini-api/docs/models)。

## 模型自動切換（fallback）

Gemini CLI 提供模型自動切換機制，確保即使預設的「pro」模型被限流時，您仍可繼續使用 CLI。

若您使用預設的「pro」模型，且 CLI 偵測到被限流，會自動切換至「flash」模型以繼續本次工作階段，讓您不中斷地作業。

## 檔案探索服務

檔案探索服務負責在專案中尋找與當前 context 相關的檔案。此服務會被 `@` 指令及其他需要存取檔案的工具使用。

## 記憶探索服務

記憶探索服務負責尋找並載入為模型提供 context 的 `GEMINI.md` 檔案。它會以階層式方式搜尋這些檔案，從目前工作目錄開始，逐層往上至專案根目錄及使用者家目錄，同時也會搜尋子目錄。

這讓您可以擁有全域、專案層級與元件層級的 context 檔案，這些檔案會被合併，為模型提供最相關的資訊。

您可以使用 [`/memory` 指令](../cli/commands.md) 來`show`、`add` 及`refresh`已載入 `GEMINI.md` 檔案的內容。
