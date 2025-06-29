# 執行與部署

本文件說明如何執行 Gemini CLI，並解釋 Gemini CLI 使用的部署架Gemin構。

## 執行 Gemini CLI

有數種方式可以執行 Gemini CLI。您選擇的選項取決於您打算如何使用 Gemini CLI。

---

### 1. 標準安裝 (建議一般使用者使用)

這是建議終端使用者安裝 Gemini CLI 的方式。其中包含從 NPM 登錄檔下載 Gemini CLI 套件。

- **全域安裝：**

  ```bash
  # 全域安裝 CLI
  npm install -g @google/gemini-cli

  # 現在您可以從任何地方執行 CLI
  gemini
  ```

- **NPX 執行：**
  ```bash
  # 無需全域安裝即可從 NPM 執行最新版本
  npx @google/gemini-cli
  ```

---

### 2. 在沙箱中執行 (Docker/Podman)

為了安全性和隔離，Gemini CLI 可以在容器內執行。這是 CLI 執行可能產生副作用的工具的預設方式。

- **直接從登錄檔執行：**
  您可以直接執行已發布的沙箱映像檔。這對於您只有 Docker 並想執行 CLI 的環境很有用。
  ```bash
  # 執行已發布的沙箱映像檔
  docker run --rm -it us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox:0.1.1
  ```
- **使用 `--sandbox` 旗標：**
  如果您已在本機安裝 Gemini CLI (使用上述標準安裝)，您可以指示它在沙箱容器內執行。
  ```bash
  gemini --sandbox "您的提示在此"
  ```

---

### 3. 從原始碼執行 (建議 Gemini CLI 貢獻者使用)

專案的貢獻者會希望直接從原始碼執行 CLI。

- **開發模式：**
  此方法提供熱重載功能，對積極開發很有用。
  ```bash
  # 從儲存庫的根目錄
  npm run start
  ```
- **類生產模式 (連結的套件)：**
  此方法透過連結您的本機套件來模擬全域安裝。這對於在生產工作流程中測試本機組建很有用。

  ```bash
  # 將本機 cli 套件連結到您的全域 node_modules
  npm link packages/cli

  # 現在您可以使用 `gemini` 指令執行您的本機版本
  gemini
  ```

---

### 4. 從 GitHub 執行最新的 Gemini CLI 修訂版本

您可以直接從 GitHub 儲存庫執行最新修訂版本的 Gemini CLI。這對於測試仍在開發中的功能很有用。

```bash
# 直接從 GitHub 上的 main 分支執行 CLI
npx https://github.com/google-gemini/gemini-cli
```

## 部署架構

上述執行方法是由下列架構元件和程序實現的：

**NPM 套件**

Gemini CLI 專案是一個 monorepo，會將兩個核心套件發布到 NPM 登錄檔：

- `@google/gemini-cli-core`：後端，處理邏輯和工具執行。
- `@google/gemini-cli`：使用者導向的前端。

這些套件在執行標準安裝和從原始碼執行 Gemini CLI 時使用。

**建置與封裝程序**

根據發行管道的不同，會使用兩種不同的建置程序：

- **NPM 發布：** 為了發布到 NPM 登錄檔，會使用 TypeScript 編譯器 (`tsc`) 將 `@google/gemini-cli-core` 和 `@google/gemini-cli` 中的 TypeScript 原始碼轉譯為標準 JavaScript。產生的 `dist/` 目錄就是發布在 NPM 套件中的內容。這是 TypeScript 程式庫的標準作法。

- **GitHub `npx` 執行：** 當直接從 GitHub 執行最新版本的 Gemini CLI 時，會由 `package.json` 中的 `prepare` 指令碼觸發不同的程序。此指令碼會使用 `esbuild` 將整個應用程式及其相依性捆綁成單一、獨立的 JavaScript 檔案。此捆綁包是在使用者的機器上即時建立的，不會簽入儲存庫。

**Docker 沙箱映像檔**

以 Docker 為基礎的執行方法是由 `gemini-cli-sandbox` 容器映像檔支援。此映像檔會發布到容器登錄檔，並包含預先安裝的全域版本 Gemini CLI。`scripts/prepare-cli-packagejson.js` 指令碼會在發布前動態地將此映像檔的 URI 插入 CLI 的 `package.json` 中，以便 CLI 在使用 `--sandbox` 旗標時知道要提取哪個映像檔。

## 發行程序

一個統一的指令碼 `npm run publish:release` 會協調發行程序。該指令碼會執行下列動作：

1.  使用 `tsc` 建置 NPM 套件。
2.  使用 Docker 映像檔 URI 更新 CLI 的 `package.json`。
3.  建置並標記 `gemini-cli-sandbox` Docker 映像檔。
4.  將 Docker 映像檔推送到容器登錄檔。
5.  將 NPM 套件發布到成品登錄檔。
