# Token 快取與成本最佳化

Gemini CLI 在使用 API 金鑰驗證（Gemini API 金鑰或 Vertex AI）時，會自動透過 Token 快取來最佳化 API 成本。此功能會重複利用先前的系統指令與 context，以減少後續請求中所需處理的 Token 數量。

**Token 快取適用於：**

- API 金鑰使用者（Gemini API 金鑰）
- Vertex AI 使用者（已設定專案與地區）

**Token 快取不適用於：**

- OAuth 使用者（Google 個人／企業帳戶）－目前 Code Assist API 尚不支援快取內容的建立

你可以使用 `/stats` 指令來檢視你的 Token 使用量與快取 Token 節省情形。當有可用的快取 Token 時，將會在統計輸出中顯示。
