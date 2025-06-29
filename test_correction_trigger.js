#!/usr/bin/env node

// Test to see if ensureCorrectFileContent is incorrectly triggering for Chinese text

import fs from 'fs';

// Copy of the unescapeStringForGeminiBug function
function unescapeStringForGeminiBug(inputString) {
  return inputString.replace(
    /\\+(n|t|r|'|"|`|\\|\n)/g,
    (match, capturedChar) => {
      switch (capturedChar) {
        case 'n':
          return '\n';
        case 't':
          return '\t';
        case 'r':
          return '\r';
        case "'":
          return "'";
        case '"':
          return '"';
        case '`':
          return '`';
        case '\\':
          return '\\';
        case '\n':
          return '\n';
        default:
          return match;
      }
    },
  );
}

// Test various Chinese content from the bug report
const testStrings = [
  '檢查點功能的說明文件', // The specific problematic string
  '歡迎使用 Gemini CLI 使用手冊',
  'Gemini CLI 將 Gemini 模型的功能帶到您的終端機',
  '`packages/cli`', // Has backticks 
  'CLI 用法：`packages/cli` 的說明文件', // Mixed content with backticks
  '**[檢查點](./checkpointing.md)：** 檢查點功能的說明文件',
];

console.log('=== Testing contentPotentiallyEscaped detection ===');

testStrings.forEach((content, index) => {
  const unescaped = unescapeStringForGeminiBug(content);
  const contentPotentiallyEscaped = unescaped !== content;
  
  console.log(`\nTest ${index + 1}: "${content}"`);
  console.log('- Original length:', content.length);
  console.log('- Unescaped length:', unescaped.length);
  console.log('- Content potentially escaped:', contentPotentiallyEscaped);
  
  if (contentPotentiallyEscaped) {
    console.log('*** WOULD TRIGGER LLM CORRECTION ***');
    console.log('- Original:', JSON.stringify(content));
    console.log('- Unescaped:', JSON.stringify(unescaped));
  }
});

// Let's also test strings that might actually need correction
const needsCorrectionStrings = [
  'Hello\\nWorld', // Should be unescaped to "Hello\nWorld"
  'console.log(\\"test\\")', // Should be unescaped
  'path\\\\to\\\\file', // Should be unescaped
];

console.log('\n=== Testing strings that actually need correction ===');

needsCorrectionStrings.forEach((content, index) => {
  const unescaped = unescapeStringForGeminiBug(content);
  const contentPotentiallyEscaped = unescaped !== content;
  
  console.log(`\nCorrection test ${index + 1}: "${content}"`);
  console.log('- Original:', JSON.stringify(content));
  console.log('- Unescaped:', JSON.stringify(unescaped));
  console.log('- Content potentially escaped:', contentPotentiallyEscaped);
});