# 可觀測性指南

遙測提供有關 Gemini CLI 效能、健康狀況和使用情況的資料。啟用後，您可以透過追蹤、指標和結構化日誌來監控操作、偵錯問題並最佳化工具使用。

Gemini CLI 的遙測系統建立在 **[OpenTelemetry] (OTEL)** 標準之上，可讓您將資料傳送至任何相容的後端。

[OpenTelemetry]: https://opentelemetry.io/

## 啟用遙測

您可以透過多種方式啟用遙測。設定主要透過 [`.gemini/settings.json` 檔案](./cli/configuration.md) 和環境變數進行管理，但 CLI 旗標可以覆寫特定工作階段的這些設定。

### 優先順序

以下列出套用遙測設定的優先順序，順序較高的項目優先權較高：

1.  **CLI 旗標 (適用於 `gemini` 指令)**：
    - `--telemetry` / `--no-telemetry`：覆寫 `telemetry.enabled`。
    - `--telemetry-target <local|gcp>`：覆寫 `telemetry.target`。
    - `--telemetry-otlp-endpoint <URL>`：覆寫 `telemetry.otlpEndpoint`。
    - `--telemetry-log-prompts` / `--no-telemetry-log-prompts`：覆寫 `telemetry.logPrompts`。

1.  **環境變數**：
    - `OTEL_EXPORTER_OTLP_ENDPOINT`：覆寫 `telemetry.otlpEndpoint`。

1.  **工作區設定檔 (`.gemini/settings.json`)**： 此專案特定檔案中 `telemetry` 物件的值。

1.  **使用者設定檔 (`~/.gemini/settings.json`)**： 此全域使用者檔案中 `telemetry` 物件的值。

1.  **預設值**： 如果上述任何一項皆未設定，則套用預設值。
    - `telemetry.enabled`：`false`
    - `telemetry.target`：`local`
    - `telemetry.otlpEndpoint`：`http://localhost:4317`
    - `telemetry.logPrompts`：`true`

**對於 `npm run telemetry -- --target=<gcp|local>` 指令碼**：
此指令碼的 `--target` 引數*僅*在該指令碼的持續時間和目的內覆寫 `telemetry.target` (亦即選擇要啟動的收集器)。它不會永久變更您的 `settings.json`。該指令碼會先在 `settings.json` 中尋找 `telemetry.target` 作為其預設值。

### 範例設定

下列程式碼可新增至您的工作區 (`.gemini/settings.json`) 或使用者 (`~/.gemini/settings.json`) 設定，以啟用遙測並將輸出傳送至 Google Cloud：

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp"
  },
  "sandbox": false
}
```

## 執行 OTEL 收集器

OTEL 收集器是一種接收、處理和匯出遙測資料的服務。
CLI 使用 OTLP/gRPC 通訊協定傳送資料。

在[說明文件][otel-config-docs]中進一步了解 OTEL 匯出器標準設定。

[otel-config-docs]: https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/

### 本機

使用 `npm run telemetry -- --target=local` 指令來自動化設定本機遙測管線的程序，包括在您的 `.gemini/settings.json` 檔案中設定必要的設定。基礎指令碼會安裝 `otelcol-contrib` (OpenTelemetry 收集器) 和 `jaeger` (用於檢視追蹤的 Jaeger UI)。若要使用它：

1.  **執行指令**：
    從存放庫的根目錄執行指令：

    ```bash
    npm run telemetry -- --target=local
    ```

    該指令碼將會：
    - 如有需要，下載 Jaeger 和 OTEL。
    - 啟動本機 Jaeger 執行個體。
    - 啟動設定為從 Gemini CLI 接收資料的 OTEL 收集器。
    - 自動在您的工作區設定中啟用遙測。
    - 結束時，停用遙測。

1.  **檢視追蹤**：
    開啟您的網頁瀏覽器並導覽至 **http://localhost:16686** 以存取 Jaeger UI。您可以在此處檢查 Gemini CLI 操作的詳細追蹤。

1.  **檢查日誌和指標**：
    該指令碼會將 OTEL 收集器輸出 (包括日誌和指標) 重新導向至 `~/.gemini/tmp/<projectHash>/otel/collector.log`。該指令碼將提供連結以在本機檢視您的遙測資料 (追蹤、指標、日誌) 並提供指令以追蹤您的遙測資料。

1.  **停止服務**：
    在執行指令碼的終端機中按下 `Ctrl+C` 以停止 OTEL 收集器和 Jaeger 服務。

### Google Cloud

使用 `npm run telemetry -- --target=gcp` 指令來自動化設定將資料轉送至您的 Google Cloud 專案的本機 OpenTelemetry 收集器，包括在您的 `.gemini/settings.json` 檔案中設定必要的設定。基礎指令碼會安裝 `otelcol-contrib`。若要使用它：

1.  **先決條件**：
    - 擁有 Google Cloud 專案 ID。
    - 匯出 `GOOGLE_CLOUD_PROJECT` 環境變數，使其可供 OTEL 收集器使用。
      ```bash
      export OTLP_GOOGLE_CLOUD_PROJECT="your-project-id"
      ```
    - 向 Google Cloud 進行驗證 (例如，執行 `gcloud auth application-default login` 或確保已設定 `GOOGLE_APPLICATION_CREDENTIALS`)。
    - 確保您的 Google Cloud 帳戶/服務帳戶具有必要的 IAM 角色：「Cloud Trace Agent」、「Monitoring Metric Writer」和「Logs Writer」。

1.  **執行指令**：
    從存放庫的根目錄執行指令：

    ```bash
    npm run telemetry -- --target=gcp
    ```

    該指令碼將會：
    - 如有需要，下載 `otelcol-contrib` 二進位檔。
    - 啟動設定為從 Gemini CLI 接收資料並將其匯出至您指定的 Google Cloud 專案的 OTEL 收集器。
    - 自動在您的工作區設定 (`.gemini/settings.json`) 中啟用遙測並停用沙盒模式。
    - 提供直接連結以在您的 Google Cloud Console 中檢視追蹤、指標和日誌。
    - 結束時 (Ctrl+C)，它會嘗試還原您原始的遙測和沙盒設定。

1.  **執行 Gemini CLI**：
    在個別的終端機中，執行您的 Gemini CLI 指令。這會產生收集器擷取的遙測資料。

1.  **在 Google Cloud 中檢視遙測**：
    使用指令碼提供的連結導覽至 Google Cloud Console 並檢視您的追蹤、指標和日誌。

1.  **檢查本機收集器日誌**：
    該指令碼會將本機 OTEL 收集器輸出重新導向至 `~/.gemini/tmp/<projectHash>/otel/collector-gcp.log`。該指令碼提供連結以在本機檢視您的收集器日誌並提供指令以追蹤您的收集器日誌。

1.  **停止服務**：
    在執行指令碼的終端機中按下 `Ctrl+C` 以停止 OTEL 收集器。

## 日誌和指標參考

以下章節說明為 Gemini CLI 產生的日誌和指標的結構。

- `sessionId` 會作為所有日誌和指標的通用屬性包含在內。

### 日誌

日誌是特定事件的帶時間戳記的記錄。為 Gemini CLI 記錄了下列事件：

- `gemini_cli.config`：此事件在啟動時發生一次，包含 CLI 的設定。
  - **屬性**：
    - `model` (字串)
    - `embedding_model` (字串)
    - `sandbox_enabled` (布林值)
    - `core_tools_enabled` (字串)
    - `approval_mode` (字串)
    - `api_key_enabled` (布林值)
    - `vertex_ai_enabled` (布林值)
    - `code_assist_enabled` (布林值)
    - `log_prompts_enabled` (布林值)
    - `file_filtering_respect_git_ignore` (布林值)
    - `debug_mode` (布林值)
    - `mcp_servers` (字串)

- `gemini_cli.user_prompt`：當使用者提交提示時，會發生此事件。
  - **屬性**：
    - `prompt_length`
    - `prompt` (如果 `log_prompts_enabled` 設定為 `false`，則排除此屬性)

- `gemini_cli.tool_call`：此事件會針對每個函式呼叫發生。
  - **屬性**：
    - `function_name`
    - `function_args`
    - `duration_ms`
    - `success` (布林值)
    - `decision` (字串："accept"、"reject" 或 "modify"，如適用)
    - `error` (如適用)
    - `error_type` (如適用)

- `gemini_cli.api_request`：向 Gemini API 發出請求時，會發生此事件。
  - **屬性**：
    - `model`
    - `request_text` (如適用)

- `gemini_cli.api_error`：如果 API 請求失敗，則會發生此事件。
  - **屬性**：
    - `model`
    - `error`
    - `error_type`
    - `status_code`
    - `duration_ms`

- `gemini_cli.api_response`：收到來自 Gemini API 的回應時，會發生此事件。
  - **屬性**：
    - `model`
    - `status_code`
    - `duration_ms`
    - `error` (選用)
    - `input_token_count`
    - `output_token_count`
    - `cached_content_token_count`
    - `thoughts_token_count`
    - `tool_token_count`
    - `response_text` (如適用)

### 指標

指標是隨時間變化的行為的數值測量。為 Gemini CLI 收集了下列指標：

- `gemini_cli.session.count` (計數器，整數)：每次 CLI 啟動時遞增一次。

- `gemini_cli.tool.call.count` (計數器，整數)：計算工具呼叫次數。
  - **屬性**：
    - `function_name`
    - `success` (布林值)
    - `decision` (字串："accept"、"reject" 或 "modify"，如適用)

- `gemini_cli.tool.call.latency` (長條圖，毫秒)：測量工具呼叫延遲。
  - **屬性**：
    - `function_name`
    - `decision` (字串："accept"、"reject" 或 "modify"，如適用)

- `gemini_cli.api.request.count` (計數器，整數)：計算所有 API 請求的次數。
  - **屬性**：
    - `model`
    - `status_code`
    - `error_type` (如適用)

- `gemini_cli.api.request.latency` (長條圖，毫秒)：測量 API 請求延遲。
  - **屬性**：
    - `model`

- `gemini_cli.token.usage` (計數器，整數)：計算使用的 token 數量。
  - **屬性**：
    - `model`
    - `type` (字串："input"、"output"、"thought"、"cache" 或 "tool")

- `gemini_cli.file.operation.count` (計數器，整數)：計算檔案操作次數。
  - **屬性**：
    - `operation` (字串："create"、"read"、"update")：檔案操作的類型。
    - `lines` (整數，如適用)：檔案中的行數。
    - `mimetype` (字串，如適用)：檔案的 Mimetype。
    - `extension` (字串，如適用)：檔案的副檔名。