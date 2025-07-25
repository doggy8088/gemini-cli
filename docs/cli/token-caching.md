# 權杖快取與成本最佳化

當使用 API 金鑰驗證 (Gemini API 金鑰或 Vertex AI) 時，Gemini CLI 會透過權杖快取自動最佳化 API 成本。此功能會重複使用先前的系統指示和情境，以減少後續請求中處理的權杖數量。

**權杖快取適用於**：

- API 金鑰使用者 (Gemini API 金鑰)
- Vertex AI 使用者 (需設定專案和位置)

**權杖快取不適用於**：

- OAuth 使用者 (Google 個人/企業帳戶) - Code Assist API 目前不支援快取內容建立

您可以使用 `/stats` 指令檢視您的權杖使用量和快取的權杖節省量。當有可用的快取權杖時，它們將會顯示在統計資料輸出中。