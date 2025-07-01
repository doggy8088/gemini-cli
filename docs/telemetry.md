# 可觀測性指南

遙測（Telemetry）提供有關 Gemini CLI 效能、健康狀況和使用情況的資料。透過啟用此功能，您可以透過追蹤、指標和結構化日誌來監控操作、偵錯問題並最佳化工具使用。

Gemini CLI 的遙測系統是建立在 **[OpenTelemetry] (OTEL)** 標準之上，可讓您將資料傳送至任何相容的後端。

[OpenTelemetry]: https://opentelemetry.io/

## 啟用遙測

您可以用多種方式啟用遙測。設定主要透過 [`.gemini/settings.json` 檔案](./cli/configuration.md) 和環境變數進行管理，但 CLI 旗標可以針對特定工作階段覆寫這些設定。

### 優先順序

以下列出套用遙測設定的優先順序，順序越高的項目優先權越大：

1.  **CLI 旗標（用於 `gemini` 指令）**：
    - `--telemetry` / `--no-telemetry`: 覆寫 `telemetry.enabled`。
    - `--telemetry-target <local|gcp>`: 覆寫 `telemetry.target`。
    - `--telemetry-otlp-endpoint <URL>`: 覆寫 `telemetry.otlpEndpoint`。
    - `--telemetry-log-prompts` / `--no-telemetry-log-prompts`: 覆寫 `telemetry.logPrompts`。

1.  **環境變數**：
    - `OTEL_EXPORTER_OTLP_ENDPOINT`: 覆寫 `telemetry.otlpEndpoint`。

1.  **工作區設定檔 (`.gemini/settings.json`)**： 來自此專案特定檔案中 `telemetry` 物件的值。

1.  **使用者設定檔 (`~/.gemini/settings.json`)**： 來自此全域使用者檔案中 `telemetry` 物件的值。

1.  **預設值**： 如果上述任何一項都未設定，則會套用預設值。
    - `telemetry.enabled`: `false`
    - `telemetry.target`: `local`
    - `telemetry.otlpEndpoint`: `http://localhost:4317`
    - `telemetry.logPrompts`: `true`

**對於 `npm run telemetry -- --target=<gcp|local>` 指令稿**：
此指令稿的 `--target` 參數_僅_在該指令稿的執行期間和目的（即選擇要啟動的收集器）內覆寫 `telemetry.target`。它不會永久變更您的 `settings.json`。指令稿會先在 `settings.json` 中尋找 `telemetry.target` 作為其預設值。

### 範例設定

以下程式碼可以新增至您的工作區 (`.gemini/settings.json`) 或使用者 (`~/.gemini/settings.json`) 設定中，以啟用遙測並將輸出傳送至 Google Cloud：

```json
{
  "telemetry": {
    "enabled": true,
    "target": "gcp"
  },
  "sandbox": false
}
```

## 執行 OTEL Collector

OTEL Collector 是一種接收、處理和匯出遙測資料的服務。
CLI 使用 OTLP/gRPC 協定傳送資料。

在[文件][otel-config-docs]中深入瞭解 OTEL 匯出器標準設定。

[otel-config-docs]: https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/

### 本機

使用 `npm run telemetry -- --target=local` 指令來自動化設定本地遙測管道的過程，包括在您的 `.gemini/settings.json` 檔案中設定必要的設定。底層指令稿會安裝 `otelcol-contrib` (OpenTelemetry Collector) 和 `jaeger` (用於檢視追蹤的 Jaeger UI)。使用方法：

1.  **執行指令**：
    從儲存庫的根目錄執行指令：

    ```bash
    npm run telemetry -- --target=local
    ```

    該指令稿將會：
    - 如果需要，下載 Jaeger 和 OTEL。
    - 啟動本地 Jaeger 執行個體。
    - 啟動設定為接收來自 Gemini CLI 資料的 OTEL 收集器。
    - 自動在您的工作區設定中啟用遙測。
    - 退出時，停用遙測。

1.  **檢視追蹤**：
    開啟您的網頁瀏覽器並前往 **http://localhost:16686** 以存取 Jaeger UI。您可以在此處檢查 Gemini CLI 操作的詳細追蹤。

1.  **檢查日誌和指標**：
    該指令稿會將 OTEL 收集器輸出（包括日誌和指標）重新導向至 `~/.gemini/tmp/<projectHash>/otel/collector.log`。該指令稿將提供連結以供檢視，並提供一個指令以在本地追蹤您的遙測資料（追蹤、指標、日誌）。

1.  **停止服務**：
    在執行指令稿的終端機中按下 `Ctrl+C` 以停止 OTEL Collector 和 Jaeger 服務。

### Google Cloud

使用 `npm run telemetry -- --target=gcp` 指令來自動化設定一個本地 OpenTelemetry 收集器，該收集器會將資料轉發到您的 Google Cloud 專案，包括在您的 `.gemini/settings.json` 檔案中設定必要的設定。底層指令稿會安裝 `otelcol-contrib`。使用方法：

1.  **先決條件**：
    - 擁有一個 Google Cloud 專案 ID。
    - 匯出 `GOOGLE_CLOUD_PROJECT` 環境變數，使其可供 OTEL 收集器使用。
      ```bash
      export OTLP_GOOGLE_CLOUD_PROJECT="your-project-id"
      ```
    - 向 Google Cloud 進行驗證（例如，執行 `gcloud auth application-default login` 或確保 `GOOGLE_APPLICATION_CREDENTIALS` 已設定）。
    - 確保您的 Google Cloud 帳戶/服務帳戶具有必要的 IAM 角色：「Cloud Trace Agent」、「Monitoring Metric Writer」和「Logs Writer」。

1.  **執行指令**：
    從儲存庫的根目錄執行指令：

    ```bash
    npm run telemetry -- --target=gcp
    ```

    該指令稿將會：
    - 如果需要，下載 `otelcol-contrib` 二進位檔。
    - 啟動一個 OTEL 收集器，設定為從 Gemini CLI 接收資料並將其匯出到您指定的 Google Cloud 專案。
    - 在您的工作區設定 (`.gemini/settings.json`) 中自動啟用遙測並停用沙箱模式。
    - 提供直接連結以在您的 Google Cloud Console 中檢視追蹤、指標和日誌。
    - 退出時（Ctrl+C），它會嘗試還原您原始的遙測和沙箱設定。

1.  **執行 Gemini CLI**：
    在另一個終端機中，執行您的 Gemini CLI 指令。這會產生遙測資料，並由收集器擷取。

1.  **在 Google Cloud 中檢視遙測資料**：
    使用指令碼提供的連結前往 Google Cloud Console，並檢視您的追蹤、指標和日誌。

1.  **檢查本機收集器日誌**：
    該指令碼會將本機 OTEL 收集器輸出重新導向至 `~/.gemini/tmp/<projectHash>/otel/collector-gcp.log`。該指令碼提供連結以供檢視，以及在本機追蹤收集器日誌的指令。

1.  **停止服務**：
    在執行指令碼的終端機中按下 `Ctrl+C` 以停止 OTEL Collector。

## 日誌與指標參考

以下章節說明為 Gemini CLI 產生的日誌與指標結構。

- 所有日誌與指標都包含一個 `sessionId` 作為通用屬性。

### 日誌

日誌是特定事件加上時間戳記的記錄。Gemini CLI 會記錄下列事件：

- `gemini_cli.config`：此事件在啟動時發生一次，包含 CLI 的設定。
  - **屬性**：
    - `model` (string)
    - `embedding_model` (string)
    - `sandbox_enabled` (boolean)
    - `core_tools_enabled` (string)
    - `approval_mode` (string)
    - `api_key_enabled` (boolean)
    - `vertex_ai_enabled` (boolean)
    - `code_assist_enabled` (boolean)
    - `log_prompts_enabled` (boolean)
    - `file_filtering_respect_git_ignore` (boolean)
    - `debug_mode` (boolean)
    - `mcp_servers` (string)

- `gemini_cli.user_prompt`：當使用者提交提示時，會發生此事件。
  - **屬性**：
    - `prompt_length`
    - `prompt` (如果 `log_prompts_enabled` 設定為 `false`，則會排除此屬性)

- `gemini_cli.tool_call`：每次函式呼叫時都會發生此事件。
  - **屬性**：
    - `function_name`
    - `function_args`
    - `duration_ms`
    - `success` (boolean)
    - `decision` (字串："accept"、"reject" 或 "modify"，如適用)
    - `error` (如適用)
    - `error_type` (如適用)

- `gemini_cli.api_request`：向 Gemini API 發出請求時會發生此事件。
  - **屬性**：
    - `model`
    - `request_text` (如適用)

- `gemini_cli.api_error`：如果 API 請求失敗，會發生此事件。
  - **屬性**：
    - `model`
    - `error`
    - `error_type`
    - `status_code`
    - `duration_ms`

- `gemini_cli.api_response`：從 Gemini API 收到回應時會發生此事件。
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

指標是行為隨時間變化的數值測量。Gemini CLI 會收集下列指標：

- `gemini_cli.session.count` (計數器，整數)：每次 CLI 啟動時遞增一次。

- `gemini_cli.tool.call.count` (計數器，整數)：計算工具呼叫次數。
  - **屬性**：
    - `function_name`
    - `success` (boolean)
    - `decision` (字串："accept"、"reject" 或 "modify"，如適用)

- `gemini_cli.tool.call.latency` (直方圖，毫秒)：測量工具呼叫延遲。
  - **屬性**：
    - `function_name`
    - `decision` (字串："accept"、"reject" 或 "modify"，如適用)

- `gemini_cli.api.request.count` (計數器，整數)：計算所有 API 請求次數。
  - **屬性**：
    - `model`
    - `status_code`
    - `error_type` (如適用)

- `gemini_cli.api.request.latency` (直方圖，毫秒)：測量 API 請求延遲。
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
