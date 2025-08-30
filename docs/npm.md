# 套件總覽

此 monorepo 包含兩個主要套件：`@google/gemini-cli` 和 `@google/gemini-cli-core`。

## `@google/gemini-cli`

這是 Gemini CLI 的主要套件。它負責使用者介面、指令解析和所有其他面向使用者的功能。

當此套件發布時，它會打包成單一可執行檔案。此打包檔包含所有套件的相依性，包括 `@google/gemini-cli-core`。這意味著無論使用者使用 `npm install -g @google/gemini-cli` 安裝套件或使用 `npx @google/gemini-cli` 直接執行，他們都在使用這個單一、自包含的可執行檔。

## `@google/gemini-cli-core`

此套件包含與 Gemini API 互動的核心邏輯。它負責進行 API 請求、處理驗證和管理本機快取。

此套件不會打包。當它發布時，會作為標準 Node.js 套件及其自己的相依性發布。如果需要，這允許它作為獨立套件在其他專案中使用。`dist` 資料夾中的所有轉譯 js 程式碼都包含在套件中。

## NPM 工作區

此專案使用 [NPM 工作區](https://docs.npmjs.com/cli/v10/using-npm/workspaces) 來管理此 monorepo 中的套件。這透過允許我們從專案根目錄管理相依性和跨多個套件執行腳本來簡化開發。

### 運作方式

根 `package.json` 檔案定義此專案的工作區：

```json
{
  "workspaces": ["packages/*"]
}
```

這告訴 NPM `packages` 目錄中的任何資料夾都是一個獨立套件，應該作為工作區的一部分進行管理。

### 工作區的好處

- **簡化相依性管理**：從專案根目錄執行 `npm install` 將為工作區中的所有套件安裝所有相依性並將它們連結在一起。這意味著您不需要在每個套件的目錄中執行 `npm install`。
- **自動連結**：工作區內的套件可以互相相依。當您執行 `npm install` 時，NPM 會自動在套件之間建立符號連結。這意味著當您對一個套件進行變更時，這些變更會立即對依賴它的其他套件可用。
- **簡化腳本執行**：您可以使用 `--workspace` 旗標從專案根目錄在任何套件中執行腳本。例如，要在 `cli` 套件中執行 `build` 腳本，您可以執行 `npm run build --workspace @google/gemini-cli`。
