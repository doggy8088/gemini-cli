# Gemini CLI

[![Gemini CLI CI](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml)
[![Gemini CLI E2E](https://github.com/google-gemini/gemini-cli/actions/workflows/e2e.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/e2e.yml)
[![Version](https://img.shields.io/npm/v/@google/gemini-cli)](https://www.npmjs.com/package/@google/gemini-cli)
[![License](https://img.shields.io/github/license/google-gemini/gemini-cli)](https://github.com/google-gemini/gemini-cli/blob/main/LICENSE)

![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

Gemini CLI 是一個開源的 AI agent（AI 代理人），讓你能直接在終端機中體驗 Gemini 的強大功能。它提供輕量級的 Gemini 存取方式，讓你從命令提示字元到我們的模型之間有最直接的路徑。

## 🚀 為什麼選擇 Gemini CLI？

- **🎯 免費方案**：使用個人 Google 帳戶，每分鐘 60 次請求、每日 1,000 次請求
- **🧠 強大的 Gemini 2.5 Pro**：可存取 100 萬 token 的 context window
- **🔧 內建工具**：Google Search grounding、檔案操作、shell 指令、網頁擷取
- **🔌 可擴充**：支援 MCP（Model Context Protocol），方便自訂整合
- **💻 終端機優先**：專為習慣命令列介面的開發者設計
- **🛡️ 開源**：採用 Apache 2.0 授權

## 📦 安裝方式

### 快速安裝

#### 立即以 npx 執行

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

## 發佈頻率與標籤

請參閱 [Releases](./docs/releases.md) 以取得更多詳細資訊。

### Preview

每週二 UTC 2359 會釋出新的 preview 版本。這些版本尚未經過完整驗證，可能包含回歸問題或其他未解決的問題。歡迎協助我們測試，並請使用 `preview` 標籤安裝。

```bash
npm install -g @google/gemini-cli@preview
```

### Stable

- 全新穩定版本將於每週二世界協調時間（UTC）20:00 發布，這將是上週 `preview` 版本的完整升級，並包含任何錯誤修正與驗證。請使用 `latest` 標籤。

```bash
npm install -g @google/gemini-cli@latest
```

### Nightly

- 新版本將於每週的 UTC 0000 發佈，內容包含當下 main 分支 (main branch) 的所有變更。請注意，這些版本可能尚未完成所有驗證，亦可能存在已知問題。請使用 `nightly` 標籤。

```bash
npm install -g @google/gemini-cli@nightly
```

## 📋 主要功能

### 程式碼理解與生成

- 查詢與編輯大型程式碼庫
- 利用多模態能力，從 PDF、圖片或手繪草圖生成新應用程式
- 以自然語言進行除錯與疑難排解

### 自動化與整合

- 自動化操作任務，例如查詢 Pull Request 或處理複雜的 rebase
- 使用 MCP 伺服器 (MCP servers) 連接新功能，包括[使用 Imagen、Veo 或 Lyria 進行媒體生成](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- 可於腳本 (script) 中非互動式執行，以自動化工作流程

### 進階功能

- 透過內建的 [Google Search](https://ai.google.dev/gemini-api/docs/grounding)，為查詢提供即時資訊
- 對話檢查點功能，儲存並恢復複雜會話
- 自訂 context 檔案（GEMINI.md），針對您的專案調整行為

### GitHub 整合

可透過 [**Gemini CLI GitHub Action**](https://github.com/google-github-actions/run-gemini-cli)，將 Gemini CLI 直接整合進您的 GitHub 工作流程：

- **Pull Request 程式碼審查**：自動化程式碼審查，提供有脈絡的回饋與建議
- **Issue 分流**：根據內容分析，自動標記與優先排序 GitHub Issues
- **隨選協助**：在 Issue 與 Pull Request 中提及 `@gemini-cli`，即可獲得除錯、說明或任務委派的協助
- **自訂工作流程**：打造自動化、排程與隨選的工作流程，滿足團隊需求

## 🔐 認證選項

請選擇最適合您的認證方式：

### 選項 1：使用 Google 登入（透過您的 Google 帳戶進行 OAuth 登入）

**✨ 最適合：** 個人開發者，以及所有擁有 Gemini Code Assist 授權者。（詳情請參閱 [配額限制與服務條款](https://cloud.google.com/gemini/docs/quotas)）

**優點：**

- **免費額度**：每分鐘 60 次請求、每日 1,000 次請求
- **Gemini 2.5 Pro**，支援 1M token context window
- **無需管理 API 金鑰** —— 只需使用 Google 帳戶登入
- **自動更新**至最新模型

#### 啟動 Gemini CLI，然後選擇 _Login with Google_，依照提示於瀏覽器完成認證流程

```bash
gemini
```

#### 如果您使用的是您組織提供的付費 Code Assist 授權，請記得設定 Google Cloud 專案

```bash
# Set your Google Cloud Project
export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_NAME"
gemini
```

### 選項 2：Gemini API 金鑰

**✨ 最適合對象：** 需要特定模型控制或付費等級存取的開發者

**優點：**

- **免費方案**：每日可使用 Gemini 2.5 Pro 進行 100 次請求
- **模型選擇**：可選擇特定的 Gemini 模型
- **依用量計費**：如需更高額度可升級

```bash
# Get your key from https://aistudio.google.com/apikey
export GEMINI_API_KEY="YOUR_API_KEY"
gemini
```

### 選項 3：Vertex AI

**✨ 最適合：** 企業團隊與生產環境工作負載

**優點：**

- **企業級功能**：進階安全性與法規遵循
- **可擴展性**：搭配帳單帳戶可享更高的速率限制
- **整合性**：可與現有 Google Cloud 基礎架構整合使用

```bash
# Get your key from Google Cloud Console
export GOOGLE_API_KEY="YOUR_API_KEY"
export GOOGLE_GENAI_USE_VERTEXAI=true
gemini
```

如需 Google Workspace 帳戶及其他驗證方式，請參閱 [authentication guide](./docs/cli/authentication.md)。

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

#### 用於腳本 (script) 的非互動模式

取得簡單的文字回應：

```bash
gemini -p "Explain the architecture of this codebase"
```

若需進行更進階的腳本操作，包括如何解析 JSON 及處理錯誤，請使用`--output-format json`旗標以取得結構化輸出：

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
- [**驗證設定**](./docs/cli/authentication.md) - 詳細的驗證（auth）設定說明
- [**設定指南**](./docs/cli/configuration.md) - 各項設定與自訂化
- [**鍵盤快速鍵**](./docs/keyboard-shortcuts.md) - 提升生產力的小技巧

### 核心功能

- [**指令參考**](./docs/cli/commands.md) - 所有斜線指令（`/help`、`/chat`、`/mcp` 等）
- [**檢查點儲存**](./docs/checkpointing.md) - 儲存與恢復對話
- [**記憶體管理**](./docs/tools/memory.md) - 使用 GEMINI.md context 檔案
- [**Token 快取**](./docs/cli/token-caching.md) - 最佳化 token 使用

### 工具與擴充套件

- [**內建工具總覽**](./docs/tools/index.md)
  - [檔案系統操作](./docs/tools/file-system.md)
  - [Shell 指令](./docs/tools/shell.md)
  - [網頁擷取與搜尋](./docs/tools/web-fetch.md)
  - [多檔案操作](./docs/tools/multi-file.md)
- [**MCP 伺服器（MCP server）整合**](./docs/tools/mcp-server.md) - 透過自訂工具擴充功能
- [**自訂擴充套件**](./docs/extension.md) - 建立自己的指令

### 進階主題

- [**架構總覽**](./docs/architecture.md) - Gemini CLI 的運作方式
- [**IDE 整合**](./docs/ide-integration.md) - VS Code 夥伴工具
- [**沙箱機制與安全性**](./docs/sandbox.md) - 安全的執行環境
- [**企業部署**](./docs/deployment.md) - Docker、系統層級設定
- [**遙測（telemetry）與監控**](./docs/telemetry.md) - 使用狀況追蹤
- [**工具 API 開發**](./docs/core/tools-api.md) - 建立自訂工具

### 設定與自訂化

- [**設定參考**](./docs/cli/configuration.md) - 所有設定選項
- [**主題自訂**](./docs/cli/themes.md) - 視覺自訂化
- [**.gemini 目錄**](./docs/gemini-ignore.md) - 專案專屬設定
- [**環境變數**](./docs/cli/configuration.md#environment-variables)

### 疑難排解與支援

- [**疑難排解指南**](./docs/troubleshooting.md) - 常見問題與解決方法
- [**常見問答（FAQ）**](./docs/troubleshooting.md#frequently-asked-questions) - 快速解答
- 使用 `/bug` 指令可直接從 CLI 回報問題

### 使用 MCP 伺服器（MCP servers）

在 `~/.gemini/settings.json` 中設定 MCP 伺服器，以擴充 Gemini CLI 的自訂工具功能：

```text
> @github List my open pull requests
> @slack Send a summary of today's commits to #dev channel
> @database Run a query to find inactive users
```

請參閱 [MCP Server Integration guide](./docs/tools/mcp-server.md) 以取得設定說明。

## 🤝 貢獻指南

我們歡迎您的貢獻！Gemini CLI 完全開源（Apache 2.0），我們鼓勵社群：

- 回報錯誤與提出功能建議
- 改善文件
- 提交程式碼改進
- 分享您的 MCP 伺服器和擴充套件

請參閱我們的 [Contributing Guide](./CONTRIBUTING.md)，瞭解開發環境設定、程式碼標準，以及如何提交 pull request。

查看我們的 [Official Roadmap](https://github.com/orgs/google-gemini/projects/11/)，瞭解規劃中的功能與優先順序。

## 📖 資源

- **[Official Roadmap](./ROADMAP.md)** - 查看接下來的開發計畫
- **[NPM Package](https://www.npmjs.com/package/@google/gemini-cli)** - 套件註冊表
- **[GitHub Issues](https://github.com/google-gemini/gemini-cli/issues)** - 回報錯誤或提出功能需求
- **[Security Advisories](https://github.com/google-gemini/gemini-cli/security/advisories)** - 安全性更新

### 移除安裝

請參閱 [Uninstall Guide](docs/Uninstall.md) 以取得移除說明。

## 📄 法律資訊

- **授權條款**：[Apache License 2.0](LICENSE)
- **服務條款**：[Terms & Privacy](./docs/tos-privacy.md)
- **安全性**：[Security Policy](SECURITY.md)

---

<p align="center">
  由 Google 與開源社群 ❤️ 共同打造
</p>
</p>
