# 服務條款與隱私權聲明

Gemini CLI 是一款開放原始碼工具，可讓您直接透過指令介面與 Google 強大的語言模型互動。適用於您 Gemini CLI 使用行為的服務條款與隱私權聲明，將因您用以驗證 Google 的帳戶類型而異。關於適用於您 Gemini CLI 使用行為的配額與定價詳細資訊，請參閱[配額與定價](./quota-and-pricing.md)。

本文概述適用於不同驗證方法的具體條款與隱私權政策。

## 1. 透過 Google 登入 (適用於[個人](https://developers.google.com/gemini-code-assist/docs/overview#supported-features-gca)的 Gemini Code Assist)

對於使用其 Google 帳戶進行驗證以存取 Gemini Code Assist (個人版) 的使用者：

- 服務條款：您對 Gemini CLI 的使用受一般 [Google 服務條款](https://policies.google.com/terms?hl=zh-TW)的規範。
- 隱私權聲明：您的資料收集與使用方式，請參閱 [Gemini Code Assist 個人版隱私權聲明](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)。

## 2. Gemini API 金鑰 (使用 Gemini 開發人員 [API](https://ai.google.dev/gemini-api/docs) a：免費服務，b：付費服務)

如果您使用 Gemini API 金鑰進行驗證，則適用以下條款：

- 服務條款：您的使用受 [Gemini API 服務條款](https://ai.google.dev/gemini-api/terms)的約束。適用於 a. [免費服務](https://ai.google.dev/gemini-api/terms#unpaid-services) 或 b. [付費服務](https://ai.google.dev/gemini-api/terms#paid-services)
- 隱私權聲明：有關資料處理與隱私權的資訊，詳見一般 [Google 隱私權政策](https://policies.google.com/privacy)。

## 3. 透過 Google 登入 (適用於 Workspace 或授權的 Code Assist 使用者)

對於 Gemini Code Assist 標準版或企業版[版本](https://cloud.google.com/gemini/docs/codeassist/overview#editions-overview)的使用者：

- 服務條款：[Google Cloud Platform 服務條款](https://cloud.google.com/terms)規範您對本服務的使用。
- 隱私權聲明：您的資料處理方式，請參閱 [Gemini Code Assist 隱私權聲明](https://developers.google.com/gemini-code-assist/resources/privacy-notices)。

## 4. Vertex AI (使用 Vertex AI Gen [API](https://cloud.google.com/vertex-ai/generative-ai/docs/reference/rest))

如果您使用具有 Vertex AI Gen API 後端的 API 金鑰：

- 服務條款：您的使用受 [Google Cloud Platform 服務條款](https://cloud.google.com/terms/service-terms/)的規範。
- 隱私權聲明：[Google Cloud 隱私權聲明](https://cloud.google.com/terms/cloud-privacy-notice)說明您的資料如何被收集與管理。

### 使用情況統計資料選擇退出

您可以按照此處提供的說明，選擇不將使用情況統計資料傳送給 Google：[使用情況統計資料設定](./cli/configuration.md#usage-statistics)。

## Gemini CLI 常見問題 (FAQ)

### 1. 我的程式碼，包括提示與回答，是否會用於訓練 Google 的模型？

這完全取決於您使用的驗證方法類型。

- **驗證方法 1**： 是。當您使用個人 Google 帳戶時，適用 Gemini Code Assist 個人版隱私權聲明。根據此聲明，您的**提示、回答及相關程式碼將被收集**，並可能用於改善 Google 的產品，其中包括模型訓練。
- **驗證方法 2a**： 是。當您使用 Gemini API 金鑰 Gemini API (免費服務) 條款時適用。根據此聲明，您的**提示、回答及相關程式碼將被收集**，並可能用於改善 Google 的產品，其中包括模型訓練。
- **驗證方法 2b、3 和 4**： 否。對於這些帳戶，您的資料受 Google Cloud 或 Gemini API (付費服務) 條款的規範，這些條款會將您的輸入視為機密。您的程式碼、提示及其他輸入**不會**用於訓練模型。

### 2. 什麼是「使用情況統計資料」，以及選擇退出控制項的功能為何？

「使用情況統計資料」設定是 Gemini CLI 中所有選用資料收集的單一控制項。其收集的資料取決於您的帳戶類型：

- **驗證方法 1**： 啟用此設定後，Google 將可收集匿名遙測資料 (例如執行的指令與效能指標) 以及**您的提示與回答**，以用於模型改善。
- **驗證方法 2a**： 啟用此設定後，Google 將可收集匿名遙測資料 (例如執行的指令與效能指標) 以及**您的提示與回答**，以用於模型改善。停用此設定後，我們將根據 [Google 如何使用您的資料](https://ai.google.dev/gemini-api/terms#data-use-unpaid)中的說明使用您的資料。
- **驗證方法 2b**： 此設定僅控制匿名遙測資料的收集。Google 會在有限的時間內記錄提示與回應，其唯一目的是偵測違反禁止使用政策的行為，以及任何必要的法律或法規揭露。
- **驗證方法 3 和 4**： 此設定僅控制匿名遙測資料的收集。無論此設定為何，您的提示與回答絕不會被收集。

您可以按照[使用情況統計資料設定](./cli/configuration.md#usage-statistics)文件中的說明，為任何帳戶類型停用使用情況統計資料。