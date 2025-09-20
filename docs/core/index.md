# Gemini CLI Core

Gemini CLI 的 Core 套件（`packages/core`）是 Gemini CLI 的後端部分，負責與 Gemini API 溝通、管理工具，以及處理從 `packages/cli` 發送的請求。若需 Gemini CLI 的總覽，請參閱[主文件頁面](../index.md)。

## 本節導覽

- **[Core tools API](./tools-api.md)：** 關於工具如何被 Core 定義、註冊與使用的說明。
- **[Memory Import Processor](./memport.md)：** 使用 @file.md 語法的模組化 GEMINI.md 匯入功能文件說明。

## Core 的角色

雖然 Gemini CLI 的 `packages/cli` 部分提供使用者介面，`packages/core` 則負責：

- **Gemini API 互動：** 與 Google Gemini API 安全地通訊，傳送使用者提示並接收模型回應。
- **Prompt engineering（提示工程）：** 為 Gemini 模型構建有效的提示，可能會結合對話歷史、工具定義，以及來自 `GEMINI.md` 檔案的指令性 context。
- **工具管理與協調：**
  - 註冊可用工具（例如檔案系統工具、shell 指令執行）。
  - 解析 Gemini 模型提出的工具使用請求。
  - 依據提供的參數執行所請求的工具。
  - 將工具執行結果回傳給 Gemini 模型以便進一步處理。
- **Session 與狀態管理：** 追蹤對話狀態，包括歷史紀錄及任何維持互動連貫性所需的相關 context。
- **組態管理：** 管理 Core 專屬的設定，例如 API 金鑰存取、模型選擇與工具設定。

## 安全性考量

Core 在安全性上扮演關鍵角色：

- **API 金鑰管理：** 負責處理 `GEMINI_API_KEY`，並確保與 Gemini API 溝通時安全地使用。
- **工具執行：** 當工具與本地系統互動（例如 `run_shell_command`）時，Core（及其底層工具實作）必須採取適當的防護措施，通常會涉及沙箱機制，以防止非預期的修改。

## 對話歷史壓縮

為避免長對話超過 Gemini 模型的 token 限制，Core 提供對話歷史壓縮功能。

當對話接近所設定模型的 token 限制時，Core 會自動在傳送給模型前壓縮對話歷史。此壓縮設計為資訊無失真的方式，但能有效減少所使用的 token 數量。

各模型的 token 限制可參考 [Google AI 文件](https://ai.google.dev/gemini-api/docs/models)。

## 模型自動切換（Model fallback）

Gemini CLI 具備模型自動切換機制，確保即使預設的「pro」模型被限流時，仍可繼續使用 CLI。

若您使用預設的「pro」模型，且 CLI 偵測到被限流，會自動切換至「flash」模型以繼續本次 session，讓您不中斷地持續工作。

## 檔案探索服務（File discovery service）

檔案探索服務負責在專案中尋找與當前 context 相關的檔案。此服務會被 `@` 指令及其他需要存取檔案的工具所使用。

## 記憶體探索服務（Memory discovery service）

記憶體探索服務負責尋找並載入為模型提供 context 的 `GEMINI.md` 檔案。它會以階層式方式搜尋這些檔案，從目前工作目錄開始，逐層往上到專案根目錄及使用者家目錄，同時也會搜尋子目錄。

這讓您可以擁有全域、專案層級及元件層級的 context 檔案，這些 context 會被整合，提供模型最相關的資訊。

您可以使用 [`/memory` 指令](../cli/commands.md) 來 `show`、`add` 和 `refresh` 已載入 `GEMINI.md` 檔案的內容。
