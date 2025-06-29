#!/usr/bin/env node

// Test script to reproduce the Unicode issue

import { unescapeStringForGeminiBug } from './packages/core/src/utils/editCorrector.js';
import fs from 'fs';

// Sample Chinese Traditional text from the issue
const chineseText = `# 歡迎使用 Gemini CLI 使用手冊

本手冊提供安裝、使用與開發 Gemini CLI 的完整指南。此工具可讓您透過指令列介面與 Gemini 模型互動。

## 總覽

- **[檢查點](./checkpointing.md)：** 檢查點功能的說明文件。`;

console.log('Original text:');
console.log(chineseText);

console.log('\nAfter unescapeStringForGeminiBug:');
const unescaped = unescapeStringForGeminiBug(chineseText);
console.log(unescaped);

console.log('\nChecking for corruption:');
console.log('Original includes "說明": ', chineseText.includes('說明'));
console.log('Unescaped includes "說明": ', unescaped.includes('說明'));
console.log('Unescaped includes "說��": ', unescaped.includes('說��'));

// Write to file to test UTF-8 handling
const testFile = '/tmp/test-unicode.md';
fs.writeFileSync(testFile, unescaped, 'utf8');
const readBack = fs.readFileSync(testFile, 'utf8');

console.log('\nAfter file write/read:');
console.log('Read back includes "說明": ', readBack.includes('說明'));
console.log('Read back includes "說��": ', readBack.includes('說��'));

console.log('\nExact bytes comparison:');
console.log('Original bytes length:', Buffer.from(chineseText, 'utf8').length);
console.log('Unescaped bytes length:', Buffer.from(unescaped, 'utf8').length);
console.log('Read back bytes length:', Buffer.from(readBack, 'utf8').length);

// Check the specific characters
const originalChar = chineseText.substring(chineseText.indexOf('說明'), chineseText.indexOf('說明') + 2);
const unescapedChar = unescaped.substring(unescaped.indexOf('說'), unescaped.indexOf('說') + 3); // might be corrupted

console.log('\nCharacter analysis:');
console.log('Original "說明" bytes:', Buffer.from(originalChar, 'utf8'));
console.log('Unescaped substring bytes:', Buffer.from(unescapedChar, 'utf8'));