# CLI 指令

Gemini CLI 支援多種內建指令，協助你管理工作階段、自訂介面及控制其行為。這些指令會以斜線（`/`）、at 符號（`@`）或驚嘆號（`!`）作為前綴。

## 斜線指令（`/`）

斜線指令提供對 Gemini CLI 本身的元層級控制。

### 內建指令

- **`/bug`**
  - **說明：** 回報 Gemini CLI 的問題。預設情況下，問題會提交到 Gemini CLI 的 GitHub 儲存庫。你在 `/bug` 後輸入的字串，將成為回報錯誤的標題。預設的 `/bug` 行為可以透過你的 `.gemini/settings.json` 檔案中的 `advanced.bugCommand` 設定進行修改。

- **`/chat`**
  - **說明：** 儲存並恢復對話歷史，讓你能夠互動式地分支對話狀態，或從之後的工作階段恢復先前狀態。
  - **子指令：**
    - **`save`**
      - **說明：** 儲存目前的對話歷史。你必須加入 `<tag>` 來識別對話狀態。
      - **用法：** `/chat save <tag>`
      - **檢查點儲存位置說明：** 已儲存聊天檢查點的預設位置如下：
        - Linux/macOS：`~/.gemini/tmp/<project_hash>/`
        - Windows：`C:\Users\<YourUsername>\.gemini\tmp\<project_hash>\`
        - 當你執行 `/chat list` 時，CLI 只會掃描這些特定目錄以尋找可用的檢查點。
        - **注意：** 這些檢查點僅供手動儲存與恢復對話狀態之用。自動檢查點（例如在檔案修改前自動建立的）請參閱 [Checkpointing 文件](../checkpointing.md)。
    - **`resume`**
      - **說明：** 從先前儲存的狀態恢復對話。
      - **用法：** `/chat resume <tag>`
    - **`list`**
      - **說明：** 列出可用的標籤，供對話狀態恢復使用。
    - **`delete`**
      - **說明：** 刪除已儲存的對話檢查點。
      - **用法：** `/chat delete <tag>`
    - **`share`**
      - **說明**：將目前對話內容寫入指定的 Markdown 或 JSON 檔案。
      - **用法**：`/chat share file.md` 或 `/chat share file.json`。若未提供檔名，CLI 會自動產生一個。

- **`/clear`**
  - **說明：** 清除終端機畫面，包括 CLI 內可見的工作階段歷史與卷軸回溯。底層的工作階段資料（用於歷史回溯）可能會依實作而保留，但畫面顯示會被清空。
  - **鍵盤快捷鍵：** 隨時按下 **Ctrl+L** 可執行清除動作。

- **`/compress`**
  - **說明：** 以摘要取代整個聊天 context。這樣可節省未來任務所需的 token，同時保留高度摘要的歷程資訊。

- **`/copy`**
  - **說明：** 將 Gemini CLI 最後產生的輸出複製到剪貼簿，方便分享或重複使用。
  - **注意：** 此指令需要安裝平台專屬的剪貼簿工具。
    - 在 Linux 上，需安裝 `xclip` 或 `xsel`。通常可透過系統套件管理員安裝。
    - 在 macOS 上需 `pbcopy`，Windows 則需 `clip`。這些工具通常在各自系統中預先安裝。

- **`/directory`**（或 **`/dir`**）
  - **說明：** 管理 workspace 目錄，以支援多個目錄。
  - **子指令：**
    - **`add`**：
      - **說明：** 將目錄加入 workspace。路徑可為絕對路徑或相對於目前工作目錄的相對路徑，也支援從家目錄參照。
      - **用法：** `/directory add <path1>,<path2>`
      - **注意：** 在限制性沙箱機制（sandbox profiles）下會停用。若你使用該模式，請改用 `--include-directories` 於啟動工作階段時指定。
    - **`show`**：
      - **說明：** 顯示所有經由 `/directory add` 與 `--include-directories` 加入的目錄。
      - **用法：** `/directory show`

- **`/editor`**
  - **說明：** 開啟選擇支援編輯器的對話框。

- **`/extensions`**
  - **說明：** 列出目前 Gemini CLI 工作階段中所有啟用的擴充套件。請參閱 [Gemini CLI 擴充套件](../extension.md)。

- **`/help`**（或 **`/?`**）
  - **說明：** 顯示 Gemini CLI 的說明資訊，包括可用指令及其用法。

- **`/mcp`**
  - **說明：** 列出已設定的 Model Context Protocol (MCP) 伺服器、其連線狀態、伺服器詳細資訊及可用工具。
  - **子指令：**
    - **`desc`** 或 **`descriptions`**：
      - **說明：** 顯示 MCP 伺服器及工具的詳細說明。
    - **`nodesc`** 或 **`nodescriptions`**：
      - **說明：** 隱藏工具說明，只顯示工具名稱。
    - **`schema`**：
      - **說明：** 顯示工具已設定參數的完整 JSON schema。
  - **鍵盤快捷鍵：** 隨時按下 **Ctrl+T** 可切換顯示或隱藏工具說明。

- **`/memory`**
  - **說明：** 管理 AI 的指令 context（從 `GEMINI.md` 檔案載入的階層式記憶）。
  - **子指令：**
    - **`add`**：
      - **說明：** 將下方文字加入 AI 記憶。用法：`/memory add <text to remember>`
    - **`show`**：
      - **說明：** 顯示目前已從所有 `GEMINI.md` 檔案載入的完整階層式記憶內容。可用來檢查提供給 Gemini 模型的指令 context。
    - **`refresh`**：
      - **說明：** 重新從所有已設定位置（全域、專案/上層目錄及子目錄）找到的 `GEMINI.md` 檔案載入階層式指令記憶。此指令會以最新的 `GEMINI.md` 內容更新模型。
    - **注意：** 關於 `GEMINI.md` 檔案如何組成階層式記憶，請參閱 [CLI 設定文件](./configuration.md#4-geminimd-files-hierarchical-instructional-context)。

- **`/restore`**
  - **說明：** 將專案檔案還原至執行工具前的狀態。這對於還原工具所做的檔案編輯特別有用。若未指定工具呼叫 ID，則會列出可還原的檢查點。
  - **用法：** `/restore [tool_call_id]`
  - **注意：** 僅當以 `--checkpointing` 旗標啟動 CLI 或透過 [設定](./configuration.md) 設定時可用。詳情請參閱 [Checkpointing 文件](../checkpointing.md)。

- **`/settings`**
  - **說明：** 開啟設定編輯器以檢視與修改 Gemini CLI 設定。
  - **細節：** 此指令提供易用的介面來變更控制 Gemini CLI 行為與外觀的設定。其效果等同於手動編輯 `.gemini/settings.json` 檔案，但具備驗證與導引以避免錯誤。
  - **用法：** 直接執行 `/settings` 即可開啟編輯器。你可以瀏覽或搜尋特定設定、檢視其目前值並依需求修改。有些設定變更會立即生效，部分則需重新啟動。

- **`/stats`**
  - **說明：** 顯示目前 Gemini CLI 工作階段的詳細統計，包括 token 使用量、已快取 token 節省（如有）及工作階段持續時間。注意：僅在使用 API 金鑰驗證時才會顯示快取 token 資訊，目前 OAuth 驗證尚未支援。

- [**`/theme`**](./themes.md)
  - **說明：** 開啟對話框，讓你變更 Gemini CLI 的視覺佈景主題。

- **`/auth`**
  - **說明：** 開啟對話框，讓你變更驗證方式。

- **`/about`**
  - **說明：** 顯示版本資訊。回報問題時請一併提供此資訊。

- [**`/tools`**](../tools/index.md)
  - **說明：** 顯示目前 Gemini CLI 可用工具清單。
  - **用法：** `/tools [desc]`
  - **子指令：**
    - **`desc`** 或 **`descriptions`**：
      - **說明：** 顯示每個工具的詳細說明，包括工具名稱及提供給模型的完整描述。
    - **`nodesc`** 或 **`nodescriptions`**：
      - **說明：** 隱藏工具說明，只顯示工具名稱。

- **`/privacy`**
  - **說明：** 顯示隱私權聲明，並讓使用者選擇是否同意為服務改進目的收集其資料。

- **`/quit`**（或 **`/exit`**）
  - **說明：** 離開 Gemini CLI。

- **`/vim`**
  - **說明：** 切換 vim 模式開啟或關閉。啟用時，輸入區支援 vim 風格的導覽與編輯指令，包含 NORMAL 及 INSERT 模式。
  - **功能特色：**
    - **NORMAL 模式：** 以 `h`、`j`、`k`、`l` 導覽；以 `w`、`b`、`e` 跳字；以 `0`、`# CLI 指令

Gemini CLI 支援多種內建指令，協助你管理工作階段、自訂介面及控制其行為。這些指令會以斜線（`/`）、at 符號（`@`）或驚嘆號（`!`）作為前綴。

## 斜線指令（`/`）

斜線指令提供對 Gemini CLI 本身的元層級控制。

### 內建指令

- **`/bug`**
  - **說明：** 回報 Gemini CLI 的問題。預設情況下，問題會提交到 Gemini CLI 的 GitHub 儲存庫。你在 `/bug` 後輸入的字串，將成為回報錯誤的標題。預設的 `/bug` 行為可以透過你的 `.gemini/settings.json` 檔案中的 `advanced.bugCommand` 設定進行修改。

- **`/chat`**
  - **說明：** 儲存並恢復對話歷史，讓你能夠互動式地分支對話狀態，或從之後的工作階段恢復先前狀態。
  - **子指令：**
    - **`save`**
      - **說明：** 儲存目前的對話歷史。你必須加入 `<tag>` 來識別對話狀態。
      - **用法：** `/chat save <tag>`
      - **檢查點儲存位置說明：** 已儲存聊天檢查點的預設位置如下：
        - Linux/macOS：`~/.gemini/tmp/<project_hash>/`
        - Windows：`C:\Users\<YourUsername>\.gemini\tmp\<project_hash>\`
        - 當你執行 `/chat list` 時，CLI 只會掃描這些特定目錄以尋找可用的檢查點。
        - **注意：** 這些檢查點僅供手動儲存與恢復對話狀態之用。自動檢查點（例如在檔案修改前自動建立的）請參閱 [Checkpointing 文件](../checkpointing.md)。
    - **`resume`**
      - **說明：** 從先前儲存的狀態恢復對話。
      - **用法：** `/chat resume <tag>`
    - **`list`**
      - **說明：** 列出可用的標籤，供對話狀態恢復使用。
    - **`delete`**
      - **說明：** 刪除已儲存的對話檢查點。
      - **用法：** `/chat delete <tag>`
    - **`share`**
      - **說明**：將目前對話內容寫入指定的 Markdown 或 JSON 檔案。
      - **用法**：`/chat share file.md` 或 `/chat share file.json`。若未提供檔名，CLI 會自動產生一個。

- **`/clear`**
  - **說明：** 清除終端機畫面，包括 CLI 內可見的工作階段歷史與卷軸回溯。底層的工作階段資料（用於歷史回溯）可能會依實作而保留，但畫面顯示會被清空。
  - **鍵盤快捷鍵：** 隨時按下 **Ctrl+L** 可執行清除動作。

- **`/compress`**
  - **說明：** 以摘要取代整個聊天 context。這樣可節省未來任務所需的 token，同時保留高度摘要的歷程資訊。

- **`/copy`**
  - **說明：** 將 Gemini CLI 最後產生的輸出複製到剪貼簿，方便分享或重複使用。
  - **注意：** 此指令需要安裝平台專屬的剪貼簿工具。
    - 在 Linux 上，需安裝 `xclip` 或 `xsel`。通常可透過系統套件管理員安裝。
    - 在 macOS 上需 `pbcopy`，Windows 則需 `clip`。這些工具通常在各自系統中預先安裝。

- **`/directory`**（或 **`/dir`**）
  - **說明：** 管理 workspace 目錄，以支援多個目錄。
  - **子指令：**
    - **`add`**：
      - **說明：** 將目錄加入 workspace。路徑可為絕對路徑或相對於目前工作目錄的相對路徑，也支援從家目錄參照。
      - **用法：** `/directory add <path1>,<path2>`
      - **注意：** 在限制性沙箱機制（sandbox profiles）下會停用。若你使用該模式，請改用 `--include-directories` 於啟動工作階段時指定。
    - **`show`**：
      - **說明：** 顯示所有經由 `/directory add` 與 `--include-directories` 加入的目錄。
      - **用法：** `/directory show`

- **`/editor`**
  - **說明：** 開啟選擇支援編輯器的對話框。

- **`/extensions`**
  - **說明：** 列出目前 Gemini CLI 工作階段中所有啟用的擴充套件。請參閱 [Gemini CLI 擴充套件](../extension.md)。

- **`/help`**（或 **`/?`**）
  - **說明：** 顯示 Gemini CLI 的說明資訊，包括可用指令及其用法。

- **`/mcp`**
  - **說明：** 列出已設定的 Model Context Protocol (MCP) 伺服器、其連線狀態、伺服器詳細資訊及可用工具。
  - **子指令：**
    - **`desc`** 或 **`descriptions`**：
      - **說明：** 顯示 MCP 伺服器及工具的詳細說明。
    - **`nodesc`** 或 **`nodescriptions`**：
      - **說明：** 隱藏工具說明，只顯示工具名稱。
    - **`schema`**：
      - **說明：** 顯示工具已設定參數的完整 JSON schema。
  - **鍵盤快捷鍵：** 隨時按下 **Ctrl+T** 可切換顯示或隱藏工具說明。

- **`/memory`**
  - **說明：** 管理 AI 的指令 context（從 `GEMINI.md` 檔案載入的階層式記憶）。
  - **子指令：**
    - **`add`**：
      - **說明：** 將下方文字加入 AI 記憶。用法：`/memory add <text to remember>`
    - **`show`**：
      - **說明：** 顯示目前已從所有 `GEMINI.md` 檔案載入的完整階層式記憶內容。可用來檢查提供給 Gemini 模型的指令 context。
    - **`refresh`**：
      - **說明：** 重新從所有已設定位置（全域、專案/上層目錄及子目錄）找到的 `GEMINI.md` 檔案載入階層式指令記憶。此指令會以最新的 `GEMINI.md` 內容更新模型。
    - **注意：** 關於 `GEMINI.md` 檔案如何組成階層式記憶，請參閱 [CLI 設定文件](./configuration.md#4-geminimd-files-hierarchical-instructional-context)。

- **`/restore`**
  - **說明：** 將專案檔案還原至執行工具前的狀態。這對於還原工具所做的檔案編輯特別有用。若未指定工具呼叫 ID，則會列出可還原的檢查點。
  - **用法：** `/restore [tool_call_id]`
  - **注意：** 僅當以 `--checkpointing` 旗標啟動 CLI 或透過 [設定](./configuration.md) 設定時可用。詳情請參閱 [Checkpointing 文件](../checkpointing.md)。

- **`/settings`**
  - **說明：** 開啟設定編輯器以檢視與修改 Gemini CLI 設定。
  - **細節：** 此指令提供易用的介面來變更控制 Gemini CLI 行為與外觀的設定。其效果等同於手動編輯 `.gemini/settings.json` 檔案，但具備驗證與導引以避免錯誤。
  - **用法：** 直接執行 `/settings` 即可開啟編輯器。你可以瀏覽或搜尋特定設定、檢視其目前值並依需求修改。有些設定變更會立即生效，部分則需重新啟動。

- **`/stats`**
  - **說明：** 顯示目前 Gemini CLI 工作階段的詳細統計，包括 token 使用量、已快取 token 節省（如有）及工作階段持續時間。注意：僅在使用 API 金鑰驗證時才會顯示快取 token 資訊，目前 OAuth 驗證尚未支援。

- [**`/theme`**](./themes.md)
  - **說明：** 開啟對話框，讓你變更 Gemini CLI 的視覺佈景主題。

- **`/auth`**
  - **說明：** 開啟對話框，讓你變更驗證方式。

- **`/about`**
  - **說明：** 顯示版本資訊。回報問題時請一併提供此資訊。

- [**`/tools`**](../tools/index.md)
  - **說明：** 顯示目前 Gemini CLI 可用工具清單。
  - **用法：** `/tools [desc]`
  - **子指令：**
    - **`desc`** 或 **`descriptions`**：
      - **說明：** 顯示每個工具的詳細說明，包括工具名稱及提供給模型的完整描述。
    - **`nodesc`** 或 **`nodescriptions`**：
      - **說明：** 隱藏工具說明，只顯示工具名稱。

- **`/privacy`**
  - **說明：** 顯示隱私權聲明，並讓使用者選擇是否同意為服務改進目的收集其資料。

- **`/quit`**（或 **`/exit`**）
  - **說明：** 離開 Gemini CLI。

- **`/vim`**
  - **說明：** 切換 vim 模式開啟或關閉。啟用時，輸入區支援 vim 風格的導覽與編輯指令，包含 NORMAL 及 INSERT 模式。
  - **功能特色：**
    - **NORMAL 模式：** 以 `h`、`j`、`k`、`l` 導覽；以 `w`、`b`、`e` 跳字；以 `0`、、`^` 跳到行首/行尾；以 `G`（或 `gg` 跳到第一行）
    - **INSERT 模式：** 標準文字輸入，按 escape 返回 NORMAL 模式
    - **編輯指令：** 以 `x` 刪除、`c` 變更、`i`、`a`、`o`、`O` 插入；支援複雜操作如 `dd`、`cc`、`dw`、`cw`
    - **數字前綴支援：** 指令可加數字前綴（如 `3h`、`5w`、`10G`）
    - **重複上次指令：** 用 `.` 重複上次編輯操作
    - **持久化設定：** Vim 模式偏好會儲存於 `~/.gemini/settings.json`，並於各工作階段間自動還原
  - **狀態指示器：** 啟用時，頁腳會顯示 `[NORMAL]` 或 `[INSERT]`

- **`/init`**
  - **說明：** 為協助使用者快速建立 `GEMINI.md` 檔案，此指令會分析目前目錄並產生專屬的 context 檔案，讓使用者更容易為 Gemini agent 提供專案專屬的指令。

### 自訂指令

快速入門請參閱下方 [範例](#範例-純函式-重構指令)。

自訂指令讓你能將常用或最喜愛的提示（prompt）儲存為 Gemini CLI 內的個人捷徑。你可以建立僅限單一專案使用的指令，或是全域可用的指令，讓所有專案都能共用，進一步簡化工作流程並確保一致性。

#### 檔案位置與優先順序

Gemini CLI 會從兩個位置載入指令，並依特定順序載入：

1.  **使用者指令（全域）：** 位於 `~/.gemini/commands/`。這些指令在你操作的任何專案中都可用。
2.  **專案指令（區域）：** 位於 `<your-project-root>/.gemini/commands/`。這些指令僅適用於目前專案，且可納入版本控制與團隊共享。

若專案目錄中的指令名稱與使用者目錄中的相同，**將永遠以專案指令為主。** 這讓專案能以專屬版本覆蓋全域指令。

#### 命名與命名空間

指令名稱由其相對於 `commands` 目錄的檔案路徑決定。子目錄可用來建立命名空間指令，路徑分隔符（`/` 或 `\`）會轉換為冒號（`:`）。

- 位於 `~/.gemini/commands/test.toml` 的檔案會成為指令 `/test`。
- 位於 `<project>/.gemini/commands/git/commit.toml` 的檔案會成為命名空間指令 `/git:commit`。

#### TOML 檔案格式（v1）

你的指令定義檔必須採用 TOML 格式，副檔名為 `.toml`。

##### 必要欄位

- `prompt`（字串）：執行指令時會送給 Gemini 模型的提示（prompt）。可為單行或多行字串。

##### 選用欄位

- `description`（字串）：簡短的一行說明，描述此指令的功能。這段文字會顯示在 `/help` 選單中的你的指令旁。**若省略此欄位，系統會根據檔名自動產生通用說明。**

```toml
# Invoked via: /git:fix "Button is misaligned"

description = "Generates a fix for a given issue."
prompt = "Please provide a code fix for the issue described here: {{args}}."
```

模型接收：`Please provide a code fix for the issue described here: "Button is misaligned".`

**B. 在 Shell 指令中使用參數（於 `!{...}` 區塊內）**

當你在 shell 注入區塊（`!{...}`）中使用 `{{args}}` 時，這些參數會在替換前自動進行 **shell 跳脫（shell-escaped）**。這讓你能夠安全地將參數傳遞給 shell 指令，確保產生的指令在語法上正確且安全，同時防止指令注入（command injection）等安全漏洞。

**範例（`/grep-code.toml`）：**

```toml
prompt = """
Please summarize the findings for the pattern `{{args}}`.

Search Results:
!{grep -r {{args}} .}
"""
```

當你執行 `/grep-code It's complicated` 時：

1. 命令列介面 (Command Line Interface, CLI) 會偵測到 `{{args}}` 同時在 `!{...}` 之外與之內被使用。
2. 在外部：第一個 `{{args}}` 會直接以原始方式被 `It's complicated` 取代。
3. 在內部：第二個 `{{args}}` 則會被替換為跳脫後的版本（例如，在 Linux 上為 `"It's complicated"`）。
4. 實際執行的指令為 `grep -r "It's complicated" .`。
5. CLI 會在執行前提示你確認這個完全相同且安全的指令。
6. 最終提示會被送出。

##### 2. 預設參數處理

如果你的 `prompt` **沒有**包含特殊的佔位符 `{{args}}`，CLI 會使用預設行為來處理參數。

當你為指令提供參數（例如：`/mycommand arg1`）時，CLI 會將你輸入的完整指令附加在提示的結尾，並以兩個換行符號分隔。這樣模型就能同時看到原始指令說明以及你剛剛提供的具體參數。

如果你**沒有**提供任何參數（例如：`/mycommand`），則提示會原封不動地傳送給模型，不會有任何附加內容。

**範例（`changelog.toml`）：**

這個範例展示如何透過為模型定義角色、說明使用者輸入的位置，以及指定預期格式與行為，來建立一個健壯的指令。

```toml
# In: <project>/.gemini/commands/changelog.toml
# Invoked via: /changelog 1.2.0 added "Support for default argument parsing."

description = "Adds a new entry to the project's CHANGELOG.md file."
prompt = """
# Task: Update Changelog

You are an expert maintainer of this software project. A user has invoked a command to add a new entry to the changelog.

**The user's raw command is appended below your instructions.**

Your task is to parse the `<version>`, `<change_type>`, and `<message>` from their input and use the `write_file` tool to correctly update the `CHANGELOG.md` file.

## Expected Format
The command follows this format: `/changelog <version> <type> <message>`
- `<type>` must be one of: "added", "changed", "fixed", "removed".

## Behavior
1. Read the `CHANGELOG.md` file.
2. Find the section for the specified `<version>`.
3. Add the `<message>` under the correct `<type>` heading.
4. If the version or type section doesn't exist, create it.
5. Adhere strictly to the "Keep a Changelog" format.
"""
```

當你執行 `/changelog 1.2.0 added "New feature"` 時，最終傳送給模型的文字會是原始提示（prompt），後面接著兩個換行，以及你輸入的指令內容。

##### 3. 使用 `!{...}` 執行 Shell 指令

你可以直接在 `prompt` 中執行 shell 指令，並將其輸出動態注入到你的指令中。這非常適合從本地環境收集 context，例如讀取檔案內容或檢查 Git 狀態。

當自訂指令嘗試執行 shell 指令時，Gemini CLI 現在會在繼續執行前提示你確認。這是一項安全措施，確保只有你預期的指令會被執行。

**運作方式說明：**

1.  **注入指令：** 使用 `!{...}` 語法。
2.  **參數替換：** 如果區塊內有 `{{args}}`，會自動進行 shell escape（詳見上方的 [Context-Aware Injection](#選用欄位)）。
3.  **健壯的解析：** 解析器能正確處理包含巢狀大括號（如 JSON payloads）的複雜 shell 指令。**注意：** `!{...}` 內的內容必須有成對的大括號（`{` 和 `}`）。如果你需要執行包含不成對大括號的指令，建議將其包裝在外部腳本（script）檔案中，並於 `!{...}` 區塊內呼叫該腳本。
4.  **安全檢查與確認：** CLI 會對最終解析後的指令（參數已 escape 並替換後）進行安全檢查。畫面上會顯示即將執行的實際指令內容，請你確認。
5.  **執行與錯誤回報：** 指令執行後，若失敗，注入到 prompt 的輸出會包含錯誤訊息（stderr），並附上一行狀態說明，例如 `[Shell command exited with code 1]`。這有助於模型理解失敗的 context。

**範例（`git/commit.toml`）：**

此指令會取得已 staged 的 git diff，並利用其內容請模型撰寫 commit message。

````toml
# In: <project>/.gemini/commands/git/commit.toml
# Invoked via: /git:commit

description = "Generates a Git commit message based on staged changes."

# The prompt uses !{...} to execute the command and inject its output.
prompt = """
Please generate a Conventional Commit message based on the following git diff:

```diff
!{git diff --staged}
```

"""

````

當你執行`/git:commit`時，命令列介面 (Command Line Interface, CLI) 會先執行`git diff --staged`，然後將`!{git diff --staged}`替換為該指令的輸出，最後再將完整的提示送給模型。

##### 4. 使用`@{...}`注入檔案內容

你可以使用`@{...}`語法，將檔案內容或目錄清單直接嵌入到你的提示中。這對於建立針對特定檔案運作的指令非常有用。

**運作方式說明：**

- **檔案注入**：`@{path/to/file.txt}`會被`file.txt`的內容所取代。
- **多模態支援**：如果路徑指向支援的圖片（如 PNG、JPEG）、PDF、音訊或影片檔案，將會正確編碼並作為多模態輸入注入。其他二進位檔案則會被妥善處理並略過。
- **目錄清單**：`@{path/to/dir}`會被遞迴遍歷，該目錄及其所有子目錄中的每個檔案都會插入到提示中。如果啟用，這會遵循`.gitignore`和`.geminiignore`。
- **支援 workspace**：指令會在目前目錄及所有 workspace 目錄中搜尋該路徑。若為絕對路徑，則必須位於 workspace 內。
- **處理順序**：使用`@{...}`進行檔案內容注入會在 shell 指令（`!{...}`）與參數替換（`{{args}}`）之前處理。
- **解析**：解析器要求`@{...}`內（即路徑）的內容必須有平衡的大括號（`{`和`}`）。

**範例（`review.toml`）：**

此指令會注入一份_固定_最佳實踐檔案（`docs/best-practices.md`）的內容，並使用使用者的參數作為審查的 context。

```toml
# In: <project>/.gemini/commands/review.toml
# Invoked via: /review FileCommandLoader.ts

description = "Reviews the provided context using a best practice guide."
prompt = """
You are an expert code reviewer.

Your task is to review {{args}}.

Use the following best practices when providing your review:

@{docs/best-practices.md}
"""
```

當你執行 `/review FileCommandLoader.ts` 時，`@{docs/best-practices.md}` 這個占位符會被該檔案的內容取代，而`{{args}}` 則會被你所提供的文字取代，這些都會在最終提示送出給模型之前完成。

---

#### 範例：「純函式」重構指令

讓我們來建立一個全域指令，請求模型對一段程式碼進行重構。

**1. 建立檔案與目錄：**

首先，請確保使用者指令目錄已存在，接著為了方便管理，建立一個 `refactor` 子目錄，並建立最終的 TOML 檔案。

```bash
mkdir -p ~/.gemini/commands/refactor
touch ~/.gemini/commands/refactor/pure.toml
```

**2. 將內容加入檔案中：**

請在你的編輯器中開啟 `~/.gemini/commands/refactor/pure.toml`，並加入以下內容。我們同時包含了可選的 `description`，以符合最佳實踐。

```toml
# In: ~/.gemini/commands/refactor/pure.toml
# This command will be invoked via: /refactor:pure

description = "Asks the model to refactor the current context into a pure function."

prompt = """
Please analyze the code I've provided in the current context.
Refactor it into a pure function.

Your response should include:
1. The refactored, pure function code block.
2. A brief explanation of the key changes you made and why they contribute to purity.
"""
```

**3. 執行指令：**

就是這麼簡單！你現在可以在命令列介面 (Command Line Interface) 中執行你的指令了。你可以先將檔案加入 context，然後再呼叫你的指令：

```
> @my-messy-function.js
> /refactor:pure
```

Gemini CLI 會執行你在 TOML 檔案中定義的多行提示 (multi-line prompt)。

## 輸入提示快捷鍵

這些快捷鍵可直接應用於輸入提示，用於文字操作。

- **復原 (Undo)：**
  - **鍵盤快捷鍵：** 按下 **Ctrl+z** 以復原輸入提示中的上一個動作。

- **重做 (Redo)：**
  - **鍵盤快捷鍵：** 按下 **Ctrl+Shift+Z** 以重做在輸入提示中被復原的動作。

## At 指令（`@`）

At 指令用於將檔案或目錄的內容作為提示的一部分，傳送給 Gemini。這些指令支援 git-aware 過濾。

- **`@<path_to_file_or_directory>`**
  - **說明：** 將指定檔案或多個檔案的內容注入到你目前的提示中。這對於詢問特定程式碼、文字或檔案集合的問題非常有用。
  - **範例：**
    - `@path/to/your/file.txt Explain this text.`
    - `@src/my_project/ Summarize the code in this directory.`
    - `What is this file about? @README.md`
  - **詳細說明：**
    - 如果提供的是單一檔案的路徑，則會讀取該檔案內容。
    - 如果提供的是目錄的路徑，指令會嘗試讀取該目錄及其子目錄中的檔案內容。
    - 路徑中若有空格，需以反斜線進行跳脫（例如：`@My\ Documents/file.txt`）。
    - 此指令內部會使用 `read_many_files` 工具。內容會被擷取，並在送出給 Gemini 模型前插入到你的查詢中。
    - **git-aware 過濾：** 預設情況下，會排除 git 忽略的檔案（如 `node_modules/`、`dist/`、`.env`、`.git/`）。你可以透過 `context.fileFiltering` 設定來變更此行為。
    - **檔案類型：** 此指令主要設計用於純文字檔案。雖然它可能會嘗試讀取任何檔案，但二進位檔案或非常大的檔案可能會被底層的 `read_many_files` 工具略過或截斷，以確保效能與相關性。若有檔案被略過，工具會顯示相關提示。
  - **輸出：** CLI 會顯示工具呼叫訊息，說明已使用 `read_many_files`，並附上處理狀態及處理過的路徑。

- **`@`（單獨 at 符號）**
  - **說明：** 如果你僅輸入單一的 `@` 符號而未指定路徑，查詢會原樣傳送給 Gemini 模型。如果你在提示中專門討論 `@` 符號時，這會很有用。

### `@` 指令的錯誤處理

- 如果在 `@` 後指定的路徑不存在或無效，會顯示錯誤訊息，查詢可能不會送出給 Gemini 模型，或會在未包含檔案內容的情況下送出。
- 若 `read_many_files` 工具遇到錯誤（例如權限問題），也會顯示相關訊息。

## Shell 模式與 passthrough 指令（`!`）

`!` 前綴可讓你直接在 Gemini CLI 內與系統的 shell 互動。

- **`!<shell_command>`**
  - **說明：** 使用 `bash` 在 Linux/macOS 或 `cmd.exe` 在 Windows 上執行指定的 `<shell_command>`。任何來自該指令的輸出或錯誤都會顯示在終端機中。
  - **範例：**
    - `!ls -la`（執行 `ls -la` 並返回 Gemini CLI）
    - `!git status`（執行 `git status` 並返回 Gemini CLI）

- **`!`（切換 shell 模式）**
  - **說明：** 單獨輸入 `!` 可切換 shell 模式。
    - **進入 shell 模式：**
      - 啟用時，shell 模式會使用不同的顏色顯示，並有「Shell Mode Indicator」。
      - 在 shell 模式下，你輸入的文字會被直接視為 shell 指令執行。
    - **離開 shell 模式：**
      - 離開後，UI 會恢復為標準外觀，並回復 Gemini CLI 的正常行為。

- **所有 `!` 用法的注意事項：** 你在 shell 模式下執行的指令，其權限與影響等同於你直接在終端機執行時。

- **環境變數：** 當你透過 `!` 或在 shell 模式下執行指令時，`GEMINI_CLI=1` 環境變數會在子程序的環境中設置。這讓腳本或工具可以偵測它們是否在 Gemini CLI 內執行。
