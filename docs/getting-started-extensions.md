# Gemini CLI 擴充套件快速入門

本指南將帶你一步步建立你的第一個 Gemini CLI 擴充套件。你將學會如何建立新的擴充套件、透過 MCP 伺服器新增自訂工具、建立自訂指令，以及使用 `GEMINI.md` 檔案為模型提供 context。

## 先決條件

在開始之前，請確保你已安裝 Gemini CLI，並且具備 Node.js 與 TypeScript 的基本認識。

## 步驟 1：建立新擴充套件

最簡單的開始方式是使用內建範本之一。我們將以 `mcp-server` 範例作為基礎。

執行以下指令，建立一個名為 `my-first-extension` 的新目錄，並包含範本檔案：

```bash
gemini extensions new my-first-extension mcp-server
```

這將會建立一個具有以下結構的新目錄：

```
my-first-extension/
├── example.ts
├── gemini-extension.json
├── package.json
└── tsconfig.json
```

## 步驟 2：了解擴充套件檔案

讓我們來看看你新建立的擴充套件中的主要檔案。

### `gemini-extension.json`

這是你的擴充套件的 manifest 檔案。它告訴 Gemini CLI 如何載入並使用你的擴充套件。

```json
{
  "name": "my-first-extension",
  "version": "1.0.0",
  "mcpServers": {
    "nodeServer": {
      "command": "node",
      "args": ["${extensionPath}${/}dist${/}example.js"],
      "cwd": "${extensionPath}"
    }
  }
}
```

- `name`：您的擴充套件的唯一名稱。
- `version`：您的擴充套件的版本。
- `mcpServers`：此區段定義一個或多個 Model Context Protocol (MCP) 伺服器。MCP 伺服器是您可以為模型新增工具的方式。
  - `command`、`args`、`cwd`：這些欄位指定如何啟動您的伺服器。請注意 `${extensionPath}` 變數的使用，Gemini CLI 會將其替換為您的擴充套件安裝目錄的絕對路徑。這讓您的擴充套件無論安裝在哪裡都能正常運作。

### `example.ts`

此檔案包含您的 MCP 伺服器的原始碼。這是一個簡單的 Node.js 伺服器，並使用 `@modelcontextprotocol/sdk`。

```typescript
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'prompt-server',
  version: '1.0.0',
});

// Registers a new tool named 'fetch_posts'
server.registerTool(
  'fetch_posts',
  {
    description: 'Fetches a list of posts from a public API.',
    inputSchema: z.object({}).shape,
  },
  async () => {
    const apiResponse = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
    );
    const posts = await apiResponse.json();
    const response = { posts: posts.slice(0, 5) };
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response),
        },
      ],
    };
  },
);

// ... (prompt registration omitted for brevity)

const transport = new StdioServerTransport();
await server.connect(transport);
```

此伺服器定義了一個名為 `fetch_posts` 的工具，用於從公開 API 擷取資料。

### `package.json` 與 `tsconfig.json`

這些是 TypeScript 專案的標準設定檔案。`package.json` 檔案定義了相依套件與 `build` 腳本（script），而 `tsconfig.json` 則用來設定 TypeScript 編譯器。

## 步驟 3：建置並連結你的擴充套件

在你能夠使用此擴充套件之前，需要先編譯 TypeScript 程式碼，並將擴充套件連結到你的 Gemini CLI 安裝環境，以便本地開發。

1.  **安裝相依套件：**

    ```bash
    cd my-first-extension
    npm install
    ```

2.  **建置伺服器：**

    ```bash
    npm run build
    ```

    這會將 `example.ts` 編譯成 `dist/example.js`，而這個檔案會在你的 `gemini-extension.json` 中被引用。

3.  **連結擴充套件：**

    `link` 指令會從 Gemini CLI 擴充套件目錄建立一個指向你的開發目錄的符號連結 (symlink)。這代表你所做的任何變更都會立即反映出來，無需重新安裝。

    ```bash
    gemini extensions link .
    ```

現在，請重新啟動你的 Gemini CLI 工作階段。新的 `fetch_posts` 工具將會可用。你可以透過詢問：「fetch posts」來測試它。

## 步驟 4：新增自訂指令

自訂指令（Custom commands）提供了一種方式，讓你可以為複雜的提示建立捷徑。我們來新增一個可以在你的程式碼中搜尋特定模式的指令。

1.  建立一個 `commands` 目錄，並為你的指令群組建立一個子目錄：

    ```bash
    mkdir -p commands/fs
    ```

2.  建立一個名為 `commands/fs/grep-code.toml` 的檔案：

    ```toml
    prompt = """
    Please summarize the findings for the pattern `{{args}}`.

    Search Results:
    !{grep -r {{args}} .}
    """
    ```

    這個指令 `/fs:grep-code` 會接收一個參數，使用該參數執行 `grep` shell 指令，並將結果導入提示中進行摘要。

儲存檔案後，請重新啟動 Gemini CLI。現在你可以執行 `/fs:grep-code "some pattern"` 來使用你新增的指令。

## 步驟 5：新增自訂 `GEMINI.md`

你可以透過在擴充套件中新增 `GEMINI.md` 檔案，為模型提供持久性的 context。這對於向模型提供行為指示或有關你擴充套件工具的資訊非常有用。請注意，如果你的擴充套件僅用於公開指令和提示，則不一定需要這個檔案。

1.  在你的擴充套件目錄根目錄下建立一個名為 `GEMINI.md` 的檔案：

    ```markdown
    # My First Extension Instructions

    You are an expert developer assistant. When the user asks you to fetch posts, use the `fetch_posts` tool. Be concise in your responses.
    ```

2.  更新你的 `gemini-extension.json`，讓命令列介面 (Command Line Interface, CLI) 載入這個檔案：

    ```json
    {
      "name": "my-first-extension",
      "version": "1.0.0",
      "contextFileName": "GEMINI.md",
      "mcpServers": {
        "nodeServer": {
          "command": "node",
          "args": ["${extensionPath}${/}dist${/}example.js"],
          "cwd": "${extensionPath}"
        }
      }
    }
    ```

請重新啟動 CLI。現在，每當此擴充套件啟用時，模型都會在每個 session 中擁有來自你的 `GEMINI.md` 檔案的 context。

## 步驟 6：釋出你的擴充套件

當你對自己的擴充套件感到滿意後，就可以與他人分享。釋出擴充套件的兩種主要方式分別是透過 Git 儲存庫 (Git repository) 或 GitHub Releases。使用公開的 Git 儲存庫是最簡單的方法。

關於這兩種方法的詳細說明，請參考 [Extension Releasing Guide](extension-releasing.md)。

## 結論

你已經成功建立了一個 Gemini CLI 擴充套件！你學會了如何：

- 透過樣板建立新的擴充套件。
- 使用 MCP 伺服器新增自訂工具。
- 建立方便的自訂指令。
- 為模型提供持久性的 context。
- 連結你的擴充套件以進行本地開發。

從這裡開始，你可以探索更多進階功能，並將強大且全新的能力加入 Gemini CLI。
