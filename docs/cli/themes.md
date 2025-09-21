# 佈景主題 (Themes)

Gemini CLI 支援多種佈景主題，可自訂其配色方案與外觀。你可以透過 `/theme` 指令或 `"theme":` 設定來變更佈景主題，以符合你的個人偏好。

## 可用佈景主題

Gemini CLI 內建多種預設佈景主題，你可以在 Gemini CLI 內使用 `/theme` 指令來列出所有可用主題：

- **深色主題：**
  - `ANSI`
  - `Atom One`
  - `Ayu`
  - `Default`
  - `Dracula`
  - `GitHub`
- **淺色主題：**
  - `ANSI Light`
  - `Ayu Light`
  - `Default Light`
  - `GitHub Light`
  - `Google Code`
  - `Xcode`

### 變更佈景主題

1. 在 Gemini CLI 輸入 `/theme`。
2. 對話框或選擇提示會出現，列出所有可用的佈景主題。
3. 使用方向鍵選擇一個主題。有些介面在選擇時會即時預覽或高亮顯示主題效果。
4. 確認你的選擇以套用該主題。

**注意：** 如果你的 `settings.json` 檔案中已定義佈景主題（不論是以名稱或檔案路徑），你必須先從該檔案移除 `"theme"` 設定，才能透過 `/theme` 指令變更主題。

### 佈景主題持久化

所選佈景主題會儲存在 Gemini CLI 的[設定檔](./configuration.md)中，因此你的偏好會在不同工作階段間被保留。

---

## 自訂顏色佈景主題

Gemini CLI 允許你在 `settings.json` 檔案中自訂顏色佈景主題，讓你能完全掌控 CLI 所使用的配色。

### 如何定義自訂佈景主題

請在你的使用者、專案或系統 `settings.json` 檔案中新增 `customThemes` 區塊。每個自訂主題都以一個唯一名稱及一組顏色鍵值對來定義。例如：

```json
{
  "ui": {
    "customThemes": {
      "MyCustomTheme": {
        "name": "MyCustomTheme",
        "type": "custom",
        "Background": "#181818",
        ...
      }
    }
  }
}
```

**顏色鍵值（Color keys）：**

- `Background`
- `Foreground`
- `LightBlue`
- `AccentBlue`
- `AccentPurple`
- `AccentCyan`
- `AccentGreen`
- `AccentYellow`
- `AccentRed`
- `Comment`
- `Gray`
- `DiffAdded`（可選，用於 diff 中新增的行）
- `DiffRemoved`（可選，用於 diff 中移除的行）
- `DiffModified`（可選，用於 diff 中修改的行）

**必要屬性（Required Properties）：**

- `name`（必須與 `customThemes` 物件中的鍵值相符，且為字串）
- `type`（必須為字串 `"custom"`）
- `Background`
- `Foreground`
- `LightBlue`
- `AccentBlue`
- `AccentPurple`
- `AccentCyan`
- `AccentGreen`
- `AccentYellow`
- `AccentRed`
- `Comment`
- `Gray`

你可以為任何顏色值使用十六進位色碼（例如：`#FF0000`）**或**標準 CSS 顏色名稱（例如：`coral`、`teal`、`blue`）。完整支援的名稱請參閱 [CSS 顏色名稱 (CSS color names)](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#color_keywords)。

你可以在 `customThemes` 物件中新增多個自訂佈景主題（custom theme）。

### 從檔案載入佈景主題

除了在 `settings.json` 中定義自訂佈景主題外，你也可以透過在 `settings.json` 中指定檔案路徑，直接從 JSON 檔案載入佈景主題。這對於分享佈景主題或將其與主要設定分離時特別有用。

若要從檔案載入佈景主題，請在 `settings.json` 中將 `theme` 屬性設為你的佈景主題檔案路徑：

```json
{
  "ui": {
    "theme": "/path/to/your/theme.json"
  }
}
```

佈景主題檔案必須是一個有效的 JSON 檔案，且其結構需與在 `settings.json` 中定義的自訂佈景主題相同。

**範例 `my-theme.json`：**

```json
{
  "name": "My File Theme",
  "type": "custom",
  "Background": "#282A36",
  "Foreground": "#F8F8F2",
  "LightBlue": "#82AAFF",
  "AccentBlue": "#61AFEF",
  "AccentPurple": "#BD93F9",
  "AccentCyan": "#8BE9FD",
  "AccentGreen": "#50FA7B",
  "AccentYellow": "#F1FA8C",
  "AccentRed": "#FF5555",
  "Comment": "#6272A4",
  "Gray": "#ABB2BF",
  "DiffAdded": "#A6E3A1",
  "DiffRemoved": "#F38BA8",
  "DiffModified": "#89B4FA",
  "GradientColors": ["#4796E4", "#847ACE", "#C3677F"]
}
```

**安全性注意事項：** 為了您的安全，Gemini CLI 只會載入位於您家目錄內的佈景主題檔案。如果您嘗試從家目錄以外的位置載入佈景主題，系統會顯示警告，且該佈景主題將不會被載入。這是為了防止從不受信任來源載入可能具有惡意的佈景主題檔案。

### 自訂佈景主題範例

<img src="../assets/theme-custom.png" alt="Custom theme example" width="600" />

### 使用您的自訂佈景主題

- 使用 Gemini CLI 中的 `/theme` 指令選擇您的自訂佈景主題。您的自訂佈景主題將會出現在佈景主題選擇對話框中。
- 或者，您也可以將其設為預設，方法是在 `settings.json` 的 `ui` 物件中新增 `"theme": "MyCustomTheme"`。
- 自訂佈景主題可以設定在使用者、專案或系統層級，並遵循與其他設定相同的[設定優先順序](./configuration.md)。

---

## 深色佈景主題

### ANSI

<img src="../assets/theme-ansi.png" alt="ANSI theme" width="600" />

### Atom OneDark

<img src="../assets/theme-atom-one.png" alt="Atom One theme" width="600">

### Ayu

<img src="../assets/theme-ayu.png" alt="Ayu theme" width="600">

### 預設

<img src="../assets/theme-default.png" alt="Default theme" width="600">

### Dracula

<img src="../assets/theme-dracula.png" alt="Dracula theme" width="600">

### GitHub

<img src="../assets/theme-github.png" alt="GitHub theme" width="600">

## 淺色佈景主題

### ANSI Light

<img src="../assets/theme-ansi-light.png" alt="ANSI Light theme" width="600">

### Ayu Light

<img src="../assets/theme-ayu-light.png" alt="Ayu Light theme" width="600">

### 預設淺色

<img src="../assets/theme-default-light.png" alt="Default Light theme" width="600">

### GitHub Light

<img src="../assets/theme-github-light.png" alt="GitHub Light theme" width="600">

### Google Code

<img src="../assets/theme-google-light.png" alt="Google Code theme" width="600">

### Xcode

<img src="../assets/theme-xcode-light.png" alt="Xcode Light theme" width="600">
