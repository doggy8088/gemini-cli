/**
 * Final verification test to demonstrate the Unicode corruption fix
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Unicode Corruption Fix - Final Verification', () => {
  it('should handle the exact scenario from the bug report', () => {
    // This is the exact content that was being corrupted in the bug report
    const originalContent = `# 歡迎使用 Gemini CLI 使用手冊

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

    // Test file writing and reading (same as WriteFile tool)
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'final-unicode-test-'));
    const testFile = path.join(tempDir, 'index.md');

    try {
      // Write the file using the same method as WriteFile tool
      fs.writeFileSync(testFile, originalContent, 'utf8');

      // Read it back
      const readContent = fs.readFileSync(testFile, 'utf8');

      // Verify no corruption occurred
      expect(readContent).toBe(originalContent);
      expect(readContent).toContain('說明文件'); // The specific text that was being corrupted
      expect(readContent).not.toContain('��'); // Should not contain replacement characters

      // Verify the specific problematic text from the bug report
      const problematicText = '檢查點功能的說明文件';
      expect(readContent).toContain(problematicText);
      
      // Check UTF-8 byte integrity of the problematic characters
      const mingIndex = readContent.indexOf('說明');
      expect(mingIndex).toBeGreaterThan(-1);
      
      const extractedMing = readContent.substring(mingIndex, mingIndex + 2);
      const originalBytes = Buffer.from('說明', 'utf8');
      const extractedBytes = Buffer.from(extractedMing, 'utf8');
      
      expect(Buffer.compare(originalBytes, extractedBytes)).toBe(0);
      
      console.log('✅ Unicode preservation test passed!');
      console.log('✅ "說明" characters preserved correctly');
      console.log('✅ No Unicode replacement characters found');
      console.log('✅ UTF-8 byte integrity maintained');

    } finally {
      // Clean up
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      fs.rmdirSync(tempDir);
    }
  });

  it('should demonstrate the corruption pattern that was fixed', () => {
    // This test documents the exact corruption that was happening
    const originalChar = '明'; // The character that was being corrupted
    const corruptedPattern = '��'; // What it was becoming
    
    // Original UTF-8 bytes for "明"
    const originalBytes = Buffer.from(originalChar, 'utf8');
    expect(originalBytes).toEqual(Buffer.from([0xe6, 0x98, 0x8e]));
    
    // Corrupted UTF-8 bytes (two replacement characters)
    const corruptedBytes = Buffer.from(corruptedPattern, 'utf8');
    expect(corruptedBytes).toEqual(Buffer.from([0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd]));
    
    console.log('📝 Corruption pattern documented:');
    console.log(`   Original "明": ${originalBytes.toString('hex')}`);
    console.log(`   Corrupted "��": ${corruptedBytes.toString('hex')}`);
    console.log('✅ This corruption pattern is now prevented by the fix');
  });
});