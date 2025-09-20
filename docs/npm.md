# 套件總覽

此 monorepo 包含兩個主要套件：`@google/gemini-cli` 和 `@google/gemini-cli-core`。

## `@google/gemini-cli`

這是 Gemini CLI 的主要套件。它負責使用者介面、指令解析，以及所有面向使用者的功能。

當此套件發佈時，會被打包成單一可執行檔。這個 bundle 會包含所有套件的相依套件，包括 `@google/gemini-cli-core`。這代表無論使用者是透過 `npm install -g @google/gemini-cli` 安裝套件，還是直接用 `npx @google/gemini-cli` 執行，都會使用這個單一、獨立的可執行檔。

## `@google/gemini-cli-core`

此套件包含與 Gemini API 互動的核心邏輯。它負責發送 API 請求、處理驗證，以及管理本地快取。

這個套件不會被打包。當發佈時，會以標準 Node.js 套件的形式發佈，並帶有其自身的相依套件。這讓它可以在其他專案中作為獨立套件使用（如有需要）。所有在 `dist` 資料夾中的轉譯 js 程式碼都會包含在套件內。

## NPM Workspaces

此專案使用 [NPM Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) 來管理這個 monorepo 內的套件。這讓我們可以在專案根目錄統一管理相依套件並跨多個套件執行腳本，簡化了開發流程。

### 運作方式

根目錄的 `package.json` 檔案定義了此專案的 workspaces：

```json
{
  "workspaces": ["packages/*"]
}
```

這會告訴 npm，`packages` 目錄下的每個資料夾都是一個獨立的套件，應作為 workspace 的一部分來管理。

### Workspace 的優點

- **簡化相依管理**：從專案根目錄執行 `npm install`，會自動安裝 workspace 內所有套件的相依套件，並將它們連結在一起。這表示你不需要在每個套件的目錄下分別執行 `npm install`。
- **自動連結**：workspace 內的套件可以彼此相依。當你執行 `npm install` 時，npm 會自動在套件之間建立符號連結（symlink）。這代表當你修改某個套件時，其他依賴該套件的套件可以立即取得最新變更。
- **簡化腳本執行**：你可以使用 `--workspace` 旗標，從專案根目錄執行任一套件中的腳本。例如，若要執行 `cli` 套件中的 `build` 腳本，只需執行 `npm run build --workspace @google/gemini-cli`。
