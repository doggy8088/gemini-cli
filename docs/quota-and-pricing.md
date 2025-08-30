# Gemini CLI：配額與定價

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

## Paid tier: Higher limits for a fixed cost

If you use up your initial number of requests, you can upgrade your plan to continue to benefit from Gemini CLI by using the [Standard or Enterprise editions of Gemini Code Assist](https://cloud.google.com/products/gemini/pricing) by signing up [here](https://goo.gle/set-up-gemini-code-assist). Quotas and pricing are based on a fixed price subscription with assigned license seats. For predictable costs, you can log in with Google. This includes:

- Standard:
  - 1500 model requests / user / day
  - 120 model requests / user / minute
- Enterprise:
  - 2000 model requests / user / day
  - 120 model requests / user / minute
- Model requests will be made across the Gemini model family as determined by Gemini CLI.

Learn more at [Gemini Code Assist Standard and Enterprise license Limits](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli).

## Pay As You Go

If you hit your daily request limits or exhaust your Gemini Pro quota even after upgrading, the most flexible solution is to switch to a pay-as-you-go model, where you pay for the specific amount of processing you use. This is the recommended path for uninterrupted access.

To do this, log in using a Gemini API key or Vertex AI.

- Vertex AI (Regular Mode):
  - Quota: Governed by a dynamic shared quota system or pre-purchased provisioned throughput.
  - Cost: Based on model and token usage.

Learn more at [Vertex AI Dynamic Shared Quota](https://cloud.google.com/vertex-ai/generative-ai/docs/resources/dynamic-shared-quota) and [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing).

- Gemini API key:
  - Quota: Varies by pricing tier.
  - Cost: Varies by pricing tier and model/token usage.

Learn more at [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits), [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

It’s important to highlight that when using an API key, you pay per token/call. This can be more expensive for many small calls with few tokens, but it's the only way to ensure your workflow isn't interrupted by quota limits.

## Google One and Ultra plans, Gemini for Workspace plans

These plans currently apply only to the use of Gemini web-based products provided by Google-based experiences (for example, the Gemini web app or the Flow video editor). These plans do not apply to the API usage which powers the Gemini CLI. Supporting these plans is under active consideration for future support.

## Tips to Avoid High Costs

When using a Pay as you Go API key, be mindful of your usage to avoid unexpected costs.

- Don't blindly accept every suggestion, especially for computationally intensive tasks like refactoring large codebases.
- Be intentional with your prompts and commands. You are paying per call, so think about the most efficient way to get the job done.

## Gemini API vs. Vertex

- Gemini API (gemini developer api): This is the fastest way to use the Gemini models directly.
- Vertex AI: This is the enterprise-grade platform for building, deploying, and managing Gemini models with specific security and control requirements.

## Understanding your usage

A summary of model usage is available through the `/stats` command and presented on exit at the end of a session.
