/**
 * Test to try to reproduce the actual Unicode corruption issue
 * by checking what happens when the LLM correction functions are triggered
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  ensureCorrectFileContent,
  correctStringEscaping,
  unescapeStringForGeminiBug 
} from '../utils/editCorrector.js';
import { GeminiClient } from '../core/client.js';

// Mock the GeminiClient but allow us to control what it returns
const mockGeminiClient = {
  generateJson: vi.fn(),
} as unknown as GeminiClient;

describe('Unicode Corruption Investigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should identify when Chinese content triggers LLM correction', async () => {
    const chineseContent = '檢查點功能的說明文件';
    
    // Test the detection logic  
    const unescaped = unescapeStringForGeminiBug(chineseContent);
    const shouldTriggerCorrection = unescaped !== chineseContent;
    
    console.log('Chinese content:', chineseContent);
    console.log('After unescape:', unescaped);
    console.log('Should trigger correction:', shouldTriggerCorrection);
    
    expect(shouldTriggerCorrection).toBe(false);
  });

  it('should test what happens when LLM returns corrupted content', async () => {
    const originalContent = '檢查點功能的說明文件';
    const corruptedResponse = '檢查點功能的說��文件';
    
    // Mock LLM to return corrupted content
    mockGeminiClient.generateJson = vi.fn().mockResolvedValue({
      corrected_string_escaping: corruptedResponse
    });
    
    // This simulates what would happen if the LLM was called and returned corrupted content
    const result = await correctStringEscaping(
      originalContent,
      mockGeminiClient,
      new AbortController().signal
    );
    
    console.log('Original:', originalContent);
    console.log('LLM returned:', result);
    console.log('Contains corruption:', result.includes('��'));
    
    expect(result).toBe(corruptedResponse);
    expect(result).toContain('說��');
  });

  it('should test ensureCorrectFileContent with forced LLM call', async () => {
    const originalContent = '檢查點功能的說明文件';
    
    // Mock to return corrupted content  
    mockGeminiClient.generateJson = vi.fn().mockResolvedValue({
      corrected_string_escaping: '檢查點功能的說��文件'
    });
    
    // Force the content to look "potentially escaped" by adding a backslash
    const contentWithBackslash = originalContent + '\\n';
    
    const result = await ensureCorrectFileContent(
      contentWithBackslash,
      mockGeminiClient,
      new AbortController().signal
    );
    
    console.log('Content with backslash:', contentWithBackslash);
    console.log('Result after correction:', result);
    
    // With the fix, it should use simple unescaping instead of calling LLM for Unicode content
    expect(result).toBe(originalContent + '\n'); // Should be simply unescaped
    expect(result).not.toContain('��'); // Should not have corruption
    expect(mockGeminiClient.generateJson).not.toHaveBeenCalled(); // Should not call LLM due to Unicode safety
  });

  it('should check UTF-8 bytes of corrupted characters', () => {
    const original = '說明';
    const corrupted = '說��';
    
    const originalBytes = Buffer.from(original, 'utf8');
    const corruptedBytes = Buffer.from(corrupted, 'utf8');
    
    console.log('Original UTF-8 bytes:', originalBytes);
    console.log('Corrupted UTF-8 bytes:', corruptedBytes);
    
    // Original should be: 說(e8 aa aa) + 明(e6 98 8e)
    expect(originalBytes).toEqual(Buffer.from([0xe8, 0xaa, 0xaa, 0xe6, 0x98, 0x8e]));
    
    // Corrupted should be: 說(e8 aa aa) + �(ef bf bd) + �(ef bf bd)  
    expect(corruptedBytes).toEqual(Buffer.from([0xe8, 0xaa, 0xaa, 0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd]));
  });

  it('should identify possible sources of Unicode corruption', () => {
    // Test various scenarios that could cause corruption
    
    // 1. Invalid UTF-8 sequence construction
    const bytes = Buffer.from([0xe8, 0xaa, 0xaa, 0xe6, 0x98]); // truncated 明 
    const truncatedString = bytes.toString('utf8');
    console.log('Truncated UTF-8 sequence:', truncatedString);
    expect(truncatedString).toContain('�'); // Should contain replacement char
    
    // 2. String manipulation that breaks UTF-8 sequences
    const chineseChar = '明'; // e6 98 8e
    const bytes2 = Buffer.from(chineseChar, 'utf8');
    const invalidBytes = Buffer.concat([bytes2.subarray(0, 2), Buffer.from([0xef, 0xbf, 0xbd])]); 
    const corruptedString = invalidBytes.toString('utf8');
    console.log('Manually corrupted string:', corruptedString);
  });
});