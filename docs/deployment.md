# Gemini CLI 執行與部署

本文件說明 Gemini CLI 的執行方法與部署架構。

## 執行 Gemini CLI

執行 Gemini CLI 有數種方法。您選擇的選項取決於您打算如何使用 Gemini CLI。

---

### 1. 標準安裝（建議一般使用者採用）

這是建議終端使用者安裝 Gemini CLI 的方法。此方法會從 NPM 註冊中心下載 Gemini CLI 套件。
- **全域安裝：**

  ```bash
  # 全域安裝 CLI
  npm install -g @google/gemini-cli

  # 現在您可以從任何地方執行 CLI
  gemini
  ```

- **NPX 執行：**
  ```bash
  # 從 NPM 執行最新版本，無需全域安裝
  npx @google/gemini-cli
  ```

---

### 2. 在沙盒中執行 (Docker/Podman)

為了安全與隔離，Gemini CLI 可以在容器內執行。這是 CLI 執行可能產生副作用的工具的預設方式。
- **直接從註冊中心執行：**
  您可以直接執行已發佈的沙盒映像檔。這對於您只有 Docker 並想執行 CLI 的環境很有用。
  ```bash
  # 執行已發佈的沙盒映像檔
  docker run --rm -it us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.1
  ```
- **使用 `--sandbox` 旗標：**
  如果您已在本地安裝 Gemini CLI（使用上述的標準安裝方式），您可以指示它在沙盒容器內執行。
  ```bash
  gemini --sandbox "在此輸入您的提示"
  ```

---

### 3. 從原始碼執行（建議 Gemini CLI 貢獻者採用）

專案貢獻者會需要直接從原始碼執行 CLI。

- **開發模式：**
  此方法提供熱重載功能，對積極開發很有用。
  ```bash
  # 從儲存庫的根目錄
  npm run start
  ```
- **類生產模式（連結套件）：**
  此方法透過連結您的本地套件來模擬全域安裝。這對於在生產工作流程中測試本地建構很有用。

  ```bash
  # 將本地 cli 套件連結到您的全域 node_modules
  npm link packages/cli

  # 現在您可以使用 `gemini` 指令執行您的本地版本
  gemini
  ```

---

### 4. 從 GitHub 執行最新的 Gemini CLI commit

您可以直接從 GitHub 儲存庫執行最近提交的 Gemini CLI 版本。這對於測試仍在開發中的功能很有用。

```bash
# 直接從 GitHub 上的 main 分支執行 CLI
npx https://github.com/google-gemini/gemini-cli
```

## 部署架構

上述的執行方法是透過以下的架構元件與流程實現的：

**NPM 套件**

Gemini CLI 專案是一個 monorepo，它會將兩個核心套件發佈到 NPM 註冊中心：

- `@google/gemini-cli-core`：後端，處理邏輯與工具執行。
- `@google/gemini-cli`：面向使用者的前端。

在執行標準安裝以及從原始碼執行 Gemini CLI 時，都會使用這些套件。

**建構與封裝流程**

根據不同的發佈管道，會使用兩種不同的建構流程：

- **NPM 發佈：** 為了發佈到 NPM 註冊中心，`@google/gemini-cli-core` 與 `@google/gemini-cli` 中的 TypeScript 原始碼会使用 TypeScript 編譯器 (`tsc`) 轉譯為標準的 JavaScript。最終產生的 `dist/` 目錄就是發佈在 NPM 套件中的內容。這是 TypeScript 函式庫的標準作法。
- **GitHub `npx` 執行：** 當直接從 GitHub 執行最新版的 Gemini CLI 時，`package.json` 中的 `prepare` 指令碼會觸發一個不同的流程。此指令碼使用 `esbuild` 將整個應用程式及其相依性套件打包成一個獨立的 JavaScript 檔案。這個打包檔案是在使用者的機器上即時建立的，並不會被簽入到儲存庫中。

**Docker 沙盒映像檔**

基於 Docker 的執行方法是由 `gemini-cli-sandbox` 容器映像檔所支援。此映像檔發佈到一個容器註冊中心，並包含一個預先安裝的全域版本 Gemini CLI。在發佈前，`scripts/prepare-cli-packagejson.js` 指令碼會動態地將此映像檔的 URI 注入到 CLI 的 `package.json` 中，如此一來，當使用 `--sandbox` 旗標時，CLI 就會知道要拉取哪個映像檔。

## 發佈流程

一個名為 `npm run publish:release` 的統一腳本會協調整個發布流程。該腳本會執行以下操作：

1.  使用 `tsc` 建構 NPM 套件。
2.  使用 Docker 映像檔的 URI 更新 CLI 的 `package.json`。
3.  建構並標記 `gemini-cli-sandbox` Docker 映像檔。
4.  將 Docker 映像檔推送至容器登錄檔。
5.  將 NPM 套件發布至成品登錄檔。
