#!/usr/bin/env node

// Trace the exact flow that happens in the WriteFile corruption case

import fs from 'fs';

// Copy functions to trace the exact flow
function unescapeStringForGeminiBug(inputString) {
  return inputString.replace(
    /\\+(n|t|r|'|"|`|\\|\n)/g,
    (match, capturedChar) => {
      switch (capturedChar) {
        case 'n': return '\n';
        case 't': return '\t';
        case 'r': return '\r';
        case "'": return "'";
        case '"': return '"';
        case '`': return '`';
        case '\\': return '\\';
        case '\n': return '\n';
        default: return match;
      }
    },
  );
}

// Simulate the bug scenario from the issue
console.log('=== Simulating the WriteFile bug scenario ===');

// This is the content that the LLM generated and wants to save  
const proposedContent = `# 歡迎使用 Gemini CLI 使用手冊

本手冊提供安裝、使用與開發 Gemini CLI 的完整指南。此工具可讓您透過指令列介面與 Gemini 模型互動。

## 總覽

Gemini CLI 將 Gemini 模型的功能帶到您的終端機，並提供互動式的「讀取-求值-輸出」循環 (REPL) 環境。Gemini CLI 包含一個用戶端應用程式 (\`packages/cli\`)，它會與本機伺服器 (\`packages/core\`) 通訊，而後者負責管理對 Gemini API 及其 AI 模型的請求。Gemini CLI 還包含各種工具，可用於執行檔案系統操作、運行 shell 和擷取網頁等任務，這些工具由 \`packages/core\` 管理。

## 導覽本手冊

本手冊分為以下幾個部分：

- **[執行與部署](./deployment.md)：** 執行 Gemini CLI 的相關資訊。
- **[架構總覽](./architecture.md)：** 了解 Gemini CLI 的高階設計，包含其元件以及它們之間的互動方式。
- **CLI 用法：** \`packages/cli\` 的說明文件。
  - **[CLI 簡介](./cli/index.md)：** 指令列介面總覽。
  - **[指令](./cli/commands.md)：** 可用 CLI 指令的說明。
  - **[設定](./cli/configuration.md)：** 設定 CLI 的相關資訊。
  - **[檢查點](./checkpointing.md)：** 檢查點功能的說明文件。
  - **[擴充功能](./extension.md)：** 如何透過新功能擴充 CLI。
  - **[遙測](./telemetry.md)：** CLI 中的遙測總覽。
- **核心詳細資訊：** \`packages/core\` 的說明文件。
  - **[核心簡介](./core/index.md)：** 核心元件總覽。
  - **[工具 API](./core/tools-api.md)：** 關於核心如何管理及公開工具的資訊。
- **工具：**
  - **[工具總覽](./tools/index.md)：** 可用工具總覽。
  - **[檔案系統工具](./tools/file-system.md)：** \`read_file\` 和 \`write_file\` 工具的說明文件。
  - **[多檔案讀取工具](./tools/multi-file.md)：** \`read_many_files\` 工具的說明文件。
  - **[Shell 工具](./tools/shell.md)：** \`run_shell_command\` 工具的說明文件。
  - **[網頁擷取工具](./tools/web-fetch.md)：** \`web_fetch\` 工具的說明文件。
  - **[網頁搜尋工具](./tools/web-search.md)：** \`google_web_search\` 工具的說明文件。
  - **[記憶工具](./tools/memory.md)：** \`save_memory\` 工具的說明文件。
- **[貢獻與開發指南](../CONTRIBUTING.md)：** 提供給貢獻者與開發者的資訊，包含設定、建置、測試與程式碼慣例。
- **[疑難排解指南](./troubleshooting.md)：** 尋找常見問題的解決方案與常見問答。
- **[服務條款與隱私權聲明](./tos-privacy.md)：** 適用於您使用 Gemini CLI 的服務條款與隱私權聲明資訊。

我們希望本手冊能幫助您充分利用 Gemini CLI！`;

// Step 1: Check if file exists (in the bug case, it's a new file)
const filePath = '/tmp/index.md';
const fileExists = fs.existsSync(filePath);
console.log('File exists:', fileExists);

// Step 2: Since it's a new file, it goes through ensureCorrectFileContent
console.log('\n=== ensureCorrectFileContent flow ===');
const contentPotentiallyEscaped = unescapeStringForGeminiBug(proposedContent) !== proposedContent;
console.log('Content potentially escaped:', contentPotentiallyEscaped);

if (contentPotentiallyEscaped) {
  console.log('*** WOULD CALL correctStringEscaping() LLM function ***');
  console.log('This could corrupt the content!');
} else {
  console.log('Content would be returned unchanged');
}

// Step 3: Let's also check what would happen if there WAS an existing file  
console.log('\n=== What if file existed (ensureCorrectEdit flow) ===');

// Simulate empty existing file scenario
const existingContent = '';
const editParams = {
  old_string: existingContent,
  new_string: proposedContent,
  file_path: filePath,
};

const newStringPotentiallyEscaped = unescapeStringForGeminiBug(editParams.new_string) !== editParams.new_string;
console.log('New string potentially escaped:', newStringPotentiallyEscaped);

if (newStringPotentiallyEscaped) {
  console.log('*** WOULD CALL correctNewStringEscaping() LLM function ***');
  console.log('This could corrupt the content!');
} else {
  console.log('New string would be used unchanged');
}

// Step 4: Check for any character sequences that might trigger issues
console.log('\n=== Checking for problematic character sequences ===');

// Look for any patterns that might confuse the regex or LLM
const problematicPattern = /\\+(n|t|r|'|"|`|\\|\n)/g;
const matches = [...proposedContent.matchAll(problematicPattern)];
console.log('Regex matches found:', matches.length);

matches.forEach((match, index) => {
  console.log(`Match ${index + 1}:`, {
    match: match[0],
    captured: match[1], 
    position: match.index,
    context: proposedContent.substring(Math.max(0, match.index - 10), match.index + 10)
  });
});

// Check for specific sequences that might cause issues
const potentialProblems = [
  '\\n', '\\t', '\\r', "\\'", '\\"', '\\`', '\\\\'
];

potentialProblems.forEach(pattern => {
  if (proposedContent.includes(pattern)) {
    console.log(`Found potentially problematic pattern: "${pattern}"`);
  }
});

console.log('\n=== Summary ===');
console.log('Based on analysis:');
console.log('1. Content potentially escaped (new file):', contentPotentiallyEscaped);
console.log('2. New string potentially escaped (existing file):', newStringPotentiallyEscaped);
console.log('3. Number of escape-like patterns:', matches.length);

if (!contentPotentiallyEscaped && !newStringPotentiallyEscaped && matches.length === 0) {
  console.log('*** This content should NOT trigger LLM correction! ***');
  console.log('The corruption must be happening elsewhere or due to other conditions.');
} else {
  console.log('*** This content WOULD trigger LLM correction ***');
  console.log('This explains where the corruption could come from.');
}