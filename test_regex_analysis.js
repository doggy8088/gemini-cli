#!/usr/bin/env node

// Test the specific regex pattern against Chinese characters and their UTF-8 bytes

import fs from 'fs';

// The regex from unescapeStringForGeminiBug
const problematicRegex = /\\+(n|t|r|'|"|`|\\|\n)/g;

console.log('=== Testing regex against Chinese UTF-8 bytes ===');

// The original "明" character 
const mingChar = '明';  // UTF-8: 0xe6 0x98 0x8e
console.log('Character "明":');
console.log('- UTF-8 bytes:', Buffer.from(mingChar, 'utf8'));
console.log('- Hex representation:', Buffer.from(mingChar, 'utf8').toString('hex'));

// Test if any of the UTF-8 bytes match the regex pattern
const utfBytes = Buffer.from(mingChar, 'utf8');
for (let i = 0; i < utfBytes.length; i++) {
  const byte = utfBytes[i];
  const char = String.fromCharCode(byte);
  console.log(`- Byte ${i}: 0x${byte.toString(16)} (${byte}) -> char: "${char}"`);
  
  // Check if this byte value matches any of the regex capture group characters
  const targetChars = ['n', 't', 'r', "'", '"', '`', '\\', '\n'];
  const byteAsChar = String.fromCharCode(byte);
  if (targetChars.includes(byteAsChar)) {
    console.log(`  *** MATCHES regex target char: "${byteAsChar}" ***`);
  }
}

// Test building a string that might trigger the issue
console.log('\n=== Testing potential problematic patterns ===');

// What if there's a backslash before the character?
const testString1 = '\\明';
console.log('Test string "\\明":');
console.log('- Original:', testString1);
console.log('- UTF-8 bytes:', Buffer.from(testString1, 'utf8'));

const matches1 = [...testString1.matchAll(problematicRegex)];
console.log('- Regex matches:', matches1);

// Test the actual regex replacement
function unescapeStringForGeminiBug(inputString) {
  return inputString.replace(
    /\\+(n|t|r|'|"|`|\\|\n)/g,
    (match, capturedChar) => {
      console.log(`*** REGEX MATCH: "${match}" with captured char: "${capturedChar}" ***`);
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

const result1 = unescapeStringForGeminiBug(testString1);
console.log('- After unescape:', result1);
console.log('- Result UTF-8 bytes:', Buffer.from(result1, 'utf8'));

// Test with a more complex case
console.log('\n=== Testing edge case that might cause corruption ===');

// Let's see what happens if we have multiple backslashes or patterns that might interfere
// Looking at 0x98 (152 decimal) - this is one of the UTF-8 bytes of "明"
const char98 = String.fromCharCode(0x98);
console.log(`Character from byte 0x98: "${char98}" (char code: ${0x98})`);

// Test string that has backslash followed by character with code 0x98
const testString2 = '\\' + char98;
console.log('Test string with \\0x98:');
console.log('- String:', testString2);
console.log('- UTF-8 bytes:', Buffer.from(testString2, 'utf8'));
console.log('- Length:', testString2.length);

const matches2 = [...testString2.matchAll(problematicRegex)];
console.log('- Regex matches:', matches2);

const result2 = unescapeStringForGeminiBug(testString2);
console.log('- After unescape:', result2);
console.log('- Result UTF-8 bytes:', Buffer.from(result2, 'utf8'));

console.log('\n=== Testing full context from the bug ===');

// Test the actual problematic context 
const bugContext = '檢查點功能的說明文件';
console.log('Bug context:', bugContext);
console.log('- UTF-8 bytes:', Buffer.from(bugContext, 'utf8'));

const bugResult = unescapeStringForGeminiBug(bugContext);
console.log('- After unescape:', bugResult);
console.log('- Result UTF-8 bytes:', Buffer.from(bugResult, 'utf8'));
console.log('- Contains corruption:', bugResult.includes('��'));