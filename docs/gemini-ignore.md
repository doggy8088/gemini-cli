# 忽略檔案

本文件說明 Gemini CLI 的 Gemini Ignore（`.geminiignore`）功能。

Gemini CLI 提供自動忽略檔案的能力，類似於 `.gitignore`（由 Git 使用）以及 `.aiexclude`（由 Gemini Code Assist 使用）。將路徑加入你的 `.geminiignore` 檔案後，支援此功能的工具將會排除這些路徑，但其他服務（如 Git）仍可見這些檔案。

## 運作方式

當你將路徑加入 `.geminiignore` 檔案時，會遵循此檔案的工具將在其操作中排除符合的檔案和目錄。例如，當你使用 [`read_many_files`](./tools/multi-file.md) 指令時，`.geminiignore` 檔案中列出的任何路徑都會自動被排除。

大致上，`.geminiignore` 遵循 `.gitignore` 檔案的慣例：

- 空白行以及以 `#` 開頭的行會被忽略。
- 支援標準的萬用字元（wildcards）模式（例如 `*`、`?` 和 `[]`）。
- 在結尾加上 `/` 僅會匹配目錄。
- 在開頭加上 `/` 會將路徑以 `.geminiignore` 檔案為相對基準。
- `!` 用來否定某個模式。

你可以隨時更新你的 `.geminiignore` 檔案。要使變更生效，必須重新啟動 Gemini CLI 工作階段。

## 如何使用 `.geminiignore`

啟用 `.geminiignore` 的步驟：

1. 在你的專案（project）目錄根目錄下建立一個名為 `.geminiignore` 的檔案。

將檔案或目錄加入 `.geminiignore` 的步驟：

1. 開啟你的 `.geminiignore` 檔案。
2. 新增你想忽略的路徑或檔案，例如：`/archive/` 或 `apikeys.txt`。

### `.geminiignore` 範例

你可以使用 `.geminiignore` 來忽略目錄和檔案：

```
# Exclude your /packages/ directory and all subdirectories
/packages/

# Exclude your apikeys.txt file
apikeys.txt
```

你可以在`.geminiignore`檔案中使用`*`的萬用字元（wildcards）：

```
# Exclude all .md files
*.md
```

最後，你可以使用 `!` 來從排除中排除特定的檔案和目錄（files and directories）：

```
# Exclude all .md files except README.md
*.md
!README.md
```

若要從你的 `.geminiignore` 檔案中移除路徑，請刪除相關的行。
