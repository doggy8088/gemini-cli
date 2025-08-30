# 可觀測性指南

遙測提供 Gemini CLI 效能、健康狀況和使用情況的資料。透過啟用遙測，您可以透過追蹤、指標和結構化日誌來監控操作、偵錯問題並最佳化工具使用。

Gemini CLI 的遙測系統建立在 **[OpenTelemetry] (OTEL)** 標準之上，允許您將資料發送到任何相容的後端。

[OpenTelemetry]: https://opentelemetry.io/

## 啟用遙測

您可以透過多種方式啟用遙測。設定主要透過 [`.gemini/settings.json` 檔案](./cli/configuration.md) 和環境變數管理，但 CLI 旗標可以覆蓋這些設定以適用於特定工作階段。

### 優先順序

以下列出套用遙測設定的優先順序，清單中較高的項目具有更高的優先順序：

1.  **CLI 旗標（適用於 `gemini` 指令）：**
    - `--telemetry` / `--no-telemetry`：覆蓋 `telemetry.enabled`。
    - `--telemetry-target <local|gcp>`：覆蓋 `telemetry.target`。
    - `--telemetry-otlp-endpoint <URL>`：覆蓋 `telemetry.otlpEndpoint`。
    - `--telemetry-log-prompts` / `--no-telemetry-log-prompts`：覆蓋 `telemetry.logPrompts`。
    - `--telemetry-outfile <path>`：將遙測輸出重新導向到檔案。請參閱[匯出到檔案](#exporting-to-a-file)。

1.  **環境變數：**
    - `OTEL_EXPORTER_OTLP_ENDPOINT`：覆蓋 `telemetry.otlpEndpoint`。

1.  **工作區設定檔案（`.gemini/settings.json`）：** 此專案特定檔案中 `telemetry` 物件的值。

1.  **使用者設定檔案（`~/.gemini/settings.json`）：** 此全域使用者檔案中 `telemetry` 物件的值。

1.  **預設值：** 如果上述任何方式都未設定則套用。
    - `telemetry.enabled`：`false`
    - `telemetry.target`：`local`
    - `telemetry.otlpEndpoint`：`http://localhost:4317`
    - `telemetry.logPrompts`：`true`

**對於 `npm run telemetry -- --target=<gcp|local>` 腳本：**
此腳本的 `--target` 參數 _僅_ 覆蓋該腳本持續時間和目的的 `telemetry.target`（即選擇要啟動的收集器）。它不會永久變更您的 `settings.json`。腳本會首先查看 `settings.json` 中的 `telemetry.target` 作為預設值。

### 範例設定

以下程式碼可以新增到您的工作區（`.gemini/settings.json`）或使用者（`~/.gemini/settings.json`）設定中，以啟用遙測並將輸出發送到 Google Cloud：

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp"
  },
  "tools": {
    "sandbox": false
  }
}
```

### 匯出到檔案

您可以將所有遙測資料匯出到檔案以進行本機檢查。

要啟用檔案匯出，請使用 `--telemetry-outfile` 旗標並指定您想要的輸出檔案路徑。這必須使用 `--telemetry-target=local` 執行。

```bash
# 設定您想要的輸出檔案路徑
TELEMETRY_FILE=".gemini/telemetry.log"

# 使用本機遙測執行 Gemini CLI
# 注意：需要 --telemetry-otlp-endpoint="" 來覆蓋預設的
# OTLP 匯出器並確保遙測寫入本機檔案。
gemini --telemetry \
  --telemetry-target=local \
  --telemetry-otlp-endpoint="" \
  --telemetry-outfile="$TELEMETRY_FILE" \
  --prompt "What is OpenTelemetry?"
```

## 執行 OTEL 收集器

OTEL 收集器是一個接收、處理和匯出遙測資料的服務。
CLI 可以使用 OTLP/gRPC 或 OTLP/HTTP 協定發送資料。
您可以透過 `--telemetry-otlp-protocol` 旗標
或您的 `settings.json` 檔案中的 `telemetry.otlpProtocol` 設定指定要使用的協定。請參閱
[設定文件](./cli/configuration.md#--telemetry-otlp-protocol) 以了解更多
詳細資訊。

在[文件][otel-config-docs]中了解更多關於 OTEL 匯出器標準設定的資訊。

[otel-config-docs]: https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/

### 本機

使用 `npm run telemetry -- --target=local` 指令來自動設定本機遙測管道的過程，包括在您的 `.gemini/settings.json` 檔案中設定必要的設定。底層腳本會安裝 `otelcol-contrib`（OpenTelemetry 收集器）和 `jaeger`（用於檢視追蹤的 Jaeger UI）。使用方法：

1.  **執行指令**：
    從儲存庫根目錄執行指令：

    ```bash
    npm run telemetry -- --target=local
    ```

    腳本將會：
    - 如有需要，下載 Jaeger 和 OTEL。
    - 啟動本機 Jaeger 實例。
    - 啟動設定為從 Gemini CLI 接收資料的 OTEL 收集器。
    - 自動在您的工作區設定中啟用遙測。
    - 退出時，停用遙測。

1.  **檢視追蹤**：
    開啟您的網頁瀏覽器並導覽到 **http://localhost:16686** 以存取 Jaeger UI。在這裡您可以檢查 Gemini CLI 操作的詳細追蹤。

1.  **檢查日誌和指標**：
    腳本將 OTEL 收集器輸出（包括日誌和指標）重新導向到 `~/.gemini/tmp/<projectHash>/otel/collector.log`。腳本將提供檢視連結和指令來在本機追蹤您的遙測資料（追蹤、指標、日誌）。

1.  **停止服務**：
    在執行腳本的終端機中按 `Ctrl+C` 來停止 OTEL 收集器和 Jaeger 服務。

### Google Cloud

使用 `npm run telemetry -- --target=gcp` 指令來自動設定本機 OpenTelemetry 收集器，將資料轉發到您的 Google Cloud 專案，包括在您的 `.gemini/settings.json` 檔案中設定必要的設定。底層腳本會安裝 `otelcol-contrib`。使用方法：

1.  **先決條件**：
    - 擁有 Google Cloud 專案 ID。
    - 匯出 `GOOGLE_CLOUD_PROJECT` 環境變數以讓 OTEL 收集器可以使用。
      ```bash
      export OTLP_GOOGLE_CLOUD_PROJECT="your-project-id"
      ```
    - 使用 Google Cloud 進行驗證（例如，執行 `gcloud auth application-default login` 或確保設定了 `GOOGLE_APPLICATION_CREDENTIALS`）。
    - 確保您的 Google Cloud 帳戶/服務帳戶具有必要的 IAM 角色：「Cloud Trace Agent」、「Monitoring Metric Writer」和「Logs Writer」。

1.  **執行指令**：
    從儲存庫根目錄執行指令：

    ```bash
    npm run telemetry -- --target=gcp
    ```

    腳本將會：
    - 如有需要，下載 `otelcol-contrib` 二進位檔案。
    - 啟動設定為從 Gemini CLI 接收資料並將其匯出到您指定的 Google Cloud 專案的 OTEL 收集器。
    - 自動啟用遙測並在您的工作區設定（`.gemini/settings.json`）中停用沙箱模式。
    - 提供直接連結以在您的 Google Cloud 主控台中檢視追蹤、指標和日誌。
    - 退出時（Ctrl+C），它將嘗試還原您的原始遙測和沙箱設定。

1.  **執行 Gemini CLI：**
    在單獨的終端機中，執行您的 Gemini CLI 指令。這會產生收集器捕獲的遙測資料。

1.  **在 Google Cloud 中檢視遙測**：
    使用腳本提供的連結導覽到 Google Cloud 主控台並檢視您的追蹤、指標和日誌。

1.  **檢查本機收集器日誌**：
    腳本將本機 OTEL 收集器輸出重新導向到 `~/.gemini/tmp/<projectHash>/otel/collector-gcp.log`。腳本提供檢視連結和指令來在本機追蹤您的收集器日誌。

1.  **停止服務**：
    在執行腳本的終端機中按 `Ctrl+C` 來停止 OTEL 收集器。

## 日誌和指標參考

以下部分描述為 Gemini CLI 產生的日誌和指標結構。

- 所有日誌和指標都包含 `sessionId` 作為通用屬性。

### 日誌

日誌是特定事件的時間戳記錄。以下事件會記錄在 Gemini CLI 中：

- `gemini_cli.config`：此事件在啟動時發生一次，記錄 CLI 的設定。
  - **屬性**：
    - `model`（字串）
    - `embedding_model`（字串）
    - `sandbox_enabled`（布林值）
    - `core_tools_enabled`（字串）
    - `approval_mode`（字串）
    - `api_key_enabled`（布林值）
    - `vertex_ai_enabled`（布林值）
    - `code_assist_enabled`（布林值）
    - `log_prompts_enabled`（布林值）
    - `file_filtering_respect_git_ignore`（布林值）
    - `debug_mode`（布林值）
    - `mcp_servers`（字串）

- `gemini_cli.user_prompt`：此事件在使用者提交提示時發生。
  - **屬性**：
    - `prompt_length`（整數）
    - `prompt_id`（字串）
    - `prompt`（字串，如果 `log_prompts_enabled` 設定為 `false`，則排除此屬性）
    - `auth_type`（字串）

- `gemini_cli.tool_call`：此事件在每次函式呼叫時發生。
  - **屬性**：
    - `function_name`
    - `function_args`
    - `duration_ms`
    - `success`（布林值）
    - `decision`（字串：「accept」、「reject」、「auto_accept」或「modify」，如果適用）
    - `error`（如果適用）
    - `error_type`（如果適用）
    - `metadata`（如果適用，字串到任何類型的字典）

- `gemini_cli.api_request`：此事件在向 Gemini API 發出請求時發生。
  - **屬性**：
    - `model`
    - `request_text`（如果適用）

- `gemini_cli.api_error`：此事件在 API 請求失敗時發生。
  - **屬性**：
    - `model`
    - `error`
    - `error_type`
    - `status_code`
    - `duration_ms`
    - `auth_type`

- `gemini_cli.api_response`：此事件在從 Gemini API 接收回應時發生。
  - **屬性**：
    - `model`
    - `status_code`
    - `duration_ms`
    - `error`（可選）
    - `input_token_count`
    - `output_token_count`
    - `cached_content_token_count`
    - `thoughts_token_count`
    - `tool_token_count`
    - `response_text`（如果適用）
    - `auth_type`

- `gemini_cli.malformed_json_response`：此事件在 Gemini API 的 `generateJson` 回應無法解析為 JSON 時發生。
  - **屬性**：
    - `model`

- `gemini_cli.flash_fallback`：此事件在 Gemini CLI 切換到 flash 作為後備時發生。
  - **屬性**：
    - `auth_type`

- `gemini_cli.slash_command`：此事件在使用者執行斜線指令時發生。
  - **屬性**：
    - `command`（字串）
    - `subcommand`（字串，如果適用）

### 指標

指標是隨時間測量行為的數值量測。以下指標會收集在 Gemini CLI 中：

- `gemini_cli.session.count`（計數器，整數）：每次 CLI 啟動時遞增一次。

- `gemini_cli.tool.call.count`（計數器，整數）：計算工具呼叫次數。
  - **屬性**：
    - `function_name`
    - `success`（布林值）
    - `decision`（字串：「accept」、「reject」或「modify」，如果適用）
    - `tool_type`（字串：「mcp」或「native」，如果適用）

- `gemini_cli.tool.call.latency`（直方圖，毫秒）：測量工具呼叫延遲。
  - **屬性**：
    - `function_name`
    - `decision`（字串：「accept」、「reject」或「modify」，如果適用）

- `gemini_cli.api.request.count`（計數器，整數）：計算所有 API 請求次數。
  - **屬性**：
    - `model`
    - `status_code`
    - `error_type`（如果適用）

- `gemini_cli.api.request.latency`（直方圖，毫秒）：測量 API 請求延遲。
  - **屬性**：
    - `model`

- `gemini_cli.token.usage`（計數器，整數）：計算使用的權杖數量。
  - **屬性**：
    - `model`
    - `type`（字串：「input」、「output」、「thought」、「cache」或「tool」）

- `gemini_cli.file.operation.count`（計數器，整數）：計算檔案操作次數。
  - **屬性**：
    - `operation`（字串：「create」、「read」、「update」）：檔案操作的類型。
    - `lines`（整數，如果適用）：檔案中的行數。
    - `mimetype`（字串，如果適用）：檔案的 MIME 類型。
    - `extension`（字串，如果適用）：檔案的副檔名。
    - `ai_added_lines`（整數，如果適用）：AI 新增/變更的行數。
    - `ai_removed_lines`（整數，如果適用）：AI 移除/變更的行數。
    - `user_added_lines`（整數，如果適用）：使用者在 AI 提議的變更中新增/變更的行數。
    - `user_removed_lines`（整數，如果適用）：使用者在 AI 提議的變更中移除/變更的行數。
    - `programming_language`（字串，如果適用）：檔案的程式語言。

- `gemini_cli.chat_compression`（計數器，整數）：計算聊天壓縮操作次數
  - **屬性**：
    - `tokens_before`：（整數）：壓縮前上下文中的權杖數量
    - `tokens_after`：（整數）：壓縮後上下文中的權杖數量
