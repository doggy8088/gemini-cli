/**
 * Test to reproduce the Unicode corruption issue in WriteFile tool
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mocked } from 'vitest';
import { WriteFileTool } from './write-file.js';
import { Config, ApprovalMode } from '../config/config.js';
import { GeminiClient } from '../core/client.js';
import { ToolRegistry } from './tool-registry.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Mock the LLM correction functions to simulate corruption
vi.mock('../utils/editCorrector.js', () => ({
  ensureCorrectFileContent: vi.fn(),
  ensureCorrectEdit: vi.fn(),
}));

import {
  ensureCorrectFileContent,
  ensureCorrectEdit,
} from '../utils/editCorrector.js';

const mockEnsureCorrectFileContent = vi.mocked(ensureCorrectFileContent);
const mockEnsureCorrectEdit = vi.mocked(ensureCorrectEdit);

describe('WriteFileTool Unicode Corruption', () => {
  let tool: WriteFileTool;
  let mockConfig: Config;
  let mockGeminiClient: Mocked<GeminiClient>;
  let testDir: string;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unicode-test-'));

    // Mock GeminiClient
    mockGeminiClient = {
      generateJson: vi.fn(),
      startChat: vi.fn(),
      sendMessageStream: vi.fn(),
    } as unknown as Mocked<GeminiClient>;

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
  });

  it('should reproduce the Chinese character corruption issue', async () => {
    const originalContent = '檢查點功能的說明文件';
    const corruptedContent = '檢查點功能的說��文件'; // Simulated corruption

    // Mock ensureCorrectFileContent to return corrupted content (simulating LLM corruption)
    mockEnsureCorrectFileContent.mockResolvedValue(corruptedContent);

    const filePath = path.join(testDir, 'test.md');
    const params = {
      file_path: filePath,
      content: originalContent,
    };

    const abortSignal = new AbortController().signal;
    const result = await tool.execute(params, abortSignal);

    // The file should be written with corrupted content due to the mocked correction
    expect(result.llmContent).toContain('Successfully created');
    
    // Read the actual file content
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    
    // This test demonstrates the bug - the written content is corrupted
    expect(writtenContent).toBe(corruptedContent);
    expect(writtenContent).toContain('說��'); // Shows the corruption
    expect(writtenContent).not.toContain('說明'); // Original characters are lost
  });

  it('should preserve Unicode characters when correction is not needed', async () => {
    const chineseContent = '檢查點功能的說明文件';

    // Mock to return content unchanged (no correction needed)
    mockEnsureCorrectFileContent.mockResolvedValue(chineseContent);

    const filePath = path.join(testDir, 'test-preserved.md');
    const params = {
      file_path: filePath,
      content: chineseContent,
    };

    const abortSignal = new AbortController().signal;
    const result = await tool.execute(params, abortSignal);

    expect(result.llmContent).toContain('Successfully created');
    
    const writtenContent = fs.readFileSync(filePath, 'utf8');
    expect(writtenContent).toBe(chineseContent);
    expect(writtenContent).toContain('說明'); // Should preserve original characters
    expect(writtenContent).not.toContain('��'); // Should not have replacement chars
  });

  it('should show the difference in UTF-8 bytes between original and corrupted', () => {
    const original = '說明';
    const corrupted = '說��';

    const originalBytes = Buffer.from(original, 'utf8');
    const corruptedBytes = Buffer.from(corrupted, 'utf8');

    // Original: 說(e8 aa aa) + 明(e6 98 8e) = 6 bytes
    expect(originalBytes).toEqual(Buffer.from([0xe8, 0xaa, 0xaa, 0xe6, 0x98, 0x8e]));
    
    // Corrupted: 說(e8 aa aa) + �(ef bf bd) + �(ef bf bd) = 9 bytes  
    expect(corruptedBytes).toEqual(Buffer.from([0xe8, 0xaa, 0xaa, 0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd]));
    
    console.log('Original bytes:', originalBytes);
    console.log('Corrupted bytes:', corruptedBytes);
  });
});