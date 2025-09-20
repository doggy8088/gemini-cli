# Gemini CLI：服務條款與隱私權通知

Gemini CLI 是一款開源工具，可讓你直接從命令列介面（Command Line Interface）與 Google 強大的大型語言模型（Large Language Model, LLM）互動。你使用 Gemini CLI 時所適用的服務條款與隱私權通知，會依你用來驗證 Google 身份的帳戶類型而有所不同。

本文將說明不同帳戶類型與驗證方式所適用的特定條款與隱私政策。注意：有關你使用 Gemini CLI 所適用的配額與定價細節，請參閱[配額與定價](./quota-and-pricing.md)。

## 如何判斷你的驗證方式

你的驗證方式，指的是你用來登入並存取 Gemini CLI 的方法。共有四種驗證方式：

- 使用你的 Google 帳戶登入 Gemini Code Assist for Individuals
- 使用你的 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise Users
- 使用 Gemini API 金鑰與 Gemini Developer API
- 使用 Gemini API 金鑰與 Vertex AI GenAI API

這四種驗證方式，各自適用不同的服務條款與隱私權通知。

| 驗證方式                         | 帳戶類型            | 服務條款                                                                                     | 隱私權通知                                                                                                                                                                                      |
| :------------------------------- | :------------------ | :------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gemini Code Assist via Google    | 個人                | [Google Terms of Service](https://policies.google.com/terms?hl=en-US)                                   | [Gemini Code Assist Privacy Notice for Individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)                                    |
| Gemini Code Assist via Google    | Standard/Enterprise | [Google Cloud Platform Terms of Service](https://cloud.google.com/terms)                                | [Gemini Code Assist Privacy Notice for Standard and Enterprise](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy) |
| Gemini Developer API             | 未付費              | [Gemini API Terms of Service - Unpaid Services](https://ai.google.dev/gemini-api/terms#unpaid-services) | [Google Privacy Policy](https://policies.google.com/privacy)                                                                                                                                     |
| Gemini Developer API             | 已付費              | [Gemini API Terms of Service - Paid Services](https://ai.google.dev/gemini-api/terms#paid-services)     | [Google Privacy Policy](https://policies.google.com/privacy)                                                                                                                                     |
| Vertex AI Gen API                |                     | [Google Cloud Platform Service Terms](https://cloud.google.com/terms/service-terms/)                    | [Google Cloud Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice)                                                                                                               |

## 1. 如果你使用 Google 帳戶登入 Gemini Code Assist for Individuals

若你使用 Google 帳戶存取 [Gemini Code Assist for Individuals](https://developers.google.com/gemini-code-assist/docs/overview#supported-features-gca)，則適用以下服務條款與隱私權通知文件：

- **服務條款：** 你對 Gemini CLI 的使用受 [Google Terms of Service](https://policies.google.com/terms?hl=en-US) 約束。
- **隱私權通知：** 你的資料蒐集與使用方式，詳見 [Gemini Code Assist Privacy Notice for Individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)。

## 2. 如果你使用 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise Users

若你使用 Google 帳戶存取 [Standard 或 Enterprise 版本](https://cloud.google.com/gemini/docs/codeassist/overview#editions-overview) 的 Gemini Code Assist，則適用以下服務條款與隱私權通知文件：

- **服務條款：** 你對 Gemini CLI 的使用受 [Google Cloud Platform Terms of Service](https://cloud.google.com/terms) 約束。
- **隱私權通知：** 你的資料蒐集與使用方式，詳見 [Gemini Code Assist Privacy Notices for Standard and Enterprise Users](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy)。

## 3. 如果你以 Gemini API 金鑰登入 Gemini Developer API

若你使用 Gemini API 金鑰驗證並存取 [Gemini Developer API](https://ai.google.dev/gemini-api/docs)，則適用以下服務條款與隱私權通知文件：

- **服務條款：** 你對 Gemini CLI 的使用受 [Gemini API Terms of Service](https://ai.google.dev/gemini-api/terms) 約束。根據你是使用未付費或已付費服務，條款內容會有所不同：
  - 未付費服務請參閱 [Gemini API Terms of Service - Unpaid Services](https://ai.google.dev/gemini-api/terms#unpaid-services)。
  - 已付費服務請參閱 [Gemini API Terms of Service - Paid Services](https://ai.google.dev/gemini-api/terms#paid-services)。
- **隱私權通知：** 你的資料蒐集與使用方式，詳見 [Google Privacy Policy](https://policies.google.com/privacy)。

## 4. 如果你以 Gemini API 金鑰登入 Vertex AI GenAI API

若你使用 Gemini API 金鑰驗證並存取 [Vertex AI GenAI API](https://cloud.google.com/vertex-ai/generative-ai/docs/reference/rest) 後端，則適用以下服務條款與隱私權通知文件：

- **服務條款：** 你對 Gemini CLI 的使用受 [Google Cloud Platform Service Terms](https://cloud.google.com/terms/service-terms/) 約束。
- **隱私權通知：** 你的資料蒐集與使用方式，詳見 [Google Cloud Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice)。

### 使用統計資料（Usage Statistics）選擇不傳送

你可以依照這裡的說明選擇不傳送使用統計資料給 Google：[Usage Statistics Configuration](./cli/configuration.md#usage-statistics)。

## Gemini CLI 常見問題（FAQ）

### 1. 我的程式碼（包含提示與回應）會被用來訓練 Google 的模型嗎？

你的程式碼（包含提示與回應）是否會被用來訓練 Google 的模型，取決於你所使用的驗證方式與帳戶類型。

預設情況下（若你未選擇退出）：

- **使用 Google 帳戶登入 Gemini Code Assist for Individuals：** 會。當你使用個人 Google 帳戶時，適用 [Gemini Code Assist Privacy Notice for Individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)。根據該通知，你的**提示、回應及相關程式碼會被蒐集**，並可能用於改進 Google 的產品，包括模型訓練。
- **使用 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise：** 不會。這類帳戶的資料受 [Gemini Code Assist Privacy Notices](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance#standard_and_enterprise_data_protection_and_privacy) 條款約束，將你的輸入視為機密。你的**提示、回應及相關程式碼不會被蒐集**，也不會用於模型訓練。
- **透過 Gemini API 金鑰使用 Gemini Developer API：** 是否蒐集與使用你的程式碼，取決於你使用的是未付費還是已付費服務。
  - **未付費服務：** 會。當你使用 Gemini API 金鑰透過 Gemini Developer API 存取未付費服務時，適用 [Gemini API Terms of Service - Unpaid Services](https://ai.google.dev/gemini-api/terms#unpaid-services)。根據該通知，你的**提示、回應及相關程式碼會被蒐集**，並可能用於改進 Google 的產品，包括模型訓練。
  - **已付費服務：** 不會。當你使用 Gemini API 金鑰透過 Gemini Developer API 存取已付費服務時，適用 [Gemini API Terms of Service - Paid Services](https://ai.google.dev/gemini-api/terms#paid-services)，將你的輸入視為機密。你的**提示、回應及相關程式碼不會被蒐集**，也不會用於模型訓練。
- **透過 Gemini API 金鑰使用 Vertex AI GenAI API：** 不會。這類帳戶的資料受 [Google Cloud Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice) 條款約束，將你的輸入視為機密。你的**提示、回應及相關程式碼不會被蒐集**，也不會用於模型訓練。

如需有關選擇退出的更多資訊，請參閱下一題。

### 2. 什麼是使用統計資料（Usage Statistics），選擇退出會控制什麼？

**使用統計資料（Usage Statistics）** 設定是 Gemini CLI 所有可選資料蒐集的唯一控制項。

它所蒐集的資料，會依你的帳戶與驗證方式而有所不同：

- **使用 Google 帳戶登入 Gemini Code Assist for Individuals：** 啟用時，Google 可蒐集匿名遙測（telemetry）（例如執行的指令與效能指標）以及**你的提示與回應（包含程式碼）**，用於模型改進。
- **使用 Google 帳戶登入 Gemini Code Assist for Standard 或 Enterprise：** 此設定僅控制匿名遙測資料的蒐集。無論此設定如何，你的提示與回應（包含程式碼）都不會被蒐集。
- **透過 Gemini API 金鑰使用 Gemini Developer API：**
  **未付費服務：** 啟用時，Google 可蒐集匿名遙測（如執行的指令與效能指標）以及**你的提示與回應（包含程式碼）**，用於模型改進。停用時，我們將依 [How Google Uses Your Data](https://ai.google.dev/gemini-api/terms#data-use-unpaid) 所述使用你的資料。
  **已付費服務：** 此設定僅控制匿名遙測資料的蒐集。Google 會在有限期間內記錄提示與回應，僅用於偵測違反禁止用途政策（Prohibited Use Policy）及符合法律或法規要求的揭露。
- **透過 Gemini API 金鑰使用 Vertex AI GenAI API：** 此設定僅控制匿名遙測資料的蒐集。無論此設定如何，你的提示與回應（包含程式碼）都不會被蒐集。

請參閱適用於你驗證方式的隱私權通知，以瞭解更多關於資料蒐集與使用的資訊。

你可以依照 [Usage Statistics Configuration](./cli/configuration.md#usage-statistics) 文件中的說明，停用任何帳戶類型的使用統計資料。
