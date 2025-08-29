# Shell 工具 (`run_shell_command`)

本文件描述 Gemini CLI 的 `run_shell_command` 工具。

## 描述

使用 `run_shell_command` 與底層系統互動、執行腳本或執行命令列操作。`run_shell_command` 執行給定的 Shell 指令。在 Windows 上，指令將使用 `cmd.exe /c` 執行。在其他平台上，指令將使用 `bash -c` 執行。

### 引數

`run_shell_command` 接受以下引數：

- `command`（string，必要）：要執行的確切 Shell 指令。
- `description`（string，選用）：指令用途的簡短描述，將顯示給使用者。
- `directory`（string，選用）：執行指令的目錄（相對於專案根目錄）。如果未提供，指令會在專案根目錄中執行。

## 如何在 Gemini CLI 中使用 `run_shell_command`

使用 `run_shell_command` 時，指令會作為子程序執行。`run_shell_command` 可以使用 `&` 啟動背景程序。此工具回傳執行的詳細資訊，包括：

- `Command`：已執行的指令。
- `Directory`：執行指令的目錄。
- `Stdout`：標準輸出串流的輸出。
- `Stderr`：標準錯誤串流的輸出。
- `Error`：子程序回報的任何錯誤訊息。
- `Exit Code`：指令的退出代碼。
- `Signal`：如果指令被信號終止的信號編號。
- `Background PIDs`：任何已啟動背景程序的 PID 清單。

使用方式：

```
run_shell_command(command="Your commands.", description="Your description of the command.", directory="Your execution directory.")
```

## `run_shell_command` examples

List files in the current directory:

```
run_shell_command(command="ls -la")
```

Run a script in a specific directory:

```
run_shell_command(command="./my_script.sh", directory="scripts", description="Run my custom script")
```

Start a background server:

```
run_shell_command(command="npm run dev &", description="Start development server in background")
```

## Important notes

- **Security:** Be cautious when executing commands, especially those constructed from user input, to prevent security vulnerabilities.
- **Interactive commands:** Avoid commands that require interactive user input, as this can cause the tool to hang. Use non-interactive flags if available (e.g., `npm init -y`).
- **Error handling:** Check the `Stderr`, `Error`, and `Exit Code` fields to determine if a command executed successfully.
- **Background processes:** When a command is run in the background with `&`, the tool will return immediately and the process will continue to run in the background. The `Background PIDs` field will contain the process ID of the background process.

## Environment Variables

When `run_shell_command` executes a command, it sets the `GEMINI_CLI=1` environment variable in the subprocess's environment. This allows scripts or tools to detect if they are being run from within the Gemini CLI.

## Command Restrictions

You can restrict the commands that can be executed by the `run_shell_command` tool by using the `tools.core` and `tools.exclude` settings in your configuration file.

- `tools.core`: To restrict `run_shell_command` to a specific set of commands, add entries to the `core` list under the `tools` category in the format `run_shell_command(<command>)`. For example, `"tools": {"core": ["run_shell_command(git)"]}` will only allow `git` commands. Including the generic `run_shell_command` acts as a wildcard, allowing any command not explicitly blocked.
- `tools.exclude`: To block specific commands, add entries to the `exclude` list under the `tools` category in the format `run_shell_command(<command>)`. For example, `"tools": {"exclude": ["run_shell_command(rm)"]}` will block `rm` commands.

The validation logic is designed to be secure and flexible:

1.  **Command Chaining Disabled**: The tool automatically splits commands chained with `&&`, `||`, or `;` and validates each part separately. If any part of the chain is disallowed, the entire command is blocked.
2.  **Prefix Matching**: The tool uses prefix matching. For example, if you allow `git`, you can run `git status` or `git log`.
3.  **Blocklist Precedence**: The `tools.exclude` list is always checked first. If a command matches a blocked prefix, it will be denied, even if it also matches an allowed prefix in `tools.core`.

### Command Restriction Examples

**Allow only specific command prefixes**

To allow only `git` and `npm` commands, and block all others:

```json
{
  "tools": {
    "core": ["run_shell_command(git)", "run_shell_command(npm)"]
  }
}
```

- `git status`: Allowed
- `npm install`: Allowed
- `ls -l`: Blocked

**Block specific command prefixes**

To block `rm` and allow all other commands:

```json
{
  "tools": {
    "core": ["run_shell_command"],
    "exclude": ["run_shell_command(rm)"]
  }
}
```

- `rm -rf /`: Blocked
- `git status`: Allowed
- `npm install`: Allowed

**Blocklist takes precedence**

If a command prefix is in both `tools.core` and `tools.exclude`, it will be blocked.

```json
{
  "tools": {
    "core": ["run_shell_command(git)"],
    "exclude": ["run_shell_command(git push)"]
  }
}
```

- `git push origin main`: Blocked
- `git status`: Allowed

**Block all shell commands**

To block all shell commands, add the `run_shell_command` wildcard to `tools.exclude`:

```json
{
  "tools": {
    "exclude": ["run_shell_command"]
  }
}
```

- `ls -l`: Blocked
- `any other command`: Blocked

## Security Note for `excludeTools`

Command-specific restrictions in `excludeTools` for `run_shell_command` are based on simple string matching and can be easily bypassed. This feature is **not a security mechanism** and should not be relied upon to safely execute untrusted code. It is recommended to use `coreTools` to explicitly select commands
that can be executed.
