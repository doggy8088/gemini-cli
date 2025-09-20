# Gemini CLI：配額與定價

Gemini CLI 提供了相當慷慨的免費額度，能夠滿足多數個人開發者的使用情境。若需企業／專業用途，或需要更高的使用上限，根據您用於驗證的帳戶類型，有多種升級方案可供選擇。

有關隱私政策與服務條款的詳細資訊，請參見 [privacy and terms](./tos-privacy.md)。

注意：所公佈的價格為標準定價；實際商業合作可能有額外議價折扣。

本文將說明在不同驗證方式下，適用於 Gemini CLI 的具體配額與定價。

一般來說，您可以選擇以下三種方案：

- 免費使用：適合實驗與輕量級使用。
- 付費方案（固定價格）：適合需要更高每日配額與可預測成本的個人開發者或企業。
- 按量計費（Pay-As-You-Go）：最具彈性的專業選項，適合長時間運行任務或需要完全掌控用量時。

## 免費使用

您的旅程從慷慨的免費額度開始，非常適合實驗與輕量級使用。

您的免費使用上限取決於您的授權類型。

### 使用 Google 帳號登入（Gemini Code Assist for Individuals）

若您以 Google 帳號驗證，使用 Gemini Code Assist for Individuals，包含：

- 每位使用者每日 1000 次模型請求
- 每位使用者每分鐘 60 次模型請求
- 模型請求將依據 Gemini CLI 的判斷，分配至 Gemini 模型家族

詳情請參見 [Gemini Code Assist for Individuals Limits](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)。

### 使用 Gemini API 金鑰登入（未付費）

若您使用 Gemini API 金鑰，也可享有免費額度，包括：

- 每位使用者每日 250 次模型請求
- 每位使用者每分鐘 10 次模型請求
- 僅限請求 Flash 模型

詳情請參見 [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)。

### 使用 Vertex AI 登入（Express Mode）

Vertex AI 提供 Express Mode，無需啟用計費。包括：

- 90 天內無需啟用計費
- 配額與可用模型依帳戶而異

詳情請參見 [Vertex AI Express Mode Limits](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#quotas)。

## 付費方案：固定費用，享有更高配額

若您已用完初始請求次數，可升級方案，繼續享有 Gemini CLI 的服務。請透過 [Gemini Code Assist 的 Standard 或 Enterprise 版本](https://cloud.google.com/products/gemini/pricing)，於 [此處](https://goo.gle/set-up-gemini-code-assist) 註冊。配額與價格採固定訂閱制，並分配授權席次。為了可預測的成本，您可使用 Google 帳號登入。包括：

- Standard 版本：
  - 每位使用者每日 1500 次模型請求
  - 每位使用者每分鐘 120 次模型請求
- Enterprise 版本：
  - 每位使用者每日 2000 次模型請求
  - 每位使用者每分鐘 120 次模型請求
- 模型請求將依據 Gemini CLI 的判斷，分配至 Gemini 模型家族

詳情請參見 [Gemini Code Assist Standard and Enterprise license Limits](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)。

## 按量計費（Pay As You Go）

若您在升級後仍達到每日請求上限或耗盡 Gemini Pro 配額，最具彈性的解決方案是切換至按量計費模式，依實際處理量付費。這是確保不中斷存取的建議方式。

操作方式：請使用 Gemini API 金鑰或 Vertex AI 登入。

- Vertex AI（Regular Mode）：
  - 配額：由動態共享配額系統或預先購買的專屬吞吐量管理
  - 成本：依模型與 token 使用量計價

詳情請參見 [Vertex AI Dynamic Shared Quota](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota) 及 [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)。

- Gemini API 金鑰：
  - 配額：依定價等級而異
  - 成本：依定價等級及模型／token 使用量而異

詳情請參見 [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)、[Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

特別提醒，使用 API 金鑰時，您是依 token／呼叫計費。若頻繁進行小型呼叫且每次 token 較少，總成本可能較高，但這是唯一能確保工作流程不受配額限制中斷的方法。

## Google One 與 Ultra 方案、Gemini for Workspace 方案

這些方案目前僅適用於 Google 提供的 Gemini 網頁產品（例如 Gemini 網頁應用程式或 Flow 影片編輯器）。這些方案不適用於驅動 Gemini CLI 的 API 使用。未來支援這些方案正在積極評估中。

## 避免高額費用的小技巧

使用「按量計費」API 金鑰時，請注意您的用量，以避免產生意外費用。

- 不要盲目接受每一個建議，尤其是像重構大型程式碼庫這類運算密集型任務。
- 請有意識地設計您的提示與指令。每次呼叫都會產生費用，請思考最有效率的解決方式。

## Gemini API 與 Vertex 比較

- Gemini API（gemini developer api）：這是直接使用 Gemini 模型的最快方式。
- Vertex AI：這是企業級平台，適用於建置、部署與管理 Gemini 模型，並滿足特定安全性與控管需求。

## 瞭解您的使用情況

模型使用摘要可透過 `/stats` 指令查詢，並於每次工作階段結束時顯示。
