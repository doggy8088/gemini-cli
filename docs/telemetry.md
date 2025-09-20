# 使用 OpenTelemetry 進行可觀測性

學習如何為 Gemini CLI 啟用並設定 OpenTelemetry。

- [使用 OpenTelemetry 進行可觀測性](#使用-opentelemetry-進行可觀測性)
  - [主要優點](#主要優點)
  - [OpenTelemetry 整合](#opentelemetry-整合)
  - [設定方式](#設定方式)
  - [Google Cloud 遙測 (telemetry)](#google-cloud-遙測-telemetry)
    - [先決條件](#先決條件)
    - [直接匯出（建議）](#直接匯出-建議方式)
    - [基於 Collector 的匯出（進階）](#基於-collector-的匯出-進階)
  - [本地端遙測 (telemetry)](#本機遙測-local-telemetry)
    - [檔案輸出（建議）](#檔案型輸出-建議方式)
    - [基於 Collector 的匯出（進階）](#基於-collector-的匯出-進階-1)
  - [日誌與指標](#日誌-logs-與指標-metrics)
    - [日誌](#日誌-logs)
    - [指標](#指標-metrics)

## 主要優點

- **🔍 使用分析**：瞭解團隊內的互動模式與功能採用情形
- **⚡ 效能監控**：追蹤回應時間、token 消耗與資源使用狀況
- **🐛 即時除錯**：即時識別瓶頸、失敗與錯誤模式
- **📊 工作流程最佳化**：根據數據做出更佳決策，優化設定與流程
- **🏢 企業治理**：跨團隊監控使用情形、追蹤成本、確保合規，並可與現有監控基礎設施整合

## OpenTelemetry 整合

基於 **[OpenTelemetry]** —— 一個與廠商無關、業界標準的可觀測性框架 —— Gemini CLI 的可觀測性系統提供：

- **通用相容性**：可匯出至任何 OpenTelemetry 後端（如 Google Cloud、Jaeger、Prometheus、Datadog 等）
- **標準化資料**：於整個工具鏈中採用一致的格式與收集方式
- **未來相容的整合**：可與現有及未來的可觀測性基礎設施連接
- **無廠商綁定**：可於不同後端間切換，無需更改儀器化程式碼

[OpenTelemetry]: https://opentelemetry.io/

## 設定方式

所有遙測 (telemetry) 行為皆可透過你的 `.gemini/settings.json` 檔案進行控制，並可用 CLI 旗標 (flags) 覆寫：

| 設定項目        | 可用值            | 預設值                 | CLI 覆寫方式                                             | 說明                                          |
| -------------- | ----------------- | ----------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `enabled`      | `true`/`false`    | `false`                 | `--telemetry` / `--no-telemetry`                         | 啟用或停用遙測 (telemetry)                          |
| `target`       | `"gcp"`/`"local"` | `"local"`               | `--telemetry-target <local\|gcp>`                        | 遙測資料的傳送目的地                         |
| `otlpEndpoint` | URL string        | `http://localhost:4317` | `--telemetry-otlp-endpoint <URL>`                        | OTLP collector 端點                              |
| `otlpProtocol` | `"grpc"`/`"http"` | `"grpc"`                | `--telemetry-otlp-protocol <grpc\|http>`                 | OTLP 傳輸協定                              |
| `outfile`      | file path         | -                       | `--telemetry-outfile <path>`                             | 將遙測資料存檔（需搭配 `otlpEndpoint: ""`） |
| `logPrompts`   | `true`/`false`    | `true`                  | `--telemetry-log-prompts` / `--no-telemetry-log-prompts` | 是否在遙測日誌中包含提示內容                    |
| `useCollector` | `true`/`false`    | `false`                 | -                                                        | 使用外部 OTLP collector（進階）               |

如需所有設定選項的詳細資訊，請參閱 [設定指南](./cli/configuration.md)。

## Google Cloud 遙測 (telemetry)

### 先決條件

在使用下列任一方法前，請先完成以下步驟：

1. 設定你的 Google Cloud 專案 ID：
   - 若遙測 (telemetry) 與推論 (inference) 分屬不同專案時：
     ```bash
     export OTLP_GOOGLE_CLOUD_PROJECT="your-telemetry-project-id"
     ```
   - 若遙測 (telemetry) 與推論 (inference) 位於同一個專案中：
     ```bash
     export GOOGLE_CLOUD_PROJECT="your-project-id"
     ```

2. 與 Google Cloud 進行驗證：
   - 若使用的是使用者帳戶：
     ```bash
     gcloud auth application-default login
     ```
   - 如果使用服務帳戶（service account）：
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account.json"
     ```
3. 請確保您的帳戶或服務帳戶（service account）擁有以下 IAM 角色：
   - Cloud Trace Agent
   - Monitoring Metric Writer
   - Logs Writer

4. 啟用所需的 Google Cloud API（如果尚未啟用）：
   ```bash
   gcloud services enable \
     cloudtrace.googleapis.com \
     monitoring.googleapis.com \
     logging.googleapis.com \
     --project="$OTLP_GOOGLE_CLOUD_PROJECT"
   ```

### 直接匯出（建議方式）

將遙測 (telemetry) 資料直接傳送至 Google Cloud 服務。無需 collector。

1. 在您的`.gemini/settings.json`中啟用遙測 (telemetry)：
   ```json
   {
     "telemetry": {
       "enabled": true,
       "target": "gcp"
     }
   }
   ```
2. 執行 Gemini CLI 並傳送提示詞（prompts）。
3. 檢視日誌與指標：
   - 在傳送提示詞後，於瀏覽器中開啟 Google Cloud Console：
     - 日誌（Logs）：https://console.cloud.google.com/logs/
     - 指標（Metrics）：https://console.cloud.google.com/monitoring/metrics-explorer
     - 追蹤（Traces）：https://console.cloud.google.com/traces/list

### 基於 Collector 的匯出（進階）

若需自訂處理、過濾或路由，請使用 OpenTelemetry collector
將資料轉發至 Google Cloud。

1. 設定你的 `.gemini/settings.json`：
   ```json
   {
     "telemetry": {
       "enabled": true,
       "target": "gcp",
       "useCollector": true
     }
   }
   ```
2. 執行自動化腳本：
   ```bash
   npm run telemetry -- --target=gcp
   ```
   這將會：
   - 啟動一個本機 OTEL collector，並轉發至 Google Cloud
   - 設定你的 workspace
   - 提供連結以在 Google Cloud Console 檢視 traces、metrics 和 logs
   - 將 collector logs 儲存到 `~/.gemini/tmp/<projectHash>/otel/collector-gcp.log`
   - 在結束時停止 collector（例如 `Ctrl+C`）
3. 執行 Gemini CLI 並傳送提示詞（prompts）。
4. 檢視 logs 和 metrics：
   - 在傳送提示詞後，於瀏覽器中開啟 Google Cloud Console：
     - Logs：https://console.cloud.google.com/logs/
     - Metrics：https://console.cloud.google.com/monitoring/metrics-explorer
     - Traces：https://console.cloud.google.com/traces/list
   - 開啟 `~/.gemini/tmp/<projectHash>/otel/collector-gcp.log` 以檢視本機 collector logs。

## 本機遙測 (Local Telemetry)

針對本機開發與除錯，你可以在本地端擷取遙測 (telemetry) 資料：

### 檔案型輸出（建議方式）

1. 在你的 `.gemini/settings.json` 中啟用遙測 (telemetry)：
   ```json
   {
     "telemetry": {
       "enabled": true,
       "target": "local",
       "otlpEndpoint": "",
       "outfile": ".gemini/telemetry.log"
     }
   }
   ```
2. 執行 Gemini CLI 並傳送提示詞（prompts）。
3. 在指定的檔案（例如：`.gemini/telemetry.log`）中檢視日誌和指標（metrics）。

### 基於 Collector 的匯出（進階）

1. 執行自動化腳本（script）：
   ```bash
   npm run telemetry -- --target=local
   ```
   這將會：
   - 下載並啟動 Jaeger 和 OTEL collector
   - 為你的 workspace 設定本地遙測 (telemetry)
   - 在 http://localhost:16686 提供 Jaeger UI
   - 將日誌／指標 (logs/metrics) 儲存到 `~/.gemini/tmp/<projectHash>/otel/collector.log`
   - 離開時停止 collector（例如：`Ctrl+C`）

2. 執行 Gemini CLI 並傳送提示 (prompts)。
3. 在 http://localhost:16686 檢視追蹤 (traces)，並於 collector 日誌檔案中檢視日誌／指標。

## 日誌 (Logs) 與指標 (Metrics)

以下章節說明 Gemini CLI 所產生的日誌 (logs) 與指標 (metrics) 結構。

- 所有日誌與指標皆包含 `sessionId` 作為共用屬性。

### 日誌 (Logs)

日誌是具時間戳記的特定事件紀錄。Gemini CLI 會記錄下列事件：

- `gemini_cli.config`：此事件於啟動時發生一次，包含 CLI 的設定。
  - **屬性**：
    - `model`（string）
    - `embedding_model`（string）
    - `sandbox_enabled`（boolean）
    - `core_tools_enabled`（string）
    - `approval_mode`（string）
    - `api_key_enabled`（boolean）
    - `vertex_ai_enabled`（boolean）
    - `code_assist_enabled`（boolean）
    - `log_prompts_enabled`（boolean）
    - `file_filtering_respect_git_ignore`（boolean）
    - `debug_mode`（boolean）
    - `mcp_servers`（string）
    - `output_format`（string："text" 或 "json"）

- `gemini_cli.user_prompt`：此事件於使用者提交提示 (prompt) 時發生。
  - **屬性**：
    - `prompt_length`（int）
    - `prompt_id`（string）
    - `prompt`（string，若 `log_prompts_enabled` 設定為 `false` 則此屬性不包含）
    - `auth_type`（string）

- `gemini_cli.tool_call`：此事件於每次工具 (function) 呼叫時發生。
  - **屬性**：
    - `function_name`
    - `function_args`
    - `duration_ms`
    - `success`（boolean）
    - `decision`（string："accept"、"reject"、"auto_accept" 或 "modify"，如適用）
    - `error`（如適用）
    - `error_type`（如適用）
    - `content_length`（int，如適用）
    - `metadata`（如適用，string -> any 的字典）

- `gemini_cli.file_operation`：此事件於每次檔案操作時發生。
  - **屬性**：
    - `tool_name`（string）
    - `operation`（string："create"、"read"、"update"）
    - `lines`（int，如適用）
    - `mimetype`（string，如適用）
    - `extension`（string，如適用）
    - `programming_language`（string，如適用）
    - `diff_stat`（json string，如適用）：一個 JSON 字串，包含以下成員：
      - `ai_added_lines`（int）
      - `ai_removed_lines`（int）
      - `user_added_lines`（int）
      - `user_removed_lines`（int）

- `gemini_cli.api_request`：此事件於發送請求至 Gemini API 時發生。
  - **屬性**：
    - `model`
    - `request_text`（如適用）

- `gemini_cli.api_error`：此事件於 API 請求失敗時發生。
  - **屬性**：
    - `model`
    - `error`
    - `error_type`
    - `status_code`
    - `duration_ms`
    - `auth_type`

- `gemini_cli.api_response`：此事件於收到 Gemini API 回應時發生。
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
    - `response_text`（如適用）
    - `auth_type`

- `gemini_cli.tool_output_truncated`：此事件於工具呼叫的輸出過大且被截斷時發生。
  - **屬性**：
    - `tool_name`（string）
    - `original_content_length`（int）
    - `truncated_content_length`（int）
    - `threshold`（int）
    - `lines`（int）
    - `prompt_id`（string）

- `gemini_cli.malformed_json_response`：此事件於 Gemini API 回傳的 `generateJson` 回應無法解析為 json 時發生。
  - **屬性**：
    - `model`

- `gemini_cli.flash_fallback`：此事件於 Gemini CLI 切換為 flash 作為備援時發生。
  - **屬性**：
    - `auth_type`

- `gemini_cli.slash_command`：此事件於使用者執行斜線指令 (slash command) 時發生。
  - **屬性**：
    - `command`（string）
    - `subcommand`（string，如適用）

### 指標 (Metrics)

指標是隨時間變化的行為數值量測。Gemini CLI 會收集下列指標：

- `gemini_cli.session.count`（Counter, Int）：每次 CLI 啟動時遞增一次。

- `gemini_cli.tool.call.count`（Counter, Int）：統計工具呼叫次數。
  - **屬性**：
    - `function_name`
    - `success`（boolean）
    - `decision`（string："accept"、"reject" 或 "modify"，如適用）
    - `tool_type`（string："mcp" 或 "native"，如適用）

- `gemini_cli.tool.call.latency`（Histogram, ms）：量測工具呼叫延遲。
  - **屬性**：
    - `function_name`
    - `decision`（string："accept"、"reject" 或 "modify"，如適用）

- `gemini_cli.api.request.count`（Counter, Int）：統計所有 API 請求次數。
  - **屬性**：
    - `model`
    - `status_code`
    - `error_type`（如適用）

- `gemini_cli.api.request.latency`（Histogram, ms）：量測 API 請求延遲。
  - **屬性**：
    - `model`

- `gemini_cli.token.usage`（Counter, Int）：統計使用的 token 數量。
  - **屬性**：
    - `model`
    - `type`（string："input"、"output"、"thought"、"cache" 或 "tool"）

- `gemini_cli.file.operation.count`（Counter, Int）：統計檔案操作次數。
  - **屬性**：
    - `operation`（string："create"、"read"、"update"）：檔案操作類型。
    - `lines`（Int，如適用）：檔案行數。
    - `mimetype`（string，如適用）：檔案的 mimetype。
    - `extension`（string，如適用）：檔案副檔名。
    - `model_added_lines`（Int，如適用）：模型新增／變更的行數。
    - `model_removed_lines`（Int，如適用）：模型移除／變更的行數。
    - `user_added_lines`（Int，如適用）：使用者於 AI 建議變更中新增／變更的行數。
    - `user_removed_lines`（Int，如適用）：使用者於 AI 建議變更中移除／變更的行數。
    - `programming_language`（string，如適用）：檔案的程式語言。

- `gemini_cli.chat_compression`（Counter, Int）：統計聊天壓縮 (chat compression) 操作次數
  - **屬性**：
    - `tokens_before`：（Int）：壓縮前 context 中的 token 數量
    - `tokens_after`：（Int）：壓縮後 context 中的 token 數量
