# 配額與定價

您的 Gemini CLI 配額與定價取決於您用來向 Google 進行驗證的帳戶類型。此外，配額與定價的計算方式可能會因模型版本、請求和使用的權杖而異。您可以透過 `/stats` 指令取得模型用量摘要，並在工作階段結束時退出時顯示。有關隱私權政策和服務條款的詳細資訊，請參閱[隱私權與條款](./tos-privacy.md)。注意：公佈的價格為定價；額外的協商商業折扣可能適用。

本文概述了使用不同驗證方法時適用於 Gemini CLI 的特定配額與定價。

## 1. 使用 Google 登入 (Gemini Code Assist 免費版)

對於使用其 Google 帳戶驗證以存取個人版 Gemini Code Assist 的使用者：

- **配額**：
  - 每分鐘 60 次請求
  - 每天 1000 次請求
  - 不適用權杖用量
- **費用**： 免費
- **詳細資訊**： [Gemini Code Assist 配額](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)
- **注意事項**： 未指定不同模型的特定配額；可能會發生模型遞補以維持共用體驗品質。

## 2. Gemini API 金鑰 (未付費)

如果您使用免費版的 Gemini API 金鑰：

- **配額**：
  - 僅限 Flash 模型
  - 每分鐘 10 次請求
  - 每天 250 次請求
- **費用**： 免費
- **詳細資訊**： [Gemini API 速率限制](https://ai.google.dev/gemini-api/docs/rate-limits)

## 3. Gemini API 金鑰 (付費)

如果您使用付費方案的 Gemini API 金鑰：

- **配額**： 因定價層級而異。
- **費用**： 因定價層級和模型/權杖用量而異。
- **詳細資訊**： [Gemini API 速率限制](https://ai.google.dev/gemini-api/docs/rate-limits)、[Gemini API 定價](https://ai.google.dev/gemini-api/docs/pricing)

## 4. 使用 Google 登入 (適用於 Workspace 或授權的 Code Assist 使用者)

對於標準版或企業版 Gemini Code Assist 的使用者，配額與定價係根據具有指定授權席次的固定價格訂閱：

- **標準層級**：
  - **配額**： 每分鐘 120 次請求，每天 1500 次
- **企業層級**：
  - **配額**： 每分鐘 120 次請求，每天 2000 次
- **費用**： 包含在您的 Gemini for Google Workspace 或 Gemini Code Assist 訂閱中的固定價格。
- **詳細資訊**： [Gemini Code Assist 配額](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)、[Gemini Code Assist 定價](https://cloud.google.com/products/gemini/pricing)
- **注意事項**：
  - 未指定不同模型的特定配額；可能會發生模型遞補以維持共用體驗品質。
  - Google 開發人員計畫的成員可能透過其會員資格擁有 Gemini Code Assist 授權。

## 5. Vertex AI (快速模式)

如果您在快速模式下使用 Vertex AI：

- **配額**： 配額是變動的，且特定於您的帳戶。如需更多詳細資訊，請參閱來源。
- **費用**： 在您的快速模式用量耗盡且您為專案啟用計費後，費用將根據標準 [Vertex AI 定價](https://cloud.google.com/vertex-ai/pricing)計算。
- **詳細資訊**： [Vertex AI 快速模式配額](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#quotas)

## 6. Vertex AI (一般模式)

如果您使用標準 Vertex AI 服務：

- **配額**： 由動態共用配額系統或預先購買的已佈建輸送量管理。
- **費用**： 根據模型和權杖用量。請參閱 [Vertex AI 定價](https://cloud.google.com/vertex-ai/pricing)。
- **詳細資訊**： [Vertex AI 動態共用配額](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota)

## 7. Google One 和 Ultra 方案、Gemini for Workspace 方案

這些方案目前僅適用於使用由 Google 提供的體驗所提供的 Gemini 網頁版產品 (例如 Gemini 網頁應用程式或 Flow 影片編輯器)。這些方案不適用於為 Gemini CLI 提供支援的 API 用量。我們正在積極考慮在未來支援這些方案。