#!/usr/bin/env node

// Test for edge cases that might trigger LLM correction with Chinese content

import fs from 'fs';

function unescapeStringForGeminiBug(inputString) {
  return inputString.replace(
    /\\+(n|t|r|'|"|`|\\|\n)/g,
    (match, capturedChar) => {
      console.log(`Regex matched: "${match}" with captured: "${capturedChar}"`);
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

console.log('=== Testing for edge cases that might trigger correction ===');

// The exact content from the bug report
const bugContent = `# 歡迎使用 Gemini CLI 使用手冊

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

console.log('Testing bug content...');
const unescaped = unescapeStringForGeminiBug(bugContent);
const triggersCorrection = unescaped !== bugContent;

console.log('Original length:', bugContent.length);
console.log('Unescaped length:', unescaped.length);
console.log('Triggers correction:', triggersCorrection);

if (triggersCorrection) {
  console.log('\n*** FOUND THE TRIGGER! ***');
  console.log('Original and unescaped are different!');
  
  // Find the differences
  for (let i = 0; i < Math.max(bugContent.length, unescaped.length); i++) {
    if (bugContent[i] !== unescaped[i]) {
      console.log(`Difference at position ${i}:`);
      console.log(`  Original: "${bugContent[i]}" (${bugContent.charCodeAt(i)})`);
      console.log(`  Unescaped: "${unescaped[i]}" (${unescaped.charCodeAt(i)})`);
      console.log(`  Context: "${bugContent.substring(Math.max(0, i-10), i+10)}"`);
      break;
    }
  }
} else {
  console.log('Content does NOT trigger correction logic');
}

// Let's also test what happens if the LLM produces content with escape sequences
console.log('\n=== Testing LLM-generated content with escapes ===');

// Simulate what might happen if LLM generates content with literal \n, \t etc
const llmGenerated1 = '檢查點功能的說明文件\\n新行';
const llmGenerated2 = 'console.log(\\"Hello\\")';
const llmGenerated3 = '**[檢查點](./checkpointing.md)：** 檢查點功能的說明文件。\\nEnd';

[llmGenerated1, llmGenerated2, llmGenerated3].forEach((content, index) => {
  console.log(`\nLLM test ${index + 1}: "${content}"`);
  const unescaped = unescapeStringForGeminiBug(content);
  const triggers = unescaped !== content;
  console.log(`  Triggers correction: ${triggers}`);
  if (triggers) {
    console.log(`  Original: ${JSON.stringify(content)}`);
    console.log(`  Unescaped: ${JSON.stringify(unescaped)}`);
  }
});

// Test a potential edge case with the specific corrupted line
const specificLine = '  - **[檢查點](./checkpointing.md)：** 檢查點功能的說明文件。';
console.log(`\n=== Testing specific problematic line ===`);
console.log('Line:', specificLine);

const unescapedLine = unescapeStringForGeminiBug(specificLine);
const lineTriggersCorrection = unescapedLine !== specificLine;
console.log('Line triggers correction:', lineTriggersCorrection);

if (lineTriggersCorrection) {
  console.log('*** FOUND LINE-LEVEL TRIGGER ***');
  console.log('Original:', JSON.stringify(specificLine));
  console.log('Unescaped:', JSON.stringify(unescapedLine));
}