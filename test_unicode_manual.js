#!/usr/bin/env node

// Test script to reproduce the Unicode issue with manual regex testing

import fs from 'fs';

// Sample Chinese Traditional text from the issue  
const chineseText = `# 歡迎使用 Gemini CLI 使用手冊

本手冊提供安裝、使用與開發 Gemini CLI 的完整指南。此工具可讓您透過指令列介面與 Gemini 模型互動。

## 總覽

- **[檢查點](./checkpointing.md)：** 檢查點功能的說明文件。`;

console.log('Original text:');
console.log(chineseText);

// Copy of the regex from unescapeStringForGeminiBug
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

console.log('\nAfter unescapeStringForGeminiBug:');
const unescaped = unescapeStringForGeminiBug(chineseText);
console.log(unescaped);

console.log('\nChecking for corruption:');
console.log('Original includes "說明": ', chineseText.includes('說明'));
console.log('Unescaped includes "說明": ', unescaped.includes('說明'));
console.log('Unescaped includes "說��": ', unescaped.includes('說��'));

// More detailed analysis
console.log('\nDetailed character analysis:');
const originalCharCodes = [];
const unescapedCharCodes = [];

for (let i = 0; i < chineseText.length; i++) {
  originalCharCodes.push(chineseText.charCodeAt(i));
}

for (let i = 0; i < unescaped.length; i++) {
  unescapedCharCodes.push(unescaped.charCodeAt(i));
}

console.log('Original length:', chineseText.length);
console.log('Unescaped length:', unescaped.length);

if (chineseText.length !== unescaped.length) {
  console.log('LENGTH MISMATCH - indicating corruption!');
}

// Check for the specific regex patterns that might affect Chinese characters
const problematicRegex = /\\+(n|t|r|'|"|`|\\|\n)/g;
const matches = [...chineseText.matchAll(problematicRegex)];
console.log('\nRegex matches found:', matches.length);
matches.forEach((match, index) => {
  console.log(`Match ${index + 1}:`, match[0], 'at position', match.index);
});

// Test with a specific Chinese character sequence that might be problematic
const testChar = '說明';
console.log('\nTesting specific character "說明":');
console.log('UTF-8 bytes:', Buffer.from(testChar, 'utf8'));
console.log('Char codes:', testChar.split('').map(c => c.charCodeAt(0)));

const testResult = unescapeStringForGeminiBug(testChar);
console.log('After unescape:', testResult);
console.log('After unescape UTF-8 bytes:', Buffer.from(testResult, 'utf8'));
console.log('After unescape char codes:', testResult.split('').map(c => c.charCodeAt(0)));