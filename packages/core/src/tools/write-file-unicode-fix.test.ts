/**
 * Test to verify the Unicode corruption fix
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WriteFileTool } from './write-file.js';
import { Config, ApprovalMode } from '../config/config.js';
import { GeminiClient } from '../core/client.js';
import { ToolRegistry } from './tool-registry.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Import the real correction functions to test the fix
import { 
  ensureCorrectFileContent,
  ensureCorrectEdit,
} from '../utils/editCorrector.js';

describe('WriteFileTool Unicode Corruption Fix', () => {
  let tool: WriteFileTool;
  let mockConfig: Config;
  let mockGeminiClient: any;
  let testDir: string;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unicode-fix-test-'));

    // Mock GeminiClient with corrupted responses to test the fix
    mockGeminiClient = {
      generateJson: vi.fn(),
    };

    // Mock Config
    mockConfig = {
      getTargetDir: () => testDir,
      getApprovalMode: () => ApprovalMode.AUTO_EDIT,
      setApprovalMode: vi.fn(),
      getGeminiClient: () => mockGeminiClient,
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
      getToolRegistry: () => new ToolRegistry(mockConfig),
      getAlwaysSkipModificationConfirmation: () => true,
      setAlwaysSkipModificationConfirmation: vi.fn(),
    } as unknown as Config;

    tool = new WriteFileTool(mockConfig);
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    vi.resetAllMocks();
  });

  it('should prevent LLM corruption by using simple unescape for Unicode content', async () => {
    const chineseContent = '檢查點功能的說明文件\\n新行'; // Has \n escape that triggers correction
    const expectedContent = '檢查點功能的說明文件\n新行'; // Should be unescaped to this

    // Mock LLM to return corrupted content (simulating the bug)
    mockGeminiClient.generateJson.mockResolvedValue({
      corrected_string_escaping: '檢查點功能的說��文件\n新行' // Corrupted response
    });

    const abortSignal = new AbortController().signal;
    
    // Test the correction function directly
    const result = await ensureCorrectFileContent(
      chineseContent,
      mockGeminiClient,
      abortSignal
    );

    // With the fix, it should use simple unescaping instead of LLM and avoid corruption
    expect(result).toBe(expectedContent);
    expect(result).toContain('說明'); // Should preserve original characters
    expect(result).not.toContain('��'); // Should not have replacement chars
    expect(result).toContain('\n'); // Should have unescaped newline
  });

  it('should fall back to original content when LLM response is corrupted', async () => {
    // Test a case where the content needs LLM correction but LLM returns corrupted content
    const problematicContent = 'Some text\\x檢查點功能的說明文件'; // Invalid escape that can't be simply unescaped
    
    // Mock LLM to return corrupted content
    mockGeminiClient.generateJson.mockResolvedValue({
      corrected_string_escaping: 'Some text\n檢查點功能的說��文件' // Corrupted Unicode
    });

    const abortSignal = new AbortController().signal;
    
    // Test the correction function
    const result = await ensureCorrectFileContent(
      problematicContent,
      mockGeminiClient,
      abortSignal
    );

    // With the fix, it should detect corruption and fall back to original
    expect(result).toBe(problematicContent); // Should return original unchanged  
    expect(result).toContain('說明'); // Should preserve original characters
    expect(result).not.toContain('��'); // Should not have replacement chars
  });

  it('should still work correctly for non-Unicode content that needs correction', async () => {
    const nonUnicodeContent = 'console.log(\\"Hello World\\")\\nNext line';
    const expectedContent = 'console.log("Hello World")\nNext line';
    
    // Mock LLM to return correct non-corrupted content
    mockGeminiClient.generateJson.mockResolvedValue({
      corrected_string_escaping: expectedContent
    });

    const abortSignal = new AbortController().signal;
    
    const result = await ensureCorrectFileContent(
      nonUnicodeContent,
      mockGeminiClient,
      abortSignal
    );

    // Should use LLM correction for non-Unicode content
    expect(result).toBe(expectedContent);
    expect(mockGeminiClient.generateJson).toHaveBeenCalled();
  });

  it('should preserve Unicode content when writing files', async () => {
    const chineseContent = '# 歡迎使用 Gemini CLI 使用手冊\n\n檢查點功能的說明文件';
    
    const filePath = path.join(testDir, 'unicode-test.md');
    const params = {
      file_path: filePath,
      content: chineseContent,
    };

    const abortSignal = new AbortController().signal;
    const result = await tool.execute(params, abortSignal);

    expect(result.llmContent).toContain('Successfully created');
    
    // Read the actual file content
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    
    // Should preserve all Unicode characters correctly
    expect(writtenContent).toBe(chineseContent);
    expect(writtenContent).toContain('歡迎使用');
    expect(writtenContent).toContain('說明文件');
    expect(writtenContent).not.toContain('��'); // Should not have replacement chars
  });

  it('should handle edit operations with Unicode content safely', async () => {
    const originalContent = '';
    const newContent = '檢查點功能的說明文件';
    
    // Mock ensureCorrectEdit scenario with potential corruption
    mockGeminiClient.generateJson.mockResolvedValue({
      corrected_new_string_escaping: '檢查點功能的說��文件' // Simulated corruption
    });

    const abortSignal = new AbortController().signal;
    
    const result = await ensureCorrectEdit(
      originalContent,
      {
        old_string: originalContent,
        new_string: newContent,
        file_path: '/test/path',
      },
      mockGeminiClient,
      abortSignal
    );

    // Should preserve the Unicode content correctly
    expect(result.params.new_string).toBe(newContent);
    expect(result.params.new_string).toContain('說明');
    expect(result.params.new_string).not.toContain('��');
  });
});