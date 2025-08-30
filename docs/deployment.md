# 執行與部署

本文件說明如何執行 Gemini CLI，並解釋 Gemini CLI 使用的部署架構。

## 執行 Gemini CLI

有多種方式可以執行 Gemini CLI。您選擇的選項取決於您打算如何使用 Gemini CLI。

---

### 1. 標準安裝（一般使用者建議）

這是終端使用者安裝 Gemini CLI 的建議方式。它涉及從 NPM 註冊表下載 Gemini CLI 套件。

- **全域安裝：**

  ```bash
  npm install -g @google/gemini-cli
  ```

  然後，從任何地方執行 CLI：

  ```bash
  gemini
  ```

- **NPX 執行：**

  ```bash
  # 從 NPM 執行最新版本，無需全域安裝
  npx @google/gemini-cli
  ```

---

### 2. 在沙箱中執行（Docker/Podman）

為了安全性和隔離性，Gemini CLI 可以在容器內執行。這是 CLI 執行可能有副作用工具的預設方式。

- **直接從註冊表執行：**
  您可以直接執行已發布的沙箱映像。這對於只有 Docker 且想要執行 CLI 的環境很有用。
  ```bash
  # 執行已發布的沙箱映像
  docker run --rm -it us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.1
  ```
- **使用 `--sandbox` 旗標：**
  如果您已在本地安裝 Gemini CLI（使用上述標準安裝），您可以指示它在沙箱容器內執行。
  ```bash
  gemini --sandbox -y -p "your prompt here"
  ```

---

### 3. 從原始碼執行（Gemini CLI 貢獻者建議）

專案貢獻者會想要直接從原始碼執行 CLI。

- **開發模式：**
  此方法提供熱重載，對於活躍開發很有用。
  ```bash
  # 從儲存庫的根目錄
  npm run start
  ```
- **類似正式版模式（連結套件）：**
  此方法透過連結您的本地套件來模擬全域安裝。這對於在正式版工作流程中測試本地建置很有用。

  ```bash
  # 將本地 cli 套件連結到您的全域 node_modules
  npm link packages/cli

  # 現在您可以使用 `gemini` 指令執行您的本地版本
  gemini
  ```

---

### 4. 從 GitHub 執行最新的 Gemini CLI 提交

您可以直接從 GitHub 儲存庫執行最近提交的 Gemini CLI 版本。這對於測試仍在開發中的功能很有用。

```bash
# 直接從 GitHub 的 main 分支執行 CLI
npx https://github.com/google-gemini/gemini-cli
```

## 部署架構

上述執行方法是透過以下架構元件和流程實現的：

**NPM 套件**

Gemini CLI 專案是一個發布兩個核心套件到 NPM 註冊表的 monorepo：

- `@google/gemini-cli-core`：後端，處理邏輯和工具執行。
- `@google/gemini-cli`：面向使用者的前端。

這些套件用於執行標準安裝和從原始碼執行 Gemini CLI。

**建置和打包流程**

根據發布通道，使用兩種不同的建置流程：

- **NPM 發布：** 為了發布到 NPM 註冊表，`@google/gemini-cli-core` 和 `@google/gemini-cli` 中的 TypeScript 原始碼使用 TypeScript 編譯器（`tsc`）轉譯為標準 JavaScript。產生的 `dist/` 目錄是在 NPM 套件中發布的內容。這是 TypeScript 函式庫的標準方法。

- **GitHub `npx` 執行：** 當直接從 GitHub 執行最新版本的 Gemini CLI 時，`package.json` 中的 `prepare` 腳本會觸發不同的流程。此腳本使用 `esbuild` 將整個應用程式及其相依性打包成單一、自包含的 JavaScript 檔案。此打包是在使用者的機器上即時建立的，不會檢入儲存庫。

**Docker 沙箱映像**

基於 Docker 的執行方法由 `gemini-cli-sandbox` 容器映像支援。此映像發布到容器註冊表，並包含預安裝的全域版本 Gemini CLI。

## 發布流程

發布流程透過 GitHub Actions 自動化。發布工作流程執行以下動作：

1.  使用 `tsc` 建置 NPM 套件。
2.  將 NPM 套件發布到成品註冊表。
3.  建立包含打包資產的 GitHub 發布。
