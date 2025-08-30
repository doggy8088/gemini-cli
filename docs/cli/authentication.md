# 驗證設定

Gemini CLI 需要您向 Google 的 AI 服務進行驗證。在初始啟動時，您需要設定**其中一種**驗證方法：

1.  **使用 Google 登入（Gemini Code Assist）**：
    - 使用此選項以您的 Google 帳戶登入。
    - 在初始啟動期間，Gemini CLI 會將您導向網頁進行驗證。驗證後，您的憑證將在本機快取，以便在後續執行時跳過網路登入。
    - 請注意，網路登入必須在能與執行 Gemini CLI 的機器通訊的瀏覽器中完成。（具體來說，瀏覽器將被重新導向到 Gemini CLI 正在監聽的 localhost url）。
    - <a id="workspace-gca">如果您符合以下情況，使用者可能需要指定 GOOGLE_CLOUD_PROJECT：</a>
      1. 您有 Google Workspace 帳戶。Google Workspace 是為企業和組織提供的付費服務，提供一套生產力工具，包括自訂電子郵件網域（例如 your-name@your-company.com）、增強的安全功能和管理控制。這些帳戶通常由雇主或學校管理。
      1. 您透過 [Google Developer Program](https://developers.google.com/program/plans-and-pricing) 獲得 Gemini Code Assist 授權（包括合格的 Google Developer Experts）
      1. 您已被指派目前 Gemini Code Assist 標準或企業版訂閱的授權。
      1. 您在免費個人使用的[支援地區](https://developers.google.com/gemini-code-assist/resources/available-locations)以外使用產品。
      1. 您是 18 歲以下的 Google 帳戶持有者
      - 如果您屬於這些類別之一，您必須先設定要使用的 Google Cloud 專案 ID，[啟用 Gemini for Cloud API](https://cloud.google.com/gemini/docs/discover/set-up-gemini#enable-api) 並[設定存取權限](https://cloud.google.com/gemini/docs/discover/set-up-gemini#grant-iam)。

      您可以使用以下指令在目前的 Shell 工作階段中暫時設定環境變數：

      ```bash
      export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
      ```
      - 對於重複使用，您可以將環境變數新增到您的 [.env 檔案](#persisting-environment-variables-with-env-files) 或您的 Shell 設定檔案（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令將環境變數新增到 `~/.bashrc` 檔案：

      ```bash
      echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
      source ~/.bashrc
      ```

2.  **<a id="gemini-api-key"></a>Gemini API 金鑰**：
    - 從 Google AI Studio 取得您的 API 金鑰：[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    - Set the `GEMINI_API_KEY` environment variable. In the following methods, replace `YOUR_GEMINI_API_KEY` with the API key you obtained from Google AI Studio:
      - You can temporarily set the environment variable in your current shell session using the following command:
        ```bash
        export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```
      - For repeated use, you can add the environment variable to your [.env file](#persisting-environment-variables-with-env-files).

      - Alternatively you can export the API key from your shell's configuration file (like `~/.bashrc`, `~/.zshrc`, or `~/.profile`). For example, the following command adds the environment variable to a `~/.bashrc` file:

        ```bash
        echo 'export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

        :warning: Be advised that when you export your API key inside your shell configuration file, any other process executed from the shell can read it.

3.  **Vertex AI:**
    - **API Key:**
      - Obtain your Google Cloud API key: [Get an API Key](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=newuser)
      - Set the `GOOGLE_API_KEY` environment variable. In the following methods, replace `YOUR_GOOGLE_API_KEY` with your Vertex AI API key:
        - You can temporarily set the environment variable in your current shell session using the following command:
          ```bash
          export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
          ```
        - For repeated use, you can add the environment variable to your [.env file](#persisting-environment-variables-with-env-files) or your shell's configuration file (like `~/.bashrc`, `~/.zshrc`, or `~/.profile`). For example, the following command adds the environment variable to a `~/.bashrc` file:

          ```bash
          echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"' >> ~/.bashrc
          source ~/.bashrc
          ```

          :warning: Be advised that when you export your API key inside your shell configuration file, any other process executed from the shell can read it.

          > **Note:**
          > If you encounter an error like `"API keys are not supported by this API - Expected OAuth2 access token or other authentication credentials that assert a principal"`, it is likely that your organization has restricted the creation of service account API keys. In this case, please try the [service account JSON key](#service-account-json-key) method described below.

    - **Application Default Credentials (ADC):**

      > **Note:**
      > If you have previously set the `GOOGLE_API_KEY` or `GEMINI_API_KEY` environment variables, you must unset them to use Application Default Credentials.
      >
      > ```bash
      > unset GOOGLE_API_KEY GEMINI_API_KEY
      > ```
      - **Using `gcloud` (for local development):**
        - Ensure you have a Google Cloud project and have enabled the Vertex AI API.
        - Log in with your user credentials:
          ```bash
          gcloud auth application-default login
          ```
          For more information, see [Set up Application Default Credentials for Google Cloud](https://cloud.google.com/docs/authentication/provide-credentials-adc).
      - **<a id="service-account-json-key"></a>Using a Service Account (for applications or when service account API keys are restricted):**
        - If you are unable to create an API key due to [organization policies](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=existinguser#expandable-2), or if you are running in a non-interactive environment, you can authenticate using a service account key.
        - [Create a service account and key](https://cloud.google.com/iam/docs/keys-create-delete), and download the JSON key file. The service account will need to be assigned the "Vertex AI User" role.
        - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the absolute path of the JSON file.
          - You can temporarily set the environment variable in your current shell session:
            ```bash
            export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
            ```
          - For repeated use, you can add the command to your shell's configuration file (e.g., `~/.bashrc`).
            ```bash
            echo 'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"' >> ~/.bashrc
            source ~/.bashrc
            ```
            :warning: Be advised that when you export service account credentials inside your shell configuration file, any other process executed from the shell can read it.

      - **Required Environment Variables for ADC:**
        - When using ADC (either with `gcloud` or a service account), you must also set the `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION` environment variables. In the following methods, replace `YOUR_PROJECT_ID` and `YOUR_PROJECT_LOCATION` with the relevant values for your project:
          - You can temporarily set these environment variables in your current shell session using the following commands:
            ```bash
            export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
            export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION" # e.g., us-central1
            ```
          - For repeated use, you can add the environment variables to your [.env file](#persisting-environment-variables-with-env-files) or your shell's configuration file (like `~/.bashrc`, `~/.zshrc`, or `~/.profile`). For example, the following commands add the environment variables to a `~/.bashrc` file:
            ```bash
            echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
            echo 'export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"' >> ~/.bashrc
            source ~/.bashrc
            ```

4.  **Cloud Shell:**
    - This option is only available when running in a Google Cloud Shell environment.
    - It automatically uses the credentials of the logged-in user in the Cloud Shell environment.
    - This is the default authentication method when running in Cloud Shell and no other method is configured.

          :warning: Be advised that when you export your API key inside your shell configuration file, any other process executed from the shell can read it.

### Persisting Environment Variables with `.env` Files

您可以在專案目錄或主目錄中建立 **`.gemini/.env`** 檔案。建立普通的 **`.env`** 檔案也可以，但建議使用 `.gemini/.env` 來保持 Gemini 變數與其他工具隔離。

**重要：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案 `.env` 檔案中排除，以防止干擾 gemini-cli 行為。請使用 `.gemini/.env` 檔案來設定 gemini-cli 特定變數。

Gemini CLI 會自動從找到的**第一個** `.env` 檔案載入環境變數，使用以下搜尋順序：

1. 從**目前目錄**開始向上移動到 `/`，對於每個目錄它會檢查：
   1. `.gemini/.env`
   2. `.env`
2. 如果找不到檔案，它會回退到您的**主目錄**：
   - `~/.gemini/.env`
   - `~/.env`

> **重要：** 搜尋會在遇到的**第一個**檔案處停止 — 變數**不會**跨多個檔案合併。

#### 範例

**專案特定覆蓋**（當您在專案內時會優先採用）：

```bash
mkdir -p .gemini
echo 'GOOGLE_CLOUD_PROJECT="your-project-id"' >> .gemini/.env
```

**User-wide settings** (available in every directory):

```bash
mkdir -p ~/.gemini
cat >> ~/.gemini/.env <<'EOF'
GOOGLE_CLOUD_PROJECT="your-project-id"
GEMINI_API_KEY="your-gemini-api-key"
EOF
```

## 非互動模式 / 無頭環境

在非互動環境中執行 Gemini CLI 時，您無法使用互動式登入流程。
相反，您必須使用環境變數設定驗證。

CLI 會自動偵測是否在非互動終端中執行，並會使用以下其中一種
驗證方法（如果可用）：

1.  **Gemini API 金鑰：**
    - 設定 `GEMINI_API_KEY` 環境變數。
    - CLI 會使用此金鑰向 Gemini API 驗證。

2.  **Vertex AI：**
    - 設定 `GOOGLE_GENAI_USE_VERTEXAI=true` 環境變數。
    - **使用 API 金鑰：** 設定 `GOOGLE_API_KEY` 環境變數。
    - **使用應用程式預設憑證（ADC）：**
      - 在您的環境中執行 `gcloud auth application-default login` 來設定 ADC。
      - 確保設定了 `GOOGLE_CLOUD_PROJECT` 和 `GOOGLE_CLOUD_LOCATION` 環境變數。

如果在非互動工作階段中沒有設定這些環境變數，CLI 會以錯誤退出。
