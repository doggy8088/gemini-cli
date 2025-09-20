# 無頭模式（Headless Mode）

無頭模式（Headless Mode）允許你以程式化方式，透過命令列腳本與自動化工具執行 Gemini CLI，而不需要任何互動式 UI。這非常適合用於腳本撰寫、自動化、CI/CD 流程，以及打造 AI 驅動的工具。

- [無頭模式（Headless Mode）](#headless-mode)
  - [總覽](#overview)
  - [基本用法](#basic-usage)
    - [直接提示](#direct-prompts)
    - [標準輸入（stdin）輸入](#stdin-input)
    - [結合檔案輸入](#combining-with-file-input)
  - [輸出格式](#output-formats)
    - [文字輸出（預設）](#text-output-default)
    - [JSON 輸出](#json-output)
      - [回應結構（Response Schema）](#response-schema)
      - [範例用法](#example-usage)
    - [檔案重新導向](#file-redirection)
  - [設定選項](#configuration-options)
  - [範例](#examples)
    - [程式碼審查](#code-review)
    - [產生提交訊息](#generate-commit-messages)
    - [API 文件產生](#api-documentation)
    - [批次程式碼分析](#batch-code-analysis)
    - [程式碼審查](#code-review-1)
    - [日誌分析](#log-analysis)
    - [發行說明產生](#release-notes-generation)
    - [模型與工具使用追蹤](#model-and-tool-usage-tracking)
  - [資源](#resources)

## 總覽

無頭模式（Headless Mode）為 Gemini CLI 提供了一個無頭介面，具備以下特性：

- 可透過命令列參數或標準輸入（stdin）接收提示
- 回傳結構化輸出（文字或 JSON）
- 支援檔案重新導向與管線（piping）
- 啟用自動化與腳本化工作流程
- 提供一致的結束碼（exit code）以利錯誤處理

## 基本用法

### 直接提示

使用 `--prompt`（或 `-p`）旗標（flags）以無頭模式執行：

```bash
gemini --prompt "What is machine learning?"
```

### 標準輸入（Stdin Input）

從你的終端機將輸入資料透過管道傳送給 Gemini CLI：

```bash
echo "Explain this code" | gemini
```

### 結合檔案輸入

從檔案讀取並使用 Gemini 處理：

```bash
cat README.md | gemini --prompt "Summarize this documentation"
```

## 輸出格式

### 文字輸出（預設）

標準的人類可讀輸出：

```bash
gemini -p "What is the capital of France?"
```

回應格式：

```
The capital of France is Paris.
```

### JSON 輸出

回傳包含回應、統計資料與中繼資料的結構化資料。此格式非常適合程式化處理與自動化腳本使用。

#### 回應結構（Response Schema）

JSON 輸出遵循以下高階結構：

```json
{
  "response": "string", // The main AI-generated content answering your prompt
  "stats": {
    // Usage metrics and performance data
    "models": {
      // Per-model API and token usage statistics
      "[model-name]": {
        "api": {
          /* request counts, errors, latency */
        },
        "tokens": {
          /* prompt, response, cached, total counts */
        }
      }
    },
    "tools": {
      // Tool execution statistics
      "totalCalls": "number",
      "totalSuccess": "number",
      "totalFail": "number",
      "totalDurationMs": "number",
      "totalDecisions": {
        /* accept, reject, modify, auto_accept counts */
      },
      "byName": {
        /* per-tool detailed stats */
      }
    },
    "files": {
      // File modification statistics
      "totalLinesAdded": "number",
      "totalLinesRemoved": "number"
    }
  },
  "error": {
    // Present only when an error occurred
    "type": "string", // Error type (e.g., "ApiError", "AuthError")
    "message": "string", // Human-readable error description
    "code": "number" // Optional error code
  }
}
```

#### 範例用法

```bash
gemini -p "What is the capital of France?" --output-format json
```

Response:


<翻譯>


Response:


<譯文>
回應：

```json
{
  "response": "The capital of France is Paris.",
  "stats": {
    "models": {
      "gemini-2.5-pro": {
        "api": {
          "totalRequests": 2,
          "totalErrors": 0,
          "totalLatencyMs": 5053
        },
        "tokens": {
          "prompt": 24939,
          "candidates": 20,
          "total": 25113,
          "cached": 21263,
          "thoughts": 154,
          "tool": 0
        }
      },
      "gemini-2.5-flash": {
        "api": {
          "totalRequests": 1,
          "totalErrors": 0,
          "totalLatencyMs": 1879
        },
        "tokens": {
          "prompt": 8965,
          "candidates": 10,
          "total": 9033,
          "cached": 0,
          "thoughts": 30,
          "tool": 28
        }
      }
    },
    "tools": {
      "totalCalls": 1,
      "totalSuccess": 1,
      "totalFail": 0,
      "totalDurationMs": 1881,
      "totalDecisions": {
        "accept": 0,
        "reject": 0,
        "modify": 0,
        "auto_accept": 1
      },
      "byName": {
        "google_web_search": {
          "count": 1,
          "success": 1,
          "fail": 0,
          "durationMs": 1881,
          "decisions": {
            "accept": 0,
            "reject": 0,
            "modify": 0,
            "auto_accept": 1
          }
        }
      }
    },
    "files": {
      "totalLinesAdded": 0,
      "totalLinesRemoved": 0
    }
  }
}
```

### 檔案重新導向

將輸出儲存到檔案或透過管道傳送至其他指令：

```bash
# Save to file
gemini -p "Explain Docker" > docker-explanation.txt
gemini -p "Explain Docker" --output-format json > docker-explanation.json

# Append to file
gemini -p "Add more details" >> docker-explanation.txt

# Pipe to other tools
gemini -p "What is Kubernetes?" --output-format json | jq '.response'
gemini -p "Explain microservices" | wc -w
gemini -p "List programming languages" | grep -i "python"
```

## 設定選項

無頭（headless）模式下的主要命令列選項：

| 選項                  | 說明                        | 範例                                            |
| --------------------- | --------------------------- | ----------------------------------------------- |
| `--prompt`, `-p`        | 以無頭（headless）模式執行               | `gemini -p "query"`                                |
| `--output-format`       | 指定輸出格式（text、json） | `gemini -p "query" --output-format json`           |
| `--model`, `-m`         | 指定 Gemini 模型           | `gemini -p "query" -m gemini-2.5-flash`            |
| `--debug`, `-d`         | 啟用除錯模式                  | `gemini -p "query" --debug`                        |
| `--all-files`, `-a`     | 將所有檔案納入 context       | `gemini -p "query" --all-files`                    |
| `--include-directories` | 納入其他目錄     | `gemini -p "query" --include-directories src,docs` |
| `--yolo`, `-y`          | 自動核准所有動作           | `gemini -p "query" --yolo`                         |
| `--approval-mode`       | 設定核准模式                  | `gemini -p "query" --approval-mode auto_edit`      |

如需所有可用設定選項、設定檔與環境變數的完整說明，請參閱 [設定指南](./configuration.md)。

## 範例

#### 程式碼審查

```bash
cat src/auth.py | gemini -p "Review this authentication code for security issues" > security-review.txt
```

#### 產生提交訊息

```bash
result=$(git diff --cached | gemini -p "Write a concise commit message for these changes" --output-format json)
echo "$result" | jq -r '.response'
```

#### API 文件

```bash
result=$(cat api/routes.js | gemini -p "Generate OpenAPI spec for these routes" --output-format json)
echo "$result" | jq -r '.response' > openapi.json
```

#### 批次檔分析

```bash
for file in src/*.py; do
    echo "Analyzing $file..."
    result=$(cat "$file" | gemini -p "Find potential bugs and suggest improvements" --output-format json)
    echo "$result" | jq -r '.response' > "reports/$(basename "$file").analysis"
    echo "Completed analysis for $(basename "$file")" >> reports/progress.log
done
```

#### 程式碼審查

```bash
result=$(git diff origin/main...HEAD | gemini -p "Review these changes for bugs, security issues, and code quality" --output-format json)
echo "$result" | jq -r '.response' > pr-review.json
```

#### 日誌分析

```bash
grep "ERROR" /var/log/app.log | tail -20 | gemini -p "Analyze these errors and suggest root cause and fixes" > error-analysis.txt
```

#### 發行說明產生

```bash
result=$(git log --oneline v1.0.0..HEAD | gemini -p "Generate release notes from these commits" --output-format json)
response=$(echo "$result" | jq -r '.response')
echo "$response"
echo "$response" >> CHANGELOG.md
```

#### 模型與工具使用追蹤

```bash
result=$(gemini -p "Explain this database schema" --include-directories db --output-format json)
total_tokens=$(echo "$result" | jq -r '.stats.models // {} | to_entries | map(.value.tokens.total) | add // 0')
models_used=$(echo "$result" | jq -r '.stats.models // {} | keys | join(", ") | if . == "" then "none" else . end')
tool_calls=$(echo "$result" | jq -r '.stats.tools.totalCalls // 0')
tools_used=$(echo "$result" | jq -r '.stats.tools.byName // {} | keys | join(", ") | if . == "" then "none" else . end')
echo "$(date): $total_tokens tokens, $tool_calls tool calls ($tools_used) used with models: $models_used" >> usage.log
echo "$result" | jq -r '.response' > schema-docs.md
echo "Recent usage trends:"
tail -5 usage.log
```

## 資源

- [CLI 設定](./configuration.md) - 完整的設定指南
- [驗證](./authentication.md) - 設定驗證
- [指令](./commands.md) - 互動式指令參考
- [教學](./tutorials.md) - 步驟式自動化教學
