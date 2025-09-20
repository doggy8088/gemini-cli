# Gemini CLI

[![Gemini CLI CI](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml)
[![Gemini CLI E2E](https://github.com/google-gemini/gemini-cli/actions/workflows/e2e.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/e2e.yml)
[![Version](https://img.shields.io/npm/v/@google/gemini-cli)](https://www.npmjs.com/package/@google/gemini-cli)
[![License](https://img.shields.io/github/license/google-gemini/gemini-cli)](https://github.com/google-gemini/gemini-cli/blob/main/LICENSE)

![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

Gemini CLI 是一個開源的 AI agent，讓你能直接在終端機中體驗 Gemini 的強大能力。它提供輕量級的 Gemini 存取方式，讓你能以最直接的方式，從命令提示字元連接到我們的模型。

## 🚀 為什麼選擇 Gemini CLI？

- **🎯 免費方案**：使用個人 Google 帳戶，每分鐘 60 次請求、每日 1,000 次請求
- **🧠 強大的 Gemini 2.5 Pro**：可存取 1M token 的上下文視窗
- **🔧 內建工具**：支援 Google 搜尋依據、檔案操作、shell 指令、網頁擷取
- **🔌 可擴充**：支援 MCP（Model Context Protocol），方便自訂整合
- **💻 終端機優先**：專為習慣在命令列工作的開發者設計
- **🛡️ 開源授權**：採用 Apache 2.0 授權

## 📦 安裝

### 快速安裝

#### 使用 npx 即時執行

```bash
# Using npx (no installation required)
npx https://github.com/google-gemini/gemini-cli
```

#### 使用 npm 全域安裝

```bash
npm install -g @google/gemini-cli
```

#### 使用 Homebrew 全域安裝（macOS/Linux）

```bash
brew install gemini-cli
```

#### 系統需求

- Node.js 版本 20 或以上
- macOS、Linux 或 Windows

## 發佈節奏與標籤

請參閱 [Releases](./docs/releases.md) 以獲得更多詳細資訊。

### 預覽版

每週二世界協調時間（UTC）23:59 會發佈新的預覽版。這些預覽版尚未經過完整驗證，可能包含回歸問題或其他未解決的問題。請協助我們進行測試，並使用 `preview` 標籤安裝。

```bash
npm install -g @google/gemini-cli@preview
```

### 穩定版

- 新的穩定版（Stable）每週二世界協調時間（UTC）20:00 發佈，內容包括上週的`preview`版本全面升級，以及任何錯誤修正與驗證。請使用`latest`標籤。

```bash
npm install -g @google/gemini-cli@latest
```

### Nightly

- 每週將於每天的 UTC 0000 發佈新版本，內容包含主分支截至發佈時的所有變更。請假設這些版本仍有待驗證及潛在問題。請使用 `nightly` 標籤。

```bash
npm install -g @google/gemini-cli@nightly
```

## 📋 主要功能

### 程式碼理解與生成

- 查詢並編輯大型程式碼庫
- 利用多模態能力，從 PDF、圖片或草圖生成全新應用程式
- 透過自然語言進行除錯與問題排查

### 自動化與整合

- 自動化操作任務，例如查詢 Pull Request 或處理複雜的 rebase
- 使用 MCP 伺服器連接新功能，包括[使用 Imagen、Veo 或 Lyria 進行媒體生成](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- 可於腳本中非互動式執行，以實現工作流程自動化

### 進階功能

- 透過內建的 [Google Search](https://ai.google.dev/gemini-api/docs/grounding) 為查詢提供即時資訊依據
- 對話檢查點功能，可儲存並恢復複雜會話
- 自訂情境檔案（GEMINI.md），依專案需求調整行為

### GitHub 整合

可將 Gemini CLI 直接整合進你的 GitHub 工作流程，透過 [**Gemini CLI GitHub Action**](https://github.com/google-github-actions/run-gemini-cli)：

- **Pull Request 審查**：自動化程式碼審查，提供情境化回饋與建議
- **Issue 分類**：根據內容分析，自動標記與優先排序 GitHub issue
- **隨選協助**：在 issue 與 pull request 中提及 `@gemini-cli`，即可獲得除錯、說明或任務分派協助
- **自訂工作流程**：建立自動化、排程與隨選的工作流程，滿足團隊需求

## 🔐 認證選項

請選擇最適合你的認證方式：

### 選項 1：使用 Google 登入（透過 Google 帳戶進行 OAuth 登入）

**✨ 最適合：** 個人開發者，以及擁有 Gemini Code Assist 授權的使用者。（詳情請參閱[配額限制與服務條款](https://cloud.google.com/gemini/docs/quotas)）

**優點：**

- **免費方案**：每分鐘 60 次請求、每日 1,000 次請求
- **Gemini 2.5 Pro**，具備 100 萬 token 的 context window
- **無需 API 金鑰管理** —— 只需使用 Google 帳戶登入
- **自動更新**至最新模型

#### 啟動 Gemini CLI，選擇 _Login with Google_，並依照提示於瀏覽器中完成認證流程

```bash
gemini
```

#### 如果您正在使用組織提供的付費 Code Assist 授權，請記得設定 Google Cloud 專案

```bash
# Set your Google Cloud Project
export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_NAME"
gemini
```

### 選項 2：Gemini API 金鑰

**✨ 最適合對象：** 需要特定模型控制或付費等級存取的開發者

**優點：**

- **免費方案**：Gemini 2.5 Pro 每日可發送 100 次請求
- **模型選擇**：可選擇特定 Gemini 模型
- **依用量計費**：需要更高額度時可升級

```bash
# Get your key from https://aistudio.google.com/apikey
export GEMINI_API_KEY="YOUR_API_KEY"
gemini
```

### 選項 3：Vertex AI

**✨ 最適合：** 企業團隊與生產環境工作負載

**優點：**

- **企業級功能**：進階安全性與合規性
- **可擴展性**：綁定計費帳戶可獲得更高的速率限制
- **整合性**：可與現有的 Google Cloud 基礎架構整合使用

```bash
# Get your key from Google Cloud Console
export GOOGLE_API_KEY="YOUR_API_KEY"
export GOOGLE_GENAI_USE_VERTEXAI=true
gemini
```

如需 Google Workspace 帳戶及其他驗證方法，請參閱 [authentication guide](./docs/cli/authentication.md)。

## 🚀 快速開始

### 基本用法

#### 在目前目錄啟動

```bash
gemini
```

#### 包含多個目錄

```bash
gemini --include-directories ../lib,../docs
```

#### 使用特定模型

```bash
gemini -m gemini-2.5-flash
```

#### 用於腳本的非互動模式

取得簡單的文字回應：

```bash
gemini -p "Explain the architecture of this codebase"
```

若需進行更進階的腳本撰寫，包括如何解析 JSON 及處理錯誤，請使用 `--output-format json` 旗標以取得結構化輸出：

```bash
gemini -p "Explain the architecture of this codebase" --output-format json
```

### 快速範例

#### 開始一個新專案

```bash
cd new-project/
gemini
> Write me a Discord bot that answers questions using a FAQ.md file I will provide
```

#### 分析現有程式碼

```bash
git clone https://github.com/google-gemini/gemini-cli
cd gemini-cli
gemini
> Give me a summary of all of the changes that went in yesterday
```

## 📚 文件說明

### 入門指南

- [**快速入門指南**](./docs/cli/index.md) - 快速開始使用
- [**驗證設定**](./docs/cli/authentication.md) - 詳細的驗證組態說明
- [**組態指南**](./docs/cli/configuration.md) - 設定與自訂化
- [**鍵盤快速鍵**](./docs/keyboard-shortcuts.md) - 提升生產力的小技巧

### 核心功能

- [**指令參考**](./docs/cli/commands.md) - 所有斜線指令（`/help`、`/chat`、`/mcp` 等）
- [**檢查點功能**](./docs/checkpointing.md) - 儲存與恢復對話
- [**記憶體管理**](./docs/tools/memory.md) - 使用 GEMINI.md 上下文檔案
- [**Token 快取**](./docs/cli/token-caching.md) - 最佳化 Token 使用

### 工具與擴充功能

- [**內建工具總覽**](./docs/tools/index.md)
  - [檔案系統操作](./docs/tools/file-system.md)
  - [Shell 指令](./docs/tools/shell.md)
  - [網頁擷取與搜尋](./docs/tools/web-fetch.md)
  - [多檔案操作](./docs/tools/multi-file.md)
- [**MCP Server 整合**](./docs/tools/mcp-server.md) - 透過自訂工具擴充功能
- [**自訂擴充功能**](./docs/extension.md) - 建立自己的指令

### 進階主題

- [**架構總覽**](./docs/architecture.md) - Gemini CLI 的運作原理
- [**IDE 整合**](./docs/ide-integration.md) - VS Code 伴侶工具
- [**沙箱與安全性**](./docs/sandbox.md) - 安全的執行環境
- [**企業部署**](./docs/deployment.md) - Docker、系統層級設定
- [**遙測與監控**](./docs/telemetry.md) - 使用狀況追蹤
- [**工具 API 開發**](./docs/core/tools-api.md) - 建立自訂工具

### 組態與自訂化

- [**設定參考**](./docs/cli/configuration.md) - 所有組態選項
- [**主題自訂化**](./docs/cli/themes.md) - 視覺自訂
- [**.gemini 目錄**](./docs/gemini-ignore.md) - 專案專屬設定
- [**環境變數**](./docs/cli/configuration.md#environment-variables)

### 疑難排解與支援

- [**疑難排解指南**](./docs/troubleshooting.md) - 常見問題與解決方法
- [**常見問答**](./docs/troubleshooting.md#frequently-asked-questions) - 快速解答
- 使用 `/bug` 指令可直接從命令列介面 (CLI) 回報問題

### 使用 MCP Servers

在 `~/.gemini/settings.json` 中設定 MCP servers，以擴充 Gemini CLI 的自訂工具功能：

```text
> @github List my open pull requests
> @slack Send a summary of today's commits to #dev channel
> @database Run a query to find inactive users
```

請參閱 [MCP Server 整合指南](./docs/tools/mcp-server.md) 以取得設定說明。

## 🤝 貢獻指南

我們歡迎各界貢獻！Gemini CLI 完全開源（Apache 2.0），我們鼓勵社群：

- 回報錯誤與提出功能建議
- 改善文件
- 提交程式碼改進
- 分享您的 MCP 伺服器與擴充套件

請參閱我們的 [貢獻指南](./CONTRIBUTING.md)，了解開發環境設定、程式碼標準，以及如何提交 pull request。

查看我們的 [官方開發藍圖](https://github.com/orgs/google-gemini/projects/11/)，瞭解規劃中的功能與優先事項。

## 📖 資源

- **[官方開發藍圖](./ROADMAP.md)** - 查看即將推出的功能
- **[NPM 套件](https://www.npmjs.com/package/@google/gemini-cli)** - 套件註冊中心
- **[GitHub 問題追蹤](https://github.com/google-gemini/gemini-cli/issues)** - 回報錯誤或提出新功能需求
- **[安全公告](https://github.com/google-gemini/gemini-cli/security/advisories)** - 安全性更新

### 移除

請參閱 [移除指南](docs/Uninstall.md) 以取得移除說明。

## 📄 法律資訊

- **授權條款**：[Apache License 2.0](LICENSE)
- **服務條款**：[Terms & Privacy](./docs/tos-privacy.md)
- **安全性**：[Security Policy](SECURITY.md)

---

<p align="center">
  由 Google 與開源社群傾心打造 ❤️
</p>
</p>
