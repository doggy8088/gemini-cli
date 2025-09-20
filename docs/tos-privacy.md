# Gemini CLI：服務條款與隱私權通知

Gemini CLI 是一款開源工具，可讓你直接從命令列介面 (Command Line Interface) 與 Google 強大的大型語言模型 (Large Language Model, LLM) 互動。你在使用 Gemini CLI 時所適用的服務條款與隱私權通知，會根據你用於 Google 驗證的帳戶類型而有所不同。

本文說明了針對不同帳戶類型與驗證方式所適用的特定條款與隱私政策。注意：有關配額與定價的詳細資訊，請參閱 [配額與定價](./quota-and-pricing.md)。

## 如何判斷你的驗證方式

你的驗證方式指的是你登入並存取 Gemini CLI 所使用的方法。共有四種驗證方式：

- 使用你的 Google 帳戶登入 Gemini Code Assist for Individuals
- 使用你的 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise Users
- 以 API 金鑰登入 Gemini Developer
- 以 API 金鑰登入 Vertex AI GenAI API

針對這四種驗證方式，各自適用不同的服務條款與隱私權通知。

| 驗證方式                         | 帳戶類型            | 服務條款                                                                                           | 隱私權通知                                                                                                                                                                                  |
| :------------------------------ | :------------------ | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Gemini Code Assist via Google   | 個人                | [Google Terms of Service](https://policies.google.com/terms?hl=en-US)                                   | [Gemini Code Assist Privacy Notice for Individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)                                    |
| Gemini Code Assist via Google   | Standard/Enterprise | [Google Cloud Platform Terms of Service](https://cloud.google.com/terms)                                | [Gemini Code Assist Privacy Notice for Standard and Enterprise](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy) |
| Gemini Developer API            | 免費                | [Gemini API Terms of Service - Unpaid Services](https://ai.google.dev/gemini-api/terms#unpaid-services) | [Google Privacy Policy](https://policies.google.com/privacy)                                                                                                                                     |
| Gemini Developer API            | 付費                | [Gemini API Terms of Service - Paid Services](https://ai.google.dev/gemini-api/terms#paid-services)     | [Google Privacy Policy](https://policies.google.com/privacy)                                                                                                                                     |
| Vertex AI Gen API               |                     | [Google Cloud Platform Service Terms](https://cloud.google.com/terms/service-terms/)                    | [Google Cloud Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice)                                                                                                               |

## 1. 若你以 Google 帳戶登入 Gemini Code Assist for Individuals

若你使用 Google 帳戶存取 [Gemini Code Assist for Individuals](https://developers.google.com/gemini-code-assist/docs/overview#supported-features-gca)，則適用以下服務條款與隱私權通知：

- **服務條款：** 你對 Gemini CLI 的使用受 [Google Terms of Service](https://policies.google.com/terms?hl=en-US) 規範。
- **隱私權通知：** 你的資料收集與使用方式詳見 [Gemini Code Assist Privacy Notice for Individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)。

## 2. 若你以 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise Users

若你使用 Google 帳戶存取 [Gemini Code Assist Standard 或 Enterprise 版本](https://cloud.google.com/gemini/docs/codeassist/overview#editions-overview)，則適用以下服務條款與隱私權通知：

- **服務條款：** 你對 Gemini CLI 的使用受 [Google Cloud Platform Terms of Service](https://cloud.google.com/terms) 規範。
- **隱私權通知：** 你的資料收集與使用方式詳見 [Gemini Code Assist Privacy Notices for Standard and Enterprise Users](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy)。

## 3. 若你以 Gemini API 金鑰登入 Gemini Developer API

若你使用 Gemini API 金鑰驗證並存取 [Gemini Developer API](https://ai.google.dev/gemini-api/docs)，則適用以下服務條款與隱私權通知：

- **服務條款：** 你對 Gemini CLI 的使用受 [Gemini API Terms of Service](https://ai.google.dev/gemini-api/terms) 規範。具體條款會依你使用的是免費或付費服務而有所不同：
  - 免費服務請參閱 [Gemini API Terms of Service - Unpaid Services](https://ai.google.dev/gemini-api/terms#unpaid-services)。
  - 付費服務請參閱 [Gemini API Terms of Service - Paid Services](https://ai.google.dev/gemini-api/terms#paid-services)。
- **隱私權通知：** 你的資料收集與使用方式詳見 [Google Privacy Policy](https://policies.google.com/privacy)。

## 4. 若你以 Gemini API 金鑰登入 Vertex AI GenAI API

若你使用 Gemini API 金鑰驗證並存取 [Vertex AI GenAI API](https://cloud.google.com/vertex-ai/generative-ai/docs/reference/rest) 後端，則適用以下服務條款與隱私權通知：

- **服務條款：** 你對 Gemini CLI 的使用受 [Google Cloud Platform Service Terms](https://cloud.google.com/terms/service-terms/) 規範。
- **隱私權通知：** 你的資料收集與使用方式詳見 [Google Cloud Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice)。

### 使用統計資料的選擇退出

你可以依照此處的說明選擇不將使用統計資料傳送給 Google：[Usage Statistics Configuration](./cli/configuration.md#usage-statistics)。

## Gemini CLI 常見問答 (FAQ)

### 1. 我的程式碼（包括提示與回應）會被用來訓練 Google 的模型嗎？

你的程式碼（包括提示與回應）是否會被用來訓練 Google 的模型，取決於你所使用的驗證方式與帳戶類型。

預設情況下（若你未選擇退出）：

- **以 Google 帳戶登入 Gemini Code Assist for Individuals：** 會。當你使用個人 Google 帳戶時，適用 [Gemini Code Assist Privacy Notice for Individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)。根據此通知，你的**提示、回應及相關程式碼會被收集**，並可能用於改進 Google 的產品，包括模型訓練。
- **以 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise：** 不會。這類帳戶的資料受 [Gemini Code Assist Privacy Notices](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy) 條款保護，將你的輸入視為機密。你的**提示、回應及相關程式碼不會被收集**，也不會用於模型訓練。
- **以 Gemini API 金鑰透過 Gemini Developer API：** 是否收集或使用你的程式碼，取決於你使用的是免費或付費服務。
  - **免費服務：** 會。當你以 Gemini API 金鑰透過 Gemini Developer API 使用免費服務時，適用 [Gemini API Terms of Service - Unpaid Services](https://ai.google.dev/gemini-api/terms#unpaid-services)。根據此通知，你的**提示、回應及相關程式碼會被收集**，並可能用於改進 Google 的產品，包括模型訓練。
  - **付費服務：** 不會。當你以 Gemini API 金鑰透過 Gemini Developer API 使用付費服務時，適用 [Gemini API Terms of Service - Paid Services](https://ai.google.dev/gemini-api/terms#paid-services)，將你的輸入視為機密。你的**提示、回應及相關程式碼不會被收集**，也不會用於模型訓練。
- **以 Gemini API 金鑰透過 Vertex AI GenAI API：** 不會。這類帳戶的資料受 [Google Cloud Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice) 條款保護，將你的輸入視為機密。你的**提示、回應及相關程式碼不會被收集**，也不會用於模型訓練。

如需有關選擇退出的更多資訊，請參閱下一題。

### 2. 什麼是使用統計資料？選擇退出控制了什麼？

**使用統計資料** 設定是 Gemini CLI 所有可選資料收集的唯一控制項。

其收集的資料內容會根據你的帳戶與驗證類型而有所不同：

- **以 Google 帳戶登入 Gemini Code Assist for Individuals：** 啟用時，此設定允許 Google 收集匿名遙測資料（例如執行的指令與效能指標）以及**你的提示與回應（包含程式碼）**，用於模型改進。
- **以 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise：** 此設定僅控制匿名遙測資料的收集。你的提示與回應（包含程式碼）無論此設定如何，皆不會被收集。
- **以 Gemini API 金鑰透過 Gemini Developer API：**
  **免費服務：** 啟用時，此設定允許 Google 收集匿名遙測資料（如執行的指令與效能指標）以及**你的提示與回應（包含程式碼）**，用於模型改進。若停用，將依 [How Google Uses Your Data](https://ai.google.dev/gemini-api/terms#data-use-unpaid) 中所述使用你的資料。
  **付費服務：** 此設定僅控制匿名遙測資料的收集。Google 僅會在有限期間內記錄提示與回應，僅用於偵測違反禁止使用政策及符合法律或法規揭露要求。
- **以 Gemini API 金鑰透過 Vertex AI GenAI API：** 此設定僅控制匿名遙測資料的收集。你的提示與回應（包含程式碼）無論此設定如何，皆不會被收集。

請參閱適用於你驗證方式的隱私權通知，以獲得更多關於資料收集與使用方式的資訊。

你可以依照 [Usage Statistics Configuration](./cli/configuration.md#usage-statistics) 文件中的說明，針對任何帳戶類型停用使用統計資料。
