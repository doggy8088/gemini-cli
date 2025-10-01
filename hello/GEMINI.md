# Ink 函式庫螢幕閱讀器指引

在開發自訂元件時，務必考慮無障礙性。雖然 Ink 提供了基礎建構模組，但確保你的元件具備無障礙設計，能讓你的命令列介面 (Command Line Interface, CLI) 被更廣泛的使用者所使用。

## 一般原則

提供對螢幕閱讀器友善的輸出：使用 `useIsScreenReaderEnabled` hook 來偵測是否有螢幕閱讀器啟用。你可以針對螢幕閱讀器使用者渲染更具描述性的輸出內容。
善用 ARIA 屬性：對於具有特定角色的元件（例如核取方塊或按鈕），請在 <Box> 和 <Text> 上使用 `aria-role`、`aria-state` 和 `aria-label` 屬性，為螢幕閱讀器提供語意上的意義。
