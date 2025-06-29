## 驗證設定

Gemini CLI 需要您向 Google 的 AI 服務進行驗證。首次啟動時，您需要設定**一種**下列驗證方法：

1.  **使用 Google 登入 (Gemini Code Assist)：**
    - 使用此選項以您的 Google 帳戶登入。
    - 首次啟動時，Gemini CLI 會將您導向一個網頁進行驗證。驗證完成後，您的憑證將會在本機進行快取，因此後續執行時可以跳過網頁登入的步驟。
    - 請注意，網頁登入必須在能夠與執行 Gemini CLI 的機器通訊的瀏覽器中進行。（具體來說，瀏覽器將被重新導向至 Gemini CLI 正在監聽的 localhost URL）。
    - <a id="workspace-gca">在下列情況下，使用者可能需要指定 GOOGLE_CLOUD_PROJECT：</a>
      1. 您擁有 Google Workspace 帳戶。Google Workspace 是為企業和組織提供的付費服務，提供一套生產力工具，包括自訂電子郵件網域（例如 your-name@your-company.com）、強化的安全功能和管理控制項。這些帳戶通常由雇主或學校管理。
      1. 您已透過 [Google 開發者計畫](https://developers.google.com/program/plans-and-pricing)（包括符合資格的 Google 開發專家）獲得免費的 Code Assist 授權
      1. 您已獲指派目前 Gemini Code Assist 標準版或企業版訂閱的授權。
      1. 您在免費個人使用的[支援地區](https://developers.google.com/gemini-code-assist/resources/available-locations)以外使用本產品。>
      1. 您是未滿 18 歲的 Google 帳戶持有人
      - 如果您屬於上述任一類別，則必須先設定要使用的 Google Cloud 專案 ID、[啟用 Gemini for Cloud API](https://cloud.google.com/gemini/docs/discover/set-up-gemini#enable-api) 並 [設定存取權限](https://cloud.google.com/gemini/docs/discover/set-up-gemini#grant-iam)。
您可以使用以下指令在目前的 shell 工作階段中暫時設定環境變數：

      ```bash
      export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
      ```
      - 如需重複使用，您可以將環境變數新增至您的 `.env` 檔案（位於專案目錄或使用者主目錄中）或您的 shell 設定檔（例如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令會將環境變數新增至 `~/.bashrc` 檔案：

```bash
      echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
      source ~/.bashrc
      ```

2.  **<a id="gemini-api-key"></a>Gemini API 金鑰：**
    - 從 Google AI Studio 取得您的 API 金鑰：[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    - 設定 `GEMINI_API_KEY` 環境變數。在下列方法中，請將 `YOUR_GEMINI_API_KEY` 替換為您從 Google AI Studio 取得的 API 金鑰：
      - 您可以使用以下指令在目前的 shell 工作階段中暫時設定環境變數：
        ```bash
        export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```
      - 如需重複使用，您可以將環境變數新增至您的 `.env` 檔案（位於專案目錄或使用者主目錄中）或您的 shell 設定檔（例如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令會將環境變數新增至 `~/.bashrc` 檔案：
        ```bash
        echo 'export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"' >> ~/.bashrc
        source ~/.bashrc
        ```

3.  **Vertex AI：**
    - 如果不使用快速模式：
      - 確保您擁有 Google Cloud 專案並已啟用 Vertex AI API。
      - 使用以下指令設定應用程式預設憑證 (Application Default Credentials, ADC)：
        ```bash
        gcloud auth application-default login
        ```
        如需詳細資訊，請參閱[設定 Google Cloud 的應用程式預設憑證](https://cloud.google.com/docs/authentication/provide-credentials-adc)。
      - 設定 `GOOGLE_CLOUD_PROJECT`、`GOOGLE_CLOUD_LOCATION` 和 `GOOGLE_GENAI_USE_VERTEXAI` 環境變數。在下列方法中，請將 `YOUR_PROJECT_ID` 和 `YOUR_PROJECT_LOCATION` 替換為您專案的相關值：
        - 您可以使用以下指令在目前的 shell 工作階段中暫時設定這些環境變數：
          ```bash
          export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
          export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION" # 例如：us-central1
          export GOOGLE_GENAI_USE_VERTEXAI=true
          ```
        - 如需重複使用，您可以將環境變數新增至您的 `.env` 檔案（位於專案目錄或使用者主目錄中）或您的 shell 設定檔（例如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令會將環境變數新增至 `~/.bashrc` 檔案：
          ```bash
          echo 'export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"' >> ~/.bashrc
          echo 'export GOOGLE_CLOUD_LOCATION="YOUR_PROJECT_LOCATION"' >> ~/.bashrc
          echo 'export GOOGLE_GENAI_USE_VERTEXAI=true' >> ~/.bashrc
          source ~/.bashrc
          ```
    - 如果使用快速模式：
      - 設定 `GOOGLE_API_KEY` 環境變數。在下列方法中，請將 `YOUR_GOOGLE_API_KEY` 替換為快速模式提供的 Vertex AI API 金鑰：
        - 您可以使用以下指令在目前的 shell 工作階段中暫時設定這些環境變數：
          ```bash
          export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
          export GOOGLE_GENAI_USE_VERTEXAI=true
          ```
        - 如需重複使用，您可以將環境變數新增至您的 `.env` 檔案（位於專案目錄或使用者主目錄中）或您的 shell 設定檔（例如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。例如，以下指令會將環境變數新增至 `~/.bashrc` 檔案：
          ```bash
          echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"' >> ~/.bashrc
          echo 'export GOOGLE_GENAI_USE_VERTEXAI=true' >> ~/.bashrc
          source ~/.bashrc
          ```