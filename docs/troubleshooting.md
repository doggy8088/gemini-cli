# 疑難排解指南

本指南提供常見問題的解決方案和偵錯技巧，包括以下主題：

- 驗證或登入錯誤
- 常見問題 (FAQ)
- 偵錯技巧
- 與您的問題類似的現有 GitHub 問題或建立新問題

## 驗證或登入錯誤

- **錯誤：`Failed to login. Message: Request contains an invalid argument`**
  - 擁有 Google Workspace 帳戶或與其 Gmail 帳戶相關聯的 Google Cloud 帳戶的使用者可能無法啟用 Google Code Assist 計畫的免費層級。
  - 對於 Google Cloud 帳戶，您可以透過將 `GOOGLE_CLOUD_PROJECT` 設定為您的專案 ID 來解決此問題。
  - 或者，您可以從 [Google AI Studio](http://aistudio.google.com/app/apikey) 取得 Gemini API 金鑰，它也包含單獨的免費層級。

- **錯誤：`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 或 `unable to get local issuer certificate`**
  - **原因**：您可能位於使用防火牆攔截和檢查 SSL/TLS 流量的企業網路上。這通常需要 Node.js 信任自訂根 CA 憑證。
  - **解決方案**：將 `NODE_EXTRA_CA_CERTS` 環境變數設定為您企業根 CA 憑證檔案的絕對路徑。
    - 範例：`export NODE_EXTRA_CA_CERTS=/path/to/your/corporate-ca.crt`

## 常見問題 (FAQ)

- **問：如何將 Gemini CLI 更新到最新版本？**
  - 答：如果您透過 `npm` 全域安裝，請使用指令 `npm install -g @google/gemini-cli@latest` 更新。如果您從原始碼編譯，請從儲存庫提取最新變更，然後使用指令 `npm run build` 重新建置。

- **問：Gemini CLI 設定或設定檔案儲存在哪裡？**
  - 答：Gemini CLI 設定儲存在兩個 `settings.json` 檔案中：
    1. 在您的主目錄：`~/.gemini/settings.json`。
    2. 在您專案的根目錄：`./.gemini/settings.json`。

    請參閱 [Gemini CLI 設定](./cli/configuration.md) 以取得更多詳細資訊。

- **問：為什麼我在統計輸出中看不到快取的權杖計數？**
  - 答：只有在使用快取權杖時才會顯示快取權杖資訊。此功能適用於 API 金鑰使用者（Gemini API 金鑰或 Google Cloud Vertex AI），但不適用於 OAuth 使用者（例如 Google 個人/企業帳戶，如 Google Gmail 或 Google Workspace）。這是因為 Gemini Code Assist API 不支援快取內容建立。您仍然可以使用 Gemini CLI 中的 `/stats` 指令查看您的總權杖使用量。

## Common error messages and solutions

- **Error: `EADDRINUSE` (Address already in use) when starting an MCP server.**
  - **Cause:** Another process is already using the port that the MCP server is trying to bind to.
  - **Solution:**
    Either stop the other process that is using the port or configure the MCP server to use a different port.

- **Error: Command not found (when attempting to run Gemini CLI with `gemini`).**
  - **Cause:** Gemini CLI is not correctly installed or it is not in your system's `PATH`.
  - **Solution:**
    The update depends on how you installed Gemini CLI:
    - If you installed `gemini` globally, check that your `npm` global binary directory is in your `PATH`. You can update Gemini CLI using the command `npm install -g @google/gemini-cli@latest`.
    - If you are running `gemini` from source, ensure you are using the correct command to invoke it (e.g., `node packages/cli/dist/index.js ...`). To update Gemini CLI, pull the latest changes from the repository, and then rebuild using the command `npm run build`.

- **Error: `MODULE_NOT_FOUND` or import errors.**
  - **Cause:** Dependencies are not installed correctly, or the project hasn't been built.
  - **Solution:**
    1.  Run `npm install` to ensure all dependencies are present.
    2.  Run `npm run build` to compile the project.
    3.  Verify that the build completed successfully with `npm run start`.

- **Error: "Operation not permitted", "Permission denied", or similar.**
  - **Cause:** When sandboxing is enabled, Gemini CLI may attempt operations that are restricted by your sandbox configuration, such as writing outside the project directory or system temp directory.
  - **Solution:** Refer to the [Configuration: Sandboxing](./cli/configuration.md#sandboxing) documentation for more information, including how to customize your sandbox configuration.

- **Gemini CLI is not running in interactive mode in "CI" environments**
  - **Issue:** The Gemini CLI does not enter interactive mode (no prompt appears) if an environment variable starting with `CI_` (e.g., `CI_TOKEN`) is set. This is because the `is-in-ci` package, used by the underlying UI framework, detects these variables and assumes a non-interactive CI environment.
  - **Cause:** The `is-in-ci` package checks for the presence of `CI`, `CONTINUOUS_INTEGRATION`, or any environment variable with a `CI_` prefix. When any of these are found, it signals that the environment is non-interactive, which prevents the Gemini CLI from starting in its interactive mode.
  - **Solution:** If the `CI_` prefixed variable is not needed for the CLI to function, you can temporarily unset it for the command. e.g., `env -u CI_TOKEN gemini`

- **DEBUG mode not working from project .env file**
  - **Issue:** Setting `DEBUG=true` in a project's `.env` file doesn't enable debug mode for gemini-cli.
  - **Cause:** The `DEBUG` and `DEBUG_MODE` variables are automatically excluded from project `.env` files to prevent interference with gemini-cli behavior.
  - **Solution:** Use a `.gemini/.env` file instead, or configure the `advanced.excludedEnvVars` setting in your `settings.json` to exclude fewer variables.

## Exit Codes

The Gemini CLI uses specific exit codes to indicate the reason for termination. This is especially useful for scripting and automation.

| Exit Code | Error Type                 | Description                                                                                         |
| --------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| 41        | `FatalAuthenticationError` | An error occurred during the authentication process.                                                |
| 42        | `FatalInputError`          | Invalid or missing input was provided to the CLI. (non-interactive mode only)                       |
| 44        | `FatalSandboxError`        | An error occurred with the sandboxing environment (e.g., Docker, Podman, or Seatbelt).              |
| 52        | `FatalConfigError`         | A configuration file (`settings.json`) is invalid or contains errors.                               |
| 53        | `FatalTurnLimitedError`    | The maximum number of conversational turns for the session was reached. (non-interactive mode only) |

## Debugging Tips

- **CLI debugging:**
  - Use the `--verbose` flag (if available) with CLI commands for more detailed output.
  - Check the CLI logs, often found in a user-specific configuration or cache directory.

- **Core debugging:**
  - Check the server console output for error messages or stack traces.
  - Increase log verbosity if configurable.
  - Use Node.js debugging tools (e.g., `node --inspect`) if you need to step through server-side code.

- **Tool issues:**
  - If a specific tool is failing, try to isolate the issue by running the simplest possible version of the command or operation the tool performs.
  - For `run_shell_command`, check that the command works directly in your shell first.
  - For _file system tools_, verify that paths are correct and check the permissions.

- **Pre-flight checks:**
  - Always run `npm run preflight` before committing code. This can catch many common issues related to formatting, linting, and type errors.

## Existing GitHub Issues similar to yours or creating new Issues

If you encounter an issue that was not covered here in this _Troubleshooting guide_, consider searching the Gemini CLI [Issue tracker on GitHub](https://github.com/google-gemini/gemini-cli/issues). If you can't find an issue similar to yours, consider creating a new GitHub Issue with a detailed description. Pull requests are also welcome!
