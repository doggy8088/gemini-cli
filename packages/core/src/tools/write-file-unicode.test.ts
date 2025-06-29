/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mocked,
} from 'vitest';
import { WriteFileTool } from './write-file.js';
import { ApprovalMode, Config } from '../config/config.js';
import { ToolRegistry } from './tool-registry.js';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { GeminiClient } from '../core/client.js';
import {
  ensureCorrectEdit,
  ensureCorrectFileContent,
  CorrectedEditResult,
  resetEditCorrectorCaches_TEST_ONLY,
} from '../utils/editCorrector.js';

const rootDir = path.resolve(os.tmpdir(), 'gemini-cli-test-unicode-root');

// --- MOCKS ---
vi.mock('../core/client.js');

let mockGeminiClientInstance: Mocked<GeminiClient>;

// Mock Config
const mockConfigInternal = {
  getTargetDir: () => rootDir,
  getApprovalMode: vi.fn(() => ApprovalMode.DEFAULT),
  setApprovalMode: vi.fn(),
  getGeminiClient: vi.fn(),
  getApiKey: () => 'test-key',
  getModel: () => 'test-model',
  getSandbox: () => false,
  getDebugMode: () => false,
  getQuestion: () => undefined,
  getFullContext: () => false,
  getToolDiscoveryCommand: () => undefined,
  getToolCallCommand: () => undefined,
  getMcpServerCommand: () => undefined,
  getMcpServers: () => undefined,
  getUserAgent: () => 'test-agent',
  getUserMemory: () => '',
  setUserMemory: vi.fn(),
  getGeminiMdFileCount: () => 0,
  setGeminiMdFileCount: vi.fn(),
  getToolRegistry: () =>
    ({
      registerTool: vi.fn(),
      discoverTools: vi.fn(),
    }) as unknown as ToolRegistry,
};
const mockConfig = mockConfigInternal as unknown as Config;

describe('WriteFileTool Unicode Corruption Fix', () => {
  let tool: WriteFileTool;

  beforeEach(() => {
    // Ensure the rootDir for the tool exists
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir, { recursive: true });
    }

    // Setup GeminiClient mock
    mockGeminiClientInstance = new (vi.mocked(GeminiClient))(
      mockConfig,
    ) as Mocked<GeminiClient>;
    vi.mocked(GeminiClient).mockImplementation(() => mockGeminiClientInstance);

    mockConfigInternal.getGeminiClient.mockReturnValue(
      mockGeminiClientInstance,
    );

    tool = new WriteFileTool(mockConfig);

    // Reset mocks before each test
    mockConfigInternal.getApprovalMode.mockReturnValue(ApprovalMode.AUTO_EDIT);
    mockConfigInternal.setApprovalMode.mockClear();
    
    resetEditCorrectorCaches_TEST_ONLY();
  });

  afterEach(() => {
    // Clean up the temporary directory
    if (fs.existsSync(rootDir)) {
      fs.rmSync(rootDir, { recursive: true, force: true });
    }
    vi.clearAllMocks();
  });

  it('should correctly handle the exact Chinese text from the bug report', async () => {
    const filePath = path.join(rootDir, 'index.md');
    
    // This is the exact content from the bug report that was getting corrupted
    const chineseContent = `# 歡迎使用 Gemini CLI 使用手冊

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

    const params = {
      file_path: filePath,
      content: chineseContent,
    };

    const abortSignal = new AbortController().signal;
    const result = await tool.execute(params, abortSignal);

    // Verify the operation was successful
    expect(result.llmContent).toMatch(/Successfully created and wrote to new file/);
    
    // Verify the file was actually written
    expect(fs.existsSync(filePath)).toBe(true);
    
    // Most importantly: verify no Unicode replacement characters were introduced
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    expect(writtenContent).not.toContain('�'); // No Unicode replacement characters
    expect(writtenContent).not.toContain('\uFFFD'); // No Unicode replacement characters (explicit check)
    
    // Verify the specific character that was being corrupted is preserved correctly
    expect(writtenContent).toContain('檢查點功能的說明文件'); // The problematic line should be intact
    expect(writtenContent).toContain('明'); // The specific character that was being corrupted
    
    // Verify the complete content matches what was intended
    expect(writtenContent).toBe(chineseContent);
  });

  it('should handle Unicode content with escape sequences correctly', async () => {
    const filePath = path.join(rootDir, 'unicode-test.md');
    
    // Test content with both Unicode characters and escape sequences
    const contentWithEscapes = '測試\\n中文\\t內容\\n歡迎使用 CLI';
    const expectedContent = '測試\n中文\t內容\n歡迎使用 CLI';

    const params = {
      file_path: filePath,
      content: contentWithEscapes,
    };

    const abortSignal = new AbortController().signal;
    const result = await tool.execute(params, abortSignal);

    // Verify the operation was successful
    expect(result.llmContent).toMatch(/Successfully created and wrote to new file/);
    
    // Verify the file content is correctly unescaped without corruption
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    expect(writtenContent).toBe(expectedContent);
    expect(writtenContent).not.toContain('�'); // No Unicode replacement characters
    expect(writtenContent).toContain('歡迎'); // Unicode characters preserved
  });

  it('should maintain UTF-8 byte integrity throughout the process', async () => {
    const filePath = path.join(rootDir, 'utf8-test.txt');
    
    // Test various Unicode characters from different ranges
    const unicodeContent = `
English: Hello World
Chinese: 你好世界  
Japanese: こんにちは
Korean: 안녕하세요
Emoji: 🌟✨🚀
Mathematical: ∑∫∆√
Arrows: →←↑↓
Special: ™©®℠
    `.trim();

    const params = {
      file_path: filePath,
      content: unicodeContent,
    };

    const abortSignal = new AbortController().signal;
    const result = await tool.execute(params, abortSignal);

    // Verify the operation was successful
    expect(result.llmContent).toMatch(/Successfully created and wrote to new file/);
    
    // Read the file and verify byte-for-byte accuracy
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    const writtenBuffer = fs.readFileSync(filePath);
    const originalBuffer = Buffer.from(unicodeContent, 'utf8');
    
    // Verify content matches exactly
    expect(writtenContent).toBe(unicodeContent);
    
    // Verify UTF-8 byte sequences are preserved
    expect(Buffer.compare(writtenBuffer, originalBuffer)).toBe(0);
    
    // Verify no corruption
    expect(writtenContent).not.toContain('�');
    expect(writtenContent).not.toContain('\uFFFD');
  });
});