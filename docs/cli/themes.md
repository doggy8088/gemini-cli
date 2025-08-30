# 主題

Gemini CLI 支援多種主題來自訂其色彩配置和外觀。您可以透過 `/theme` 指令或 `"theme":` 設定選項來改變主題以符合您的偏好。

## 可用主題

Gemini CLI 附帶一系列預定義主題，您可以在 Gemini CLI 中使用 `/theme` 指令列出它們：

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

### 更改主題

1.  在 Gemini CLI 中輸入 `/theme`。
2.  出現對話框或選擇提示，列出可用主題。
3.  使用方向鍵選擇主題。某些介面可能會在您選擇時提供即時預覽或高亮顯示。
4.  確認您的選擇以套用主題。

**注意：** 如果在您的 `settings.json` 檔案中定義了主題（透過名稱或檔案路徑），您必須從檔案中移除 `"theme"` 設定，才能使用 `/theme` 指令變更主題。

### 主題持久性

選擇的主題會保存在 Gemini CLI 的[設定](./configuration.md)中，因此您的偏好會在工作階段之間被記住。

---

## 自訂色彩主題

Gemini CLI 允許您透過在 `settings.json` 檔案中指定自訂色彩主題。這讓您完全控制 CLI 中使用的色彩調色盤。

### 如何定義自訂主題

在您的使用者、專案或系統 `settings.json` 檔案中新增 `customThemes` 區塊。每個自訂主題都定義為具有唯一名稱和一組色彩鍵的物件。例如：

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

**色彩鍵：**

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
- `DiffAdded`（可選，用於差異中的新增行）
- `DiffRemoved`（可選，用於差異中的刪除行）
- `DiffModified`（可選，用於差異中的修改行）

**必需屬性：**

- `name`（必須與 `customThemes` 物件中的鍵匹配並且是字串）
- `type`（必須是字串 `"custom"`）
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

您可以使用十六進位代碼（例如，`#FF0000`）**或**標準 CSS 色彩名稱（例如，`coral`、`teal`、`blue`）作為任何色彩值。完整的支援名稱清單請參閱[CSS 色彩名稱](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#color_keywords)。

您可以透過在 `customThemes` 物件中新增更多條目來定義多個自訂主題。

### 從檔案載入主題

除了在 `settings.json` 中定義自訂主題外，您還可以透過在 `settings.json` 中指定檔案路徑直接從 JSON 檔案載入主題。這對於分享主題或將它們與主要設定分開很有用。

要從檔案載入主題，請將 `settings.json` 中的 `theme` 屬性設定為主題檔案的路徑：

```json
{
  "ui": {
    "theme": "/path/to/your/theme.json"
  }
}
```

主題檔案必須是有效的 JSON 檔案，遵循與在 `settings.json` 中定義的自訂主題相同的結構。

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

**安全性注意事項：** 為了您的安全，Gemini CLI 只會載入位於您主目錄內的主題檔案。如果您嘗試從主目錄外載入主題，將顯示警告且不會載入主題。這是為了防止從不信任來源載入潛在惡意的主題檔案。

### 自訂主題範例

<img src="../assets/theme-custom.png" alt="自訂主題範例" width="600" />

### 使用您的自訂主題

- 在 Gemini CLI 中使用 `/theme` 指令選擇您的自訂主題。您的自訂主題會出現在主題選擇對話框中。
- 或者，透過在 `settings.json` 的 `ui` 物件中新增 `"theme": "MyCustomTheme"` 將其設定為預設值。
- 自訂主題可以在使用者、專案或系統層級設定，並遵循與其他設定相同的[設定優先順序](./configuration.md)。

---

## 深色主題

### ANSI

<img src="../assets/theme-ansi.png" alt="ANSI 主題" width="600" />

### Atom OneDark

<img src="../assets/theme-atom-one.png" alt="Atom One 主題" width="600">

### Ayu

<img src="../assets/theme-ayu.png" alt="Ayu 主題" width="600">

### Default

<img src="../assets/theme-default.png" alt="預設主題" width="600">

### Dracula

<img src="../assets/theme-dracula.png" alt="Dracula 主題" width="600">

### GitHub

<img src="../assets/theme-github.png" alt="GitHub 主題" width="600">

## 淺色主題

### ANSI Light

<img src="../assets/theme-ansi-light.png" alt="ANSI Light 主題" width="600">

### Ayu Light

<img src="../assets/theme-ayu-light.png" alt="Ayu Light 主題" width="600">

### Default Light

<img src="../assets/theme-default-light.png" alt="Default Light 主題" width="600">

### GitHub Light

<img src="../assets/theme-github-light.png" alt="GitHub Light 主題" width="600">

### Google Code

<img src="../assets/theme-google-light.png" alt="Google Code 主題" width="600">

### Xcode

<img src="../assets/theme-xcode-light.png" alt="Xcode Light 主題" width="600">
