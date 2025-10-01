# Gemini CLI：配額與定價

Gemini CLI 提供了相當慷慨的免費方案，能滿足許多個人開發者的使用情境。若您屬於企業／專業用途，或需要更高的使用上限，則可依您的驗證帳號類型選擇不同升級途徑。

隱私政策與服務條款詳情請參閱 [privacy and terms](./tos-privacy.md)。

注意：公布的價格為標準牌價；實際商業合作可能會有額外議價折扣。

本文將說明使用不同驗證方式時，Gemini CLI 所適用的配額與定價細則。

一般而言，您可選擇以下三種類型：

- 免費使用：適合實驗或輕量需求。
- 付費方案（固定價格）：適合需要更高每日配額及可預期成本的個人開發者或企業。
- 按量付費（Pay-As-You-Go）：最具彈性的選擇，適合專業用途、長時間執行任務，或需要完全掌控用量時。

## 免費使用

您的旅程可從慷慨的免費方案開始，非常適合實驗與輕量使用。

免費使用的配額取決於您的授權類型。

### 使用 Google 帳號登入（Gemini Code Assist for Individuals）

針對以 Google 帳號驗證，使用 Gemini Code Assist for Individuals 的使用者，包含：

- 每位使用者每日 1000 次模型請求
- 每位使用者每分鐘 60 次模型請求
- 模型請求將依 Gemini CLI 決定，分配至 Gemini 模型家族

詳情請參閱 [Gemini Code Assist for Individuals Limits](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)。

### 使用 Gemini API 金鑰登入（未付費）

若您使用 Gemini API 金鑰，也可享有免費方案，包含：

- 每位使用者每日 250 次模型請求
- 每位使用者每分鐘 10 次模型請求
- 僅能請求 Flash 模型

詳情請參閱 [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)。

### 使用 Vertex AI 登入（Express Mode）

Vertex AI 提供 Express Mode，無需啟用計費，包含：

- 90 天內無需啟用計費
- 配額與可用模型依您的帳號而異

詳情請參閱 [Vertex AI Express Mode Limits](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#quotas)。

## 付費方案：固定費用，享有更高配額

若您已用完初始請求額度，可透過升級以下訂閱方案，繼續享有 Gemini CLI 的服務：

- 透過 [Google AI Pro 和 AI Ultra](https://cloud.google.com/products/gemini/pricing)，於 [Set up Gemini Code Assist](https://goo.gle/set-up-gemini-code-assist) 註冊。此方案推薦給個人開發者，配額與定價採固定費用訂閱制。

  若您需要可預期的成本，可選擇以 Google 帳號登入。

  詳細配額請參閱 [Gemini Code Assist Quotas and Limits](https://developers.google.com/gemini-code-assist/resources/quotas)

- 透過 [Google Cloud 購買 Gemini Code Assist 訂閱](https://cloud.google.com/gemini/docs/codeassist/overview)，於 Google Cloud 控制台註冊。詳情請參閱 [Set up Gemini Code Assist] (https://cloud.google.com/gemini/docs/discover/set-up-gemini)。此方案採固定費用訂閱制，並分配授權席次。若需可預期成本，可選擇以 Google 帳號登入。

  內容包含：
  - Gemini Code Assist Standard 版本：
    - 每位使用者每日 1500 次模型請求
    - 每位使用者每分鐘 120 次模型請求
  - Gemini Code Assist Enterprise 版本：
    - 每位使用者每日 2000 次模型請求
    - 每位使用者每分鐘 120 次模型請求
  - 模型請求將依 Gemini CLI 決定，分配至 Gemini 模型家族

  [瞭解 Gemini Code Assist Standard 與 Enterprise 授權配額限制](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)。

## 按量付費（Pay As You Go）

若您達到每日請求上限，或升級後仍用盡 Gemini Pro 配額，最具彈性的解決方案是切換至按量付費模式，依實際處理量付費。此方式推薦給需要不中斷存取的使用者。

操作方式：請以 Gemini API 金鑰或 Vertex AI 登入。

- Vertex AI（Regular Mode）：
  - 配額：由動態共享配額系統或預先購買的預留吞吐量管理
  - 費用：依模型與 Token 用量計算

詳情請參閱 [Vertex AI Dynamic Shared Quota](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota) 及 [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)。

- Gemini API 金鑰：
  - 配額：依定價等級而異
  - 費用：依定價等級、模型／Token 用量而異

詳情請參閱 [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)、[Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

特別提醒：使用 API 金鑰時，您是依 Token／呼叫付費。若有大量小型呼叫且每次 Token 很少，總費用可能較高，但這是唯一能確保工作流程不受配額限制中斷的方法。

## Gemini for Workspace 方案

目前這些方案僅適用於 Google 提供的 Gemini 網頁產品（例如 Gemini 網頁版應用程式或 Flow 影片編輯器）。這些方案不適用於驅動 Gemini CLI 的 API 使用。未來是否支援此方案，仍在積極評估中。

## 避免高額費用的小技巧

使用按量付費 API 金鑰時，請留意您的使用量，以避免產生意外費用。

- 不要盲目接受所有建議，尤其是像重構大型程式碼庫這類運算密集型任務。
- 請有意識地設計您的提示詞與指令。您是按呼叫付費，請思考最有效率的完成方式。

## Gemini API 與 Vertex 的比較

- Gemini API（Gemini Developer API）：最快速直接使用 Gemini 模型的方法。
- Vertex AI：企業級平台，適合有特定安全性與控管需求時，建置、部署及管理 Gemini 模型。

## 了解您的使用情形

模型使用摘要可透過 `/stats` 指令查詢，並於每次工作階段結束時顯示。
