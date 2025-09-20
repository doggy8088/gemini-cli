# Gemini CLI 執行與部署

本文件說明如何執行 Gemini CLI，並解釋 Gemini CLI 所採用的部署架構。

## 執行 Gemini CLI

有多種方式可以執行 Gemini CLI。您選擇的方式取決於您打算如何使用 Gemini CLI。

---

### 1. 標準安裝（建議一般使用者採用）

這是最推薦給終端使用者安裝 Gemini CLI 的方式。此方法需要從 NPM registry 下載 Gemini CLI 套件。

- **全域安裝：**

  ```bash
  npm install -g @google/gemini-cli
  ```

  然後，您就可以在任何位置執行命令列介面 (CLI)：

  ```bash
  gemini
  ```

- **NPX execution:**


- **NPX 執行：**

  ```bash
  # Execute the latest version from NPM without a global install
  npx @google/gemini-cli
  ```

---

### 2. 在沙箱中執行（Docker/Podman）

為了安全性與隔離性，Gemini CLI 可以在容器內執行。這是 CLI 執行可能產生副作用工具的預設方式。

- **直接從 Registry 執行：**
  你可以直接執行已發佈的 sandbox 映像檔。這在你只有 Docker 並且想要執行 CLI 的環境中特別有用。
  ```bash
  # Run the published sandbox image
  docker run --rm -it us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.1
  ```
- **使用 `--sandbox` 旗標 (flag)：**
  如果你已經在本機安裝了 Gemini CLI（依照上方的標準安裝方式），你可以指示它在 sandbox 容器內執行。
  ```bash
  gemini --sandbox -y -p "your prompt here"
  ```

---

### 3. 從原始碼執行（建議 Gemini CLI 貢獻者使用）

專案貢獻者會希望直接從原始碼執行命令列介面 (CLI)。

- **開發模式：**
  此方法提供熱重載功能，非常適合於積極開發時使用。
  ```bash
  # From the root of the repository
  npm run start
  ```
- **Production-like mode (Linked package):**
  This method simulates a global installation by linking your local package. It's useful for testing a local build in a production workflow.


譯文：

- **類生產環境模式（已連結套件）：**
  此方法會透過連結本地套件來模擬全域安裝。這對於在生產工作流程中測試本地建置非常有用。

  ```bash
  # Link the local cli package to your global node_modules
  npm link packages/cli

  # Now you can run your local version using the `gemini` command
  gemini
  ```

---

### 4. 從 GitHub 執行最新的 Gemini CLI commit

你可以直接從 GitHub 儲存庫執行最新提交的 Gemini CLI 版本。這對於測試仍在開發中的功能非常有用。

```bash
# Execute the CLI directly from the main branch on GitHub
npx https://github.com/google-gemini/gemini-cli
```

## 部署架構

上述的執行方式是透過以下架構元件與流程實現的：

**NPM 套件**

Gemini CLI 專案是一個 monorepo，會將兩個核心套件發佈到 NPM registry：

- `@google/gemini-cli-core`：後端，負責邏輯處理與工具執行。
- `@google/gemini-cli`：面向使用者的前端。

這些套件會在標準安裝時，以及從原始碼執行 Gemini CLI 時使用。

**建置與封裝流程**

根據發佈管道，會使用兩種不同的建置流程：

- **NPM 發佈：** 當發佈到 NPM registry 時，`@google/gemini-cli-core` 和 `@google/gemini-cli` 內的 TypeScript 原始碼會透過 TypeScript Compiler (`tsc`) 轉譯為標準 JavaScript。產生的 `dist/` 目錄即為 NPM 套件中發佈的內容。這是 TypeScript 函式庫的標準做法。

- **GitHub `npx` 執行：** 當直接從 GitHub 執行最新版本的 Gemini CLI 時，會由 `package.json` 中的 `prepare` 腳本觸發不同的流程。此腳本會使用 `esbuild`，將整個應用程式及其相依套件打包成單一、可自我包含的 JavaScript 檔案。這個 bundle 會在使用者本機即時產生，不會被提交到版本庫。

**Docker sandbox 容器映像檔**

基於 Docker 的執行方式由 `gemini-cli-sandbox` 容器映像檔支援。此映像檔會發佈到容器 registry，並內含已全域安裝的 Gemini CLI 版本。

## 發佈流程

發佈流程是透過 GitHub Actions 自動化執行的。發佈工作流程會執行以下動作：

1. 使用 `tsc` 建置 NPM 套件。
2. 將 NPM 套件發佈到 artifact registry。
3. 建立包含 bundle 資產的 GitHub releases。
