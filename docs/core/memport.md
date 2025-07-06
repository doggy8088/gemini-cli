# 記憶匯入處理器

記憶匯入處理器是一項功能，可讓您使用 `@file.md` 語法從其他 Markdown 檔案匯入內容，將您的 GEMINI.md 檔案模組化。

## 總覽

此功能可讓您將大型 GEMINI.md 檔案分解為更小、更易於管理的可在不同情境中重複使用的元件。匯入處理器支援相對和絕對路徑，並內建安全功能以防止循環匯入並確保檔案存取安全。

## 重要限制

**此功能僅支援 `.md` (markdown) 檔案。** 嘗試匯入具有其他副檔名（如 `.txt`、`.json` 等）的檔案將導致警告且匯入將會失敗。

## 語法

使用 `@` 符號，後接您要匯入的 Markdown 檔案的路徑：

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

匯入的檔案本身可以包含匯入，從而建立巢狀結構：

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

@./file-a.md <!-- 這將被偵測到並被阻止 -->
```

### 檔案存取安全

`validateImportPath` 函式可確保僅允許從指定目錄進行匯入，從而防止存取允許範圍之外的敏感檔案。

### 最大匯入深度

為防止無限遞迴，有一個可設定的最大匯入深度（預設值：10 層）。

## 錯誤處理

### 非 MD 檔案嘗試

如果您嘗試匯入非 Markdown 檔案，您會看到一則警告：

```markdown
@./instructions.txt <!-- 這將顯示警告並失敗 -->
```

主控台輸出：

```
[WARN] [ImportProcessor] Import processor only supports .md files. Attempting to import non-md file: ./instructions.txt. This will fail.
```

### 遺失檔案

如果參照的檔案不存在，匯入將會正常失敗，並在輸出中顯示錯誤註解。

### 檔案存取錯誤

權限問題或其他檔案系統錯誤會以適當的錯誤訊息正常處理。

## API 參考

### `processImports(content, basePath, debugMode?, importState?)`

處理 GEMINI.md 內容中的匯入陳述式。

**參數**：

- `content` (string): 要處理匯入的內容
- `basePath` (string): 目前檔案所在的目錄路徑
- `debugMode` (boolean, optional): 是否啟用偵錯記錄（預設值：false）
- `importState` (ImportState, optional): 用於防止循環匯入的狀態追蹤

**傳回**： `Promise<string>` - 已解析匯入的已處理內容

### `validateImportPath(importPath, basePath, allowedDirectories)`

驗證匯入路徑以確保其安全且在允許的目錄內。

**參數**：

- `importPath` (string): 要驗證的匯入路徑
- `basePath` (string): 用於解析相對路徑的基礎目錄
- `allowedDirectories` (string[]): 允許的目錄路徑陣列

**傳回**： boolean - 匯入路徑是否有效

## 最佳實務

1. **為匯入的元件使用描述性檔案名稱**
2. **保持匯入的淺層性** - 避免深度巢狀的匯入鏈
3. **記錄您的結構** - 維護匯入檔案的清晰階層
4. **測試您的匯入** - 確保所有參照的檔案都存在且可存取
5. **盡可能使用相對路徑** 以獲得更好的可攜性

## 疑難排解

### 常見問題

1. **匯入無法運作**：檢查檔案是否存在且副檔名為 `.md`
2. **循環匯入警告**：檢查您的匯入結構是否有循環參照
3. **權限錯誤**：確保檔案可讀取且在允許的目錄內
4. **路徑解析問題**：如果相對路徑無法正確解析，請使用絕對路徑

### 偵錯模式

啟用偵錯模式以查看匯入程序的詳細記錄：

```typescript
const result = await processImports(content, basePath, true);
```