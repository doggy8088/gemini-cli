# 配額與定價

Gemini CLI 提供一個慷慨的免費層級，涵蓋許多個人開發者的使用情況。對於企業/專業使用或如果您需要更高的限制，根據您用來進行驗證的帳戶類型，有多種可能的途徑。

請參閱[隱私權與條款](./tos-privacy.md)以了解隱私權政策與服務條款的詳細資訊。

注意：公布的價格為定價表價格；可能適用額外的協商商業折扣。

本文章概述使用不同驗證方法時適用於 Gemini CLI 的特定配額和定價。

一般來說，有三個類別可供選擇：

- 免費使用：適合實驗和輕度使用。
- 付費層級（固定價格）：適合需要更慷慨每日配額和可預測成本的個人開發者或企業。
- 按使用量付費：最靈活的專業使用選項、長時間執行的任務，或當您需要完全控制使用量時。

## 免費使用

您的旅程從慷慨的免費層級開始，非常適合實驗和輕度使用。

您的免費使用限制取決於您的授權類型。

### 使用 Google 登入（Gemini Code Assist for Individuals）

對於使用 Google 帳戶驗證以存取個人版 Gemini Code Assist 的使用者。這包括：

- 1000 個模型請求 / 使用者 / 天
- 60 個模型請求 / 使用者 / 分鐘
- 模型請求將由 Gemini CLI 決定在 Gemini 模型系列中進行。

在 [Gemini Code Assist for Individuals 限制](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli) 了解更多。

### 使用 Gemini API 金鑰登入（免費）

如果您使用 Gemini API 金鑰，您也可以享受免費層級。這包括：

- 250 個模型請求 / 使用者 / 天
- 10 個模型請求 / 使用者 / 分鐘
- 僅限 Flash 模型的模型請求。

在 [Gemini API 速率限制](https://ai.google.dev/gemini-api/docs/rate-limits) 了解更多。

### 使用 Vertex AI 登入（Express 模式）

Vertex AI 提供 Express 模式，無需啟用計費。這包括：

- 啟用計費前有 90 天
- 配額和模型因您的帳戶而異且特定。

在 [Vertex AI Express 模式限制](https://cloud.google.com/vertex-ai/generative-ai/docs/start/express-mode/overview#quotas) 了解更多。

## 付費層級：固定成本的更高限制

如果您用完了初始請求數量，您可以透過 [在此註冊](https://goo.gle/set-up-gemini-code-assist) 使用 [Gemini Code Assist 標準版或企業版](https://cloud.google.com/products/gemini/pricing) 來升級您的計畫以繼續享受 Gemini CLI 的好處。配額和定價基於具有指定授權席位的固定價格訂閱。為了可預測的成本，您可以使用 Google 登入。這包括：

- 標準版：
  - 1500 個模型請求 / 使用者 / 天
  - 120 個模型請求 / 使用者 / 分鐘
- 企業版：
  - 2000 個模型請求 / 使用者 / 天
  - 120 個模型請求 / 使用者 / 分鐘
- 模型請求將由 Gemini CLI 決定在 Gemini 模型系列中進行。

在 [Gemini Code Assist 標準版與企業版授權限制](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli) 了解更多。

## 按使用量付費

如果您達到每日請求限制或即使在升級後仍耗盡 Gemini Pro 配額，最靈活的解決方案是切換到按使用量付費模式，您根據使用的特定處理量付費。這是不間斷存取的建議路徑。

要做到這一點，請使用 Gemini API 金鑰或 Vertex AI 登入。

- Vertex AI（一般模式）：
  - 配額：由動態共享配額系統或預購置配置輸送量管理。
  - 成本：基於模型和權杖使用量。

在 [Vertex AI 動態共享配額](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota) 和 [Vertex AI 定價](https://cloud.google.com/vertex-ai/pricing) 了解更多。

- Gemini API 金鑰：
  - 配額：因定價層級而異。
  - 成本：因定價層級和模型/權杖使用量而異。

在 [Gemini API 速率限制](https://ai.google.dev/gemini-api/docs/rate-limits)、[Gemini API 定價](https://ai.google.dev/gemini-api/docs/pricing) 了解更多

重要的是要強調，使用 API 金鑰時，您按權杖/呼叫付費。對於許多少權杖的小呼叫，這可能更昂貴，但這是確保您的工作流程不被配額限制中斷的唯一方法。

## Google One 和 Ultra 計畫、Gemini for Workspace 計畫

這些計畫目前僅適用於 Google 體驗提供的基於網路的 Gemini 產品（例如 Gemini 網路應用程式或 Flow 影片編輯器）。這些計畫不適用於為 Gemini CLI 提供動力的 API 使用。目前正在積極考慮為未來支援這些計畫。

## 避免高成本的技巧

使用按使用量付費 API 金鑰時，請注意您的使用量以避免意外成本。

- 不要盲目接受每個建議，特別是對於計算密集型任務，如重構大型程式碼庫。
- 對您的提示和指令要有意圖。您按呼叫付費，所以要考慮完成工作的最有效方式。

## Gemini API 與 Vertex

- Gemini API（gemini developer api）：這是直接使用 Gemini 模型的最快方式。
- Vertex AI：這是用於建置、部署和管理具有特定安全和控制要求的 Gemini 模型的企業級平台。

## 了解您的使用情況

模型使用情況摘要可透過 `/stats` 指令取得，並在工作階段結束時退出時顯示。
