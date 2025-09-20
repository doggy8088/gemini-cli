# 記憶匯入處理器（Memory Import Processor）

記憶匯入處理器（Memory Import Processor）是一項功能，可讓你透過`@file.md`語法，從其他檔案匯入內容，進而將你的 GEMINI.md 檔案模組化。

## 概述

這項功能讓你能將龐大的 GEMINI.md 檔案拆解成較小、較易管理的元件，並可在不同 context 中重複使用。匯入處理器（import processor）同時支援相對路徑（Relative Paths）與絕對路徑（Absolute Paths），並內建安全機制，以防止循環匯入（Circular Import Detection）並確保檔案存取安全。

## 語法

請使用`@`符號，後接你想要匯入的檔案路徑：

```markdown
# Main GEMINI.md file

This is the main content.

@./components/instructions.md

More content here.

@./shared/configuration.md
```

## 支援的路徑格式

### 相對路徑 (Relative Paths)

- `@./file.md` - 從相同目錄匯入
- `@../file.md` - 從父目錄匯入
- `@./components/file.md` - 從子目錄匯入

### 絕對路徑 (Absolute Paths)

- `@/absolute/path/to/file.md` - 使用絕對路徑匯入

## 範例

### 基本匯入

```markdown
# My GEMINI.md

Welcome to my project!

@./getting-started.md

## Features

@./features/overview.md
```

### 巢狀匯入 (Nested Imports)

被匯入的檔案本身也可以包含匯入，從而建立巢狀結構：

```markdown
# main.md

@./header.md
@./content.md
@./footer.md
```

```markdown
# header.md

# Project Header

@./shared/title.md
```

## 安全性功能

### 循環匯入偵測（Circular Import Detection）

處理器會自動偵測並防止循環匯入：

```markdown
# file-a.md

@./file-b.md

# file-b.md

@./file-a.md <!-- This will be detected and prevented -->
```

### 檔案存取安全性

`validateImportPath` 函式可確保僅允許從指定目錄 (directory) 進行匯入，防止存取超出允許範圍的敏感檔案。

### 最大匯入深度

為防止無限遞迴，最大匯入深度可設定（預設為 5 層）。

## 錯誤處理

### 檔案遺失

若參考的檔案不存在，匯入時會優雅地失敗，並在輸出中顯示錯誤註解。

### 檔案存取錯誤

權限問題或其他檔案系統錯誤，皆會以適當的錯誤訊息優雅處理。

## 程式碼區塊偵測

匯入處理器 (processor) 使用 `marked` 函式庫來偵測程式碼區塊與行內程式碼區段，確保這些區域中的 `@` 匯入會被正確忽略。這可強化對巢狀程式碼區塊與複雜 Markdown 結構的處理。

## 匯入樹狀結構

處理器會回傳一個匯入樹，顯示被匯入檔案的階層結構，類似 Claude 的 `/memory` 功能。這有助於使用者除錯 GEMINI.md 檔案問題，清楚呈現哪些檔案被讀取，以及它們之間的匯入關係。

範例樹狀結構：

```
Memory Files
 L project: GEMINI.md
            L a.md
              L b.md
                L c.md
              L d.md
                L e.md
                  L f.md
            L included.md
```

此樹狀結構會保留檔案被匯入的順序，並顯示完整的匯入鏈，以便於除錯時使用。

## 與 Claude Code 的 `/memory`（`claude.md`）方法比較

Claude Code 的 `/memory` 功能（如 `claude.md` 所示）會將所有被包含的檔案串接成一個扁平、線性的文件，並始終以明確的註解與路徑名稱標示檔案邊界。它不會明確呈現匯入階層結構，但大型語言模型 (LLM) 會取得所有檔案內容與路徑，這對於需要時重建階層結構已經足夠。

注意：匯入樹主要用於開發過程中的清晰度，對於大型語言模型 (LLM) 的處理來說，相關性有限。

## API 參考

### `processImports(content, basePath, debugMode?, importState?)`

處理 GEMINI.md 內容中的匯入語句。

**參數：**

- `content`（string）：要處理匯入的內容
- `basePath`（string）：目前檔案所在的目錄路徑
- `debugMode`（boolean，選填）：是否啟用除錯日誌（預設值：false）
- `importState`（ImportState，選填）：用於追蹤循環匯入的狀態

**回傳值：** Promise&lt;ProcessImportsResult&gt; - 物件，包含處理後的內容與匯入樹

### `ProcessImportsResult`

```typescript
interface ProcessImportsResult {
  content: string; // The processed content with imports resolved
  importTree: MemoryFile; // Tree structure showing the import hierarchy
}
```

### `MemoryFile`

```typescript
interface MemoryFile {
  path: string; // The file path
  imports?: MemoryFile[]; // Direct imports, in the order they were imported
}
```

### `validateImportPath(importPath, basePath, allowedDirectories)`

驗證匯入路徑，確保其安全且位於允許的目錄內。

**參數:**

- `importPath` (string)：要驗證的匯入路徑
- `basePath` (string)：用於解析相對路徑的基礎目錄
- `allowedDirectories` (string[])：允許的目錄路徑陣列

**回傳值：** boolean - 匯入路徑是否有效

### `findProjectRoot(startDir)`

透過自指定起始目錄向上搜尋 `.git` 目錄，以尋找專案根目錄。此功能以 **async** 非同步函式實作，使用非阻塞的檔案系統 API，以避免阻塞 Node.js 事件迴圈。

**參數:**

- `startDir` (string)：開始搜尋的目錄

**回傳值：** Promise&lt;string&gt; - 專案根目錄（若未找到 `.git`，則回傳起始目錄）

## 最佳實踐

1. **使用具描述性的檔案名稱** 來匯入元件
2. **保持匯入層級淺顯** - 避免過度巢狀的匯入鏈
3. **記錄你的結構** - 維護清晰的匯入檔案階層
4. **測試你的匯入** - 確保所有參考的檔案都存在且可存取
5. **盡可能使用相對路徑**，以提升可攜性

## 疑難排解

### 常見問題

1. **匯入無法運作**：請檢查檔案是否存在，以及路徑是否正確
2. **循環匯入警告**：檢查你的匯入結構是否有循環參考
3. **權限錯誤**：確保檔案可讀取且位於允許的目錄內
4. **路徑解析問題**：若相對路徑無法正確解析，請改用絕對路徑

### 除錯模式

啟用除錯模式以查看匯入過程的詳細日誌：

```typescript
const result = await processImports(content, basePath, true);
```
