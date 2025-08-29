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

This tells NPM that any folder inside the `packages` directory is a separate package that should be managed as part of the workspace.

### Benefits of Workspaces

- **Simplified Dependency Management**: Running `npm install` from the root of the project will install all dependencies for all packages in the workspace and link them together. This means you don't need to run `npm install` in each package's directory.
- **Automatic Linking**: Packages within the workspace can depend on each other. When you run `npm install`, NPM will automatically create symlinks between the packages. This means that when you make changes to one package, the changes are immediately available to other packages that depend on it.
- **Simplified Script Execution**: You can run scripts in any package from the root of the project using the `--workspace` flag. For example, to run the `build` script in the `cli` package, you can run `npm run build --workspace @google/gemini-cli`.
