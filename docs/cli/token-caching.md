# Token 快取與成本優化

當您使用 API 金鑰驗證（Gemini API 金鑰或 Vertex AI）時，Gemini CLI 會透過 Token 快取自動優化 API 費用。此功能會重複使用先前的系統指令與上下文，以減少後續請求中處理的 Token 數量。

**Token 快取適用於：**

- API 金鑰使用者（Gemini API 金鑰）
- Vertex AI 使用者（已設定專案與位置）

**Token 快取不適用於：**

- OAuth 使用者（Google 個人/企業帳戶） - Code Assist API 目前不支援建立快取內容

您可以使用 `/stats` 指令來檢視您的 Token 使用量與節省成效。當有可用的快取 Token 時，它們將會顯示在統計資料的輸出中。
