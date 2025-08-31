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
  - 對於重複使用，您可以將環境變數新增到您的 [.env 檔案](#使用-env-檔案保存環境變數) 或您的 Shell 設定檔案（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令將環境變數新增到 `~/.bashrc` 檔案：

      ```bash
      echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
      source ~/.bashrc
      ```

2.  **<a id="gemini-api-key"></a>Gemini API 金鑰**：
    - 從 Google AI Studio 取得您的 API 金鑰：[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    - 設定 `GEMINI_API_KEY` 環境變數。在以下方法中，請將 `YOUR_GEMINI_API_KEY` 替換為您從 Google AI Studio 取得的 API 金鑰：
      - 您可以使用以下指令在目前的 Shell 工作階段中暫時設定環境變數：
        ```bash
        export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```
  - 對於重複使用，您可以將環境變數新增到您的 [.env 檔案](#使用-env-檔案保存環境變數)。

      - 或者，您可以從 Shell 設定檔案（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）匯出 API 金鑰。例如，以下指令將環境變數新增到 `~/.bashrc` 檔案：

        ```bash
        echo 'export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

        :warning: 請注意，當您在 Shell 設定檔案中匯出 API 金鑰時，從該 Shell 執行的任何其他程序都可以讀取它。

3.  **Vertex AI：**
    - **API 金鑰：**
      - 取得您的 Google Cloud API 金鑰：[取得 API 金鑰](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=newuser)
      - 設定 `GOOGLE_API_KEY` 環境變數。在以下方法中，請將 `YOUR_GOOGLE_API_KEY` 替換為您的 Vertex AI API 金鑰：
        - 您可以使用以下指令在目前的 Shell 工作階段中暫時設定環境變數：
          ```bash
          export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
          ```
  - 對於重複使用，您可以將環境變數新增到您的 [.env 檔案](#使用-env-檔案保存環境變數) 或 Shell 設定檔案（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令將環境變數新增到 `~/.bashrc` 檔案：

          ```bash
          echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"' >> ~/.bashrc
          source ~/.bashrc
          ```

          :warning: 請注意，當您在 Shell 設定檔案中匯出 API 金鑰時，從該 Shell 執行的任何其他程序都可以讀取它。

          > **注意：**
          > 如果您遇到像 `"API keys are not supported by this API - Expected OAuth2 access token or other authentication credentials that assert a principal"` 這樣的錯誤，很可能是您的組織限制了服務帳戶 API 金鑰的建立。在這種情況下，請嘗試下方描述的[服務帳戶 JSON 金鑰](#service-account-json-key)方法。

    - **應用程式預設憑證（ADC）：**

      > **注意：**
      > 如果您先前設定了 `GOOGLE_API_KEY` 或 `GEMINI_API_KEY` 環境變數，您必須取消設定它們才能使用應用程式預設憑證。
      >
      > ```bash
      > unset GOOGLE_API_KEY GEMINI_API_KEY
      > ```
      - **使用 `gcloud`（用於本機開發）：**
        - 確保您有 Google Cloud 專案並已啟用 Vertex AI API。
        - 使用您的使用者憑證登入：
          ```bash
          gcloud auth application-default login
          ```
          如需更多資訊，請參閱[為 Google Cloud 設定應用程式預設憑證](https://cloud.google.com/docs/authentication/provide-credentials-adc)。
      - **<a id="service-account-json-key"></a>使用服務帳戶（用於應用程式或當服務帳戶 API 金鑰受到限制時）：**
        - 如果您因為[組織政策](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=existinguser#expandable-2)而無法建立 API 金鑰，或者如果您在非互動環境中執行，您可以使用服務帳戶金鑰進行驗證。
        - [建立服務帳戶和金鑰](https://cloud.google.com/iam/docs/keys-create-delete)，並下載 JSON 金鑰檔案。服務帳戶需要被指派「Vertex AI 使用者」角色。
        - 將 `GOOGLE_APPLICATION_CREDENTIALS` 環境變數設定為 JSON 檔案的絕對路徑。
          - 您可以在目前的 Shell 工作階段中暫時設定環境變數：
            ```bash
            export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
            ```
          - 對於重複使用，您可以將指令新增到 Shell 設定檔案（例如 `~/.bashrc`）。
            ```bash
            echo 'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"' >> ~/.bashrc
            source ~/.bashrc
            ```
            :warning: 請注意，當您在 Shell 設定檔案中匯出服務帳戶憑證時，從該 Shell 執行的任何其他程序都可以讀取它。

      - **ADC 所需的環境變數：**
        - 使用 ADC 時（無論是使用 `gcloud` 或服務帳戶），您也必須設定 `GOOGLE_CLOUD_PROJECT` 和 `GOOGLE_CLOUD_LOCATION` 環境變數。在以下方法中，請將 `YOUR_PROJECT_ID` 和 `YOUR_PROJECT_LOCATION` 替換為您專案的相關值：
          - 您可以使用以下指令在目前的 Shell 工作階段中暫時設定這些環境變數：
            ```bash
            export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
            export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION" # 例如：us-central1
            ```
          - 對於重複使用，您可以將環境變數新增到您的 [.env 檔案](#使用-env-檔案保存環境變數) 或 Shell 設定檔案（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令將環境變數新增到 `~/.bashrc` 檔案：
            ```bash
            echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
            echo 'export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"' >> ~/.bashrc
            source ~/.bashrc
            ```

4.  **Cloud Shell：**
    - 此選項僅在 Google Cloud Shell 環境中執行時可用。
    - 它會自動使用 Cloud Shell 環境中已登入使用者的憑證。
    - 這是在 Cloud Shell 中執行且未設定其他方法時的預設驗證方法。

          :warning: 請注意，當您在 Shell 設定檔案中匯出 API 金鑰時，從該 Shell 執行的任何其他程序都可以讀取它。

### 使用 `.env` 檔案保存環境變數

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

**使用者範圍設定**（在每個目錄中都可用）：

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
