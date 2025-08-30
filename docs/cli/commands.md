# CLI 指令

Gemini CLI 支援多個內建指令來幫助您管理工作階段、自訂介面和控制其行為。這些指令以正斜線 (`/`)、at 符號 (`@`) 或驚嘆號 (`!`) 為前置詞。

## 斜線指令 (`/`)

斜線指令提供對 CLI 本身的元層級控制。

### 內建指令

- **`/bug`**
  - **描述**：回報關於 Gemini CLI 的問題。預設情況下，問題會在 Gemini CLI 的 GitHub 儲存庫中回報。您在 `/bug` 後輸入的字串將成為所回報錯誤的標題。可以使用 `.gemini/settings.json` 檔案中的 `advanced.bugCommand` 設定修改預設 `/bug` 行為。

- **`/chat`**
  - **描述**：儲存和恢復對話歷史記錄，以互動方式分支對話狀態，或從後續工作階段恢復先前狀態。
  - **子指令**：
    - **`save`**
      - **描述**：儲存目前的對話歷史記錄。您必須新增用於識別對話狀態的 `<tag>`。
      - **使用方式**：`/chat save <tag>`
      - **檢查點位置詳細資訊**：儲存的聊天檢查點的預設位置為：
        - Linux/macOS：`~/.gemini/tmp/<project_hash>/`
        - Windows：`C:\Users\<YourUsername>\.gemini\tmp\<project_hash>\`
        - 當您執行 `/chat list` 時，CLI 只會掃描這些特定目錄以尋找可用的檢查點。
        - **注意**：這些檢查點用於手動儲存和恢復對話狀態。對於在檔案修改前建立的自動檢查點，請參閱[檢查點說明文件](../checkpointing.md)。
    - **`resume`**
      - **描述**：從先前的儲存恢復對話。
      - **使用方式**：`/chat resume <tag>`
    - **`list`**
      - **描述**：列出可用於聊天狀態恢復的標籤。
    - **`delete`**
      - **Description:** Deletes a saved conversation checkpoint.
      - **Usage:** `/chat delete <tag>`

- **`/clear`**
  - **Description:** Clear the terminal screen, including the visible session history and scrollback within the CLI. The underlying session data (for history recall) might be preserved depending on the exact implementation, but the visual display is cleared.
  - **Keyboard shortcut:** Press **Ctrl+L** at any time to perform a clear action.

- **`/compress`**
  - **Description:** Replace the entire chat context with a summary. This saves on tokens used for future tasks while retaining a high level summary of what has happened.

- **`/copy`**
  - **Description:** Copies the last output produced by Gemini CLI to your clipboard, for easy sharing or reuse.
  - **Note:** This command requires platform-specific clipboard tools to be installed.
    - On Linux, it requires `xclip` or `xsel`. You can typically install them using your system's package manager.
    - On macOS, it requires `pbcopy`, and on Windows, it requires `clip`. These tools are typically pre-installed on their respective systems.

- **`/directory`** (or **`/dir`**)
  - **Description:** Manage workspace directories for multi-directory support.
  - **Sub-commands:**
    - **`add`**:
      - **Description:** Add a directory to the workspace. The path can be absolute or relative to the current working directory. Moreover, the reference from home directory is supported as well.
      - **Usage:** `/directory add <path1>,<path2>`
      - **Note:** Disabled in restrictive sandbox profiles. If you're using that, use `--include-directories` when starting the session instead.
    - **`show`**:
      - **Description:** Display all directories added by `/directory add` and `--include-directories`.
      - **Usage:** `/directory show`

- **`/editor`**
  - **Description:** Open a dialog for selecting supported editors.

- **`/extensions`**
  - **Description:** Lists all active extensions in the current Gemini CLI session. See [Gemini CLI Extensions](../extension.md).

- **`/help`** (or **`/?`**)
  - **Description:** Display help information about Gemini CLI, including available commands and their usage.

- **`/mcp`**
  - **Description:** List configured Model Context Protocol (MCP) servers, their connection status, server details, and available tools.
  - **Sub-commands:**
    - **`desc`** or **`descriptions`**:
      - **Description:** Show detailed descriptions for MCP servers and tools.
    - **`nodesc`** or **`nodescriptions`**:
      - **Description:** Hide tool descriptions, showing only the tool names.
    - **`schema`**:
      - **Description:** Show the full JSON schema for the tool's configured parameters.
  - **Keyboard Shortcut:** Press **Ctrl+T** at any time to toggle between showing and hiding tool descriptions.

- **`/memory`**
  - **Description:** Manage the AI's instructional context (hierarchical memory loaded from `GEMINI.md` files).
  - **Sub-commands:**
    - **`add`**:
      - **Description:** Adds the following text to the AI's memory. Usage: `/memory add <text to remember>`
    - **`show`**:
      - **Description:** Display the full, concatenated content of the current hierarchical memory that has been loaded from all `GEMINI.md` files. This lets you inspect the instructional context being provided to the Gemini model.
    - **`refresh`**:
      - **Description:** Reload the hierarchical instructional memory from all `GEMINI.md` files found in the configured locations (global, project/ancestors, and sub-directories). This command updates the model with the latest `GEMINI.md` content.
    - **Note:** For more details on how `GEMINI.md` files contribute to hierarchical memory, see the [CLI Configuration documentation](./configuration.md#4-geminimd-files-hierarchical-instructional-context).

- **`/restore`**
  - **Description:** Restores the project files to the state they were in just before a tool was executed. This is particularly useful for undoing file edits made by a tool. If run without a tool call ID, it will list available checkpoints to restore from.
  - **Usage:** `/restore [tool_call_id]`
  - **Note:** Only available if the CLI is invoked with the `--checkpointing` option or configured via [settings](./configuration.md). See [Checkpointing documentation](../checkpointing.md) for more details.

- **`/settings`**
  - **Description:** Open the settings editor to view and modify Gemini CLI settings.
  - **Details:** This command provides a user-friendly interface for changing settings that control the behavior and appearance of Gemini CLI. It is equivalent to manually editing the `.gemini/settings.json` file, but with validation and guidance to prevent errors.
  - **Usage:** Simply run `/settings` and the editor will open. You can then browse or search for specific settings, view their current values, and modify them as desired. Changes to some settings are applied immediately, while others require a restart.

- **`/stats`**
  - **Description:** Display detailed statistics for the current Gemini CLI session, including token usage, cached token savings (when available), and session duration. Note: Cached token information is only displayed when cached tokens are being used, which occurs with API key authentication but not with OAuth authentication at this time.

- [**`/theme`**](./themes.md)
  - **Description:** Open a dialog that lets you change the visual theme of Gemini CLI.

- **`/auth`**
  - **Description:** Open a dialog that lets you change the authentication method.

- **`/about`**
  - **Description:** Show version info. Please share this information when filing issues.

- [**`/tools`**](../tools/index.md)
  - **Description:** Display a list of tools that are currently available within Gemini CLI.
  - **Usage:** `/tools [desc]`
  - **Sub-commands:**
    - **`desc`** or **`descriptions`**:
      - **Description:** Show detailed descriptions of each tool, including each tool's name with its full description as provided to the model.
    - **`nodesc`** or **`nodescriptions`**:
      - **Description:** Hide tool descriptions, showing only the tool names.

- **`/privacy`**
  - **Description:** Display the Privacy Notice and allow users to select whether they consent to the collection of their data for service improvement purposes.

- **`/quit`** (or **`/exit`**)
  - **Description:** Exit Gemini CLI.

- **`/vim`**
  - **Description:** Toggle vim mode on or off. When vim mode is enabled, the input area supports vim-style navigation and editing commands in both NORMAL and INSERT modes.
  - **Features:**
    - **NORMAL mode:** Navigate with `h`, `j`, `k`, `l`; jump by words with `w`, `b`, `e`; go to line start/end with `0`, `$`, `^`; go to specific lines with `G` (or `gg` for first line)
    - **INSERT mode:** Standard text input with escape to return to NORMAL mode
    - **Editing commands:** Delete with `x`, change with `c`, insert with `i`, `a`, `o`, `O`; complex operations like `dd`, `cc`, `dw`, `cw`
    - **Count support:** Prefix commands with numbers (e.g., `3h`, `5w`, `10G`)
    - **Repeat last command:** Use `.` to repeat the last editing operation
    - **Persistent setting:** Vim mode preference is saved to `~/.gemini/settings.json` and restored between sessions
  - **Status indicator:** When enabled, shows `[NORMAL]` or `[INSERT]` in the footer

- **`/init`**
  - **Description:** To help users easily create a `GEMINI.md` file, this command analyzes the current directory and generates a tailored context file, making it simpler for them to provide project-specific instructions to the Gemini agent.

### 自訂指令

如需快速開始，請參閱下方的[範例](#example-a-pure-function-refactoring-command)。

自訂指令允許您將最愛或最常使用的提示儲存並重複使用，作為 Gemini CLI 中的個人快速鍵。您可以建立特定於單一專案的指令，或在所有專案中全域可用的指令，簡化您的工作流程並確保一致性。

#### 檔案位置與優先順序

Gemini CLI 從兩個位置探索指令，以特定順序載入：

1.  **使用者指令（全域）：** 位於 `~/.gemini/commands/`。這些指令在您進行的任何專案中都可用。
2.  **專案指令（本機）：** 位於 `<your-project-root>/.gemini/commands/`。這些指令專用於目前專案，可以檢入版本控制以與您的團隊共用。

如果專案目錄中的指令與使用者目錄中的指令同名，**專案指令將永遠被使用。** 這允許專案覆蓋全域指令為專案特定版本。

#### 命名與命名空間

指令的名稱由其相對於 `commands` 目錄的檔案路徑決定。子目錄用於建立命名空間指令，路徑分隔符號（`/` 或 `\`）會轉換為冒號（`:`）。

- 位於 `~/.gemini/commands/test.toml` 的檔案會成為指令 `/test`。
- 位於 `<project>/.gemini/commands/git/commit.toml` 的檔案會成為命名空間指令 `/git:commit`。

#### TOML 檔案格式（v1）

您的指令定義檔案必須以 TOML 格式撰寫並使用 `.toml` 副檔名。

##### 必要欄位

- `prompt`（字串）：當指令執行時將傳送給 Gemini 模型的提示。這可以是單行或多行字串。

##### 選用欄位

- `description`（字串）：指令功能的簡要單行描述。此文字將在 `/help` 選單中顯示在您的指令旁。**如果您省略此欄位，將從檔案名稱產生通用描述。**

#### 處理引數

自訂指令支援兩種強大的引數處理方法。CLI 會根據您指令 `prompt` 的內容自動選擇正確的方法。

##### 1. 使用 `{{args}}` 的內容感知注入

如果您的 `prompt` 包含特殊占位符 `{{args}}`，CLI 會將該占位符替換為使用者在指令名稱後輸入的文字。

此注入的行為取決於使用位置：

**A. 原始注入（Shell 指令外）**

當在提示的主體中使用時，引數會完全按照使用者輸入的方式注入。

**範例（`git/fix.toml`）：**

```toml
# 透過：/git:fix "Button is misaligned" 呼叫

description = "為給定問題產生修正。"
prompt = "請為此處描述的問題提供程式碼修正：{{args}}。"
```

模型收到：`請為此處描述的問題提供程式碼修正："Button is misaligned"。`

**B. 在 Shell 指令中使用引數（在 `!{...}` 區塊內）**

當您在 shell 注入區塊（`!{...}`）內使用 `{{args}}` 時，引數會在替換前自動**Shell 跳脫**。這允許您安全地將引數傳遞給 shell 指令，確保產生的指令在語法上正確且安全，同時防止指令注入漏洞。

**範例（`/grep-code.toml`）：**

```toml
prompt = """
請摘要模式 `{{args}}` 的發現。

搜尋結果：
!{grep -r {{args}} .}
"""
```

當您執行 `/grep-code It's complicated` 時：

1. CLI 看到 `{{args}}` 同時在 `!{...}` 外部和內部使用。
2. 外部：第一個 `{{args}}` 被原始替換為 `It's complicated`。
3. 內部：第二個 `{{args}}` 被替換為跳脫版本（例如，在 Linux 上：`"It's complicated"`）。
4. 執行的指令是 `grep -r "It's complicated" .`。
5. CLI 會提示您在執行前確認這個確切、安全的指令。
6. 最終提示被傳送。

##### 2. 預設引數處理

如果您的 `prompt` **不**包含特殊占位符 `{{args}}`，CLI 會使用預設行為來處理引數。

如果您為指令提供引數（例如，`/mycommand arg1`），CLI 會將您輸入的完整指令附加到提示的末尾，以兩個換行符號分隔。這允許模型同時看到原始指示和您剛提供的特定引數。

如果您**不**提供任何引數（例如，`/mycommand`），提示會完全按原樣傳送給模型，不附加任何內容。

**範例（`changelog.toml`）：**

此範例展示如何透過為模型定義角色、說明在哪裡找到使用者的輸入，並指定預期的格式和行為來建立強健的指令。

```toml
# 位於：<project>/.gemini/commands/changelog.toml
# 透過：/changelog 1.2.0 added "Support for default argument parsing." 呼叫

description = "在專案的 CHANGELOG.md 檔案中新增新項目。"
prompt = """
# 任務：更新變更日誌

您是此軟體專案的專家維護者。使用者已呼叫指令以在變更日誌中新增新項目。

**使用者的原始指令會附加在您的指示下方。**

您的任務是從他們的輸入中解析 `<version>`、`<change_type>` 和 `<message>`，並使用 `write_file` 工具正確更新 `CHANGELOG.md` 檔案。

## 預期格式
指令遵循此格式：`/changelog <version> <type> <message>`
- `<type>` 必須是以下之一："added"、"changed"、"fixed"、"removed"。

## 行為
1. 讀取 `CHANGELOG.md` 檔案。
2. 找到指定 `<version>` 的區段。
3. 在正確的 `<type>` 標題下新增 `<message>`。
4. 如果版本或類型區段不存在，則建立它。
5. 嚴格遵循「Keep a Changelog」格式。
"""
```

當您執行 `/changelog 1.2.0 added "New feature"` 時，傳送給模型的最終文字將是原始提示，後跟兩個換行符號和您輸入的指令。

##### 3. 使用 `!{...}` 執行 Shell 指令

您可以透過直接在 `prompt` 中執行 shell 指令並注入其輸出，讓您的指令變得動態。這非常適合從本機環境收集內容，例如讀取檔案內容或檢查 Git 狀態。

當自訂指令嘗試執行 shell 指令時，Gemini CLI 現在會在繼續之前提示您確認。這是一項安全措施，確保只有預期的指令才能執行。

**運作方式：**

1.  **注入指令：** 使用 `!{...}` 語法。
2.  **引數替換：** 如果 `{{args}}` 存在於區塊內，它會自動進行 shell 跳脫（請參閱上方的[內容感知注入](#1-使用-args-的內容感知注入)）。
3.  **強健解析：** 解析器正確處理包含巢狀大括號的複雜 shell 指令，例如 JSON 承載。**注意：** `!{...}` 內的內容必須有平衡的大括號（`{` 和 `}`）。如果您需要執行包含不平衡大括號的指令，請考慮將其包裝在外部腳本檔案中，並在 `!{...}` 區塊內呼叫該腳本。
4.  **安全檢查與確認：** CLI 對最終解析的指令（在引數跳脫和替換後）執行安全檢查。將出現對話方塊，顯示要執行的確切指令。
5.  **執行與錯誤回報：** 指令被執行。如果指令失敗，注入提示的輸出將包含錯誤訊息（stderr），後跟狀態行，例如 `[Shell command exited with code 1]`。這有助於模型理解失敗的內容。

**範例（`git/commit.toml`）：**

此指令取得暫存的 git diff 並使用它請求模型撰寫提交訊息。

````toml
# 位於：<project>/.gemini/commands/git/commit.toml
# 透過：/git:commit 呼叫

description = "根據暫存變更產生 Git 提交訊息。"

# 提示使用 !{...} 執行指令並注入其輸出。
prompt = """
請根據以下 git diff 產生 Conventional Commit 訊息：

```diff
!{git diff --staged}
```

"""

````

當您執行 `/git:commit` 時，CLI 首先執行 `git diff --staged`，然後在將最終完整提示傳送給模型之前，將 `!{git diff --staged}` 替換為該指令的輸出。

##### 4. 使用 `@{...}` 注入檔案內容

您可以使用 `@{...}` 語法直接將檔案內容或目錄清單嵌入您的提示中。這對於建立操作特定檔案的指令很有用。

**運作方式：**

- **檔案注入**：`@{path/to/file.txt}` 會被 `file.txt` 的內容替換。
- **多模態支援**：如果路徑指向支援的影像（例如 PNG、JPEG）、PDF、音訊或視訊檔案，它將被正確編碼並作為多模態輸入注入。其他二進位檔案會優雅處理並跳過。
- **目錄清單**：`@{path/to/dir}` 會被遍歷，目錄和所有子目錄中存在的每個檔案都會插入提示中。如果啟用，這會尊重 `.gitignore` 和 `.geminiignore`。
- **工作區感知**：指令在目前目錄和任何其他工作區目錄中搜尋路徑。如果絕對路徑在工作區內，則允許使用。
- **處理順序**：使用 `@{...}` 的檔案內容注入會在 shell 指令（`!{...}`）和引數替換（`{{args}}`）_之前_處理。
- **解析**：解析器要求 `@{...}` 內的內容（路徑）有平衡的大括號（`{` 和 `}`）。

**範例（`review.toml`）：**

此指令注入_固定_最佳實務檔案（`docs/best-practices.md`）的內容，並使用使用者的引數為審查提供內容。

```toml
# 位於：<project>/.gemini/commands/review.toml
# 透過：/review FileCommandLoader.ts 呼叫

description = "使用最佳實務指南審查提供的內容。"
prompt = """
您是專家程式碼審查員。

您的任務是審查 {{args}}。

在提供審查時請使用以下最佳實務：

@{docs/best-practices.md}
"""
```

當您執行 `/review FileCommandLoader.ts` 時，`@{docs/best-practices.md}` 占位符會被該檔案的內容替換，而 `{{args}}` 會被您提供的文字替換，然後將最終提示傳送給模型。

---

#### 範例：「純函式」重構指令

讓我們建立一個全域指令，要求模型重構一段程式碼。

**1. 建立檔案和目錄：**

首先，確保使用者指令目錄存在，然後建立 `refactor` 子目錄以進行組織，以及最終的 TOML 檔案。

```bash
mkdir -p ~/.gemini/commands/refactor
touch ~/.gemini/commands/refactor/pure.toml
```

**2. 將內容新增到檔案：**

在編輯器中開啟 `~/.gemini/commands/refactor/pure.toml` 並新增以下內容。為了最佳實務，我們包含了選用的 `description`。

```toml
# 位於：~/.gemini/commands/refactor/pure.toml
# 此指令將透過：/refactor:pure 呼叫

description = "要求模型將目前內容重構為純函式。"

prompt = """
請分析我在目前內容中提供的程式碼。
將其重構為純函式。

您的回應應包括：
1. 重構的純函式程式碼區塊。
2. 您所做的關鍵變更的簡要說明，以及為什麼它們有助於純度。
"""
```

**3. 執行指令：**

就是這樣！您現在可以在 CLI 中執行您的指令。首先，您可能會將檔案新增到內容中，然後呼叫您的指令：

```
> @my-messy-function.js
> /refactor:pure
```

Gemini CLI 接著會執行您在 TOML 檔案中定義的多行提示。

## At 指令（`@`）

At 指令用於將檔案或目錄的內容包含在您對 Gemini 的提示中。這些指令包含 git 感知篩選。

- **`@<path_to_file_or_directory>`**
  - **描述：** 將指定檔案或檔案的內容注入您目前的提示中。這對於詢問特定程式碼、文字或檔案集合的問題很有用。
  - **範例：**
    - `@path/to/your/file.txt 說明這個文字。`
    - `@src/my_project/ 摘要此目錄中的程式碼。`
    - `這個檔案是關於什麼的？@README.md`
  - **詳細資訊：**
    - 如果提供單一檔案的路徑，會讀取該檔案的內容。
    - 如果提供目錄的路徑，指令會嘗試讀取該目錄和任何子目錄中檔案的內容。
    - 路徑中的空格應使用反斜線跳脫（例如，`@My\ Documents/file.txt`）。
    - 指令內部使用 `read_many_files` 工具。內容會被擷取，然後在傳送給 Gemini 模型之前插入您的查詢中。
    - **Git 感知篩選：** 預設情況下，git 忽略的檔案（例如 `node_modules/`、`dist/`、`.env`、`.git/`）會被排除。此行為可以透過 `context.fileFiltering` 設定變更。
    - **檔案類型：** 指令用於基於文字的檔案。雖然它可能會嘗試讀取任何檔案，但二進位檔案或非常大的檔案可能會被底層 `read_many_files` 工具跳過或截斷，以確保效能和相關性。工具會指示是否有檔案被跳過。
  - **輸出：** CLI 會顯示工具呼叫訊息，指示使用了 `read_many_files`，以及詳述狀態和處理路徑的訊息。

- **`@`（單獨的 at 符號）**
  - **描述：** 如果您輸入單獨的 `@` 符號而沒有路徑，查詢會原樣傳遞給 Gemini 模型。如果您在提示中特別談論 `@` 符號，這可能很有用。

### `@` 指令的錯誤處理

- 如果在 `@` 後指定的路徑找不到或無效，將顯示錯誤訊息，查詢可能不會傳送給 Gemini 模型，或者會在沒有檔案內容的情況下傳送。
- 如果 `read_many_files` 工具遇到錯誤（例如權限問題），這也會被回報。

## Shell 模式與透傳指令（`!`）

`!` 前綴讓您直接從 Gemini CLI 內與系統的 shell 互動。

- **`!<shell_command>`**
  - **描述：** 在 Linux/macOS 上使用 `bash` 或在 Windows 上使用 `cmd.exe` 執行給定的 `<shell_command>`。指令的任何輸出或錯誤都會在終端中顯示。
  - **範例：**
    - `!ls -la`（執行 `ls -la` 並回到 Gemini CLI）
    - `!git status`（執行 `git status` 並回到 Gemini CLI）

- **`!`（切換 shell 模式）**
  - **描述：** 單獨輸入 `!` 會切換 shell 模式。
    - **進入 shell 模式：**
      - 啟用時，shell 模式使用不同的色彩和「Shell 模式指示器」。
      - 在 shell 模式中，您輸入的文字會直接解釋為 shell 指令。
    - **退出 shell 模式：**
      - 退出時，UI 會回復到標準外觀，並恢復正常的 Gemini CLI 行為。

- **所有 `!` 使用的注意事項：** 您在 shell 模式中執行的指令具有與您直接在終端中執行相同的權限和影響。

- **環境變數：** 當透過 `!` 或在 shell 模式中執行指令時，`GEMINI_CLI=1` 環境變數會在子程序的環境中設定。這允許腳本或工具偵測它們是否從 Gemini CLI 內執行。
