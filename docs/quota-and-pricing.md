# Gemini CLI：配額與定價

Gemini CLI 提供了相當慷慨的免費額度，足以涵蓋多數個人開發者的使用情境。若為企業／專業用途，或需要更高的使用上限，則可根據您使用的帳號驗證方式，選擇不同的升級方案。

有關隱私權政策與服務條款，請參閱 [privacy and terms](./tos-privacy.md)。

注意：所公布的價格為標準牌價；實際商業合作可能會有額外協商折扣。

本文將說明在不同驗證方式下，Gemini CLI 適用的配額與定價細節。

一般來說，您可選擇以下三種方案：

- 免費使用：適合實驗與輕量級使用。
- 付費方案（固定價格）：適合需要更高每日配額與可預期成本的個人開發者或企業。
- 按量付費（Pay-As-You-Go）：最具彈性的專業選擇，適合長時間運行任務或需要完全掌控用量時。

## 免費使用

您的體驗將從慷慨的免費額度開始，非常適合實驗與輕量級使用。

免費使用的配額會依您的授權類型而有所不同。

### 使用 Google 登入（Gemini Code Assist for Individuals）

若您透過 Google 帳號驗證，使用 Gemini Code Assist for Individuals，將享有以下配額：

- 每位使用者每日 1000 次模型請求
- 每位使用者每分鐘 60 次模型請求
- 模型請求將依 Gemini CLI 決定，分配至 Gemini 模型家族

詳情請參閱 [Gemini Code Assist for Individuals Limits](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)。

### 使用 Gemini API 金鑰登入（未付費）

若您使用 Gemini API 金鑰，也可享有免費額度，包括：

- 每位使用者每日 250 次模型請求
- 每位使用者每分鐘 10 次模型請求
- 僅限 Flash 模型請求

詳情請參閱 [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)。

### 使用 Vertex AI 登入（Express Mode）

Vertex AI 提供 Express Mode，無需啟用計費即可使用。其特點包括：

- 可免費使用 90 天，之後需啟用計費
- 配額與可用模型依您的帳號而異

詳情請參閱 [Vertex AI Express Mode Limits](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#quotas)。

## 付費方案：固定費用，享有更高配額

若您用完初始免費請求額度，可升級方案，繼續享受 Gemini CLI 的完整功能。可透過申請 [Gemini Code Assist 的 Standard 或 Enterprise 版本](https://cloud.google.com/products/gemini/pricing)，於 [此處註冊](https://goo.gle/set-up-gemini-code-assist)。配額與定價採固定訂閱制，並分配授權席次。若需可預期的成本，可選擇以 Google 登入。配額如下：

- Standard 版本：
  - 每位使用者每日 1500 次模型請求
  - 每位使用者每分鐘 120 次模型請求
- Enterprise 版本：
  - 每位使用者每日 2000 次模型請求
  - 每位使用者每分鐘 120 次模型請求
- 模型請求將依 Gemini CLI 決定，分配至 Gemini 模型家族

詳情請參閱 [Gemini Code Assist Standard and Enterprise license Limits](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)。

## 按量付費（Pay As You Go）

若您即使升級後仍達到每日請求上限，或用完 Gemini Pro 配額，最具彈性的解決方案是切換至按量付費模式，依實際處理量計費。這是確保不中斷存取的推薦方式。

操作方式：請使用 Gemini API 金鑰或 Vertex AI 登入。

- Vertex AI（Regular Mode）：
  - 配額：由動態共享配額系統或預先購買的保證吞吐量管理
  - 費用：依模型及 token 使用量計價

詳情請參閱 [Vertex AI Dynamic Shared Quota](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota) 及 [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)。

- Gemini API 金鑰：
  - 配額：依定價等級而異
  - 費用：依定價等級及模型／token 使用量而異

詳情請參閱 [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)、[Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

特別提醒：使用 API 金鑰時，將依每個 token／呼叫計費。若頻繁進行小型呼叫（token 較少），總費用可能較高，但這是唯一能確保您的工作流程不會因配額限制而中斷的方法。

## Google One 與 Ultra 方案、Gemini for Workspace 方案

這些方案目前僅適用於 Google 提供的 Gemini 網頁產品（例如 Gemini 網頁應用程式或 Flow 影片編輯器）。這些方案不適用於驅動 Gemini CLI 的 API 使用。未來支援這些方案已在積極評估中。

## 避免高額費用的小技巧

使用按量付費 API 金鑰時，請留意您的用量，以避免產生意外費用。

- 不要盲目接受所有建議，尤其是像重構大型程式碼庫這類運算密集型任務。
- 請有意識地撰寫提示與指令。每次呼叫都會產生費用，請思考最有效率的解決方式。

## Gemini API 與 Vertex 的比較

- Gemini API（Gemini Developer API）：最直接、最快速地使用 Gemini 模型的方式。
- Vertex AI：企業級平台，適合有特定安全與控管需求時，用於建置、部署與管理 Gemini 模型。

## 瞭解您的用量

模型用量摘要可透過 `/stats` 指令查詢，並於每次工作階段結束時顯示。
