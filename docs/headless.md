# Headless 模式

Headless 模式允許你以程式化方式，透過命令列腳本 (scripts) 和自動化工具執行 Gemini CLI，而無需任何互動式 UI。這非常適合腳本自動化、持續整合/持續部署 (CI/CD) 流程，以及打造 AI 驅動的工具。

- [Headless 模式](#headless-模式)
  - [總覽](#總覽)
  - [基本用法](#基本用法)
    - [直接提示](#直接提示)
    - [Stdin 輸入](#標準輸入stdin-input)
    - [結合檔案輸入](#結合檔案輸入)
  - [輸出格式](#輸出格式)
    - [文字輸出（預設）](#文字輸出預設)
    - [JSON 輸出](#json-輸出)
      - [回應結構](#回應結構response-schema)
      - [範例用法](#範例用法)
    - [檔案重新導向](#檔案重新導向)
  - [設定選項](#設定選項)
  - [範例](#範例)
    - [程式碼審查](#程式碼審查)
    - [產生提交訊息](#產生提交訊息)
    - [API 文件](#api-文件)
    - [批次程式碼分析](#批次程式碼分析)
    - [程式碼審查](#程式碼審查-1)
    - [日誌分析](#日誌分析)
    - [發行說明產生](#發佈說明產生器)
    - [模型與工具使用追蹤](#模型與工具使用追蹤)
  - [資源](#資源)

## 總覽

Headless 模式為 Gemini CLI 提供一個無頭介面，具備以下特性：

- 可透過命令列參數或 stdin 傳遞提示 (prompt)
- 回傳結構化輸出（文字或 JSON）
- 支援檔案重新導向與管線 (piping)
- 啟用自動化與腳本化工作流程
- 提供一致的結束碼以利錯誤處理

## 基本用法

### 直接提示

使用 `--prompt`（或 `-p`）旗標 (flags) 以 Headless 模式執行：

```bash
gemini --prompt "What is machine learning?"
```

### 標準輸入（Stdin Input）

從你的終端機將輸入資料透過管道傳送給 Gemini CLI：

```bash
echo "Explain this code" | gemini
```

### 結合檔案輸入

從檔案讀取並使用 Gemini 進行處理：

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

回傳結構化資料，包括回應、統計資訊與中繼資料。這種格式非常適合程式化處理與自動化腳本（automation scripts）。

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

將輸出儲存到檔案或導入其他指令：

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

無頭（headless）模式下的主要命令列選項如下：

| 選項                    | 說明                                | 範例                                              |
| ----------------------- | ----------------------------------- | ------------------------------------------------- |
| `--prompt`, `-p`        | 以無頭（headless）模式執行              | `gemini -p "query"`                                |
| `--output-format`       | 指定輸出格式（text、json）               | `gemini -p "query" --output-format json`           |
| `--model`, `-m`         | 指定 Gemini 模型                      | `gemini -p "query" -m gemini-2.5-flash`            |
| `--debug`, `-d`         | 啟用除錯模式（debug mode）             | `gemini -p "query" --debug`                        |
| `--all-files`, `-a`     | 將所有檔案納入 context                | `gemini -p "query" --all-files`                    |
| `--include-directories` | 納入額外目錄                             | `gemini -p "query" --include-directories src,docs` |
| `--yolo`, `-y`          | 自動核准所有操作                       | `gemini -p "query" --yolo`                         |
| `--approval-mode`       | 設定核准模式                            | `gemini -p "query" --approval-mode auto_edit`      |

如需所有可用設定選項、設定檔案與環境變數的完整說明，請參閱[設定指南](./configuration.md)。

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

品質分析：  
「批次程式碼分析」雖然直譯了原文，但「batch code」在此應指「一批程式碼」或「批次處理的程式碼」的分析，而非「批次程式碼」這個詞組本身。中文語境下，「批次」常用於「批次處理」或「批量」，而非直接修飾「程式碼」。此外，標題語氣可更簡潔自然。

改進建議：  
可譯為「批次程式碼分析」或「批量程式碼分析」，但若語境指的是「批次處理的程式碼」的分析，則可譯為「批次處理程式碼分析」。若是指「一批程式碼」的分析，則可譯為「批量程式碼分析」。根據常見用法，「批次程式碼分析」較為通順，但可視語境微調。

改進後的翻譯：

#### 批次程式碼分析

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

改進後的翻譯：

#### 發佈說明產生器

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

- [CLI Configuration](./configuration.md) - 完整設定指南
- [Authentication](./authentication.md) - 設定驗證
- [Commands](./commands.md) - 互動式指令參考
- [Tutorials](./tutorials.md) - 步驟式自動化教學
