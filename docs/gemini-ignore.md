# 忽略檔案

本文件提供 Gemini CLI 的 Gemini 忽略（`.geminiignore`）功能總覽。

Gemini CLI 包含自動忽略檔案的能力，類似於 `.gitignore`（Git 使用）和 `.aiexclude`（Gemini Code Assist 使用）。將路徑新增到您的 `.geminiignore` 檔案會將它們從支援此功能的工具中排除，儘管它們對其他服務（如 Git）仍然可見。

## 運作方式

當您將路徑新增到 `.geminiignore` 檔案時，遵守此檔案的工具會從其操作中排除匹配的檔案和目錄。例如，當您使用 [`read_many_files`](./tools/multi-file.md) 指令時，`.geminiignore` 檔案中的任何路徑都會自動被排除。

大多數情況下，`.geminiignore` 遵循 `.gitignore` 檔案的慣例：

- 空白行和以 `#` 開始的行會被忽略。
- 支援標準 glob 模式（如 `*`、`?` 和 `[]`）。
- 在結尾放置 `/` 只會匹配目錄。
- 在開頭放置 `/` 會將路徑錨定到相對於 `.geminiignore` 檔案。
- `!` 會否定模式。

您可以隨時更新 `.geminiignore` 檔案。要套用變更，您必須重新啟動 Gemini CLI 工作階段。

## 如何使用 `.geminiignore`

啟用 `.geminiignore`：

1. 在專案目錄的根目錄中建立名為 `.geminiignore` 的檔案。

將檔案或目錄新增到 `.geminiignore`：

1. 開啟您的 `.geminiignore` 檔案。
2. 新增您要忽略的路徑或檔案，例如：`/archive/` 或 `apikeys.txt`。

### `.geminiignore` 範例

您可以使用 `.geminiignore` 來忽略目錄和檔案：

```
# 排除您的 /packages/ 目錄和所有子目錄
/packages/

# 排除您的 apikeys.txt 檔案
apikeys.txt
```

您可以在 `.geminiignore` 檔案中使用 `*` 萬用字元：

```
# 排除所有 .md 檔案
*.md
```

最後，您可以使用 `!` 將檔案和目錄從排除中排除：

```
# 排除所有 .md 檔案，除了 README.md
*.md
!README.md
```

要從 `.geminiignore` 檔案中移除路徑，請刪除相關行。
