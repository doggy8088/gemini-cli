# 認證設定

Gemini CLI 需要你與 Google 的 AI 服務進行認證。首次啟動時，你需要設定**其中一種**認證方式：

1.  **使用 Google 帳戶登入（Gemini Code Assist）：**
    - 使用此選項可透過你的 Google 帳戶登入。
    - 在首次啟動時，Gemini CLI 會引導你前往網頁進行認證。認證完成後，你的認證資訊將會快取在本地端，之後執行時即可略過網頁登入步驟。
    - 請注意，網頁登入必須在能夠與執行 Gemini CLI 的機器通訊的瀏覽器中進行。（具體來說，瀏覽器會被重新導向至 Gemini CLI 正在監聽的 localhost URL。）
    - <a id="workspace-gca">若符合以下情況，使用者可能需要指定 GOOGLE_CLOUD_PROJECT：</a>
      1. 你擁有 Google Workspace 帳戶。Google Workspace 是一項為企業與組織提供的付費服務，包含自訂電子郵件網域（例如 your-name@your-company.com）、進階安全功能及管理控制。這類帳戶通常由雇主或學校管理。
      1. 你是透過 [Google Developer Program](https://developers.google.com/program/plans-and-pricing)（包含合格的 Google Developer Experts）獲得 Gemini Code Assist 授權。
      1. 你已被指派為現有 Gemini Code Assist Standard 或 Enterprise 訂閱的授權使用者。
      1. 你在[支援地區](https://developers.google.com/gemini-code-assist/resources/available-locations)以外地區以個人免費身份使用本產品。
      1. 你的 Google 帳戶年齡未滿 18 歲
      - 若你屬於上述任一情況，必須先設定要使用的 Google Cloud Project ID，並[啟用 Gemini for Cloud API](https://cloud.google.com/gemini/docs/discover/set-up-gemini#enable-api)及[設定存取權限](https://cloud.google.com/gemini/docs/discover/set-up-gemini#grant-iam)。

      你可以在目前的 shell 工作階段中，使用以下指令暫時設定環境變數：

      ```bash
      export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
      ```
      - 若需重複使用，您可以將環境變數加入您的[.env file](#使用-env-檔案持久化環境變數)或 shell 的設定檔（例如：`~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，下列指令會將環境變數加入`~/.bashrc`檔案中：

      ```bash
      echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
      source ~/.bashrc
      ```

2.  **<a id="gemini-api-key"></a>Gemini API 金鑰:**
    - 從 Google AI Studio 取得你的 API 金鑰：[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    - 設定 `GEMINI_API_KEY` 環境變數。在以下方法中，請將 `YOUR_GEMINI_API_KEY` 替換為你從 Google AI Studio 取得的 API 金鑰：
      - 你可以使用以下指令，在目前的 shell 工作階段中暫時設定環境變數：
        ```bash
        export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```
      - 若需重複使用，您可以將環境變數加入您的[.env file](#使用-env-檔案持久化環境變數)。

      - 或者，您也可以從 shell 的設定檔（例如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）中 export API 金鑰。例如，以下指令會將環境變數加入 `~/.bashrc` 檔案：

        ```bash
        echo 'export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

        :warning: 請注意，當你在 shell 設定檔中匯出你的 API 金鑰時，任何從該 shell 執行的其他程序都能讀取該金鑰。

3.  **Vertex AI：**
    - **API 金鑰：**
      - 取得你的 Google Cloud API 金鑰：[Get an API Key](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=newuser)
      - 設定 `GOOGLE_API_KEY` 環境變數。在以下方法中，請將 `YOUR_GOOGLE_API_KEY` 替換為你的 Vertex AI API 金鑰：
        - 你可以使用以下指令，於目前的 shell 工作階段中暫時設定該環境變數：
          ```bash
          export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
          ```
        - 若需重複使用，您可以將環境變數加入您的[.env file](#使用-env-檔案持久化環境變數)或 shell 的設定檔（例如：`~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令會將環境變數新增至`~/.bashrc`檔案：

          ```bash
          echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"' >> ~/.bashrc
          source ~/.bashrc
          ```

          :warning: 請注意，當你在 shell 設定檔中匯出你的 API 金鑰時，任何從該 shell 執行的其他程序都可以讀取該金鑰。

          > **注意：**
          > 如果你遇到像是 `"API keys are not supported by this API - Expected OAuth2 access token or other authentication credentials that assert a principal"` 這樣的錯誤，這很可能是你的組織限制了建立服務帳戶（service account）API 金鑰。在這種情況下，請嘗試下方所述的 [服務帳戶 JSON 金鑰](#service-account-json-key) 方法。

    - **應用程式預設憑證（Application Default Credentials, ADC）：**

      > **注意：**
      > 如果你之前已設定 `GOOGLE_API_KEY` 或 `GEMINI_API_KEY` 環境變數，必須先取消這些設定，才能使用應用程式預設憑證（Application Default Credentials）。
      >
      > ```bash
      > unset GOOGLE_API_KEY GEMINI_API_KEY
      > ```
      - **使用 `gcloud`（用於本機開發）：**
        - 請確保你擁有一個 Google Cloud 專案，並已啟用 Vertex AI API。
        - 使用你的使用者憑證登入：
          ```bash
          gcloud auth application-default login
          ```
          如需更多資訊，請參閱 [為 Google Cloud 設定 Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc)。
  - **<a id="service-account-json-key"></a>使用服務帳戶（適用於應用程式或服務帳戶 API 金鑰受限時）：**
    - 如果因 [組織政策](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys?usertype=existinguser#expandable-2) 無法建立 API 金鑰，或是在非互動式環境中執行，您可以使用服務帳戶金鑰進行驗證。
    - [建立服務帳戶及金鑰](https://cloud.google.com/iam/docs/keys-create-delete)，並下載 JSON 金鑰檔案。該服務帳戶需被指派「Vertex AI User」角色。
    - 將 `GOOGLE_APPLICATION_CREDENTIALS` 環境變數設為該 JSON 檔案的絕對路徑。
      - 您可以在目前的 shell 工作階段中暫時設定此環境變數：
            ```bash
            export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
            ```
          - 若需重複使用，您可以將該指令加入您的 shell 設定檔（例如：`~/.bashrc`）。
            ```bash
            echo 'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"' >> ~/.bashrc
            source ~/.bashrc
            ```
            :warning: 請注意，當你在 shell 設定檔中匯出服務帳戶（service account）憑證時，任何從該 shell 執行的其他程序都能讀取這些憑證。

      - **ADC 所需的環境變數（Required Environment Variables for ADC）：**
        - 當你使用 ADC（無論是透過 `gcloud` 或服務帳戶）時，也必須設定 `GOOGLE_CLOUD_PROJECT` 和 `GOOGLE_CLOUD_LOCATION` 這兩個環境變數。以下方法中，請將 `YOUR_PROJECT_ID` 和 `YOUR_PROJECT_LOCATION` 替換為你專案（project）對應的值：
          - 你可以使用下列指令，在目前的 shell 工作階段中暫時設定這些環境變數：
            ```bash
            export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
            export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION" # e.g., us-central1
            ```
          - 若需重複使用，您可以將這些環境變數加入您的[.env file](#使用-env-檔案持久化環境變數)或 shell 的設定檔（例如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，下列指令會將環境變數加入 `~/.bashrc` 檔案：
            ```bash
            echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
            echo 'export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"' >> ~/.bashrc
            source ~/.bashrc
            ```

4.  **Cloud Shell：**
    - 此選項僅在 Google Cloud Shell 環境中執行時可用。
    - 它會自動使用 Cloud Shell 環境中已登入使用者的認證。
    - 當在 Cloud Shell 執行且未設定其他驗證方式時，這是預設的驗證方法。

          :warning: 請注意，若您將 API 金鑰匯出到 shell 設定檔中，任何從該 shell 執行的其他程序都能讀取該金鑰。

### 使用 `.env` 檔案持久化環境變數

您可以在專案目錄或家目錄中建立一個 **`.gemini/.env`** 檔案。建立一般的 **`.env`** 檔案也可行，但建議使用 `.gemini/.env`，以便將 Gemini 相關變數與其他工具隔離。

**重要提示：** 某些環境變數（如 `DEBUG` 和 `DEBUG_MODE`）會自動從專案 `.env` 檔案中排除，以避免影響 Gemini CLI 的行為。請使用 `.gemini/.env` 檔案來設定 Gemini CLI 專屬的變數。

Gemini CLI 會自動從找到的**第一個** `.env` 檔案中載入環境變數，搜尋順序如下：

1. 從**目前目錄**開始，往上層至 `/`，每個目錄會依序檢查：
   1. `.gemini/.env`
   2. `.env`
2. 若未找到檔案，則回退至您的**家目錄**：
   - `~/.gemini/.env`
   - `~/.env`

> **重要提示：** 搜尋會在遇到**第一個**檔案時停止——變數**不會**跨多個檔案合併。

#### 範例

**專案專屬覆寫**（當您在專案內時會優先套用）：

```bash
mkdir -p .gemini
echo 'GOOGLE_CLOUD_PROJECT="your-project-id"' >> .gemini/.env
```

**使用者層級設定**（在每個目錄中皆可使用）：

```bash
mkdir -p ~/.gemini
cat >> ~/.gemini/.env <<'EOF'
GOOGLE_CLOUD_PROJECT="your-project-id"
GEMINI_API_KEY="your-gemini-api-key"
EOF
```

## 非互動模式 / 無頭環境

當在非互動式環境中執行 Gemini CLI 時，無法使用互動式登入流程。  
此時，必須透過設定環境變數來完成驗證。

Gemini CLI 會自動偵測是否在非互動式終端機中執行，並在可用時採用以下其中一種驗證方式：

1.  **Gemini API 金鑰：**
    - 設定 `GEMINI_API_KEY` 環境變數。
    - CLI 會使用此金鑰與 Gemini API 進行驗證。

2.  **Vertex AI：**
    - 設定 `GOOGLE_GENAI_USE_VERTEXAI=true` 環境變數。
    - **使用 API 金鑰：** 設定 `GOOGLE_API_KEY` 環境變數。
    - **使用 Application Default Credentials (ADC)：**
      - 在您的環境中執行 `gcloud auth application-default login` 以設定 ADC。
      - 確保已設定 `GOOGLE_CLOUD_PROJECT` 和 `GOOGLE_CLOUD_LOCATION` 環境變數。

如果在非互動式會話中未設定上述任何環境變數，CLI 將會顯示錯誤並結束執行。

如需以程式化方式或自動化流程使用 Gemini CLI 的完整指引，請參閱 [Headless Mode Guide](../headless.md)。
