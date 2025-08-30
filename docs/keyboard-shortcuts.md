# 鍵盤快速鍵

本文件列出 Gemini CLI 中可用的鍵盤快速鍵。

## 一般

| 快速鍵   | 描述                                                       |
| -------- | ---------------------------------------------------------- |
| `Esc`    | 關閉對話方塊和建議。                                       |
| `Ctrl+C` | 取消正在進行的請求並清除輸入。按兩次以退出應用程式。       |
| `Ctrl+D` | 如果輸入為空，則退出應用程式。按兩次以確認。               |
| `Ctrl+L` | 清除螢幕。                                                 |
| `Ctrl+O` | 切換偵錯主控台的顯示。                                     |
| `Ctrl+S` | 允許長回應完整列印，停用截斷。使用您的終端機回捲查看完整輸出。 |
| `Ctrl+T` | 切換工具描述的顯示。                                       |
| `Ctrl+Y` | 切換所有工具呼叫的自動核准（YOLO 模式）。                  |

## 輸入提示

| 快速鍵                                      | 描述                                               |
| ------------------------------------------- | -------------------------------------------------- |
| `!`                                         | 當輸入為空時切換 Shell 模式。                      |
| `\`（在行尾）+ `Enter`                      | 插入換行。                                         |
| `Down Arrow`                                | 透過輸入歷史記錄向下導覽。                         |
| `Enter`                                     | 提交目前提示。                                     |
| `Meta+Delete` / `Ctrl+Delete`               | 刪除游標右邊的單字。                               |
| `Tab`                                       | 如果存在目前建議，則自動完成。                     |
| `Up Arrow`                                  | 透過輸入歷史記錄向上導覽。                         |
| `Ctrl+A` / `Home`                           | 將游標移動到行首。                                 |
| `Ctrl+B` / `Left Arrow`                     | 將游標向左移動一個字元。                           |
| `Ctrl+C`                                           | Clear the input prompt                                                                                                              |
| `Esc` (double press)                               | Clear the input prompt.                                                                                                             |
| `Ctrl+D` / `Delete`                                | Delete the character to the right of the cursor.                                                                                    |
| `Ctrl+E` / `End`                                   | Move the cursor to the end of the line.                                                                                             |
| `Ctrl+F` / `Right Arrow`                           | Move the cursor one character to the right.                                                                                         |
| `Ctrl+H` / `Backspace`                             | Delete the character to the left of the cursor.                                                                                     |
| `Ctrl+K`                                           | Delete from the cursor to the end of the line.                                                                                      |
| `Ctrl+Left Arrow` / `Meta+Left Arrow` / `Meta+B`   | Move the cursor one word to the left.                                                                                               |
| `Ctrl+N`                                           | Navigate down through the input history.                                                                                            |
| `Ctrl+P`                                           | Navigate up through the input history.                                                                                              |
| `Ctrl+Right Arrow` / `Meta+Right Arrow` / `Meta+F` | Move the cursor one word to the right.                                                                                              |
| `Ctrl+U`                                           | Delete from the cursor to the beginning of the line.                                                                                |
| `Ctrl+V`                                           | Paste clipboard content. If the clipboard contains an image, it will be saved and a reference to it will be inserted in the prompt. |
| `Ctrl+W` / `Meta+Backspace` / `Ctrl+Backspace`     | Delete the word to the left of the cursor.                                                                                          |
| `Ctrl+X` / `Meta+Enter`                            | Open the current input in an external editor.                                                                                       |

## Suggestions

| Shortcut        | Description                            |
| --------------- | -------------------------------------- |
| `Down Arrow`    | Navigate down through the suggestions. |
| `Tab` / `Enter` | Accept the selected suggestion.        |
| `Up Arrow`      | Navigate up through the suggestions.   |

## Radio Button Select

| Shortcut           | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `Down Arrow` / `j` | Move selection down.                                                                                          |
| `Enter`            | Confirm selection.                                                                                            |
| `Up Arrow` / `k`   | Move selection up.                                                                                            |
| `1-9`              | Select an item by its number.                                                                                 |
| (multi-digit)      | For items with numbers greater than 9, press the digits in quick succession to select the corresponding item. |

## IDE Integration

| Shortcut | Description                       |
| -------- | --------------------------------- |
| `Ctrl+G` | See context CLI received from IDE |
