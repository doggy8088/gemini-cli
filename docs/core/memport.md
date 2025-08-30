# 記憶體匯入處理器

記憶體匯入處理器是一個功能，允許您使用 `@file.md` 語法從其他檔案匯入內容，將您的 GEMINI.md 檔案模組化。

## 總覽

此功能使您能夠將大型 GEMINI.md 檔案分解為更小、更易管理的元件，這些元件可以在不同內容中重複使用。匯入處理器支援相對和絕對路徑，並具有內建安全功能以防止循環匯入並確保檔案存取安全性。

## 語法

使用 `@` 符號後跟您要匯入的檔案路徑：

```markdown
# 主要 GEMINI.md 檔案

這是主要內容。

@./components/instructions.md

此處有更多內容。

@./shared/configuration.md
```

## 支援的路徑格式

### 相對路徑

- `@./file.md` - 從相同目錄匯入
- `@../file.md` - 從父目錄匯入
- `@./components/file.md` - 從子目錄匯入

### 絕對路徑

- `@/absolute/path/to/file.md` - 使用絕對路徑匯入

## 範例

### 基本匯入

```markdown
# 我的 GEMINI.md

歡迎來到我的專案！

@./getting-started.md

## 功能

@./features/overview.md
```

### 巢狀匯入

匯入的檔案本身可以包含匯入，建立巢狀結構：

```markdown
# main.md

@./header.md
@./content.md
@./footer.md
```

```markdown
# header.md

# 專案標頭

@./shared/title.md
```

## 安全功能

### 循環匯入偵測

處理器會自動偵測並防止循環匯入：

```markdown
# file-a.md

@./file-b.md

# file-b.md

@./file-a.md <!-- 這將被偵測並防止 -->
```

### 檔案存取安全性

`validateImportPath` 函式確保只允許從指定目錄進行匯入，防止存取允許範圍外的敏感檔案。

### 最大匯入深度

為防止無限遞迴，有一個可設定的最大匯入深度（預設：5 層）。

## 錯誤處理

### 遺失檔案

如果參考的檔案不存在，匯入將優雅地失敗，並在輸出中顯示錯誤註解。

### 檔案存取錯誤

權限問題或其他檔案系統錯誤會以適當的錯誤訊息優雅地處理。

## 程式碼區域偵測

匯入處理器使用 `marked` 函式庫來偵測程式碼區塊和內嵌程式碼片段，確保這些區域內的 `@` 匯入被適當地忽略。這提供了對巢狀程式碼區塊和複雜 Markdown 結構的強健處理。

## 匯入樹狀結構

處理器回傳一個匯入樹，顯示匯入檔案的階層，類似於 Claude 的 `/memory` 功能。這幫助使用者透過顯示讀取了哪些檔案及其匯入關係來除錯 GEMINI.md 檔案的問題。

範例樹狀結構：

```
記憶體檔案
 L 專案: GEMINI.md
            L a.md
              L b.md
                L c.md
              L d.md
                L e.md
                  L f.md
            L included.md
```

樹狀結構保留檔案匯入的順序，並顯示完整的匯入鏈以供除錯之用。

## 與 Claude Code 的 `/memory`（`claude.md`）方法比較

Claude Code 的 `/memory` 功能（如 `claude.md` 中所見）透過串聯所有包含的檔案來產生平坦的線性文件，始終以清楚的註解和路徑名稱標記檔案邊界。它不明確呈現匯入階層，但 LLM 接收所有檔案內容和路徑，這足以在需要時重建階層。

注意：匯入樹主要是為了開發期間的清晰度，對 LLM 消費的相關性有限。

## API 參考

### `processImports(content, basePath, debugMode?, importState?)`

處理 GEMINI.md 內容中的匯入陳述。

**參數：**

- `content`（字串）：要處理匯入的內容
- `basePath`（字串）：目前檔案所在的目錄路徑
- `debugMode`（布林值，可選）：是否啟用除錯記錄（預設：false）
- `importState`（ImportState，可選）：循環匯入防止的狀態追蹤

**回傳：** Promise&lt;ProcessImportsResult&gt; - 包含處理過的內容和匯入樹的物件

### `ProcessImportsResult`

```typescript
interface ProcessImportsResult {
  content: string; // 已解析匯入的處理內容
  importTree: MemoryFile; // 顯示匯入階層的樹狀結構
}
```

### `MemoryFile`

```typescript
interface MemoryFile {
  path: string; // 檔案路徑
  imports?: MemoryFile[]; // 直接匯入，按匯入順序
}
```

### `validateImportPath(importPath, basePath, allowedDirectories)`

驗證匯入路徑以確保它們是安全的且在允許的目錄內。

**參數：**

- `importPath`（字串）：要驗證的匯入路徑
- `basePath`（字串）：解析相對路徑的基礎目錄
- `allowedDirectories`（字串陣列）：允許的目錄路徑陣列

**回傳：** 布林值 - 匯入路徑是否有效

### `findProjectRoot(startDir)`

透過從給定的起始目錄向上搜尋 `.git` 目錄來尋找專案根目錄。實作為**非同步**函式，使用非阻塞檔案系統 API 以避免阻塞 Node.js 事件迴圈。

**參數：**

- `startDir`（字串）：開始搜尋的目錄

**回傳：** Promise&lt;string&gt; - 專案根目錄（如果找不到 `.git` 則為起始目錄）

## 最佳實務

1. **為匯入的元件使用描述性檔案名稱**
2. **保持匯入淺層** - 避免深度巢狀的匯入鏈
3. **記錄您的結構** - 維護清楚的匯入檔案階層
4. **測試您的匯入** - 確保所有參考的檔案存在且可存取
5. **盡可能使用相對路徑**以獲得更好的可攜性

## 疑難排解

### 常見問題

1. **匯入無法運作**：檢查檔案是否存在且路徑正確
2. **循環匯入警告**：檢查您的匯入結構是否有循環參考
3. **權限錯誤**：確保檔案可讀取且在允許的目錄內
4. **路徑解析問題**：如果相對路徑無法解析，請使用絕對路徑

### 除錯模式

啟用除錯模式以查看匯入流程的詳細記錄：

```typescript
const result = await processImports(content, basePath, true);
```
