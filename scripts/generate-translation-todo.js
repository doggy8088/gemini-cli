#!/usr/bin/env node

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * 遞迴掃描目錄中的 .md 檔案
 */
function findMarkdownFiles(dir, basePath = '') {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = basePath ? join(basePath, entry.name) : entry.name;
    
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(relativePath);
    }
  }
  
  return files;
}

/**
 * 掃描 docs/ 目錄下的所有 .md 檔案並產生翻譯進度清單
 */
function generateTranslationTodo() {
  console.log('掃描 docs/ 目錄下的 .md 檔案...');
  
  const docsDir = join(rootDir, 'docs');
  
  // 掃描所有 .md 檔案
  const files = findMarkdownFiles(docsDir, 'docs').sort();
  
  // 按分類整理檔案
  const categories = {
    'docs (root)': [],
    'docs/cli': [],
    'docs/core': [],
    'docs/tools': [],
    'docs/examples': [],
    'docs/other': []
  };
  
  files.forEach(file => {
    if (file.startsWith('docs/cli/')) {
      categories['docs/cli'].push(file);
    } else if (file.startsWith('docs/core/')) {
      categories['docs/core'].push(file);
    } else if (file.startsWith('docs/tools/')) {
      categories['docs/tools'].push(file);
    } else if (file.startsWith('docs/examples/')) {
      categories['docs/examples'].push(file);
    } else if (file.startsWith('docs/') && !file.includes('/', 5)) {
      categories['docs (root)'].push(file);
    } else {
      categories['docs/other'].push(file);
    }
  });
  
  // 產生 markdown 內容
  const timestamp = new Date().toISOString();
  let content = `# 翻譯進度清單\n\n`;
  content += `> 自動產生於：${timestamp}\n`;
  content += `> 腳本位置：\`scripts/generate-translation-todo.js\`\n`;
  content += `> 執行指令：\`npm run gen-translation-todo\`\n\n`;
  
  let totalFiles = 0;
  
  Object.entries(categories).forEach(([categoryName, categoryFiles]) => {
    if (categoryFiles.length === 0) return;
    
    categoryFiles.sort();
    totalFiles += categoryFiles.length;
    
    content += `## ${categoryName} (${categoryFiles.length} 個檔案)\n\n`;
    
    categoryFiles.forEach(file => {
      content += `- [ ] \`${file}\`\n`;
    });
    
    content += `\n`;
  });
  
  content += `## 統計資訊\n\n`;
  content += `- **總檔案數**：${totalFiles} 個 .md 檔案\n`;
  content += `- **掃描範圍**：\`docs/**/*.md\`\n`;
  content += `- **產生時間**：${timestamp}\n\n`;
  
  content += `## 使用說明\n\n`;
  content += `1. 翻譯完成的檔案請將 \`[ ]\` 改為 \`[x]\`\n`;
  content += `2. 請參考 \`ZHTW_DICT.md\` 字典檔確保術語一致性\n`;
  content += `3. 遵循 \`.github/copilot-instructions.md\` 的翻譯協作指引\n`;
  content += `4. 注意 VuePress 角括號轉義以避免建置錯誤\n\n`;
  
  content += `## 重新產生此清單\n\n`;
  content += `\`\`\`bash\n`;
  content += `npm run gen-translation-todo\n`;
  content += `\`\`\`\n`;
  
  // 寫入檔案
  const outputPath = join(rootDir, 'TRANSLATION_TODO.md');
  writeFileSync(outputPath, content, 'utf8');
  
  console.log(`✅ 已產生翻譯進度清單：${relative(rootDir, outputPath)}`);
  console.log(`📄 總共發現 ${totalFiles} 個 .md 檔案`);
  
  // 顯示分類統計
  Object.entries(categories).forEach(([categoryName, categoryFiles]) => {
    if (categoryFiles.length > 0) {
      console.log(`   - ${categoryName}: ${categoryFiles.length} 個檔案`);
    }
  });
}

// 執行腳本
try {
  generateTranslationTodo();
} catch (error) {
  console.error('❌ 產生翻譯清單時發生錯誤：', error);
  process.exit(1);
}